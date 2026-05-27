// ============================================================
// FlashCart — Schema.org JSON-LD Builder
// Builds structured data objects for all page types.
// Schema.org helps Google understand page content and
// enables rich results (star ratings, price, hours, etc.)
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

import { PORTAL_URLS, SITE_META } from '../utils/constants';
import { getCategorySchemaType } from '../data/categories';

// Base URL for the main portal
const MAIN_URL = PORTAL_URLS.main;

// ── WEBSITE SCHEMA ────────────────────────────────────────

/**
 * buildWebSiteSchema
 * Schema for the main FlashCart website.
 * Enables Google Sitelinks Searchbox in search results.
 * Used on the homepage only.
 *
 * @returns {object} WebSite Schema.org object
 */
export const buildWebSiteSchema = () => ({
  '@context':    'https://schema.org',
  '@type':       'WebSite',
  name:          'FlashCart',
  alternateName: 'ফ্ল্যাশকার্ট',
  url:           MAIN_URL,
  description:   `${SITE_META.description} | ${SITE_META.descriptionBn}`,
  inLanguage:    ['bn-BD', 'en-US'],

  // SearchAction — enables Google Sitelinks Searchbox
  // When users search on Google, they can search FlashCart directly
  potentialAction: {
    '@type':   'SearchAction',
    target: {
      '@type':       'EntryPoint',
      urlTemplate:   `${MAIN_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },

  publisher: buildOrganizationSchema(),
});

// ── ORGANIZATION SCHEMA ───────────────────────────────────

/**
 * buildOrganizationSchema
 * Schema for the FlashCart organization.
 * Helps Google understand FlashCart as a real brand/business.
 * Used on homepage and about page.
 *
 * @returns {object} Organization Schema.org object
 */
export const buildOrganizationSchema = () => ({
  '@context':    'https://schema.org',
  '@type':       'Organization',
  name:          'FlashCart',
  alternateName: 'ফ্ল্যাশকার্ট',
  url:           MAIN_URL,
  logo:          `${MAIN_URL}/icons/flashcart-logo.svg`,
  description:   SITE_META.description,
  foundingDate:  '2024',

  founders: [
    {
      '@type': 'Person',
      name:    SITE_META.developer,
    }
  ],

  parentOrganization: {
    '@type': 'Organization',
    name:    SITE_META.organization,
    url:     SITE_META.orgURL,
  },

  areaServed: {
    '@type': 'Country',
    name:    'Bangladesh',
  },

  // All 3 portals listed as related web pages
  sameAs: [
    MAIN_URL,
    PORTAL_URLS.partner,
    PORTAL_URLS.docs,
  ],

  contactPoint: {
    '@type':       'ContactPoint',
    contactType:   'customer service',
    availableLanguage: ['Bengali', 'English'],
    areaServed:    'BD',
  },
});

// ── LOCAL BUSINESS / STORE SCHEMA ─────────────────────────

/**
 * buildStoreSchema
 * Schema for an individual partner store's landing page.
 * This is the most important schema — enables rich results
 * showing star ratings, address, hours in Google Search.
 *
 * @param {object} store - Partner store document from Firestore
 * @returns {object} LocalBusiness Schema.org object
 */
export const buildStoreSchema = (store) => {
  if (!store) return null;

  // Get the correct Schema.org type for this business category
  const schemaType = getCategorySchemaType(store.category) || 'LocalBusiness';

  // Build opening hours specification
  const openingHoursSpec = buildOpeningHoursSpec(store.schedule);

  // Build the aggregate rating if store has reviews
  const aggregateRating = store.totalRatings > 0
    ? {
        '@type':       'AggregateRating',
        ratingValue:   store.averageRating?.toFixed(1) || '0',
        reviewCount:   store.totalRatings || 0,
        bestRating:    '5',
        worstRating:   '1',
      }
    : undefined;

  return {
    '@context':   'https://schema.org',
    '@type':      schemaType,

    // Identity
    name:         store.businessName || '',
    alternateName:store.businessNameBn || '',
    description:  store.seoDescription || store.description || '',
    url:          `${MAIN_URL}/store/${store.slug}`,

    // Images
    image:        [
      store.coverImageURL,
      store.logoURL,
      ...(store.galleryImages || []),
    ].filter(Boolean), // Remove empty values

    // Logo
    logo:         store.logoURL || `${MAIN_URL}/og-image.png`,

    // Address
    address: store.location ? {
      '@type':           'PostalAddress',
      streetAddress:     store.location.address || '',
      addressLocality:   store.location.area || '',
      addressRegion:     store.location.city || 'Dhaka',
      postalCode:        '',
      addressCountry:    'BD',
    } : undefined,

    // Geographic coordinates
    geo: (store.location?.lat && store.location?.lng) ? {
      '@type':     'GeoCoordinates',
      latitude:    store.location.lat,
      longitude:   store.location.lng,
    } : undefined,

    // Contact
    telephone:    store.phone || '',

    // WhatsApp URL
    sameAs: store.whatsapp
      ? [`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`]
      : [],

    // Ratings
    aggregateRating,

    // Business hours
    openingHoursSpecification: openingHoursSpec,

    // Is currently open
    isAccessibleForFree: true,

    // Service type
    servesCuisine: store.category === 'restaurant' || store.category === 'home_kitchen'
      ? store.tags?.slice(0, 3) || ['Bangladeshi Food']
      : undefined,

    // Menu URL
    hasMenu: (store.category === 'restaurant' || store.category === 'home_kitchen')
      ? `${MAIN_URL}/store/${store.slug}#menu`
      : undefined,

    // Delivery
    potentialAction: {
      '@type':  'OrderAction',
      target:   `${MAIN_URL}/store/${store.slug}`,
      deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
    },

    // Payment accepted
    paymentAccepted: 'Cash on Delivery',

    // Currencies accepted
    currenciesAccepted: 'BDT',

    // Parent organization
    parentOrganization: {
      '@type': 'Organization',
      name:    'FlashCart',
      url:     MAIN_URL,
    },
  };
};

// ── PRODUCT / ITEM SCHEMA ─────────────────────────────────

/**
 * buildItemSchema
 * Schema for an individual menu item / product page.
 * Enables Product rich results with price, availability.
 *
 * @param {object} item - Item document from Firestore
 * @param {object} store - Parent store document
 * @returns {object} Product Schema.org object
 */
export const buildItemSchema = (item, store) => {
  if (!item) return null;

  // Build offers (pricing) schema
  const offers = {
    '@type':       'Offer',
    price:         item.price?.toString() || '0',
    priceCurrency: 'BDT',
    availability:  item.isAvailable
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url:           `${MAIN_URL}/store/${item.storeSlug}/item/${item.slug}`,
    seller: {
      '@type': 'Organization',
      name:    store?.businessName || item.storeName || 'FlashCart Store',
    },
    // Delivery method
    deliveryLeadTime: {
      '@type':    'QuantitativeValue',
      minValue:   item.preparationTime || 15,
      maxValue:   (item.preparationTime || 15) + 30,
      unitCode:   'MIN',
    },
  };

  // Add original price if there's a discount
  if (item.originalPrice && item.originalPrice > item.price) {
    offers.priceSpecification = [
      {
        '@type':       'PriceSpecification',
        price:         item.price,
        priceCurrency: 'BDT',
      },
      {
        '@type':       'UnitPriceSpecification',
        price:         item.originalPrice,
        priceCurrency: 'BDT',
        name:          'Regular Price',
      }
    ];
  }

  // Aggregate rating
  const aggregateRating = item.totalRatings > 0
    ? {
        '@type':       'AggregateRating',
        ratingValue:   item.averageRating?.toFixed(1) || '0',
        reviewCount:   item.totalRatings || 0,
        bestRating:    '5',
        worstRating:   '1',
      }
    : undefined;

  return {
    '@context':      'https://schema.org',
    '@type':         'Product',
    name:            item.name || '',
    alternateName:   item.nameBn || '',
    description:     item.description || '',
    image:           item.images?.length > 0
      ? item.images
      : [item.imageURL].filter(Boolean),
    sku:             item.id || '',
    offers,
    aggregateRating,

    // Category
    category: item.categoryName || '',

    // Brand is the store
    brand: {
      '@type': 'Brand',
      name:    store?.businessName || item.storeName || '',
    },

    // Additional product properties
    additionalProperty: [
      item.isVegetarian && {
        '@type': 'PropertyValue',
        name:    'Suitable for Diet',
        value:   'Vegetarian',
      },
      item.isSpicy && {
        '@type': 'PropertyValue',
        name:    'Spice Level',
        value:   'Spicy',
      },
      item.preparationTime && {
        '@type': 'PropertyValue',
        name:    'Preparation Time',
        value:   `${item.preparationTime} minutes`,
      },
    ].filter(Boolean),
  };
};

// ── BREADCRUMB SCHEMA ─────────────────────────────────────

/**
 * buildBreadcrumbSchema
 * Schema for breadcrumb navigation.
 * Enables Google to show breadcrumbs in search results.
 *
 * @param {Array} items - Array of { name, url } breadcrumb items
 * @returns {object} BreadcrumbList Schema.org object
 */
export const buildBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type':   'ListItem',
      position:  index + 1,
      name:      item.name,
      item:      item.url,
    })),
  };
};

// ── FAQ SCHEMA ────────────────────────────────────────────

/**
 * buildFAQSchema
 * Schema for FAQ pages — enables FAQ rich results in Google.
 *
 * @param {Array} faqs - Array of { question, answer } objects
 * @returns {object} FAQPage Schema.org object
 */
export const buildFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type':          'Question',
      name:             faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    faq.answer,
      },
    })),
  };
};

// ── HOW-TO SCHEMA (Docs) ──────────────────────────────────

/**
 * buildHowToSchema
 * Schema for step-by-step guide pages in the docs portal.
 * Enables HowTo rich results with steps.
 *
 * @param {object} guide - Guide data with title, steps array
 * @returns {object} HowTo Schema.org object
 */
export const buildHowToSchema = (guide) => {
  if (!guide) return null;

  return {
    '@context':  'https://schema.org',
    '@type':     'HowTo',
    name:        guide.title,
    description: guide.description || '',
    totalTime:   guide.estimatedTime || 'PT5M',

    step: (guide.steps || []).map((step, index) => ({
      '@type':    'HowToStep',
      position:   index + 1,
      name:       step.title,
      text:       step.description,
      url:        `${guide.url}#step-${index + 1}`,
      image:      step.image || undefined,
    })),
  };
};

// ── ARTICLE SCHEMA (Docs) ─────────────────────────────────

/**
 * buildArticleSchema
 * Schema for documentation articles.
 *
 * @param {object} article - Article data
 * @returns {object} Article Schema.org object
 */
export const buildArticleSchema = (article) => {
  if (!article) return null;

  return {
    '@context':       'https://schema.org',
    '@type':          'TechArticle',
    headline:         article.title,
    description:      article.description || '',
    image:            article.image || `${PORTAL_URLS.docs}/og-image.png`,
    url:              article.url,
    datePublished:    article.publishedAt || '2024-01-01',
    dateModified:     article.updatedAt || article.publishedAt || '2024-01-01',
    author: {
      '@type': 'Person',
      name:    SITE_META.developer,
    },
    publisher: {
      '@type': 'Organization',
      name:    SITE_META.organization,
      url:     SITE_META.orgURL,
      logo: {
        '@type': 'ImageObject',
        url:     `${PORTAL_URLS.main}/icons/flashcart-logo.svg`,
      },
    },
    inLanguage:       ['bn-BD', 'en-US'],
    isPartOf: {
      '@type': 'WebSite',
      name:    'FlashCart Documentation',
      url:     PORTAL_URLS.docs,
    },
  };
};

// ── STORE LIST SCHEMA ─────────────────────────────────────

/**
 * buildStoreListSchema
 * Schema for a list of stores (category/search results page).
 *
 * @param {Array} stores - Array of store objects
 * @param {string} listName - Name of the list
 * @param {string} listURL - URL of the list page
 * @returns {object} ItemList Schema.org object
 */
export const buildStoreListSchema = (stores, listName, listURL) => {
  if (!stores || stores.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       listName,
    url:        listURL,
    numberOfItems: stores.length,
    itemListElement: stores.slice(0, 10).map((store, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      name:       store.businessName,
      url:        `${MAIN_URL}/store/${store.slug}`,
      image:      store.coverImageURL || store.logoURL,
    })),
  };
};

// ── HELPER: OPENING HOURS SPEC ────────────────────────────

/**
 * buildOpeningHoursSpec
 * Converts FlashCart schedule object to Schema.org format.
 *
 * @param {object} schedule - Store schedule from Firestore
 * @returns {Array} Array of OpeningHoursSpecification objects
 */
export const buildOpeningHoursSpec = (schedule) => {
  if (!schedule) return [];

  // Day name mapping to Schema.org day names
  const dayMap = {
    monday:    'Monday',
    tuesday:   'Tuesday',
    wednesday: 'Wednesday',
    thursday:  'Thursday',
    friday:    'Friday',
    saturday:  'Saturday',
    sunday:    'Sunday',
  };

  return Object.entries(schedule)
    .filter(([, dayData]) => dayData?.isOpen) // Only open days
    .map(([day, dayData]) => ({
      '@type':    'OpeningHoursSpecification',
      dayOfWeek:  `https://schema.org/${dayMap[day]}`,
      opens:      dayData.open || '09:00',
      closes:     dayData.close || '22:00',
    }));
};

// ── REVIEW SCHEMA ─────────────────────────────────────────

/**
 * buildReviewSchema
 * Schema for a single review.
 *
 * @param {object} review - Review document from Firestore
 * @returns {object} Review Schema.org object
 */
export const buildReviewSchema = (review) => {
  if (!review) return null;

  return {
    '@type':       'Review',
    reviewRating: {
      '@type':       'Rating',
      ratingValue:   review.rating,
      bestRating:    '5',
      worstRating:   '1',
    },
    author: {
      '@type': 'Person',
      name:    review.customerName || 'Anonymous',
    },
    reviewBody:    review.content || '',
    datePublished: review.createdAt?.toDate?.()?.toISOString()
      || new Date().toISOString(),
  };
};
