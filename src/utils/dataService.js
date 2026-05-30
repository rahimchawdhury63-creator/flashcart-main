// dataService.js — Read/write helpers around Firestore for stores, items, orders, reviews.
// Falls back to demo data (demoData.js) when Firestore is empty/unavailable, so the UI
// always renders meaningful, SEO-friendly content.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, set } from 'firebase/database'
import { db, realtimeDb } from '../firebase'
import { DEMO_STORES, DEMO_ITEMS, DEMO_MENU_CATEGORIES } from './demoData'
import { notifyPartner } from './orderNotify'

// --- Stores ---

/**
 * Fetch all stores. Returns Firestore data if present, otherwise demo data.
 * @returns {Promise<object[]>}
 */
export async function fetchStores() {
  try {
    const snap = await getDocs(query(collection(db, 'stores'), limit(100)))
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    }
  } catch {
    // Permission/network error — fall through to demo data.
  }
  return DEMO_STORES
}

/**
 * Fetch a single store by its URL slug.
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function fetchStoreBySlug(slug) {
  try {
    const snap = await getDocs(query(collection(db, 'stores'), where('slug', '==', slug), limit(1)))
    if (!snap.empty) {
      const d = snap.docs[0]
      return { id: d.id, ...d.data() }
    }
  } catch {
    /* fall through */
  }
  return DEMO_STORES.find((s) => s.slug === slug) || null
}

// --- Items / menu ---

/**
 * Fetch items for a store.
 * @param {string} storeId
 * @returns {Promise<object[]>}
 */
export async function fetchItems(storeId) {
  try {
    const snap = await getDocs(query(collection(db, 'items'), where('storeId', '==', storeId)))
    if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    /* fall through */
  }
  return DEMO_ITEMS[storeId] || []
}

/**
 * Fetch menu categories for a store.
 * @param {string} storeId
 */
export async function fetchMenuCategories(storeId) {
  try {
    const snap = await getDocs(
      query(collection(db, 'menuCategories'), where('storeId', '==', storeId))
    )
    if (!snap.empty)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.order - b.order)
  } catch {
    /* fall through */
  }
  return DEMO_MENU_CATEGORIES[storeId] || []
}

/**
 * Fetch a single item by store slug + item slug.
 * @param {string} storeSlug
 * @param {string} itemSlug
 */
export async function fetchItemBySlug(storeSlug, itemSlug) {
  const store = await fetchStoreBySlug(storeSlug)
  if (!store) return { store: null, item: null }
  const items = await fetchItems(store.id)
  const item = items.find((i) => i.slug === itemSlug) || null
  return { store, item }
}

// --- Orders ---

/**
 * Place a new order. Writes to Firestore `orders` and mirrors to Realtime DB
 * so the partner gets a live notification.
 * @param {object} orderData
 * @returns {Promise<string>} the generated order document id
 */
export async function placeOrder(orderData) {
  // Human-readable order id: FC-YYYY-XXXXX
  const readableId = `FC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`

  const payload = {
    ...orderData,
    orderId: readableId,
    paymentMethod: 'COD',
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: Date.now(), note: 'Order placed' }],
    isRated: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  // Write to Firestore (source of truth).
  const docRef = await addDoc(collection(db, 'orders'), payload)

  // Mirror a lightweight record to Realtime DB for the partner's live feed.
  // This is what drives the partner's in-app sound/banner/tab-badge instantly.
  try {
    if (orderData.partnerId) {
      await set(ref(realtimeDb, `orders/${orderData.partnerId}/${docRef.id}`), {
        status: 'placed',
        total: orderData.total,
        customerName: orderData.customerName,
        itemCount: orderData.items?.length || 0,
        orderId: readableId,
        createdAt: Date.now(),
        isNew: true,
      })
    }
  } catch {
    // Realtime mirror is best-effort; order is already saved in Firestore.
  }

  // Trigger a OneSignal push so the partner is alerted even if their app is
  // closed or their phone is locked. Best-effort; never blocks the order.
  try {
    if (orderData.partnerId) {
      // Look up the partner's saved OneSignal subscription id.
      const partnerSnap = await getDoc(doc(db, 'users', orderData.partnerId))
      const playerId = partnerSnap.exists() ? partnerSnap.data().oneSignalPlayerId : null
      await notifyPartner({
        playerId: playerId || undefined,
        externalId: orderData.partnerId, // fallback: target by external id (partner uid)
        order: { id: docRef.id, orderId: readableId, total: orderData.total, customerName: orderData.customerName },
      })
    }
  } catch {
    // Push is best-effort; the order is already saved and mirrored.
  }

  return docRef.id
}

/**
 * Fetch a customer's orders (most recent first).
 * @param {string} customerId
 */
export async function fetchUserOrders(customerId) {
  try {
    const snap = await getDocs(
      query(collection(db, 'orders'), where('customerId', '==', customerId), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

/**
 * Fetch a single order by document id.
 * @param {string} orderId
 */
export async function fetchOrder(orderId) {
  try {
    const snap = await getDoc(doc(db, 'orders', orderId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch {
    return null
  }
}

/**
 * Cancel an order (only allowed before confirmation).
 * @param {string} orderId
 */
export async function cancelOrder(orderId) {
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  })
}

// --- Reviews ---

/**
 * Submit a review and mark the related order as rated.
 * @param {object} review - { orderId, storeId, customerId, customerName, rating, review, reviewPhoto }
 */
export async function submitReview(review) {
  await addDoc(collection(db, 'reviews'), {
    ...review,
    isReported: false,
    helpfulVotes: 0,
    partnerReply: '',
    createdAt: serverTimestamp(),
  })
  if (review.orderId) {
    await updateDoc(doc(db, 'orders', review.orderId), {
      isRated: true,
      rating: review.rating,
      review: review.review,
    }).catch(() => {})
  }
}

/**
 * Fetch reviews for a store (most recent first).
 * @param {string} storeId
 */
export async function fetchStoreReviews(storeId) {
  try {
    const snap = await getDocs(
      query(collection(db, 'reviews'), where('storeId', '==', storeId), orderBy('createdAt', 'desc'), limit(50))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}
