/**
 * =============================================================================
 * FLASHCART — Sitemap Generator
 * =============================================================================
 *
 * Purpose: Dynamically generates sitemap.xml content by fetching all
 * partner stores and items from Firestore. Used by an admin endpoint
 * or build-time script to regenerate the sitemap.
 *
 * The sitemap helps Google discover and index all store pages and
 * product pages efficiently.
 *
 * Note: Since we can't run server-side code in Cloudflare Pages without
 * Functions, this generator runs client-side in the admin panel and
 * outputs XML that the admin can copy and place in /public/sitemap.xml
 * Or it can be downloaded as a file.
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import { db, collection, getDocs, query, where } from '@/firebase';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

/**
 * Generate full sitemap.xml string from Firestore data.
 *
 * @returns {Promise<string>} Sitemap XML content
 */
export const generateSitemap = async () => {
  const now = new Date().toISOString();
  const urls = [];

  /* --- Static Pages --- */
  urls.push({ loc: '/', changefreq: 'daily', priority: '1.0', lastmod: now });
  urls.push({ loc: '/search', changefreq: 'daily', priority: '0.9', lastmod: now });
  urls.push({ loc: '/login', changefreq: 'monthly', priority: '0.5', lastmod: now });
  urls.push({ loc: '/register', changefreq: 'monthly', priority: '0.5', lastmod: now });

  /* --- Category Pages --- */
  const categories = [
    'restaurant', 'grocery', 'medical', 'electronics',
    'clothing', 'books', 'mobile', 'homeKitchen', 'supermarket'
  ];
  categories.forEach((cat) => {
    urls.push({
      loc: `/category/${cat}`,
      changefreq: 'daily',
      priority: '0.8',
      lastmod: now
    });
  });

  /* --- Partner Store Pages (dynamic from Firestore) --- */
  try {
    const partnersQuery = query(
      collection(db, 'partners'),
      where('isApproved', '==', true)
    );
    const snapshot = await getDocs(partnersQuery);

    snapshot.forEach((doc) => {
      const partner = doc.data();
      if (partner.slug) {
        urls.push({
          loc: `/store/${partner.slug}`,
          changefreq: 'daily',
          priority: '0.9',
          lastmod: partner.updatedAt
            ? new Date(partner.updatedAt.toDate ? partner.updatedAt.toDate() : partner.updatedAt).toISOString()
            : now
        });
      }
    });
  } catch (error) {
    console.error('[Sitemap] Failed to fetch partners:', error);
  }

  /* --- Build XML --- */
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls.map((url) => {
    const fullUrl = `${BASE_URL}${url.loc}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="bn" href="${fullUrl}?lang=bn"/>
    <xhtml:link rel="alternate" hreflang="en" href="${fullUrl}?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${fullUrl}"/>
  </url>`;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
};

/**
 * Trigger browser download of sitemap.xml file.
 * Useful in admin panel to generate and save sitemap.
 */
export const downloadSitemap = async () => {
  try {
    const sitemapXml = await generateSitemap();
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('[Sitemap] Download failed:', error);
    return false;
  }
};

export default generateSitemap;
