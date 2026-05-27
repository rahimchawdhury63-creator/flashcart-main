/**
 * =============================================================================
 * FLASHCART MAIN — Service Worker
 * =============================================================================
 * 
 * Purpose: Progressive Web App service worker for the customer portal.
 * 
 * Responsibilities:
 * 1. Cache static assets (CSS, JS, fonts, images) for offline access
 * 2. Serve cached pages when network is unavailable (offline fallback)
 * 3. Implement cache-first strategy for static assets
 * 4. Implement network-first strategy for API calls (Firestore/RTDB)
 * 5. Handle background sync for offline order queue
 * 6. Manage cache versioning for update control
 * 
 * Cache Strategies:
 * - Static assets (JS/CSS/fonts): Cache-first (fastest, update on install)
 * - API responses: Network-first (freshest data, fallback to cache)
 * - Pages/routes: Stale-while-revalidate (show cached, update in background)
 * - Images: Cache-first with expiration (save bandwidth)
 * 
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

/* --- Cache Version --- */
/* Increment this version string to force cache invalidation on update */
const CACHE_VERSION = 'flashcart-main-v1.0.0';

/* --- Cache Names --- */
const STATIC_CACHE = `${CACHE_VERSION}-static`;    /* CSS, JS, fonts */
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;  /* Runtime cached pages */
const IMAGE_CACHE = `${CACHE_VERSION}-images`;      /* Cached images */

/* --- URLs to Pre-cache on Service Worker Install --- */
/* These are the critical resources needed for offline functionality */
const PRECACHE_URLS = [
  '/',                    /* Homepage */
  '/offline.html',        /* Offline fallback page */
  '/manifest.json'        /* PWA manifest */
];

/* --- External Resources to Cache --- */
/* Fonts and CSS from CDNs that should be cached for offline use */
const EXTERNAL_CACHE_URLS = [
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap'
];

/* --- Domains That Should Use Network-First Strategy --- */
/* API calls that need fresh data, falling back to cached responses */
const NETWORK_FIRST_DOMAINS = [
  'firestore.googleapis.com',
  'flashcart-bd-default-rtdb.asia-southeast1.firebasedatabase.app',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'api.imgbb.com',
  'nominatim.openstreetmap.org'
];

/* --- Domains to Cache-First (CDN Resources) --- */
const CACHE_FIRST_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
  'tile.openstreetmap.org'
];

/**
 * =============================================================================
 * INSTALL EVENT
 * =============================================================================
 * Triggered when the service worker is first installed or updated.
 * Pre-caches critical resources so the app works offline immediately.
 */
self.addEventListener('install', (event) => {
  /* Skip waiting to activate immediately (don't wait for old SW to die) */
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      /* Pre-cache all critical URLs */
      return cache.addAll(PRECACHE_URLS).catch((error) => {
        /* Log but don't fail — some URLs might not be available yet */
        console.warn('[SW] Pre-cache partial failure:', error);
      });
    })
  );
});

/**
 * =============================================================================
 * ACTIVATE EVENT
 * =============================================================================
 * Triggered when the service worker takes control of the page.
 * Cleans up old caches from previous versions.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          /* Find caches that don't match current version */
          .filter((name) => {
            return name.startsWith('flashcart-main-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE;
          })
          /* Delete outdated caches */
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      /* Take control of all open tabs immediately */
      return self.clients.claim();
    })
  );
});

/**
 * =============================================================================
 * FETCH EVENT
 * =============================================================================
 * Intercepts all network requests and applies the appropriate cache strategy.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* --- Skip non-GET requests (POST, PUT, DELETE) --- */
  if (request.method !== 'GET') {
    return;
  }

  /* --- Skip chrome-extension and other non-http requests --- */
  if (!request.url.startsWith('http')) {
    return;
  }

  /* --- Strategy Selection Based on Domain --- */

  /* Network-First: API calls that need fresh data */
  if (NETWORK_FIRST_DOMAINS.some((domain) => url.hostname.includes(domain))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  /* Cache-First: CDN resources (fonts, map tiles, CSS frameworks) */
  if (CACHE_FIRST_DOMAINS.some((domain) => url.hostname.includes(domain))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  /* Cache-First: Image files */
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  /* Cache-First: Static assets (JS, CSS bundles) */
  if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  /* Stale-While-Revalidate: HTML pages/routes (SPA navigation) */
  event.respondWith(staleWhileRevalidateStrategy(request));
});

/**
 * Network-First Strategy
 * Try network, fall back to cache, then offline page
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    /* Cache successful responses for future offline use */
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    /* Network failed — try cache */
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    /* No cache either — return offline page for navigation requests */
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    /* For non-navigation requests, return a generic error response */
    return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Cache-First Strategy
 * Try cache first (fastest), fall back to network, cache the result
 */
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    /* Return offline page for navigation, empty response for resources */
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return new Response('', { status: 404 });
  }
}

/**
 * Stale-While-Revalidate Strategy
 * Return cached version immediately, update cache in background
 * Best for HTML pages — user gets instant response, next visit gets fresh data
 */
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  /* Fetch from network in background regardless of cache hit */
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  }).catch(() => {
    /* Network failed silently — cached response is already being returned */
    return null;
  });

  /* Return cached response immediately, or wait for network */
  if (cachedResponse) {
    return cachedResponse;
  }

  /* No cache — must wait for network */
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  /* Both failed — offline page */
  if (request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  return new Response('Offline', { status: 503 });
}

/**
 * =============================================================================
 * BACKGROUND SYNC — Offline Order Queue
 * =============================================================================
 * When a customer places an order while offline, we queue it in IndexedDB
 * and sync it when connectivity is restored.
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-orders') {
    event.waitUntil(syncOfflineOrders());
  }
});

/**
 * Process queued offline orders
 * Reads from IndexedDB, sends to Firebase, clears queue on success
 */
async function syncOfflineOrders() {
  try {
    /* Open IndexedDB to read queued orders */
    const db = await openDatabase();
    const orders = await getAllFromStore(db, 'offlineOrders');
    
    for (const order of orders) {
      try {
        /* Send order to Firebase (this would need the Firebase REST API) */
        const response = await fetch(
          `https://flashcart-bd-default-rtdb.asia-southeast1.firebasedatabase.app/orders/${order.orderId}.json`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
          }
        );
        
        if (response.ok) {
          /* Remove from offline queue on success */
          await deleteFromStore(db, 'offlineOrders', order.orderId);
          
          /* Notify all open tabs that the order was synced */
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({
              type: 'ORDER_SYNCED',
              orderId: order.orderId
            });
          });
        }
      } catch (err) {
        console.warn('[SW] Failed to sync order:', order.orderId, err);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

/**
 * =============================================================================
 * MESSAGE EVENT — Communication with Main Thread
 * =============================================================================
 * Allows the React app to communicate with the service worker
 */
self.addEventListener('message', (event) => {
  /* Handle skip waiting message (for update prompt) */
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  /* Handle cache clear request */
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});

/* =============================================================================
 * IndexedDB Helpers for Background Sync
 * ============================================================================= */

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FlashCartOffline', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineOrders')) {
        db.createObjectStore('offlineOrders', { keyPath: 'orderId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteFromStore(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
