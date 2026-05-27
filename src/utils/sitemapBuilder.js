// ============================================================
// FlashCart — Sitemap Builder
// Generates XML sitemap content for all portal pages.
// The sitemap is submitted to Google Search Console to
// ensure all store and item pages are indexed.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import { PORTAL_URLS } from '../utils/constants';

/**
 * buildSitemapEntry
 * Creates a single URL entry in the sitemap XML.
 *
 * @param {string} url - Full URL
 * @param {string} changefreq - How often content changes
 * @param {number} priority - Priority 0.0-1.0 (1.0 = highest)
 * @param {string} lastmod - Last modified date (YYYY-MM-DD)
 * @returns {string} XML string for this URL
 */
const buildSitemapEntry = (url, changefreq = 'weekly', priority = 0.5, lastmod = null) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

/**
 * buildMainPortalSitemap
 * Generates sitemap for the main customer portal.
 * Includes static pages + dynamic store/item pages from Firestore.
 *
 * @param {Array} stores - Array of active store documents
 * @param {Array} items - Array of active item documents
 * @param {Array} categories - Array of category IDs
 * @returns {string} Complete XML sitemap string
 */
export const buildMainPortalSitemap = (stores = [], items = [], categories = []) => {
  const baseURL = PORTAL_URLS.main;
  const today = new Date().toISOString().split('T')[0];

  // Collect all URL entries
  const entries = [];

  // ── STATIC PAGES ─────────────────────────────────────────

  // Homepage — highest priority
  entries.push(buildSitemapEntry(`${baseURL}/`, 'daily', 1.0));

  // Store listing page
  entries.push(buildSitemapEntry(`${baseURL}/stores`, 'daily', 0.9));

  // Search page
  entries.push(buildSitemapEntry(`${baseURL}/search`, 'daily', 0.8));

  // Category pages
  categories.forEach(categoryId => {
    entries.push(buildSitemapEntry(
      `${baseURL}/category/${categoryId}`,
      'daily',
      0.8
    ));
  });

  // ── DYNAMIC STORE PAGES ───────────────────────────────────
  // Each partner store gets their own URL — this is their free SEO website
  stores.forEach(store => {
    if (!store.slug || !store.isActive) return;

    entries.push(buildSitemapEntry(
      `${baseURL}/store/${store.slug}`,
      'daily',         // Store info changes daily
      0.9,             // High priority — these are key landing pages
      store.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today
    ));
  });

  // ── DYNAMIC ITEM PAGES ────────────────────────────────────
  // Each menu item gets its own SEO-optimized page
  items.forEach(item => {
    if (!item.slug || !item.storeSlug || !item.isAvailable) return;

    entries.push(buildSitemapEntry(
      `${baseURL}/store/${item.storeSlug}/item/${item.slug}`,
      'weekly',        // Items change less frequently
      0.7,
      item.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today
    ));
  });

  // ── BUILD XML ─────────────────────────────────────────────
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;
};

/**
 * buildPartnerPortalSitemap
 * Sitemap for the partner portal (mostly noindex pages).
 * Only the public-facing landing page is indexed.
 *
 * @returns {string} XML sitemap string
 */
export const buildPartnerPortalSitemap = () => {
  const baseURL = PORTAL_URLS.partner;
  const entries = [];

  // Partner portal homepage — public
  entries.push(buildSitemapEntry(`${baseURL}/`, 'monthly', 0.8));

  // Partner registration page — public + SEO target
  entries.push(buildSitemapEntry(`${baseURL}/register`, 'monthly', 0.7));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
};

/**
 * buildDocsPortalSitemap
 * Sitemap for the documentation portal.
 * All docs pages should be indexed for SEO traffic.
 *
 * @param {Array} docPages - Array of { path, updatedAt } doc page objects
 * @returns {string} XML sitemap string
 */
export const buildDocsPortalSitemap = (docPages = []) => {
  const baseURL = PORTAL_URLS.docs;
  const entries = [];

  // Docs homepage
  entries.push(buildSitemapEntry(`${baseURL}/`, 'weekly', 0.9));

  // Customer guide index
  entries.push(buildSitemapEntry(`${baseURL}/customer`, 'weekly', 0.8));

  // Partner guide index
  entries.push(buildSitemapEntry(`${baseURL}/partner`, 'weekly', 0.8));

  // FAQ page
  entries.push(buildSitemapEntry(`${baseURL}/faq`, 'monthly', 0.7));

  // Troubleshooting
  entries.push(buildSitemapEntry(`${baseURL}/troubleshooting`, 'monthly', 0.6));

  // Dynamic doc pages
  docPages.forEach(page => {
    if (!page.path) return;
    entries.push(buildSitemapEntry(
      `${baseURL}${page.path}`,
      'monthly',
      0.7,
      page.updatedAt
    ));
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
};

/**
 * buildSitemapIndex
 * Creates a sitemap index file pointing to multiple sitemaps.
 * Used when the main portal has too many URLs for one sitemap
 * (Google limit: 50,000 URLs per sitemap file).
 *
 * @returns {string} Sitemap index XML
 */
export const buildSitemapIndex = () => {
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${PORTAL_URLS.main}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${PORTAL_URLS.partner}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${PORTAL_URLS.docs}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
};
