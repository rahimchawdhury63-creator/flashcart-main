// ============================================================
// FlashCart — useSEO Custom Hook
// Generates SEO meta data for any page type dynamically.
// Combines all schema builders and keyword generators.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import { useMemo } from 'react';

// Schema builders
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildStoreSchema,
  buildItemSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildArticleSchema,
  buildStoreListSchema,
} from '../utils/schemaBuilder';

// Keyword builder
import { buildPageKeywords, buildStoreKeywords } from '../data/keywords';

// Constants
import { PORTAL_URLS, SITE_META, SEO } from '../utils/constants';

// Formatters
import { truncateText } from '../utils/formatters';

/**
 * useSEO
 * Generates complete SEO metadata for any page type.
 * Returns meta object ready to pass to <MetaTags />.
 *
 * @param {string} pageType - Type of page:
 *   'home'|'store'|'item'|'search'|'category'|'cart'|
 *   'checkout'|'order'|'profile'|'auth'|'docs'|'faq'|'404'
 * @param {object} data - Page-specific data (store, item, etc.)
 * @returns {object} Complete SEO metadata object
 */
const useSEO = (pageType, data = {}) => {

  // Detect portal and base URL
  const portalType = import.meta.env.VITE_PORTAL_TYPE || 'main';
  const baseURL = PORTAL_URLS[portalType] || PORTAL_URLS.main;

  // Memoize — only recalculate when pageType or data changes
  const seoData = useMemo(() => {

    // Base SEO object — filled differently per page type
    let title = '';
    let description = '';
    let keywords = [];
    let url = baseURL;
    let image = `${baseURL}/og-image.png`;
    let type = 'website';
    let schema = null;
    let schemas = []; // For multiple schemas on one page
    let noIndex = false;
    let breadcrumbs = [];

    switch (pageType) {

      // ── HOMEPAGE ─────────────────────────────────────
      case 'home': {
        title = "FlashCart — Bangladesh's Fastest Free Delivery Platform | ফ্ল্যাশকার্ট";
        description = 'FlashCart — বাংলাদেশের সেরা ফ্রি ডেলিভারি প্ল্যাটফর্ম। Restaurant, grocery, medicine delivery. Cash on Delivery only. ফ্রি ডেলিভারি বাংলাদেশ।';
        keywords = [
          'flashcart', 'ফ্ল্যাশকার্ট',
          'food delivery bangladesh', 'খাবার ডেলিভারি বাংলাদেশ',
          'free delivery bangladesh', 'cash on delivery bangladesh',
          'online delivery bangladesh', 'বাংলাদেশ ডেলিভারি',
          'restaurant near me bangladesh', 'ঘরে ডেলিভারি',
        ];
        url = PORTAL_URLS.main;

        // Multiple schemas on homepage
        schemas = [
          buildWebSiteSchema(),
          buildOrganizationSchema(),
        ];
        break;
      }

      // ── STORE DETAIL PAGE ─────────────────────────────
      case 'store': {
        const store = data.store;
        if (store) {
          // Dynamic title with store name + location + category for SEO
          title = store.seoTitle ||
            `${store.businessName} — ${store.category} in ${store.location?.area || ''}, ${store.location?.city || 'Bangladesh'} | FlashCart`;

          // Dynamic description
          description = store.seoDescription ||
            `Order from ${store.businessName} in ${store.location?.area || store.location?.city || 'Bangladesh'}. ${truncateText(store.description || '', 100)} Fast delivery, Cash on Delivery. Shop on FlashCart.`;

          // Store-specific keywords (SEO optimized)
          keywords = buildStoreKeywords(store).split(', ');

          url = `${PORTAL_URLS.main}/store/${store.slug}`;
          image = store.coverImageURL || store.logoURL || `${PORTAL_URLS.main}/og-image.png`;
          type = 'website';

          // Store schema + breadcrumb schema
          schemas = [
            buildStoreSchema(store),
            buildBreadcrumbSchema([
              { name: 'Home', url: PORTAL_URLS.main },
              { name: store.category, url: `${PORTAL_URLS.main}/category/${store.category}` },
              { name: store.businessName, url },
            ]),
          ];

          breadcrumbs = [
            { label: 'Home', labelBn: 'হোম', href: '/' },
            { label: store.category, labelBn: store.category, href: `/category/${store.category}` },
            { label: store.businessName, labelBn: store.businessNameBn || store.businessName, href: null },
          ];
        }
        break;
      }

      // ── ITEM DETAIL PAGE ──────────────────────────────
      case 'item': {
        const { item, store: itemStore } = data;
        if (item) {
          title = `${item.name} — ${itemStore?.businessName || ''} | FlashCart`;
          description = `${item.description || item.name} — ৳${item.price}. Order from ${itemStore?.businessName} on FlashCart Bangladesh. Cash on Delivery.`;
          keywords = [
            item.name, item.nameBn || '',
            ...(item.tags || []),
            item.categoryName || '',
            'delivery bangladesh',
            `${item.name} price`,
          ].filter(Boolean);
          url = `${PORTAL_URLS.main}/store/${item.storeSlug}/item/${item.slug}`;
          image = item.imageURL || (item.images && item.images[0]) || `${PORTAL_URLS.main}/og-image.png`;
          type = 'product';

          schemas = [
            buildItemSchema(item, itemStore),
            buildBreadcrumbSchema([
              { name: 'Home', url: PORTAL_URLS.main },
              { name: itemStore?.businessName || '', url: `${PORTAL_URLS.main}/store/${item.storeSlug}` },
              { name: item.name, url },
            ]),
          ];

          breadcrumbs = [
            { label: 'Home', labelBn: 'হোম', href: '/' },
            { label: itemStore?.businessName || '', href: `/store/${item.storeSlug}` },
            { label: item.name, labelBn: item.nameBn || item.name, href: null },
          ];
        }
        break;
      }

      // ── SEARCH PAGE ───────────────────────────────────
      case 'search': {
        const query = data.query || '';
        title = query
          ? `"${query}" — Search Results | FlashCart Bangladesh`
          : 'Search — FlashCart | Bangladesh Delivery';
        description = query
          ? `Search results for "${query}" on FlashCart Bangladesh. Find restaurants, groceries, medicines near you. ক্যাশ অন ডেলিভারি।`
          : 'Search for restaurants, food, groceries, medicines on FlashCart Bangladesh. Free delivery platform.';
        keywords = [query, 'search flashcart', 'delivery bangladesh', 'খুঁজুন'].filter(Boolean);
        url = `${PORTAL_URLS.main}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;

        // Don't index paginated/filtered search results
        noIndex = Boolean(query);
        break;
      }

      // ── CATEGORY PAGE ─────────────────────────────────
      case 'category': {
        const category = data.category;
        if (category) {
          title = `${category.label} Delivery Bangladesh — ${category.labelBn} | FlashCart`;
          description = `${category.description} Order ${category.label.toLowerCase()} online in Bangladesh. ${category.descriptionBn}. Cash on Delivery.`;
          keywords = [...(category.keywords || []), ...(category.keywordsBn || []), 'delivery bangladesh'];
          url = `${PORTAL_URLS.main}/category/${category.id}`;

          schemas = [
            buildStoreListSchema(
              data.stores || [],
              `${category.label} Stores in Bangladesh`,
              url
            ),
          ];

          breadcrumbs = [
            { label: 'Home', labelBn: 'হোম', href: '/' },
            { label: category.label, labelBn: category.labelBn, href: null },
          ];
        }
        break;
      }

      // ── CART PAGE (noindex) ───────────────────────────
      case 'cart': {
        title = 'Your Cart — FlashCart';
        description = 'Review your order and checkout. Cash on Delivery. Free delivery Bangladesh.';
        url = `${PORTAL_URLS.main}/cart`;
        noIndex = true; // Don't index personal cart pages
        break;
      }

      // ── CHECKOUT PAGE (noindex) ───────────────────────
      case 'checkout': {
        title = 'Checkout — FlashCart';
        description = 'Complete your order. Cash on Delivery only.';
        url = `${PORTAL_URLS.main}/checkout`;
        noIndex = true;
        break;
      }

      // ── ORDER TRACKING (noindex) ──────────────────────
      case 'order': {
        const orderId = data.orderId || '';
        title = `Order ${orderId} — FlashCart`;
        description = 'Track your FlashCart order in real-time.';
        url = `${PORTAL_URLS.main}/order/${orderId}`;
        noIndex = true; // Personal order pages
        break;
      }

      // ── AUTH PAGES (noindex) ──────────────────────────
      case 'auth': {
        title = `${data.authPage || 'Login'} — FlashCart`;
        description = 'Sign in to your FlashCart account. Bangladesh delivery platform.';
        noIndex = true;
        break;
      }

      // ── PARTNER DASHBOARD (noindex) ───────────────────
      case 'partner-dashboard': {
        title = `Dashboard — FlashCart Partner`;
        description = 'Manage your store, orders, and analytics on FlashCart Partner Portal.';
        url = `${PORTAL_URLS.partner}/dashboard`;
        noIndex = true; // Private dashboard
        break;
      }

      // ── DOCS HOMEPAGE ────────────────────────────────
      case 'docs-home': {
        title = 'FlashCart Documentation — Complete Guide | গাইড';
        description = 'Complete documentation for FlashCart Bangladesh delivery platform. Guides for customers and partners. ফ্ল্যাশকার্ট সম্পূর্ণ গাইড।';
        keywords = [
          'flashcart documentation', 'flashcart guide',
          'ফ্ল্যাশকার্ট গাইড', 'flashcart help',
          'how to use flashcart', 'flashcart partner guide',
        ];
        url = PORTAL_URLS.docs;
        type = 'website';
        break;
      }

      // ── DOCS ARTICLE ─────────────────────────────────
      case 'docs-article': {
        const article = data.article;
        if (article) {
          title = `${article.title} — FlashCart Documentation`;
          description = article.description || `${article.title} guide for FlashCart Bangladesh delivery platform.`;
          keywords = article.tags || [];
          url = `${PORTAL_URLS.docs}${article.path}`;
          type = 'article';

          schemas = [
            buildArticleSchema({
              ...article,
              url: `${PORTAL_URLS.docs}${article.path}`,
            }),
          ];

          breadcrumbs = [
            { label: 'Docs', labelBn: 'ডকুমেন্টেশন', href: '/' },
            ...(article.breadcrumbs || []),
            { label: article.title, href: null },
          ];
        }
        break;
      }

      // ── FAQ PAGE ─────────────────────────────────────
      case 'faq': {
        title = 'FAQ — Frequently Asked Questions | FlashCart Bangladesh';
        description = 'Answers to common questions about FlashCart. How to order, delivery, payment, and more. ফ্ল্যাশকার্ট সম্পর্কে সাধারণ প্রশ্নের উত্তর।';
        keywords = ['flashcart faq', 'flashcart questions', 'ফ্ল্যাশকার্ট প্রশ্ন', 'delivery faq bangladesh'];
        url = `${PORTAL_URLS.docs}/faq`;

        if (data.faqs) {
          schemas = [buildFAQSchema(data.faqs)];
        }
        break;
      }

      // ── 404 PAGE ─────────────────────────────────────
      case '404': {
        title = 'Page Not Found — FlashCart | 404';
        description = 'The page you are looking for does not exist. Go back to FlashCart homepage to order food and groceries.';
        noIndex = true;
        break;
      }

      // ── DEFAULT ───────────────────────────────────────
      default: {
        title = SITE_META.name;
        description = SITE_META.description;
        url = baseURL;
        break;
      }
    }

    // Trim title to 60 chars for optimal display
    if (title.length > SEO.TITLE_MAX_LENGTH) {
      title = title.slice(0, SEO.TITLE_MAX_LENGTH - 3) + '...';
    }

    // Trim description to 160 chars
    if (description.length > SEO.DESCRIPTION_MAX_LENGTH) {
      description = description.slice(0, SEO.DESCRIPTION_MAX_LENGTH - 3) + '...';
    }

    return {
      title,
      description,
      keywords,
      url,
      image,
      type,
      schema: schemas.length > 0 ? schemas : (schema || null),
      noIndex,
      breadcrumbs,
    };

  }, [pageType, data, baseURL]);

  return seoData;
};

export default useSEO;
