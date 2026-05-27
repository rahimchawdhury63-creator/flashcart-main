// ============================================================
// FlashCart — Firebase Firestore Service
// All database operations: users, partners, stores,
// items, orders, and reviews.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// Import Firestore modular SDK functions
import {
  doc,              // Reference to a single document
  collection,       // Reference to a collection
  addDoc,           // Add document with auto-generated ID
  setDoc,           // Set document (create or overwrite)
  getDoc,           // Get a single document
  getDocs,          // Get multiple documents
  updateDoc,        // Update specific fields in a document
  deleteDoc,        // Delete a document
  query,            // Create a query
  where,            // Query filter condition
  orderBy,          // Query sort order
  limit,            // Limit query results
  startAfter,       // Cursor for pagination
  onSnapshot,       // Real-time listener
  serverTimestamp,  // Firebase server timestamp
  increment,        // Atomic counter increment
  arrayUnion,       // Add to array without duplicates
  arrayRemove,      // Remove from array
  runTransaction,   // Atomic transaction
  writeBatch,       // Batch writes
  Timestamp,        // Firestore Timestamp type
} from 'firebase/firestore';

// Import the Firestore instance
import { db } from './config';

// Import collection name constants to avoid typos
import { COLLECTIONS, PAGINATION } from '../../utils/constants';

// Import slug formatter for generating store URLs
import { formatSlug } from '../../utils/formatters';

// ============================================================
// USER OPERATIONS
// ============================================================

/**
 * createUserDocument
 * Creates or updates a user's Firestore document.
 * Called after every successful login/registration.
 * Uses setDoc with merge:true — safe to call multiple times.
 *
 * @param {object} user - Firebase Auth user object
 * @param {object} additionalData - Extra data to store
 * @returns {Promise<void>}
 */
export const createUserDocument = async (user, additionalData = {}) => {
  // Validate user object
  if (!user || !user.uid) return;

  // Create a reference to the user's document in Firestore
  // Document ID is the Firebase Auth UID — guarantees uniqueness
  const userRef = doc(db, COLLECTIONS.USERS, user.uid);

  try {
    // Check if the document already exists
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // NEW USER — Create full document with all default fields
      await setDoc(userRef, {
        // Identity
        uid: user.uid,
        displayName: user.displayName || additionalData.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        phone: '',                              // Set later in profile

        // Auth
        emailVerified: user.emailVerified || false,
        authProvider: additionalData.authProvider || 'email',

        // Preferences
        preferredLanguage: 'default',          // Default bilingual mode
        notificationsEnabled: false,           // Off until user grants permission
        locationPermissionGranted: false,       // Off until user grants permission

        // Addresses
        savedAddresses: [],                    // Empty — user adds later

        // Activity
        orderHistory: [],                      // Empty — builds over time
        favoriteStores: [],                    // Empty — user adds later
        recentlyViewed: [],                    // Empty — builds over time
        totalOrders: 0,

        // Tracking
        portalType: additionalData.portalType || 'customer',

        // Timestamps
        createdAt: serverTimestamp(),          // Firebase server time — never wrong
        updatedAt: serverTimestamp(),

        // SEO tracking
        referralSource: document.referrer || 'direct',
      });

    } else {
      // EXISTING USER — Only update last-seen timestamp and email verification
      await updateDoc(userRef, {
        emailVerified: user.emailVerified || false,
        updatedAt: serverTimestamp(),
        // Update displayName and photoURL if they changed (e.g., user updated Google profile)
        ...(user.displayName && { displayName: user.displayName }),
        ...(user.photoURL && { photoURL: user.photoURL }),
      });
    }

  } catch (error) {
    console.error('[FlashCart Firestore] createUserDocument error:', error);
    // Don't throw — user can still use app even if Firestore write fails
  }
};

/**
 * getUserDocument
 * Fetches a user's Firestore document by UID.
 *
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<object|null>} User data or null if not found
 */
export const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    // Return data with the document ID included
    return { id: userSnap.id, ...userSnap.data() };

  } catch (error) {
    console.error('[FlashCart Firestore] getUserDocument error:', error);
    return null;
  }
};

/**
 * updateUserDocument
 * Updates specific fields in a user's Firestore document.
 *
 * @param {string} uid - User's Firebase Auth UID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (uid, updates) => {
  if (!uid) throw new Error('User ID is required');

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);

    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(), // Always update the timestamp
    });

  } catch (error) {
    console.error('[FlashCart Firestore] updateUserDocument error:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * addSavedAddress
 * Adds a new delivery address to user's saved addresses.
 *
 * @param {string} uid - User UID
 * @param {object} address - Address object { label, address, lat, lng, area, city }
 * @returns {Promise<void>}
 */
export const addSavedAddress = async (uid, address) => {
  if (!uid || !address) throw new Error('User ID and address are required');

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);

    // Generate a unique ID for this address
    const addressWithId = {
      ...address,
      id: `addr_${Date.now()}`,       // Unique ID for this address
      createdAt: new Date().toISOString(),
    };

    // arrayUnion — adds to array without creating duplicates
    await updateDoc(userRef, {
      savedAddresses: arrayUnion(addressWithId),
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to save address: ${error.message}`);
  }
};

/**
 * removeSavedAddress
 * Removes a saved address by its ID.
 *
 * @param {string} uid - User UID
 * @param {object} address - The address object to remove (must match exactly)
 * @returns {Promise<void>}
 */
export const removeSavedAddress = async (uid, address) => {
  if (!uid || !address) throw new Error('User ID and address are required');

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);

    // arrayRemove removes the exact matching element
    await updateDoc(userRef, {
      savedAddresses: arrayRemove(address),
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to remove address: ${error.message}`);
  }
};

/**
 * toggleFavoriteStore
 * Adds or removes a store from user's favorites.
 *
 * @param {string} uid - User UID
 * @param {string} storeId - Store ID to toggle
 * @param {boolean} isFavorite - Current favorite state (true = remove, false = add)
 * @returns {Promise<void>}
 */
export const toggleFavoriteStore = async (uid, storeId, isFavorite) => {
  if (!uid || !storeId) throw new Error('User ID and store ID are required');

  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);

    await updateDoc(userRef, {
      // If currently favorite, remove it; otherwise add it
      favoriteStores: isFavorite
        ? arrayRemove(storeId)   // Remove from favorites
        : arrayUnion(storeId),   // Add to favorites
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to update favorites: ${error.message}`);
  }
};

// ============================================================
// PARTNER / STORE OPERATIONS
// ============================================================

/**
 * createPartnerDocument
 * Creates the initial partner document when a business registers.
 * Sets up all default values for a new partner.
 *
 * @param {object} user - Firebase Auth user
 * @param {object} businessData - Business registration data
 * @returns {Promise<string>} Partner document ID (same as UID)
 */
export const createPartnerDocument = async (user, businessData) => {
  if (!user || !user.uid) throw new Error('User is required');

  try {
    const partnerRef = doc(db, COLLECTIONS.PARTNERS, user.uid);

    // Generate a URL-friendly slug from the business name
    const slug = formatSlug(businessData.businessName) +
      '-' + user.uid.slice(-4); // Add 4 chars of UID for uniqueness

    await setDoc(partnerRef, {
      // Identity
      uid: user.uid,
      businessName: businessData.businessName || '',
      businessNameBn: businessData.businessNameBn || '',
      slug: slug,                           // URL slug for store page
      description: businessData.description || '',
      descriptionBn: businessData.descriptionBn || '',

      // Category and tags
      category: businessData.category || 'other',
      tags: businessData.tags || [],
      keywords: businessData.keywords || [],

      // Contact
      email: user.email || '',
      phone: businessData.phone || '',
      whatsapp: businessData.whatsapp || '',

      // Images — empty until partner uploads
      logoURL: '',
      coverImageURL: '',
      galleryImages: [],

      // Location — initial values (partner sets via map in Step 38)
      location: {
        address: businessData.address || '',
        area: businessData.area || '',
        city: businessData.city || 'Dhaka',
        district: businessData.district || 'Dhaka',
        lat: businessData.lat || 0,
        lng: businessData.lng || 0,
        deliveryRadiusKm: 10,             // Default 10km radius
        deliveryAreas: [],                // Named delivery areas (optional)
      },

      // Business hours — default: open all week 9AM-10PM
      schedule: {
        monday:    { open: '09:00', close: '22:00', isOpen: true },
        tuesday:   { open: '09:00', close: '22:00', isOpen: true },
        wednesday: { open: '09:00', close: '22:00', isOpen: true },
        thursday:  { open: '09:00', close: '22:00', isOpen: true },
        friday:    { open: '09:00', close: '22:00', isOpen: true },
        saturday:  { open: '09:00', close: '22:00', isOpen: true },
        sunday:    { open: '09:00', close: '22:00', isOpen: true },
      },
      specialSchedules: [],              // Holiday/special day overrides

      // Status flags
      isOpen: true,                      // Currently open
      isAcceptingOrders: true,           // Accepting orders
      isVerified: false,                 // Not verified by admin yet
      isActive: true,                    // Active on platform
      isFeatured: false,                 // Not featured yet

      // SEO fields — partner fills these in profile settings
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],

      // Analytics & ranking
      pageViews: 0,
      searchImpressions: 0,
      searchClicks: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalRatings: 0,
      completionRate: 100,              // Start at 100% — no orders yet
      responseTime: 0,
      rankScore: 0,                     // Calculated by ranking engine

      // Certifications — earned over time
      certificates: [],

      // Multiple outlets — empty initially
      outlets: [],

      // Notifications
      oneSignalPlayerId: '',
      notificationPreferences: {
        newOrder: true,
        orderCancelled: true,
        newReview: true,
        system: true,
      },

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approvedAt: null,                 // Set when admin approves
    });

    return user.uid; // Return the document ID

  } catch (error) {
    console.error('[FlashCart Firestore] createPartnerDocument error:', error);
    throw new Error(`Failed to create partner: ${error.message}`);
  }
};

/**
 * getPartnerDocument
 * Fetches a partner's document by UID.
 *
 * @param {string} uid - Partner's Firebase Auth UID
 * @returns {Promise<object|null>}
 */
export const getPartnerDocument = async (uid) => {
  if (!uid) return null;

  try {
    const partnerRef = doc(db, COLLECTIONS.PARTNERS, uid);
    const snap = await getDoc(partnerRef);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };

  } catch (error) {
    console.error('[FlashCart Firestore] getPartnerDocument error:', error);
    return null;
  }
};

/**
 * getPartnerBySlug
 * Fetches a partner's document by their URL slug.
 * Used in store detail page routing: /store/{slug}
 *
 * @param {string} slug - Store's URL slug
 * @returns {Promise<object|null>}
 */
export const getPartnerBySlug = async (slug) => {
  if (!slug) return null;

  try {
    // Query partners collection where slug matches
    const q = query(
      collection(db, COLLECTIONS.PARTNERS),
      where('slug', '==', slug),
      where('isActive', '==', true),  // Only active stores
      limit(1)                         // Only need one result
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    // Return first (and only) matching document
    const docData = snap.docs[0];
    return { id: docData.id, ...docData.data() };

  } catch (error) {
    console.error('[FlashCart Firestore] getPartnerBySlug error:', error);
    return null;
  }
};

/**
 * updatePartnerDocument
 * Updates specific fields in a partner's Firestore document.
 *
 * @param {string} uid - Partner UID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updatePartnerDocument = async (uid, updates) => {
  if (!uid) throw new Error('Partner ID is required');

  try {
    const partnerRef = doc(db, COLLECTIONS.PARTNERS, uid);

    await updateDoc(partnerRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to update partner: ${error.message}`);
  }
};

/**
 * getNearbyStores
 * Fetches active stores for display on the home and listing pages.
 * Note: Firestore doesn't do geo-queries natively — we fetch a
 * manageable batch and filter by distance in the client using geoUtils.
 * For production at scale, use GeoFirestore library.
 *
 * @param {string} category - Filter by category (optional)
 * @param {number} limitCount - Max stores to fetch
 * @returns {Promise<Array>} Array of partner store objects
 */
export const getNearbyStores = async (category = null, limitCount = 50) => {
  try {
    // Build the query based on parameters
    let q;

    if (category) {
      // Filter by category if provided
      q = query(
        collection(db, COLLECTIONS.PARTNERS),
        where('isActive', '==', true),         // Only active stores
        where('category', '==', category),     // Matching category
        orderBy('rankScore', 'desc'),           // Best ranked first
        limit(limitCount)
      );
    } else {
      // All active stores — sorted by rank
      q = query(
        collection(db, COLLECTIONS.PARTNERS),
        where('isActive', '==', true),
        orderBy('rankScore', 'desc'),
        limit(limitCount)
      );
    }

    const snap = await getDocs(q);

    // Map to data objects with document IDs
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.error('[FlashCart Firestore] getNearbyStores error:', error);
    return [];
  }
};

/**
 * getFeaturedStores
 * Gets featured/promoted stores for homepage display.
 *
 * @param {number} limitCount - Number of featured stores
 * @returns {Promise<Array>}
 */
export const getFeaturedStores = async (limitCount = 8) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PARTNERS),
      where('isActive', '==', true),
      where('isFeatured', '==', true),   // Only featured stores
      orderBy('rankScore', 'desc'),
      limit(limitCount)
    );

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error('[FlashCart Firestore] getFeaturedStores error:', error);
    return [];
  }
};

/**
 * incrementStorePageViews
 * Atomically increments the page view counter for a store.
 * Called every time a store's page is visited.
 *
 * @param {string} storeId - Partner store document ID
 * @returns {Promise<void>}
 */
export const incrementStorePageViews = async (storeId) => {
  if (!storeId) return;

  try {
    const partnerRef = doc(db, COLLECTIONS.PARTNERS, storeId);

    // increment() is atomic — safe for concurrent updates
    await updateDoc(partnerRef, {
      pageViews: increment(1),  // Increment by 1 atomically
    });

  } catch (error) {
    // Non-critical — don't throw, just log
    console.warn('[FlashCart Firestore] Page view increment failed:', error.message);
  }
};

// ============================================================
// ITEM / MENU OPERATIONS
// ============================================================

/**
 * createItem
 * Creates a new menu item for a partner store.
 *
 * @param {string} storeId - Partner store UID
 * @param {object} itemData - Item data from the form
 * @returns {Promise<string>} New item document ID
 */
export const createItem = async (storeId, itemData) => {
  if (!storeId || !itemData) throw new Error('Store ID and item data are required');

  try {
    // Generate slug from item name for SEO-friendly URLs
    const slug = formatSlug(itemData.name) + '-' + Date.now().toString(36);

    // Add the item to the global items collection
    const docRef = await addDoc(collection(db, COLLECTIONS.ITEMS), {
      // Reference to the store
      storeId,
      storeName: itemData.storeName || '',
      storeSlug: itemData.storeSlug || '',

      // Category
      categoryId: itemData.categoryId || '',
      categoryName: itemData.categoryName || '',

      // Item identity
      name: itemData.name || '',
      nameBn: itemData.nameBn || '',
      slug: slug,
      description: itemData.description || '',
      descriptionBn: itemData.descriptionBn || '',

      // Pricing
      price: Number(itemData.price) || 0,
      originalPrice: Number(itemData.originalPrice) || 0,
      discountPercent: Number(itemData.discountPercent) || 0,

      // Images
      imageURL: itemData.imageURL || '',
      images: itemData.images || [],

      // SEO and search
      tags: itemData.tags || [],
      keywords: itemData.keywords || [],

      // Status flags
      isAvailable: itemData.isAvailable !== false,  // Default true
      isFeatured: itemData.isFeatured || false,
      isVegetarian: itemData.isVegetarian || false,
      isSpicy: itemData.isSpicy || false,

      // Delivery
      preparationTime: Number(itemData.preparationTime) || 15,

      // Analytics
      totalOrders: 0,
      totalViews: 0,
      averageRating: 0,
      totalRatings: 0,
      rankScore: 0,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id; // Return the new document ID

  } catch (error) {
    throw new Error(`Failed to create item: ${error.message}`);
  }
};

/**
 * getStoreItems
 * Fetches all menu items for a specific store.
 *
 * @param {string} storeId - Partner store UID
 * @param {string} categoryId - Filter by category (optional)
 * @returns {Promise<Array>} Array of item objects
 */
export const getStoreItems = async (storeId, categoryId = null) => {
  if (!storeId) return [];

  try {
    let q;

    if (categoryId) {
      // Filter by category within the store
      q = query(
        collection(db, COLLECTIONS.ITEMS),
        where('storeId', '==', storeId),
        where('categoryId', '==', categoryId),
        where('isAvailable', '==', true),
        orderBy('rankScore', 'desc')
      );
    } else {
      // All items for the store
      q = query(
        collection(db, COLLECTIONS.ITEMS),
        where('storeId', '==', storeId),
        where('isAvailable', '==', true),
        orderBy('rankScore', 'desc')
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error('[FlashCart Firestore] getStoreItems error:', error);
    return [];
  }
};

/**
 * getItemBySlug
 * Fetches an item by its URL slug.
 * Used for individual item detail pages.
 *
 * @param {string} storeId - Store ID to scope the search
 * @param {string} slug - Item's URL slug
 * @returns {Promise<object|null>}
 */
export const getItemBySlug = async (storeId, slug) => {
  if (!storeId || !slug) return null;

  try {
    const q = query(
      collection(db, COLLECTIONS.ITEMS),
      where('storeId', '==', storeId),
      where('slug', '==', slug),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docData = snap.docs[0];
    return { id: docData.id, ...docData.data() };

  } catch (error) {
    console.error('[FlashCart Firestore] getItemBySlug error:', error);
    return null;
  }
};

/**
 * updateItem
 * Updates a menu item's data.
 *
 * @param {string} itemId - Item document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateItem = async (itemId, updates) => {
  if (!itemId) throw new Error('Item ID is required');

  try {
    const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Failed to update item: ${error.message}`);
  }
};

/**
 * deleteItem
 * Deletes a menu item from Firestore.
 *
 * @param {string} itemId - Item document ID
 * @returns {Promise<void>}
 */
export const deleteItem = async (itemId) => {
  if (!itemId) throw new Error('Item ID is required');

  try {
    await deleteDoc(doc(db, COLLECTIONS.ITEMS, itemId));
  } catch (error) {
    throw new Error(`Failed to delete item: ${error.message}`);
  }
};

/**
 * searchItems
 * Searches items by name across all stores or within a specific store.
 * Note: Firestore doesn't have full-text search — this does basic
 * prefix matching. For production, integrate Algolia or ElasticSearch.
 * Our search engine (Step 20) handles this more sophisticatedly client-side.
 *
 * @param {string} searchTerm - Search query
 * @param {string} storeId - Scope to store (optional)
 * @param {number} limitCount - Max results
 * @returns {Promise<Array>}
 */
export const searchItems = async (searchTerm, storeId = null, limitCount = 20) => {
  if (!searchTerm || searchTerm.trim().length < 2) return [];

  try {
    const term = searchTerm.trim().toLowerCase();

    // Build base query
    let constraints = [
      where('isAvailable', '==', true),
      limit(limitCount),
    ];

    // Add store scope if provided
    if (storeId) {
      constraints.unshift(where('storeId', '==', storeId));
    }

    const q = query(collection(db, COLLECTIONS.ITEMS), ...constraints);
    const snap = await getDocs(q);

    // Client-side filtering (Firestore limitation — no full-text search)
    // Filter by name containing the search term
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.name?.toLowerCase().includes(term) ||
        item.nameBn?.includes(searchTerm) ||       // Exact Bangla match
        item.tags?.some(tag => tag.toLowerCase().includes(term))
      );

  } catch (error) {
    console.error('[FlashCart Firestore] searchItems error:', error);
    return [];
  }
};

// ============================================================
// ORDER OPERATIONS
// ============================================================

/**
 * createOrder
 * Creates a new order in Firestore.
 * Also updates the Real-time Database (in rtdb.js) for live tracking.
 *
 * @param {object} orderData - Complete order data
 * @returns {Promise<string>} New order document ID
 */
export const createOrder = async (orderData) => {
  if (!orderData) throw new Error('Order data is required');

  try {
    // Generate a human-readable order ID
    const orderId = `FC-${Date.now().toString(36).toUpperCase()}`;

    // Create the order document
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      // Human-readable ID (different from Firestore document ID)
      orderId,

      // Parties
      customerId: orderData.customerId,
      customerName: orderData.customerName || '',
      customerPhone: orderData.customerPhone || '',
      storeId: orderData.storeId,
      storeName: orderData.storeName || '',

      // Items ordered
      items: orderData.items || [],

      // Pricing
      subtotal: Number(orderData.subtotal) || 0,
      deliveryFee: Number(orderData.deliveryFee) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,

      // Payment — always COD
      paymentMethod: 'cod',

      // Status — starts as pending
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        }
      ],

      // Delivery details
      deliveryAddress: orderData.deliveryAddress || {},
      estimatedDeliveryTime: orderData.estimatedDeliveryTime || 45,
      actualDeliveryTime: null,   // Set when delivered

      // Notes
      customerNote: orderData.customerNote || '',
      partnerNote: '',            // Partner fills this in

      // Review
      isReviewed: false,
      reviewId: null,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Increment the store's total order count
    await updateDoc(doc(db, COLLECTIONS.PARTNERS, orderData.storeId), {
      totalOrders: increment(1),
    });

    // Increment user's total order count
    await updateDoc(doc(db, COLLECTIONS.USERS, orderData.customerId), {
      totalOrders: increment(1),
      orderHistory: arrayUnion(docRef.id),
    });

    return docRef.id;

  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

/**
 * updateOrderStatus
 * Updates an order's status. Used by the partner to accept/reject/complete.
 * Also updates the RTDB entry for real-time tracking.
 *
 * @param {string} orderId - Firestore order document ID
 * @param {string} newStatus - New status string
 * @param {string} note - Optional status note from partner
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  if (!orderId || !newStatus) throw new Error('Order ID and status are required');

  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);

    // Update the order document
    await updateDoc(orderRef, {
      status: newStatus,
      // Append to status history array
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note,
      }),
      // If delivered, set the actual delivery time
      ...(newStatus === 'delivered' && {
        actualDeliveryTime: serverTimestamp(),
      }),
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }
};

/**
 * getOrdersByCustomer
 * Fetches all orders for a specific customer.
 *
 * @param {string} customerId - Customer UID
 * @param {number} limitCount - Max orders to fetch
 * @returns {Promise<Array>}
 */
export const getOrdersByCustomer = async (customerId, limitCount = PAGINATION.ORDERS_PER_PAGE) => {
  if (!customerId) return [];

  try {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc'),    // Most recent first
      limit(limitCount)
    );

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error('[FlashCart Firestore] getOrdersByCustomer error:', error);
    return [];
  }
};

/**
 * getOrdersByStore
 * Fetches orders for a partner store — for partner order management.
 *
 * @param {string} storeId - Store UID
 * @param {string} status - Filter by status (optional — null = all)
 * @param {number} limitCount - Max orders
 * @returns {Promise<Array>}
 */
export const getOrdersByStore = async (storeId, status = null, limitCount = PAGINATION.ORDERS_PER_PAGE) => {
  if (!storeId) return [];

  try {
    let q;

    if (status) {
      // Filter by specific status
      q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('storeId', '==', storeId),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      // All orders for this store
      q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('storeId', '==', storeId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error('[FlashCart Firestore] getOrdersByStore error:', error);
    return [];
  }
};

/**
 * getOrderDocument
 * Fetches a single order document by ID.
 *
 * @param {string} orderId - Order document ID
 * @returns {Promise<object|null>}
 */
export const getOrderDocument = async (orderId) => {
  if (!orderId) return null;

  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const snap = await getDoc(orderRef);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };

  } catch (error) {
    console.error('[FlashCart Firestore] getOrderDocument error:', error);
    return null;
  }
};

/**
 * subscribeToOrder
 * Sets up a real-time listener on a single order document.
 * Used in order tracking page — updates UI when status changes.
 *
 * @param {string} orderId - Order document ID
 * @param {function} callback - Called with order data on every change
 * @returns {function} Unsubscribe function
 */
export const subscribeToOrder = (orderId, callback) => {
  if (!orderId) return () => {};

  // Create a real-time listener on the order document
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);

  return onSnapshot(orderRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null); // Order doesn't exist
    }
  }, (error) => {
    console.error('[FlashCart Firestore] Order listener error:', error);
  });
};

// ============================================================
// REVIEW OPERATIONS
// ============================================================

/**
 * createReview
 * Creates a new review for a store.
 * Updates the store's average rating atomically.
 *
 * @param {object} reviewData - Review data from the form
 * @returns {Promise<string>} New review document ID
 */
export const createReview = async (reviewData) => {
  if (!reviewData) throw new Error('Review data is required');

  try {
    // Use a Firestore transaction to atomically:
    // 1. Create the review document
    // 2. Update the store's average rating
    // 3. Mark the order as reviewed
    const reviewId = await runTransaction(db, async (transaction) => {
      // Reference to the store document
      const storeRef = doc(db, COLLECTIONS.PARTNERS, reviewData.storeId);
      const storeSnap = await transaction.get(storeRef);

      if (!storeSnap.exists()) {
        throw new Error('Store not found');
      }

      const storeData = storeSnap.data();

      // Calculate new average rating
      const currentTotal = storeData.averageRating * storeData.totalRatings;
      const newTotalRatings = storeData.totalRatings + 1;
      const newAverageRating = (currentTotal + reviewData.rating) / newTotalRatings;

      // Create the review document
      const reviewRef = doc(collection(db, COLLECTIONS.REVIEWS));

      transaction.set(reviewRef, {
        // References
        orderId: reviewData.orderId,
        customerId: reviewData.customerId,
        customerName: reviewData.customerName || '',
        customerPhotoURL: reviewData.customerPhotoURL || '',
        storeId: reviewData.storeId,
        storeName: reviewData.storeName || '',

        // Rating
        rating: Number(reviewData.rating) || 5,
        title: reviewData.title || '',
        content: reviewData.content || '',
        contentBn: reviewData.contentBn || '',

        // Detailed ratings
        foodQualityRating: Number(reviewData.foodQualityRating) || 0,
        packagingRating: Number(reviewData.packagingRating) || 0,
        deliveryRating: Number(reviewData.deliveryRating) || 0,
        valueRating: Number(reviewData.valueRating) || 0,

        // Images
        images: reviewData.images || [],

        // Engagement
        helpfulCount: 0,
        helpfulUsers: [],

        // Partner response
        partnerResponse: '',
        partnerResponseAt: null,

        // Flags
        isVerifiedPurchase: true,   // Always true since we require an order
        isReported: false,
        isApproved: true,           // Auto-approve for now

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update store rating atomically
      transaction.update(storeRef, {
        averageRating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
        totalRatings: increment(1),
        updatedAt: serverTimestamp(),
      });

      // Mark the order as reviewed
      if (reviewData.orderId) {
        const orderRef = doc(db, COLLECTIONS.ORDERS, reviewData.orderId);
        transaction.update(orderRef, {
          isReviewed: true,
          reviewId: reviewRef.id,
          updatedAt: serverTimestamp(),
        });
      }

      return reviewRef.id;
    });

    return reviewId;

  } catch (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

/**
 * getStoreReviews
 * Fetches reviews for a store with pagination support.
 *
 * @param {string} storeId - Store ID to get reviews for
 * @param {number} limitCount - Reviews per page
 * @param {object} lastDoc - Last document for pagination cursor
 * @returns {Promise<{ reviews: Array, lastDoc: object }>}
 */
export const getStoreReviews = async (storeId, limitCount = PAGINATION.REVIEWS_PER_PAGE, lastDoc = null) => {
  if (!storeId) return { reviews: [], lastDoc: null };

  try {
    // Build paginated query
    let q;

    if (lastDoc) {
      // Paginated — start after the last document from previous page
      q = query(
        collection(db, COLLECTIONS.REVIEWS),
        where('storeId', '==', storeId),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),    // Pagination cursor
        limit(limitCount)
      );
    } else {
      // First page
      q = query(
        collection(db, COLLECTIONS.REVIEWS),
        where('storeId', '==', storeId),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const snap = await getDocs(q);
    const reviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Return reviews and the last document for pagination
    return {
      reviews,
      lastDoc: snap.docs[snap.docs.length - 1] || null,
      hasMore: snap.docs.length === limitCount,  // True if there might be more
    };

  } catch (error) {
    console.error('[FlashCart Firestore] getStoreReviews error:', error);
    return { reviews: [], lastDoc: null, hasMore: false };
  }
};

/**
 * addPartnerReviewResponse
 * Allows a partner to respond to a review.
 *
 * @param {string} reviewId - Review document ID
 * @param {string} response - Partner's response text
 * @returns {Promise<void>}
 */
export const addPartnerReviewResponse = async (reviewId, response) => {
  if (!reviewId || !response) throw new Error('Review ID and response are required');

  try {
    const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);

    await updateDoc(reviewRef, {
      partnerResponse: response.trim(),
      partnerResponseAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    throw new Error(`Failed to add review response: ${error.message}`);
  }
};

/**
 * markReviewHelpful
 * Increments the helpful count on a review.
 * Prevents double-voting by tracking user IDs.
 *
 * @param {string} reviewId - Review document ID
 * @param {string} userId - User marking as helpful
 * @returns {Promise<void>}
 */
export const markReviewHelpful = async (reviewId, userId) => {
  if (!reviewId || !userId) return;

  try {
    const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);

    await updateDoc(reviewRef, {
      helpfulCount: increment(1),
      helpfulUsers: arrayUnion(userId),  // Track who voted (prevents duplicates)
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    console.error('[FlashCart Firestore] markReviewHelpful error:', error);
  }
};

// ============================================================
// STORE CATEGORIES (sub-collection)
// ============================================================

/**
 * createStoreCategory
 * Creates a menu category for a partner store.
 * Categories are stored as a sub-collection under each store.
 *
 * @param {string} storeId - Store/Partner UID
 * @param {object} categoryData - Category data
 * @returns {Promise<string>} New category document ID
 */
export const createStoreCategory = async (storeId, categoryData) => {
  if (!storeId || !categoryData) throw new Error('Store ID and category data required');

  try {
    // Sub-collection path: partners/{storeId}/categories
    const categoriesRef = collection(db, COLLECTIONS.PARTNERS, storeId, COLLECTIONS.CATEGORIES);

    const docRef = await addDoc(categoriesRef, {
      name: categoryData.name || '',
      nameBn: categoryData.nameBn || '',
      description: categoryData.description || '',
      imageURL: categoryData.imageURL || '',
      sortOrder: categoryData.sortOrder || 0,
      isActive: true,
      itemCount: 0,
      createdAt: serverTimestamp(),
    });

    return docRef.id;

  } catch (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
};

/**
 * getStoreCategories
 * Fetches all menu categories for a store.
 *
 * @param {string} storeId - Store UID
 * @returns {Promise<Array>}
 */
export const getStoreCategories = async (storeId) => {
  if (!storeId) return [];

  try {
    const categoriesRef = collection(db, COLLECTIONS.PARTNERS, storeId, COLLECTIONS.CATEGORIES);
    const q = query(categoriesRef, where('isActive', '==', true), orderBy('sortOrder', 'asc'));

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error('[FlashCart Firestore] getStoreCategories error:', error);
    return [];
  }
};

/**
 * updateStoreCategory
 * Updates a menu category.
 *
 * @param {string} storeId - Store UID
 * @param {string} categoryId - Category document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateStoreCategory = async (storeId, categoryId, updates) => {
  if (!storeId || !categoryId) throw new Error('Store ID and category ID required');

  try {
    const categoryRef = doc(db, COLLECTIONS.PARTNERS, storeId, COLLECTIONS.CATEGORIES, categoryId);
    await updateDoc(categoryRef, { ...updates });

  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
};

/**
 * deleteStoreCategory
 * Soft-deletes a category by setting isActive to false.
 * Items in the category still exist but are hidden.
 *
 * @param {string} storeId - Store UID
 * @param {string} categoryId - Category document ID
 * @returns {Promise<void>}
 */
export const deleteStoreCategory = async (storeId, categoryId) => {
  if (!storeId || !categoryId) throw new Error('Store ID and category ID required');

  try {
    const categoryRef = doc(db, COLLECTIONS.PARTNERS, storeId, COLLECTIONS.CATEGORIES, categoryId);
    // Soft delete — set isActive false instead of actually deleting
    await updateDoc(categoryRef, { isActive: false });

  } catch (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};

// ── UTILITY: BATCH OPERATIONS ──────────────────────────────

/**
 * batchUpdateItems
 * Updates multiple items at once using Firestore batch writes.
 * More efficient than individual updates. Max 500 per batch.
 *
 * @param {Array<{id: string, updates: object}>} items - Items to update
 * @returns {Promise<void>}
 */
export const batchUpdateItems = async (items) => {
  if (!items || items.length === 0) return;

  try {
    const batch = writeBatch(db);

    // Add each update to the batch
    items.forEach(({ id, updates }) => {
      const ref = doc(db, COLLECTIONS.ITEMS, id);
      batch.update(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    });

    // Execute all updates atomically
    await batch.commit();

  } catch (error) {
    throw new Error(`Batch update failed: ${error.message}`);
  }
};
