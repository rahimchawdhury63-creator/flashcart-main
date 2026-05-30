// search.js — ULTRA search engine (Google / Foodpanda class), client-side.
//
// Capabilities:
//  • Searches STORES + ITEMS together from live Firestore data.
//  • Multi-word tokenized matching (every query word must contribute).
//  • Cross-script Bangla <-> English via synonym/transliteration knowledge base.
//  • Synonym + related-term expansion ("biryani" also surfaces rice/kacchi/tehari).
//  • Typo tolerance (Levenshtein) + "Did you mean" correction.
//  • Category-alias intent ("food" -> restaurants, "medicine" -> pharmacy).
//  • Quality/popularity ranking (rating, orders, open status, exactness).
//  • Autocomplete suggestions + related-keyword chips with counts.

import { CATEGORIES, categoryName } from '../data/categories'
import { expandToken, resolveCategoryAliases } from '../data/searchSynonyms'

/* ------------------------------------------------------------------ */
/* Text utilities                                                     */
/* ------------------------------------------------------------------ */

/** Normalize: lowercase, trim, collapse whitespace, strip punctuation noise. */
export function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[._/\\|,;:!?()[\]{}"'`]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Split a query into meaningful tokens (drop 1-char noise except Bangla). */
export function tokenize(s) {
  return norm(s)
    .split(' ')
    .filter((t) => t.length >= 2 || /[\u0980-\u09FF]/.test(t))
}

/** Levenshtein edit distance (typo tolerance). */
export function editDistance(a, b) {
  a = String(a || '')
  b = String(b || '')
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  let cur = new Array(n + 1)
  for (let i = 1; i <= m; i++) {
    cur[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
    }
    ;[prev, cur] = [cur, prev]
  }
  return prev[n]
}

/* ------------------------------------------------------------------ */
/* Field-level scoring                                                */
/* ------------------------------------------------------------------ */

/**
 * Score one token against one text field. 0-100.
 * exact word > word-prefix > field-prefix > contains > fuzzy.
 */
function tokenFieldScore(field, token) {
  const f = norm(field)
  if (!f || !token) return 0
  const words = f.split(' ')

  if (f === token) return 100
  if (words.includes(token)) return 94
  if (f.startsWith(token)) return 86
  if (words.some((w) => w.startsWith(token))) return 80
  if (f.includes(token)) return 66

  // Fuzzy: allow typos proportional to token length.
  const tol = token.length >= 7 ? 2 : token.length >= 4 ? 1 : 0
  if (tol > 0) {
    for (const w of words) {
      if (Math.abs(w.length - token.length) > tol + 1) continue
      if (editDistance(w, token) <= tol) return 48 - editDistance(w, token) * 4
    }
  }
  return 0
}

/**
 * Build the weighted field list for a store.
 * @returns {Array<{v:string,w:number}>}
 */
function storeFields(store) {
  return [
    { v: store.name?.en, w: 1.0 },
    { v: store.name?.bn, w: 1.0 },
    { v: categoryName(store.category, 'en'), w: 0.72 },
    { v: categoryName(store.category, 'bn'), w: 0.72 },
    { v: store.upazila, w: 0.6 },
    { v: store.district, w: 0.5 },
    { v: store.description?.en, w: 0.4 },
    { v: store.description?.bn, w: 0.4 },
    ...(store.tags || []).map((t) => ({ v: t, w: 0.7 })),
    ...(store.subcategories || []).map((s) => ({ v: s, w: 0.7 })),
    ...(store.seoKeywords || []).map((k) => ({ v: k, w: 0.6 })),
  ]
}

/** Build the weighted field list for an item. */
function itemFields(item) {
  return [
    { v: item.name?.en, w: 1.0 },
    { v: item.name?.bn, w: 1.0 },
    { v: item.description?.en, w: 0.5 },
    { v: item.description?.bn, w: 0.5 },
    { v: item._store?.name?.en, w: 0.45 },
    { v: item._store?.name?.bn, w: 0.45 },
    { v: categoryName(item._store?.category, 'en'), w: 0.4 },
    ...(item.tags || []).map((t) => ({ v: t, w: 0.7 })),
  ]
}

/**
 * Score an entity (its field list) against an expanded query.
 * Each query token contributes its best field hit. Synonyms/related terms add
 * partial credit. Multi-word queries require most tokens to match.
 *
 * @param {Array<{v:string,w:number}>} fields
 * @param {object} expanded - output of expandQuery()
 * @returns {number} 0..~120 (popularity boost can push above 100)
 */
function scoreFields(fields, expanded) {
  const { tokens } = expanded
  if (!tokens.length) return 0

  let total = 0
  let matchedTokens = 0

  for (const tk of tokens) {
    // Best direct hit for this token across all fields.
    let best = 0
    for (const f of fields) best = Math.max(best, tokenFieldScore(f.v, tk.term) * f.w)

    // Synonyms (equivalent) — count at 0.85 of their hit if better.
    for (const syn of tk.synonyms) {
      for (const f of fields) best = Math.max(best, tokenFieldScore(f.v, syn) * f.w * 0.85)
    }
    // Related terms — weaker credit (0.45).
    let relBest = 0
    for (const rel of tk.related) {
      for (const f of fields) relBest = Math.max(relBest, tokenFieldScore(f.v, rel) * f.w * 0.45)
    }
    best = Math.max(best, relBest)

    if (best > 0) matchedTokens += 1
    total += best
  }

  // Multi-word AND-ish gate: if more than one token and fewer than half match, drop it.
  if (tokens.length > 1 && matchedTokens / tokens.length < 0.5) return 0
  if (matchedTokens === 0) return 0

  // Average across tokens so long queries aren't unfairly inflated.
  return total / tokens.length
}

/* ------------------------------------------------------------------ */
/* Quality / popularity boost                                         */
/* ------------------------------------------------------------------ */

function storeBoost(store) {
  const rating = ((store.averageRating || 0) / 5) * 6 // up to +6
  const orders = Math.min(Math.log10((store.totalOrders || 0) + 1) / 4, 1) * 6 // up to +6
  const open = store.isOpen ? 3 : 0
  const verified = store.isVerified ? 2 : 0
  return rating + orders + open + verified
}

function itemBoost(item) {
  const rating = ((item.averageRating || 0) / 5) * 5
  const orders = Math.min(Math.log10((item.totalOrders || 0) + 1) / 3, 1) * 5
  const available = item.isAvailable === false ? -8 : 2
  return rating + orders + available
}

/* ------------------------------------------------------------------ */
/* Query expansion                                                    */
/* ------------------------------------------------------------------ */

/**
 * Expand a raw query into tokens with synonyms + related terms.
 * @param {string} query
 * @returns {{raw:string, tokens:Array<{term:string,synonyms:string[],related:string[]}>, categoryIds:string[]}}
 */
export function expandQuery(query) {
  const tokens = tokenize(query).map((term) => {
    const { synonyms, related } = expandToken(term)
    return { term, synonyms, related }
  })
  const categoryIds = resolveCategoryAliases(query)
  return { raw: norm(query), tokens, categoryIds }
}

/* ------------------------------------------------------------------ */
/* Main search                                                        */
/* ------------------------------------------------------------------ */

/**
 * Unified ultra search over a prebuilt index.
 * @param {{stores:object[], items:object[]}} index
 * @param {string} query
 * @returns {{stores:object[], items:object[], total:number, didYouMean:string|null, expanded:object}}
 */
export function searchAll(index, query) {
  const expanded = expandQuery(query)
  if (!expanded.tokens.length) {
    return { stores: index.stores, items: [], total: index.stores.length, didYouMean: null, expanded }
  }

  // Category-intent stores (e.g. "food" -> all restaurants) get a baseline score.
  const catSet = new Set(expanded.categoryIds)

  const stores = index.stores
    .map((s) => {
      let score = scoreFields(storeFields(s), expanded)
      if (catSet.has(s.category)) score = Math.max(score, 70) // intent match
      return score > 0 ? { ...s, _score: score + storeBoost(s) } : null
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score)

  const items = index.items
    .map((it) => {
      let score = scoreFields(itemFields(it), expanded)
      if (catSet.has(it._store?.category)) score = Math.max(score, 55)
      return score > 0 ? { ...it, _score: score + itemBoost(it) } : null
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score)

  const total = stores.length + items.length

  // "Did you mean" — only when nothing matched; find the closest known term.
  let didYouMean = null
  if (total === 0) didYouMean = suggestCorrection(index, expanded.raw)

  return { stores, items, total, didYouMean, expanded }
}

/**
 * Suggest a spelling correction by finding the closest store/item/category word.
 * @param {{stores:object[], items:object[]}} index
 * @param {string} query
 * @returns {string|null}
 */
export function suggestCorrection(index, query) {
  const q = norm(query)
  if (q.length < 3) return null

  // Collect a vocabulary of candidate words from the live data + categories.
  const vocab = new Set()
  const addWords = (text) => norm(text).split(' ').forEach((w) => w.length >= 3 && vocab.add(w))
  for (const s of index.stores) {
    addWords(s.name?.en); addWords(s.name?.bn)
    ;(s.tags || []).forEach(addWords)
  }
  for (const it of index.items) {
    addWords(it.name?.en); addWords(it.name?.bn)
    ;(it.tags || []).forEach(addWords)
  }
  for (const c of CATEGORIES) { addWords(c.en); addWords(c.bn) }

  let best = null
  let bestDist = Infinity
  for (const w of vocab) {
    if (Math.abs(w.length - q.length) > 3) continue
    const d = editDistance(w, q)
    if (d < bestDist && d <= Math.max(1, Math.floor(q.length / 3))) {
      bestDist = d
      best = w
    }
  }
  return best
}

/* ------------------------------------------------------------------ */
/* Autocomplete suggestions                                           */
/* ------------------------------------------------------------------ */

/**
 * Build autocomplete suggestions (categories, stores, items) for a partial query.
 * @param {{stores:object[], items:object[]}} index
 * @param {string} query
 * @param {(o:any)=>string} pick - language picker for {bn,en}
 * @param {string} lang
 * @returns {Array<object>}
 */
export function getSuggestions(index, query, pick, lang = 'default') {
  const expanded = expandQuery(query)
  if (!expanded.tokens.length) return []

  const out = []
  const seen = new Set()
  const add = (s) => {
    const key = `${s.type}:${s.label.toLowerCase()}`
    if (seen.has(key)) return
    seen.add(key)
    out.push(s)
  }

  // 1) Categories (alias intent or name match) with store counts.
  const catIds = new Set(expanded.categoryIds)
  for (const c of CATEGORIES) {
    const nameHit = scoreFields([{ v: c.en, w: 1 }, { v: c.bn, w: 1 }], expanded) > 0
    if (catIds.has(c.id) || nameHit) {
      const count = index.stores.filter((s) => s.category === c.id).length
      if (count > 0) add({ label: lang === 'bn' ? c.bn : c.en, type: 'category', count, to: `/category/${c.id}` })
    }
  }

  // 2) Stores (top 4). Gate on the RELEVANCE score (base), then rank with boost,
  //    so the popularity boost never lets a non-matching store leak in.
  const catSet = new Set(expanded.categoryIds)
  index.stores
    .map((s) => {
      let base = scoreFields(storeFields(s), expanded)
      if (catSet.has(s.category)) base = Math.max(base, 60) // category-intent match
      return { s, base, sc: base + storeBoost(s) }
    })
    .filter((x) => x.base > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 4)
    .forEach(({ s }) => add({ label: pick(s.name), type: 'store', to: `/store/${s.slug}`, sub: categoryName(s.category, lang) }))

  // 3) Items / dishes (top 5). Same gating: relevance first, boost only for ranking.
  index.items
    .map((it) => {
      let base = scoreFields(itemFields(it), expanded)
      if (catSet.has(it._store?.category)) base = Math.max(base, 45)
      return { it, base, sc: base + itemBoost(it) }
    })
    .filter((x) => x.base > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 5)
    .forEach(({ it }) =>
      add({ label: pick(it.name), type: 'item', to: `/store/${it._storeSlug}/item/${it.slug}`, sub: it._store ? pick(it._store.name) : '' })
    )

  // 4) Catch-all "search for X".
  add({ label: query.trim(), type: 'search', query: query.trim(), to: `/search?q=${encodeURIComponent(query.trim())}` })

  return out.slice(0, 10)
}

/* ------------------------------------------------------------------ */
/* Related-keyword chips (results page)                               */
/* ------------------------------------------------------------------ */

/**
 * Related keyword chips for the results page (Foodpanda-style).
 * Combines: query's own related terms + categories present in results + frequent tags.
 * @param {{stores:object[], items:object[], expanded?:object}} results
 * @param {string} lang
 * @returns {Array<{label:string, to:string}>}
 */
export function relatedKeywords(results, lang = 'default') {
  const out = []
  const seen = new Set()
  const push = (label, to) => {
    const k = label.toLowerCase()
    if (!label || seen.has(k)) return
    seen.add(k)
    out.push({ label, to })
  }

  // From the expanded query's related terms (true "related things").
  if (results.expanded?.tokens) {
    for (const tk of results.expanded.tokens) {
      for (const rel of tk.related) push(rel, `/search?q=${encodeURIComponent(rel)}`)
    }
  }

  // Categories present in results, by frequency.
  const catCount = {}
  for (const s of results.stores) catCount[s.category] = (catCount[s.category] || 0) + 1
  for (const it of results.items) {
    const cat = it._store?.category
    if (cat) catCount[cat] = (catCount[cat] || 0) + 1
  }
  Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([catId]) => push(categoryName(catId, lang), `/category/${catId}`))

  // Frequent tags / subcategories in results.
  const tagCount = {}
  for (const s of results.stores) (s.subcategories || []).forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1))
  for (const it of results.items) (it.tags || []).forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1))
  Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .forEach(([tag]) => push(tag, `/search?q=${encodeURIComponent(tag)}`))

  return out.slice(0, 10)
}

// Popular/trending fallback searches when the box is empty.
export const TRENDING = [
  { en: 'Biryani', bn: 'বিরিয়ানি' },
  { en: 'Pizza', bn: 'পিৎজা' },
  { en: 'Burger', bn: 'বার্গার' },
  { en: 'Grocery', bn: 'মুদি' },
  { en: 'Medicine', bn: 'ওষুধ' },
  { en: 'Cake', bn: 'কেক' },
  { en: 'Coffee', bn: 'কফি' },
]

/* ------------------------------------------------------------------ */
/* Recent search history (localStorage)                               */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = 'flashcart_search_history'

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function addSearchHistory(term) {
  if (!term?.trim()) return
  const t = term.trim()
  let hist = getSearchHistory().filter((x) => x.toLowerCase() !== t.toLowerCase())
  hist.unshift(t)
  hist = hist.slice(0, 8)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist))
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

/* ------------------------------------------------------------------ */
/* Legacy helper (stores-only) kept for backward compatibility        */
/* ------------------------------------------------------------------ */
export function search(entities, query) {
  const expanded = expandQuery(query)
  if (!expanded.tokens.length) return entities
  return entities
    .map((e) => ({ ...e, _score: scoreFields(storeFields(e), expanded) }))
    .filter((e) => e._score > 0)
    .sort((a, b) => b._score - a._score)
}
