// ============================================================
// FlashCart — Application Constants
// Shared constants used across all portals and components.
// Change values here to update them everywhere at once.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

// ── PORTAL INFORMATION ────────────────────────────────────

// Portal URLs — used for cross-portal links and SEO
export const PORTAL_URLS = {
  main:    'https://flashcart.bsdc.info.bd',
  partner: 'https://partner.flashcart.bsdc.info.bd',
  docs:    'https://docs.flashcart.bsdc.info.bd',
};

// Site metadata — used in SEO and footer
export const SITE_META = {
  name:           'FlashCart',
  nameBn:         'ফ্ল্যাশকার্ট',
  tagline:        "Bangladesh's Fastest Free Delivery Platform",
  taglineBn:      'বাংলাদেশের সেরা ফ্রি ডেলিভারি প্ল্যাটফর্ম',
  description:    'Free delivery platform connecting customers with local businesses in Bangladesh. Cash on Delivery only.',
  descriptionBn:  'বাংলাদেশে স্থানীয় ব্যবসাগুলোর সাথে গ্রাহকদের সংযোগ দেওয়ার ফ্রি প্ল্যাটফর্ম। শুধুমাত্র ক্যাশ অন ডেলিভারি।',
  developer:      'Rizwan Rahim Chowdhury',
  organization:   'Bangladesh Software Development Community',
  orgURL:         'https://www.bsdc.info.bd',
  version:        '1.0.0',
  year:           '2024',
  logo:           '/icons/flashcart-logo.svg',
  ogImage:        '/og-image.png',
  email:          'support@flashcart.bsdc.info.bd',
};

// ── FIREBASE COLLECTION NAMES ──────────────────────────────
// Centralized so they don't get typo'd in different files

export const COLLECTIONS = {
  USERS:     'users',        // Customer user profiles
  PARTNERS:  'partners',     // Partner/store profiles
  ITEMS:     'items',        // Menu items (global collection)
  ORDERS:    'orders',       // All orders
  REVIEWS:   'reviews',      // All reviews
  CATEGORIES:'categories',   // Store menu categories (sub-collection)
};

// Realtime Database paths
export const RTDB_PATHS = {
  ACTIVE_ORDERS:    'activeOrders',    // {storeId}/{orderId}
  STORE_STATUS:     'storeStatus',     // {storeId}
  PARTNER_PRESENCE: 'partnerPresence', // {partnerId}
  NOTIFICATIONS:    'notifications',   // {partnerId}/{notifId}
};

// ── ORDER STATUSES ─────────────────────────────────────────

export const ORDER_STATUS = {
  PENDING:   'pending',    // Order placed, awaiting partner
  CONFIRMED: 'confirmed',  // Partner accepted order
  PREPARING: 'preparing',  // Partner is preparing
  READY:     'ready',      // Ready for pickup/delivery
  DELIVERED: 'delivered',  // Successfully delivered
  CANCELLED: 'cancelled',  // Cancelled by partner or customer
};

// Order status flow — allowed transitions
export const ORDER_STATUS_FLOW = {
  [ORDER_STATUS.PENDING]:   [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]:     [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],  // Terminal state
  [ORDER_STATUS.CANCELLED]: [],  // Terminal state
};

// ── PAYMENT METHODS ────────────────────────────────────────

// FlashCart only supports COD — this is the only entry
export const PAYMENT_METHODS = {
  COD: 'cod',  // Cash on Delivery — the ONLY payment method
};

export const PAYMENT_METHOD_LABELS = {
  cod: { en: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি' },
};

// ── LANGUAGE OPTIONS ───────────────────────────────────────

export const LANGUAGES = {
  DEFAULT: 'default',  // Bangla-English mix (SEO-optimized)
  BANGLA:  'bn',       // Pure Bangla
  ENGLISH: 'en',       // Pure English
};

export const LANGUAGE_LABELS = {
  default: { label: 'বাংলা-English',  flag: 'BD' },
  bn:      { label: 'বাংলা',          flag: 'BD' },
  en:      { label: 'English',        flag: 'GB' },
};

// ── SORT OPTIONS ───────────────────────────────────────────

export const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Relevant',   labelBn: 'প্রাসঙ্গিক' },
  { value: 'rating',     label: 'Top Rated',  labelBn: 'সর্বোচ্চ রেটিং' },
  { value: 'distance',   label: 'Nearest',    labelBn: 'কাছের' },
  { value: 'newest',     label: 'Newest',     labelBn: 'নতুন' },
  { value: 'popular',    label: 'Popular',    labelBn: 'জনপ্রিয়' },
];

// ── RATING CONFIG ──────────────────────────────────────────

export const RATING = {
  MAX: 5,           // Maximum stars
  MIN: 1,           // Minimum stars (must give at least 1)
  DEFAULT: 0,       // Default unrated value
};

// ── DELIVERY DEFAULTS ──────────────────────────────────────

export const DELIVERY_DEFAULTS = {
  RADIUS_KM: 10,           // Default store delivery radius
  MIN_RADIUS_KM: 1,        // Minimum delivery radius
  MAX_RADIUS_KM: 50,       // Maximum delivery radius
  DEFAULT_FEE: 0,          // Free delivery (store sets their own fee)
  ESTIMATED_TIME_MIN: 30,  // Default estimated delivery time (minutes)
};

// ── PAGINATION ─────────────────────────────────────────────

export const PAGINATION = {
  STORES_PER_PAGE: 20,   // Stores per page in listing
  ITEMS_PER_PAGE:  24,   // Items per page in store menu
  ORDERS_PER_PAGE: 10,   // Orders per page in history
  REVIEWS_PER_PAGE: 10,  // Reviews per page
};

// ── IMAGE CONSTRAINTS ──────────────────────────────────────

export const IMAGE_LIMITS = {
  MAX_SIZE_MB: 5,               // Maximum image upload size
  STORE_LOGO_RATIO: 1,          // Square ratio for logos
  STORE_COVER_RATIO: 3 / 1,     // Wide banner ratio for covers
  ITEM_IMAGE_RATIO: 4 / 3,      // Standard item image ratio
  MAX_GALLERY_IMAGES: 10,       // Maximum gallery images per store
  MAX_REVIEW_IMAGES: 3,         // Maximum images per review
};

// ── RANKING ALGORITHM WEIGHTS ──────────────────────────────
// Used in rankingEngine.js for store/item scoring

export const RANKING_WEIGHTS = {
  // Store ranking weights
  STORE: {
    RATING:            20,    // Max 100 points (rating * 20)
    COMPLETION_RATE:   15,    // Max 15 points
    TOTAL_ORDERS:      0.01,  // Uncapped popularity (orders * 0.01)
    FAST_RESPONSE:     10,    // 10 points if response < 5 mins
    VERIFIED:          10,    // 10 points for verified stores
    FEATURED:          15,    // 15 points for featured placement
    PROFILE_COMPLETE:  10,    // Max 10 points (completeness * 10)
    RECENT_ACTIVITY:   5,     // Boost for recent orders
    LOCATION_BOOST:    0,     // Dynamic — calculated by proximity
    CANCELLATION_PENALTY: -2, // Per cancellation
  },

  // Item ranking weights
  ITEM: {
    RATING:            25,    // Max 125 points (rating * 25)
    TOTAL_ORDERS:      0.05,  // Order popularity
    TOTAL_VIEWS:       0.01,  // View popularity
    FEATURED:          20,    // Featured item boost
    DISCOUNT:          10,    // Has discount boost
    RECENT_ORDERS:     5,     // Trending boost
  },
};

// ── SEO CONSTANTS ──────────────────────────────────────────

export const SEO = {
  TITLE_MAX_LENGTH: 60,           // Max SEO title length
  DESCRIPTION_MAX_LENGTH: 160,    // Max meta description length
  KEYWORDS_MAX: 15,               // Maximum keywords per page
  DEFAULT_OG_IMAGE: 'https://flashcart.bsdc.info.bd/og-image.png',

  // Schema.org types per partner category
  SCHEMA_TYPES: {
    restaurant:   'Restaurant',
    grocery:      'GroceryStore',
    pharmacy:     'Pharmacy',
    supermarket:  'GroceryStore',
    home_kitchen: 'FoodEstablishment',
    electronics:  'ElectronicsStore',
    clothing:     'ClothingStore',
    mobile_shop:  'MobilePhoneStore',
    library:      'BookStore',
    bakery:       'Bakery',
    cafe:         'CafeOrCoffeeShop',
    diner:        'Restaurant',
  },
};

// ── NOTIFICATION CONFIG ────────────────────────────────────

export const NOTIFICATIONS = {
  ORDER_SOUND_URL: '/sounds/new-order.mp3', // New order notification sound
  TAB_FLASH_INTERVAL: 1000,  // Tab title flash interval (ms)
  TAB_FLASH_MESSAGE:  'NEW ORDER — FlashCart Partner', // Flashing tab title
  ESCALATION_DELAY:   300000, // 5 minutes before escalation notification
};

// ── LOCAL STORAGE KEYS ─────────────────────────────────────
// Centralized localStorage keys to prevent collisions

export const STORAGE_KEYS = {
  CART:             'fc_cart',           // Shopping cart data
  USER_LOCATION:    'fc_user_location',  // Saved user location
  PARTNER_SETTINGS: 'fc_partner_settings', // Partner app settings
  THEME:            'fc_theme',          // Theme preference (future)
  CLICK_HISTORY:    'fc_click_history',  // Click history for recommendations
};

// ── REGEX PATTERNS ─────────────────────────────────────────
// Reusable regex for validation and search

export const REGEX = {
  EMAIL:      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  BD_PHONE:   /^01[3-9]\d{8}$/,         // Bangladeshi mobile number
  BANGLA:     /[\u0980-\u09FF]/,         // Any Bangla character
  URL_SLUG:   /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Valid URL slug
  NUMBER_ONLY:/^\d+$/,                   // Only digits
  ALPHA_ONLY: /^[a-zA-Z]+$/,            // Only letters
};

// ── TIME CONSTANTS ─────────────────────────────────────────

export const TIME = {
  MS_PER_SECOND: 1000,
  MS_PER_MINUTE: 60 * 1000,
  MS_PER_HOUR:   60 * 60 * 1000,
  MS_PER_DAY:    24 * 60 * 60 * 1000,
  DEBOUNCE_SEARCH: 300,     // ms — debounce delay for search input
  DEBOUNCE_RESIZE: 150,     // ms — debounce delay for window resize
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes — Firestore cache duration
};
