// ============================================================
// FlashCart — SEO Keyword Library
// Bilingual keyword lists for meta tags, page optimization,
// and search functionality.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

/**
 * PRIMARY_KEYWORDS
 * Core brand keywords — used on every page's meta tags.
 * These are the most important terms for FlashCart's SEO.
 */
export const PRIMARY_KEYWORDS = [
  // English brand keywords
  'flashcart',
  'flashcart bangladesh',
  'flash cart',
  'flashcart delivery',
  'free delivery bangladesh',
  'online delivery bangladesh',
  'cash on delivery bangladesh',
  'home delivery bangladesh',
  'bangladesh delivery platform',

  // Bangla brand keywords
  'ফ্ল্যাশকার্ট',
  'ফ্ল্যাশ কার্ট',
  'বাংলাদেশ ডেলিভারি',
  'ফ্রি ডেলিভারি বাংলাদেশ',
  'ক্যাশ অন ডেলিভারি',
  'হোম ডেলিভারি বাংলাদেশ',
  'অনলাইন ডেলিভারি বাংলাদেশ',
];

/**
 * LONG_TAIL_KEYWORDS
 * More specific search terms for higher conversion.
 * These target users with purchase intent.
 */
export const LONG_TAIL_KEYWORDS = [
  // Food delivery
  'best food delivery app bangladesh',
  'restaurant near me bangladesh',
  'food delivery dhaka',
  'food delivery chittagong',
  'food delivery sylhet',

  // Grocery delivery
  'grocery delivery near me bangladesh',
  'online grocery bangladesh',
  'grocery home delivery dhaka',
  'fresh vegetables delivery dhaka',

  // Medicine delivery
  'medicine delivery bangladesh',
  'online pharmacy bangladesh',
  'medicine delivery dhaka',
  'emergency medicine delivery',

  // Business-related
  'free online store bangladesh',
  'register restaurant bangladesh',
  'sell food online bangladesh',
  'partner with delivery platform',

  // Bangla long-tail
  'কাছের রেস্টুরেন্ট',
  'খাবার ডেলিভারি ঢাকা',
  'ঘরে বসে অর্ডার করুন',
  'মুদি দোকান ডেলিভারি',
  'ওষুধ ডেলিভারি ঢাকা',
  'অনলাইনে খাবার অর্ডার',
  'বাড়িতে ডেলিভারি',
];

/**
 * LOCATION_KEYWORDS
 * City and area-specific keywords for local SEO.
 * Helps rank for "[service] in [city]" searches.
 */
export const LOCATION_KEYWORDS = [
  // Dhaka-specific
  'delivery dhaka', 'food delivery dhaka', 'grocery delivery dhaka',
  'delivery gulshan', 'delivery banani', 'delivery dhanmondi',
  'delivery mirpur', 'delivery uttara', 'delivery mohammadpur',
  'food delivery dhaka bangladesh', 'home delivery dhaka bd',

  // Other cities
  'delivery chittagong', 'food delivery chittagong',
  'delivery sylhet', 'food delivery sylhet',
  'delivery rajshahi', 'food delivery rajshahi',
  'delivery khulna', 'food delivery khulna',

  // Bangla location keywords
  'ঢাকায় ডেলিভারি', 'খাবার ডেলিভারি ঢাকা',
  'চট্টগ্রামে ডেলিভারি', 'সিলেটে ডেলিভারি',
  'গুলশানে ডেলিভারি', 'বনানীতে ডেলিভারি',
  'ধানমন্ডিতে ডেলিভারি', 'মিরপুরে ডেলিভারি',
];

/**
 * PARTNER_KEYWORDS
 * Keywords targeting potential business partners.
 * Used on the partner portal and registration pages.
 */
export const PARTNER_KEYWORDS = [
  // English
  'join flashcart', 'partner with flashcart',
  'register your restaurant bangladesh',
  'list your business online bangladesh',
  'free ecommerce bangladesh',
  'sell online bangladesh free',
  'free seo for restaurant bangladesh',
  'delivery platform for businesses bangladesh',
  'grow your business online bangladesh',

  // Bangla
  'ফ্ল্যাশকার্টে যোগ দিন',
  'রেস্টুরেন্ট রেজিস্ট্রেশন',
  'অনলাইনে ব্যবসা করুন',
  'ফ্রি ওয়েবসাইট ব্যবসার জন্য',
  'ব্যবসা অনলাইনে দিন',
  'ডেলিভারি পার্টনার বাংলাদেশ',
  'ফ্রি SEO রেস্টুরেন্ট',
];

/**
 * buildPageKeywords
 * Builds a keyword string for a specific page.
 * Combines primary keywords with page-specific terms.
 *
 * @param {Array<string>} pageKeywords - Page-specific keywords
 * @param {boolean} includePrimary - Whether to include primary keywords
 * @returns {string} Comma-separated keywords string for meta tag
 */
export const buildPageKeywords = (pageKeywords = [], includePrimary = true) => {
  const all = includePrimary
    ? [...pageKeywords, ...PRIMARY_KEYWORDS.slice(0, 5)] // Only top 5 primary
    : pageKeywords;

  // Remove duplicates and join
  return [...new Set(all)].join(', ');
};

/**
 * buildStoreKeywords
 * Builds SEO keywords for an individual store page.
 * Combines store-specific info with category and location keywords.
 *
 * @param {object} store - Store data object
 * @returns {string} Keyword string for store meta tag
 */
export const buildStoreKeywords = (store) => {
  if (!store) return buildPageKeywords([]);

  const keywords = [
    // Store name variations
    store.businessName,
    store.businessNameBn,

    // Category keywords (first 3)
    ...(store.keywords || []).slice(0, 3),

    // Location keywords
    store.location?.area,
    store.location?.city,
    `${store.businessName} ${store.location?.area}`,
    `${store.businessName} delivery`,
    `${store.businessName} ডেলিভারি`,

    // User-defined tags
    ...(store.tags || []).slice(0, 5),
  ].filter(Boolean); // Remove null/undefined

  return buildPageKeywords(keywords);
};
