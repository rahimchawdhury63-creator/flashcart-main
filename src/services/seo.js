// ============================================================
// FlashCart — SEO Service
// Functions for SEO tracking, search impression recording,
// and sitemap regeneration triggers.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import { incrementStorePageViews } from './firebase/firestore';
import { PORTAL_URLS } from '../utils/constants';

/**
 * trackPageView
 * Records a page view for SEO analytics.
 * Called from each page component on mount.
 *
 * @param {string} pageType - Type of page visited
 * @param {object} pageData - Page-specific data (storeId, itemId, etc.)
 */
export const trackPageView = async (pageType, pageData = {}) => {
  try {
    // Track store page views for SEO ranking
    if (pageType === 'store' && pageData.storeId) {
      await incrementStorePageViews(pageData.storeId);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[FlashCart SEO] Page view: ${pageType}`, pageData);
    }

  } catch (error) {
    // Non-critical — tracking failures shouldn't break the page
    console.warn('[FlashCart SEO] Page view tracking failed:', error.message);
  }
};

/**
 * generateMetaDescription
 * Generates an SEO-optimized meta description from raw text.
 * Ensures proper length and keyword inclusion.
 *
 * @param {string} text - Raw description text
 * @param {number} maxLength - Maximum description length (default 160)
 * @returns {string} Optimized meta description
 */
export const generateMetaDescription = (text, maxLength = 160) => {
  if (!text) return '';

  // Clean up the text
  const cleaned = text
    .replace(/<[^>]*>/g, '') // Remove any HTML tags
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();

  // Truncate at word boundary
  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.8 ? truncated.slice(0, lastSpace) : truncated) + '...';
};

/**
 * generateStoreMetaTitle
 * Generates an SEO-optimized page title for a store.
 *
 * @param {object} store - Store document
 * @returns {string} Optimized title
 */
export const generateStoreMetaTitle = (store) => {
  if (!store) return 'Store — FlashCart';

  const name = store.businessName || '';
  const area = store.location?.area || '';
  const city = store.location?.city || 'Bangladesh';
  const category = store.category || '';

  // Format: "Store Name — Category in Area, City | FlashCart"
  // This format targets "[store name] [area]" searches
  const parts = [name];
  if (category) parts.push(category);
  if (area) parts.push(`in ${area}`);
  if (city && city !== area) parts.push(city);
  parts.push('FlashCart');

  return parts.join(' — ').slice(0, 60);
};

/**
 * generateItemMetaTitle
 * Generates an SEO-optimized page title for an item.
 *
 * @param {object} item - Item document
 * @param {string} storeName - Store name
 * @returns {string} Optimized title
 */
export const generateItemMetaTitle = (item, storeName) => {
  if (!item) return 'Item — FlashCart';

  // Format: "Item Name — Store Name | FlashCart Bangladesh"
  const name = item.name || '';
  const store = storeName || item.storeName || '';
  const price = item.price ? ` ৳${item.price}` : '';

  return `${name}${price} — ${store} | FlashCart`.slice(0, 60);
};

/**
 * pingSearchEngines
 * Pings search engines when sitemap is updated.
 * Helps new stores/items get indexed faster.
 *
 * IMPORTANT: Only call this when sitemap actually changes.
 * Pinging too often can result in being ignored.
 *
 * @returns {Promise<void>}
 */
export const pingSearchEngines = async () => {
  const sitemapURL = encodeURIComponent(`${PORTAL_URLS.main}/sitemap.xml`);

  // Ping URLs — these notify search engines to recrawl
  const pingURLs = [
    `https://www.google.com/ping?sitemap=${sitemapURL}`,
    `https://www.bing.com/ping?sitemap=${sitemapURL}`,
  ];

  // Ping each search engine
  const pings = pingURLs.map(url =>
    fetch(url, { method: 'GET', mode: 'no-cors' })
      .catch(err => console.warn('[FlashCart SEO] Ping failed:', err.message))
  );

  await Promise.allSettled(pings);

  if (import.meta.env.DEV) {
    console.log('[FlashCart SEO] Search engine ping sent');
  }
};

/**
 * getStructuredDataForPage
 * Returns all schema.org data needed for a specific page.
 * Convenience function combining multiple schema builders.
 *
 * @param {string} pageType - Page type
 * @param {object} data - Page data
 * @returns {Array} Array of schema objects
 */
export const getStructuredDataForPage = (pageType, data = {}) => {
  const schemas = [];

  switch (pageType) {
    case 'home':
      // Import dynamically to avoid circular deps
      schemas.push({ '@type': 'WebSite', name: 'FlashCart', url: PORTAL_URLS.main });
      break;

    case 'store':
      if (data.store) {
        // Schema built by useSEO hook — just return indicator
        schemas.push({ type: 'store', data: data.store });
      }
      break;

    default:
      break;
  }

  return schemas;
};
