// ranking.js — Smart ranking algorithm for stores and items.
// Pure functions: take data, return a numeric score used to sort results.

/**
 * Compute a store's ranking score (0-100).
 * Weighted factors per project spec.
 * @param {object} store
 * @returns {number}
 */
export function storeRankScore(store) {
  if (!store) return 0

  // Rating Score: 30% — normalized rating out of 5.
  const ratingScore = ((store.averageRating || 0) / 5) * 30

  // Total Orders: 25% — log-scaled so huge stores don't dominate forever.
  const ordersScore = Math.min(Math.log10((store.totalOrders || 0) + 1) / 4, 1) * 25

  // Recent Orders (last 7 days): 20%.
  const recentScore = Math.min((store.recentOrders || 0) / 50, 1) * 20

  // Profile Completeness: 10%.
  const completenessScore = ((store.profileCompleteness || 0) / 100) * 10

  // Response Time: 10% — faster acceptance is better (assume value in minutes).
  const responseMinutes = store.avgResponseMinutes ?? 30
  const responseScore = Math.max(0, 1 - responseMinutes / 60) * 10

  // Verified Badge: 5%.
  const verifiedScore = store.isVerified ? 5 : 0

  return Math.round(
    ratingScore + ordersScore + recentScore + completenessScore + responseScore + verifiedScore
  )
}

/**
 * Compute an item's ranking score (0-100).
 * @param {object} item
 * @param {number} minPrice - lowest price in the comparison set (for competitiveness)
 * @param {number} maxPrice - highest price in the comparison set
 * @returns {number}
 */
export function itemRankScore(item, minPrice = 0, maxPrice = 1000) {
  if (!item) return 0

  // Individual item rating: 35%.
  const ratingScore = ((item.averageRating || 0) / 5) * 35

  // Times ordered: 30% — log scaled.
  const orderedScore = Math.min(Math.log10((item.totalOrders || 0) + 1) / 3, 1) * 30

  // Recent views (last 24h): 20%.
  const viewsScore = Math.min((item.recentViews || 0) / 100, 1) * 20

  // Price competitiveness: 15% — lower relative price scores higher.
  const price = item.discountPrice || item.price || 0
  const range = Math.max(1, maxPrice - minPrice)
  const priceScore = (1 - (price - minPrice) / range) * 15

  return Math.round(ratingScore + orderedScore + viewsScore + priceScore)
}

/**
 * Sort an array of stores by rank (highest first). Returns a new array.
 * @param {object[]} stores
 * @param {{lat:number,lng:number}|null} customerLocation - optional, adds distance tiebreak
 */
export function rankStores(stores, customerLocation = null) {
  return [...stores]
    .map((s) => ({ ...s, _rank: storeRankScore(s) }))
    .sort((a, b) => b._rank - a._rank)
}

/**
 * Sort items by rank. Computes the price range first for competitiveness scoring.
 * @param {object[]} items
 */
export function rankItems(items) {
  if (!items.length) return []
  const prices = items.map((i) => i.discountPrice || i.price || 0)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return [...items]
    .map((i) => ({ ...i, _rank: itemRankScore(i, min, max) }))
    .sort((a, b) => b._rank - a._rank)
}
