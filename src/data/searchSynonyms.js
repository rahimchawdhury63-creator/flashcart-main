// searchSynonyms.js — Knowledge base that powers "ultra" search:
//  • Bangla <-> English term equivalence (so "বিরিয়ানি" matches "biryani" and vice-versa)
//  • Synonyms / alternate spellings (so "coke" -> "cola", "mobile" -> "phone")
//  • Related-term expansion (so "biryani" also surfaces "rice", "kacchi", "tehari")
//  • Category aliases (so "food" -> restaurant/fastfood, "medicine" -> pharmacy)
//
// Each group is a cluster of equivalent/related terms. When a user query matches
// any term in a group, all the other terms in that group are added as "expansions"
// with a lower weight, mimicking Google/Foodpanda related results.

// --- Equivalence + synonym groups (strong matches, weight ~0.85) ---
// Order inside a group doesn't matter; all members are treated as equivalent.
export const SYNONYM_GROUPS = [
  // Food — rice & biryani family
  ['biryani', 'biriyani', 'biriani', 'বিরিয়ানি', 'birani'],
  ['kacchi', 'kachchi', 'কাচ্চি', 'kacci'],
  ['tehari', 'tehri', 'তেহারি'],
  ['polao', 'pulao', 'polaw', 'পোলাও'],
  ['rice', 'bhat', 'ভাত', 'চাল', 'chal'],
  ['khichuri', 'khichdi', 'khichari', 'খিচুড়ি'],

  // Fast food
  ['burger', 'বার্গার'],
  ['pizza', 'পিৎজা', 'পিজা'],
  ['sandwich', 'স্যান্ডউইচ'],
  ['fries', 'french fries', 'ফ্রাই', 'চিপস', 'chips'],
  ['shawarma', 'shawrma', 'শর্মা', 'shorma'],
  ['noodles', 'chowmein', 'chow mein', 'নুডলস', 'চাউমিন'],
  ['pasta', 'পাস্তা'],
  ['fried chicken', 'broast', 'ব্রোস্ট', 'ফ্রায়েড চিকেন', 'kfc'],

  // Curries / proteins
  ['chicken', 'murgi', 'মুরগি', 'চিকেন'],
  ['beef', 'goru', 'গরু', 'গরুর মাংস', 'বিফ'],
  ['mutton', 'khasi', 'খাসি', 'মাটন'],
  ['fish', 'mach', 'maach', 'মাছ', 'ফিশ'],
  ['egg', 'dim', 'ডিম'],
  ['vegetable', 'shobji', 'sabji', 'সবজি', 'ভেজি', 'veggie'],
  ['dal', 'daal', 'lentil', 'ডাল'],

  // Drinks
  ['cola', 'coke', 'coca cola', 'কোক', 'কোলা'],
  ['juice', 'jus', 'জুস', 'শরবত', 'sharbat'],
  ['coffee', 'কফি'],
  ['tea', 'cha', 'চা'],
  ['lassi', 'লাচ্ছি', 'borhani', 'বোরহানি'],
  ['water', 'pani', 'পানি'],

  // Sweets / bakery
  ['cake', 'কেক'],
  ['pastry', 'পেস্ট্রি'],
  ['mishti', 'sweets', 'sweet', 'মিষ্টি', 'roshogolla', 'rasgulla', 'রসগোল্লা'],
  ['bread', 'ruti', 'roti', 'রুটি', 'পাউরুটি'],
  ['croissant', 'ক্রোয়াসঁ'],

  // Grocery staples
  ['oil', 'tel', 'তেল', 'soybean oil'],
  ['sugar', 'chini', 'চিনি'],
  ['salt', 'lobon', 'লবণ'],
  ['flour', 'atta', 'আটা', 'ময়দা', 'moida'],
  ['onion', 'piyaj', 'peyaj', 'পেঁয়াজ'],
  ['potato', 'alu', 'aloo', 'আলু'],
  ['milk', 'dudh', 'দুধ'],

  // Pharmacy / health
  ['medicine', 'ousud', 'oushadh', 'ওষুধ', 'medicin', 'drug'],
  ['paracetamol', 'napa', 'ace', 'নাপা', 'প্যারাসিটামল'],
  ['mask', 'মাস্ক', 'face mask'],
  ['sanitizer', 'স্যানিটাইজার', 'hand sanitizer'],
  ['vitamin', 'ভিটামিন'],

  // Clothing
  ['panjabi', 'punjabi', 'পাঞ্জাবি'],
  ['saree', 'sari', 'শাড়ি'],
  ['shirt', 'শার্ট'],
  ['tshirt', 't-shirt', 'tee', 'টিশার্ট'],
  ['pant', 'pants', 'trouser', 'প্যান্ট'],
  ['shari three piece', 'three piece', 'থ্রি পিস', 'salwar', 'সালোয়ার'],

  // Electronics / mobile
  ['mobile', 'phone', 'smartphone', 'মোবাইল', 'ফোন'],
  ['earbuds', 'earphone', 'headphone', 'ইয়ারবাড', 'হেডফোন', 'airpods'],
  ['charger', 'চার্জার', 'adapter'],
  ['laptop', 'ল্যাপটপ'],
  ['powerbank', 'power bank', 'পাওয়ার ব্যাংক'],

  // Books / stationery
  ['book', 'boi', 'বই'],
  ['pen', 'kolom', 'কলম'],
  ['notebook', 'khata', 'খাতা'],
]

// --- Related-term expansion (weaker matches, weight ~0.45) ---
// Key term -> related terms surfaced as "related results" (not equivalent).
export const RELATED_TERMS = {
  biryani: ['rice', 'kacchi', 'tehari', 'polao', 'borhani', 'mutton', 'chicken'],
  kacchi: ['biryani', 'mutton', 'borhani'],
  burger: ['fries', 'cola', 'fried chicken', 'sandwich'],
  pizza: ['pasta', 'garlic bread', 'cola'],
  coffee: ['cake', 'pastry', 'sandwich'],
  tea: ['biscuit', 'singara', 'samosa'],
  cake: ['pastry', 'coffee', 'birthday'],
  chicken: ['fried chicken', 'biryani', 'curry'],
  medicine: ['mask', 'sanitizer', 'vitamin', 'paracetamol'],
  mobile: ['charger', 'earbuds', 'powerbank', 'cover'],
  rice: ['dal', 'curry', 'vegetable', 'fish'],
  fish: ['rice', 'curry'],
  panjabi: ['saree', 'tshirt', 'eid'],
  saree: ['panjabi', 'three piece'],
}

// --- Category aliases: query term -> category id(s) ---
// Lets a search like "food" or "খাবার" bring up restaurants & fast food.
export const CATEGORY_ALIASES = {
  food: ['restaurant', 'fastfood', 'homekitchen'],
  খাবার: ['restaurant', 'fastfood', 'homekitchen'],
  restaurant: ['restaurant'],
  রেস্টুরেন্ট: ['restaurant'],
  hotel: ['restaurant'],
  fastfood: ['fastfood'],
  'fast food': ['fastfood'],
  grocery: ['grocery', 'supermarket'],
  মুদি: ['grocery', 'supermarket'],
  bazar: ['grocery', 'supermarket'],
  বাজার: ['grocery', 'supermarket'],
  medicine: ['pharmacy'],
  pharmacy: ['pharmacy'],
  ফার্মেসি: ['pharmacy'],
  ওষুধ: ['pharmacy'],
  clothes: ['clothing'],
  clothing: ['clothing'],
  fashion: ['clothing'],
  পোশাক: ['clothing'],
  electronics: ['electronics', 'mobile'],
  gadget: ['electronics', 'mobile'],
  mobile: ['mobile', 'electronics'],
  মোবাইল: ['mobile', 'electronics'],
  book: ['library', 'stationery'],
  বই: ['library', 'stationery'],
  cake: ['bakery'],
  bakery: ['bakery'],
  বেকারি: ['bakery'],
  cosmetics: ['cosmetics'],
  makeup: ['cosmetics'],
  কসমেটিক্স: ['cosmetics'],
}

// --- Build fast lookup maps from the groups above (computed once) ---

// term -> array of equivalent terms (excluding the term itself)
const _synonymMap = new Map()
for (const group of SYNONYM_GROUPS) {
  for (const term of group) {
    const t = term.toLowerCase()
    const others = group.filter((x) => x.toLowerCase() !== t).map((x) => x.toLowerCase())
    _synonymMap.set(t, others)
  }
}

/**
 * Expand a query token into:
 *  - synonyms (equivalent terms, weight 0.85)
 *  - related terms (weight 0.45)
 * @param {string} token lowercased
 * @returns {{synonyms:string[], related:string[]}}
 */
export function expandToken(token) {
  const t = token.toLowerCase()
  const synonyms = new Set(_synonymMap.get(t) || [])
  const related = new Set(RELATED_TERMS[t] || [])

  // If the token has synonyms, also pull related terms for each synonym
  // (e.g. "biriyani" -> synonym "biryani" -> related "rice/kacchi").
  for (const syn of synonyms) {
    for (const r of RELATED_TERMS[syn] || []) related.add(r)
  }
  // Don't let a term appear as both.
  for (const s of synonyms) related.delete(s)
  related.delete(t)

  return { synonyms: [...synonyms], related: [...related] }
}

/**
 * Resolve category aliases for a full query string.
 * @param {string} query lowercased
 * @returns {string[]} matching category ids
 */
export function resolveCategoryAliases(query) {
  const q = query.toLowerCase().trim()
  const ids = new Set()
  // Whole-query match.
  if (CATEGORY_ALIASES[q]) CATEGORY_ALIASES[q].forEach((id) => ids.add(id))
  // Token-level match.
  for (const tok of q.split(/\s+/)) {
    if (CATEGORY_ALIASES[tok]) CATEGORY_ALIASES[tok].forEach((id) => ids.add(id))
  }
  return [...ids]
}
