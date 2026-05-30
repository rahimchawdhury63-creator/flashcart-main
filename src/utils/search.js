// search.js — Lightweight multilingual fuzzy search engine (client-side).
// Searches store/item names (Bangla + English), category and location.

/**
 * Normalize a string for comparison: lowercase + trim.
 * @param {string} s
 */
function norm(s) {
  return String(s || '').toLowerCase().trim()
}

/**
 * Levenshtein edit distance — used for fuzzy/typo-tolerant matching.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function editDistance(a, b) {
  a = norm(a)
  b = norm(b)
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

/**
 * Score how well a store/item matches a query.
 * exact match > startsWith > includes > fuzzy.
 * @param {object} entity - store or item with name {bn,en}, category, tags
 * @param {string} query
 * @returns {number} score (higher is better; 0 = no match)
 */
export function matchScore(entity, query) {
  const q = norm(query)
  if (!q) return 0

  const fields = [
    entity.name?.en,
    entity.name?.bn,
    entity.category,
    entity.district,
    entity.upazila,
    ...(entity.tags || []),
    ...(entity.subcategories || []),
  ].filter(Boolean)

  let best = 0
  for (const raw of fields) {
    const f = norm(raw)
    if (!f) continue
    if (f === q) best = Math.max(best, 100)
    else if (f.startsWith(q)) best = Math.max(best, 80)
    else if (f.includes(q)) best = Math.max(best, 60)
    else {
      // Fuzzy: allow small typos relative to query length.
      const dist = editDistance(f.slice(0, q.length + 2), q)
      if (dist <= Math.max(1, Math.floor(q.length / 4))) best = Math.max(best, 40)
    }
  }
  return best
}

/**
 * Run a search over a list of entities, returning matches sorted by relevance.
 * @param {object[]} entities
 * @param {string} query
 * @returns {object[]}
 */
export function search(entities, query) {
  if (!query) return entities
  return entities
    .map((e) => ({ ...e, _score: matchScore(e, query) }))
    .filter((e) => e._score > 0)
    .sort((a, b) => b._score - a._score)
}

// --- Recent search history (localStorage) ---

const HISTORY_KEY = 'flashcart_search_history'

/** Get recent search terms (most recent first). */
export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

/** Add a search term to history (deduped, capped at 8). */
export function addSearchHistory(term) {
  if (!term?.trim()) return
  const t = term.trim()
  let hist = getSearchHistory().filter((x) => x !== t)
  hist.unshift(t)
  hist = hist.slice(0, 8)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist))
}

/** Clear search history. */
export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
