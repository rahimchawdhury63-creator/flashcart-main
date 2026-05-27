// ============================================================
// FlashCart — Firebase Realtime Database Service
// Real-time operations for order status tracking,
// partner presence detection, and notification queue.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// Import Realtime Database functions from Firebase
import {
  ref,          // Create a database reference (path)
  set,          // Set data at a path (overwrites)
  update,       // Update specific fields at a path
  get,          // One-time read of data
  remove,       // Delete data at a path
  onValue,      // Real-time listener (fires on every change)
  onDisconnect, // Actions to run when user disconnects
  serverTimestamp as rtdbTimestamp, // RTDB server timestamp
  push,         // Push to a list (auto-generates key)
  query as rtdbQuery, // RTDB query
  orderByChild, // Order RTDB query by child field
  limitToLast,  // Limit RTDB query results
  equalTo,      // Filter RTDB by value
} from 'firebase/database';

// Import the RTDB instance from our config
import { rtdb } from './config';

// Import path constants
import { RTDB_PATHS } from '../../utils/constants';

// ============================================================
// ACTIVE ORDER OPERATIONS (Real-time order tracking)
// ============================================================

/**
 * createActiveOrder
 * Creates an entry in the RTDB for real-time order tracking.
 * Called alongside createOrder() in Firestore.
 * Partners listen to this path for instant new order alerts.
 *
 * @param {string} storeId - Partner store UID
 * @param {string} orderId - Firestore order document ID
 * @param {object} orderSummary - Minimal order data for RTDB
 * @returns {Promise<void>}
 */
export const createActiveOrder = async (storeId, orderId, orderSummary) => {
  if (!storeId || !orderId) return;

  try {
    // Path: activeOrders/{storeId}/{orderId}
    const orderRef = ref(rtdb, `${RTDB_PATHS.ACTIVE_ORDERS}/${storeId}/${orderId}`);

    await set(orderRef, {
      orderId,                                        // Firestore document ID
      status: 'pending',                              // Initial status
      customerId: orderSummary.customerId || '',
      customerName: orderSummary.customerName || '',
      customerPhone: orderSummary.customerPhone || '',
      totalAmount: orderSummary.totalAmount || 0,
      itemCount: orderSummary.itemCount || 0,
      createdAt: Date.now(),                          // Unix timestamp (ms)
      updatedAt: Date.now(),
    });

  } catch (error) {
    console.error('[FlashCart RTDB] createActiveOrder error:', error);
    // Non-fatal — Firestore is the source of truth
  }
};

/**
 * updateActiveOrderStatus
 * Updates the order status in RTDB for real-time UI updates.
 * Called whenever partner changes order status.
 *
 * @param {string} storeId - Store UID
 * @param {string} orderId - Order document ID
 * @param {string} status - New order status
 * @returns {Promise<void>}
 */
export const updateActiveOrderStatus = async (storeId, orderId, status) => {
  if (!storeId || !orderId || !status) return;

  try {
    const orderRef = ref(rtdb, `${RTDB_PATHS.ACTIVE_ORDERS}/${storeId}/${orderId}`);

    await update(orderRef, {
      status,
      updatedAt: Date.now(),
    });

    // If order is completed or cancelled, remove from active orders after delay
    // This keeps the RTDB clean — only truly active orders remain
    if (status === 'delivered' || status === 'cancelled') {
      setTimeout(async () => {
        try {
          await removeActiveOrder(storeId, orderId);
        } catch {
          // Silently fail — cleanup is non-critical
        }
      }, 30000); // Remove after 30 seconds
    }

  } catch (error) {
    console.error('[FlashCart RTDB] updateActiveOrderStatus error:', error);
  }
};

/**
 * removeActiveOrder
 * Removes a completed/cancelled order from RTDB active orders.
 * Keeps RTDB clean — only pending/in-progress orders remain.
 *
 * @param {string} storeId - Store UID
 * @param {string} orderId - Order document ID
 * @returns {Promise<void>}
 */
export const removeActiveOrder = async (storeId, orderId) => {
  if (!storeId || !orderId) return;

  try {
    const orderRef = ref(rtdb, `${RTDB_PATHS.ACTIVE_ORDERS}/${storeId}/${orderId}`);
    await remove(orderRef);
  } catch (error) {
    console.error('[FlashCart RTDB] removeActiveOrder error:', error);
  }
};

/**
 * subscribeToStoreActiveOrders
 * Sets up a real-time listener on a store's active orders.
 * Partner portal uses this to instantly show new orders.
 * Fires immediately with current data, then on every change.
 *
 * @param {string} storeId - Partner store UID
 * @param {function} callback - Called with orders object on every change
 * @returns {function} Unsubscribe function — call to stop listening
 */
export const subscribeToStoreActiveOrders = (storeId, callback) => {
  if (!storeId) return () => {};

  // Reference to this store's active orders
  const ordersRef = ref(rtdb, `${RTDB_PATHS.ACTIVE_ORDERS}/${storeId}`);

  // Subscribe to real-time changes
  const unsubscribe = onValue(ordersRef, (snapshot) => {
    // snapshot.val() returns null if no data, or the object
    const data = snapshot.val();

    if (!data) {
      // No active orders
      callback([]);
      return;
    }

    // Convert the RTDB object to an array of orders
    // RTDB stores as { orderId: { ...data } } — we want an array
    const ordersArray = Object.entries(data).map(([key, value]) => ({
      id: key,       // The RTDB key (same as Firestore orderId)
      ...value,
    }));

    // Sort by createdAt (newest first)
    ordersArray.sort((a, b) => b.createdAt - a.createdAt);

    callback(ordersArray);

  }, (error) => {
    console.error('[FlashCart RTDB] subscribeToStoreActiveOrders error:', error);
    callback([]); // Return empty on error
  });

  // Return the unsubscribe function
  return unsubscribe;
};

/**
 * subscribeToSingleOrder
 * Real-time listener on a specific order for customer tracking.
 * Customer sees live status updates as partner changes them.
 *
 * @param {string} storeId - Store UID
 * @param {string} orderId - Order document ID
 * @param {function} callback - Called with order data on change
 * @returns {function} Unsubscribe function
 */
export const subscribeToSingleOrder = (storeId, orderId, callback) => {
  if (!storeId || !orderId) return () => {};

  const orderRef = ref(rtdb, `${RTDB_PATHS.ACTIVE_ORDERS}/${storeId}/${orderId}`);

  const unsubscribe = onValue(orderRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? { id: orderId, ...data } : null);
  }, (error) => {
    console.error('[FlashCart RTDB] subscribeToSingleOrder error:', error);
    callback(null);
  });

  return unsubscribe;
};

// ============================================================
// STORE STATUS OPERATIONS (Real-time open/close)
// ============================================================

/**
 * setStoreStatus
 * Updates a store's open/close status in RTDB.
 * All users see this change immediately.
 *
 * @param {string} storeId - Store UID
 * @param {boolean} isOpen - Whether store is open
 * @param {boolean} isAcceptingOrders - Whether accepting orders
 * @returns {Promise<void>}
 */
export const setStoreStatus = async (storeId, isOpen, isAcceptingOrders = true) => {
  if (!storeId) return;

  try {
    const statusRef = ref(rtdb, `${RTDB_PATHS.STORE_STATUS}/${storeId}`);

    await set(statusRef, {
      isOpen,
      isAcceptingOrders: isOpen ? isAcceptingOrders : false, // Can't accept orders if closed
      lastUpdated: Date.now(),
    });

  } catch (error) {
    console.error('[FlashCart RTDB] setStoreStatus error:', error);
    throw new Error(`Failed to update store status: ${error.message}`);
  }
};

/**
 * subscribeToStoreStatus
 * Real-time listener on a store's open/close status.
 * Used in store cards and detail pages to show live status.
 *
 * @param {string} storeId - Store UID
 * @param {function} callback - Called with status on change
 * @returns {function} Unsubscribe function
 */
export const subscribeToStoreStatus = (storeId, callback) => {
  if (!storeId) return () => {};

  const statusRef = ref(rtdb, `${RTDB_PATHS.STORE_STATUS}/${storeId}`);

  const unsubscribe = onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    // Provide defaults if no status has been set yet
    callback(data || { isOpen: true, isAcceptingOrders: true });
  }, (error) => {
    console.error('[FlashCart RTDB] subscribeToStoreStatus error:', error);
    callback({ isOpen: false, isAcceptingOrders: false });
  });

  return unsubscribe;
};

// ============================================================
// PARTNER PRESENCE SYSTEM (Online/Offline Detection)
// ============================================================

/**
 * setPartnerPresence
 * Marks a partner as online in RTDB.
 * Uses onDisconnect to automatically mark offline when connection drops.
 * This is the key mechanism for detecting if partner is active.
 *
 * @param {string} partnerId - Partner UID
 * @returns {Promise<void>}
 */
export const setPartnerPresence = async (partnerId) => {
  if (!partnerId) return;

  try {
    const presenceRef = ref(rtdb, `${RTDB_PATHS.PARTNER_PRESENCE}/${partnerId}`);

    // What to set when the partner disconnects (network drop, browser close)
    // This runs automatically on Firebase's servers — very reliable
    onDisconnect(presenceRef).set({
      isOnline: false,
      tabActive: false,
      lastSeen: Date.now(),
    });

    // Mark partner as online now
    await set(presenceRef, {
      isOnline: true,
      tabActive: true,      // Assume tab is active when first connecting
      lastSeen: Date.now(),
    });

  } catch (error) {
    console.error('[FlashCart RTDB] setPartnerPresence error:', error);
  }
};

/**
 * updatePartnerTabActive
 * Updates whether the partner's browser tab is currently active/focused.
 * Uses the Page Visibility API — if tab is hidden, partner may miss notifications.
 *
 * @param {string} partnerId - Partner UID
 * @param {boolean} isActive - Whether tab is focused/visible
 * @returns {Promise<void>}
 */
export const updatePartnerTabActive = async (partnerId, isActive) => {
  if (!partnerId) return;

  try {
    const presenceRef = ref(rtdb, `${RTDB_PATHS.PARTNER_PRESENCE}/${partnerId}`);

    await update(presenceRef, {
      tabActive: isActive,
      lastSeen: Date.now(),
    });

  } catch (error) {
    // Non-critical — don't throw
    console.warn('[FlashCart RTDB] Tab activity update failed:', error.message);
  }
};

/**
 * removePartnerPresence
 * Marks partner as offline (called on logout or page unload).
 *
 * @param {string} partnerId - Partner UID
 * @returns {Promise<void>}
 */
export const removePartnerPresence = async (partnerId) => {
  if (!partnerId) return;

  try {
    const presenceRef = ref(rtdb, `${RTDB_PATHS.PARTNER_PRESENCE}/${partnerId}`);

    await set(presenceRef, {
      isOnline: false,
      tabActive: false,
      lastSeen: Date.now(),
    });

  } catch (error) {
    console.warn('[FlashCart RTDB] Presence removal failed:', error.message);
  }
};

// ============================================================
// NOTIFICATION QUEUE
// ============================================================

/**
 * pushNotification
 * Pushes a notification to the partner's notification queue in RTDB.
 * Partner app listens to this and shows alerts accordingly.
 *
 * @param {string} partnerId - Partner UID to notify
 * @param {object} notification - Notification data
 * @returns {Promise<string>} Notification key
 */
export const pushNotification = async (partnerId, notification) => {
  if (!partnerId || !notification) return null;

  try {
    // Push to the notification list — generates unique key
    const notifRef = ref(rtdb, `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}`);

    const newNotifRef = await push(notifRef, {
      type: notification.type || 'system',      // 'new_order' | 'cancelled' | 'review' | 'system'
      orderId: notification.orderId || null,    // Related order ID
      message: notification.message || '',      // Notification message
      messageBn: notification.messageBn || '', // Bangla message
      isRead: false,                            // Unread initially
      createdAt: Date.now(),
    });

    return newNotifRef.key; // Return the generated notification key

  } catch (error) {
    console.error('[FlashCart RTDB] pushNotification error:', error);
    return null;
  }
};

/**
 * subscribeToPartnerNotifications
 * Sets up a real-time listener on a partner's notification queue.
 * This is Layer 2 of the 5-layer notification system.
 * Fires when a new notification is pushed to the queue.
 *
 * @param {string} partnerId - Partner UID
 * @param {function} callback - Called with notifications array on change
 * @returns {function} Unsubscribe function
 */
export const subscribeToPartnerNotifications = (partnerId, callback) => {
  if (!partnerId) return () => {};

  // Reference to partner's notifications
  // Only get last 20 notifications (most recent)
  const notifRef = ref(rtdb, `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}`);

  const unsubscribe = onValue(notifRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    // Convert object to array and sort by createdAt (newest first)
    const notifications = Object.entries(data)
      .map(([key, value]) => ({ id: key, ...value }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20); // Keep only 20 most recent

    callback(notifications);

  }, (error) => {
    console.error('[FlashCart RTDB] Notification listener error:', error);
    callback([]);
  });

  return unsubscribe;
};

/**
 * markNotificationRead
 * Marks a specific notification as read in RTDB.
 *
 * @param {string} partnerId - Partner UID
 * @param {string} notificationId - Notification key to mark read
 * @returns {Promise<void>}
 */
export const markNotificationRead = async (partnerId, notificationId) => {
  if (!partnerId || !notificationId) return;

  try {
    const notifRef = ref(
      rtdb,
      `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}/${notificationId}`
    );

    await update(notifRef, { isRead: true });

  } catch (error) {
    console.warn('[FlashCart RTDB] markNotificationRead error:', error.message);
  }
};

/**
 * markAllNotificationsRead
 * Marks all of a partner's notifications as read.
 *
 * @param {string} partnerId - Partner UID
 * @returns {Promise<void>}
 */
export const markAllNotificationsRead = async (partnerId) => {
  if (!partnerId) return;

  try {
    // Get current notifications
    const notifRef = ref(rtdb, `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}`);
    const snapshot = await get(notifRef);
    const data = snapshot.val();

    if (!data) return;

    // Build update object to mark all as read
    const updates = {};
    Object.keys(data).forEach(key => {
      updates[`${key}/isRead`] = true;
    });

    // Batch update all at once
    await update(notifRef, updates);

  } catch (error) {
    console.error('[FlashCart RTDB] markAllNotificationsRead error:', error);
  }
};

/**
 * clearAllNotifications
 * Removes all notifications for a partner.
 * Called when partner explicitly clears notifications.
 *
 * @param {string} partnerId - Partner UID
 * @returns {Promise<void>}
 */
export const clearAllNotifications = async (partnerId) => {
  if (!partnerId) return;

  try {
    const notifRef = ref(rtdb, `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}`);
    await remove(notifRef);
  } catch (error) {
    console.error('[FlashCart RTDB] clearAllNotifications error:', error);
  }
};

/**
 * getUnreadNotificationCount
 * Gets the count of unread notifications for badge display.
 *
 * @param {string} partnerId - Partner UID
 * @returns {Promise<number>} Count of unread notifications
 */
export const getUnreadNotificationCount = async (partnerId) => {
  if (!partnerId) return 0;

  try {
    const notifRef = ref(rtdb, `${RTDB_PATHS.NOTIFICATIONS}/${partnerId}`);
    const snapshot = await get(notifRef);
    const data = snapshot.val();

    if (!data) return 0;

    // Count entries where isRead is false
    return Object.values(data).filter(notif => !notif.isRead).length;

  } catch (error) {
    return 0;
  }
};

// ============================================================
// UTILITY: Connection State Monitoring
// ============================================================

/**
 * subscribeToConnectionState
 * Monitors the RTDB connection state.
 * Used to show online/offline indicators in the UI.
 * Firebase provides a special .info/connected path for this.
 *
 * @param {function} callback - Called with boolean (connected/disconnected)
 * @returns {function} Unsubscribe function
 */
export const subscribeToConnectionState = (callback) => {
  // Firebase's special path that reflects connection status
  const connectedRef = ref(rtdb, '.info/connected');

  const unsubscribe = onValue(connectedRef, (snapshot) => {
    const isConnected = snapshot.val() === true;
    callback(isConnected);
  });

  return unsubscribe;
};

/**
 * pingRTDB
 * Tests the RTDB connection with a simple read.
 * Used to verify connection before showing real-time features.
 *
 * @returns {Promise<boolean>} Whether connection is working
 */
export const pingRTDB = async () => {
  try {
    const testRef = ref(rtdb, '.info/serverTimeOffset');
    await get(testRef);
    return true;
  } catch {
    return false;
  }
};
