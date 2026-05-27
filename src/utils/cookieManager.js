// ============================================================
// FlashCart — Cookie Manager
// Manages browser cookies for anonymous user tracking,
// recommendation data, and session preferences.
// GDPR/privacy-friendly: only non-personal tracking data.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

// Cookie expiry constants
const COOKIE_EXPIRY = {
  SESSION: 0,            // Session cookie — expires when browser closes
  ONE_DAY: 1,            // 1 day in days
  ONE_WEEK: 7,           // 7 days
  ONE_MONTH: 30,         // 30 days
  THREE_MONTHS: 90,      // 90 days
};

/**
 * setCookie
 * Sets a browser cookie with an expiry date.
 *
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value (will be URI encoded)
 * @param {number} days - Days until expiry (0 = session cookie)
 * @param {string} path - Cookie path (default '/')
 */
export const setCookie = (name, value, days = COOKIE_EXPIRY.ONE_MONTH, path = '/') => {
  let expires = '';

  if (days > 0) {
    // Calculate expiry date
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to ms
    expires = `; expires=${date.toUTCString()}`;
  }

  // Set the cookie with SameSite=Strict for security
  document.cookie = `${name}=${encodeURIComponent(String(value))}${expires}; path=${path}; SameSite=Strict`;
};

/**
 * getCookie
 * Gets a cookie value by name.
 *
 * @param {string} name - Cookie name to retrieve
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  // Parse the cookie string
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim(); // Remove leading/trailing spaces

    if (cookie.startsWith(nameEQ)) {
      // Found the cookie — decode and return the value
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null; // Cookie not found
};

/**
 * deleteCookie
 * Deletes a cookie by setting it to expire in the past.
 *
 * @param {string} name - Cookie name to delete
 * @param {string} path - Cookie path
 */
export const deleteCookie = (name, path = '/') => {
  // Set expiry to past date — browser will delete it
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict`;
};

/**
 * hasCookie
 * Checks if a cookie exists.
 *
 * @param {string} name - Cookie name to check
 * @returns {boolean}
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

// ── FLASHCART SPECIFIC COOKIE HELPERS ─────────────────────

// Cookie name constants — centralized for consistency
const COOKIE_KEYS = {
  RECENTLY_VIEWED:   'fc_recently_viewed',    // Stores recently viewed store IDs
  SEARCH_HISTORY:    'fc_search_history',     // Recent searches
  PREFERRED_AREA:    'fc_preferred_area',     // User's preferred delivery area
  LANGUAGE:          'fc_language',           // Language preference
  RECOMMENDATION:    'fc_rec_categories',     // Category preferences for recommendations
  CART_STORE:        'fc_cart_store',         // Store ID for current cart
  ONBOARDING_DONE:   'fc_onboarding_done',    // Whether user completed onboarding
};

/**
 * trackStoreView
 * Records that a user viewed a store — used for recommendations.
 * Stores the last 20 viewed store IDs in a cookie.
 *
 * @param {string} storeId - Store ID that was viewed
 * @param {string} category - Store category (for category preferences)
 */
export const trackStoreView = (storeId, category) => {
  try {
    // Get existing recently viewed list
    const existing = getCookie(COOKIE_KEYS.RECENTLY_VIEWED);
    let recentlyViewed = existing ? JSON.parse(existing) : [];

    // Remove if already in list (to re-add at front)
    recentlyViewed = recentlyViewed.filter(id => id !== storeId);

    // Add to front of list (most recent first)
    recentlyViewed.unshift(storeId);

    // Keep only last 20 entries to limit cookie size
    recentlyViewed = recentlyViewed.slice(0, 20);

    // Save back to cookie — expires in 30 days
    setCookie(COOKIE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed), COOKIE_EXPIRY.ONE_MONTH);

    // Track category preference if provided
    if (category) {
      trackCategoryInterest(category);
    }
  } catch (error) {
    // Cookie operations can fail in private mode — fail silently
    console.warn('[FlashCart] Cookie tracking failed:', error.message);
  }
};

/**
 * getRecentlyViewed
 * Returns the list of recently viewed store IDs.
 *
 * @param {number} limit - Maximum number to return (default 10)
 * @returns {Array<string>} Array of store IDs
 */
export const getRecentlyViewed = (limit = 10) => {
  try {
    const existing = getCookie(COOKIE_KEYS.RECENTLY_VIEWED);
    if (!existing) return [];

    const parsed = JSON.parse(existing);
    return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
  } catch {
    return []; // Return empty on parse error
  }
};

/**
 * trackCategoryInterest
 * Tracks which categories the user views most often.
 * Used to personalize recommendations.
 *
 * @param {string} category - Category ID to track
 */
export const trackCategoryInterest = (category) => {
  try {
    const existing = getCookie(COOKIE_KEYS.RECOMMENDATION);
    let categories = existing ? JSON.parse(existing) : {};

    // Increment count for this category
    categories[category] = (categories[category] || 0) + 1;

    // Save back — 90 day expiry for long-term preference learning
    setCookie(COOKIE_KEYS.RECOMMENDATION, JSON.stringify(categories), COOKIE_EXPIRY.THREE_MONTHS);
  } catch (error) {
    console.warn('[FlashCart] Category tracking failed:', error.message);
  }
};

/**
 * getTopCategories
 * Returns the user's most-visited categories, sorted by interest.
 *
 * @param {number} limit - Number of top categories to return
 * @returns {Array<string>} Category IDs sorted by interest (highest first)
 */
export const getTopCategories = (limit = 3) => {
  try {
    const existing = getCookie(COOKIE_KEYS.RECOMMENDATION);
    if (!existing) return [];

    const categories = JSON.parse(existing);

    // Sort by count (highest first) and return just the category IDs
    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category]) => category);
  } catch {
    return [];
  }
};

/**
 * saveSearchTerm
 * Saves a search term to history for autocomplete.
 *
 * @param {string} term - Search term to save
 */
export const saveSearchTerm = (term) => {
  if (!term || term.trim().length < 2) return;

  try {
    const existing = getCookie(COOKIE_KEYS.SEARCH_HISTORY);
    let history = existing ? JSON.parse(existing) : [];

    const trimmed = term.trim();

    // Remove if exists (to re-add at front)
    history = history.filter(t => t.toLowerCase() !== trimmed.toLowerCase());

    // Add to front
    history.unshift(trimmed);

    // Keep last 15 searches
    history = history.slice(0, 15);

    setCookie(COOKIE_KEYS.SEARCH_HISTORY, JSON.stringify(history), COOKIE_EXPIRY.ONE_WEEK);
  } catch (error) {
    console.warn('[FlashCart] Search history save failed:', error.message);
  }
};

/**
 * getSearchHistory
 * Returns saved search terms for autocomplete suggestions.
 *
 * @param {number} limit - Maximum searches to return
 * @returns {Array<string>} Recent search terms
 */
export const getSearchHistory = (limit = 8) => {
  try {
    const existing = getCookie(COOKIE_KEYS.SEARCH_HISTORY);
    if (!existing) return [];

    const parsed = JSON.parse(existing);
    return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
  } catch {
    return [];
  }
};

/**
 * savePreferredArea
 * Saves the user's preferred delivery area for next visit.
 *
 * @param {object} area - Area object with name, lat, lng
 */
export const savePreferredArea = (area) => {
  try {
    setCookie(COOKIE_KEYS.PREFERRED_AREA, JSON.stringify(area), COOKIE_EXPIRY.THREE_MONTHS);
  } catch (error) {
    console.warn('[FlashCart] Area preference save failed:', error.message);
  }
};

/**
 * getPreferredArea
 * Returns the user's saved preferred delivery area.
 *
 * @returns {object|null} Area object or null
 */
export const getPreferredArea = () => {
  try {
    const existing = getCookie(COOKIE_KEYS.PREFERRED_AREA);
    return existing ? JSON.parse(existing) : null;
  } catch {
    return null;
  }
};

/**
 * saveLanguagePreference
 * Saves the user's language choice persistently.
 *
 * @param {string} lang - 'default'|'bn'|'en'
 */
export const saveLanguagePreference = (lang) => {
  setCookie(COOKIE_KEYS.LANGUAGE, lang, COOKIE_EXPIRY.THREE_MONTHS);
};

/**
 * getLanguagePreference
 * Returns the saved language preference.
 *
 * @returns {string} Language code or 'default'
 */
export const getLanguagePreference = () => {
  return getCookie(COOKIE_KEYS.LANGUAGE) || 'default';
};

/**
 * markOnboardingComplete
 * Records that the user has completed the onboarding flow.
 */
export const markOnboardingComplete = () => {
  setCookie(COOKIE_KEYS.ONBOARDING_DONE, 'true', COOKIE_EXPIRY.THREE_MONTHS);
};

/**
 * isOnboardingComplete
 * Checks if the user has completed onboarding.
 *
 * @returns {boolean}
 */
export const isOnboardingComplete = () => {
  return getCookie(COOKIE_KEYS.ONBOARDING_DONE) === 'true';
};

/**
 * clearAllTrackingCookies
 * Clears all FlashCart tracking cookies.
 * Used for privacy/logout cleanup.
 */
export const clearAllTrackingCookies = () => {
  Object.values(COOKIE_KEYS).forEach(cookieName => {
    deleteCookie(cookieName);
  });
};
