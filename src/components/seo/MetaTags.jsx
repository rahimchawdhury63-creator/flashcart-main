// ============================================================
// FlashCart — MetaTags Component
// Universal SEO meta tag manager using React Helmet Async.
// Solves the Googlebot/React problem — every route gets
// unique, dynamic meta tags injected before render.
//
// USAGE:
// <MetaTags
//   title="ABC Restaurant — Gulshan, Dhaka | FlashCart"
//   description="Order from ABC Restaurant..."
//   keywords={['abc restaurant', 'gulshan food']}
//   image="https://i.ibb.co/store-image.jpg"
//   url="https://flashcart.bsdc.info.bd/store/abc-restaurant"
//   type="website"
//   schema={storeSchemaObject}
// />
//
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React import
import React from 'react';

// React Helmet Async — manages all <head> tags
// HelmetProvider wraps the app in main.jsx (already done in Step 2)
import { Helmet } from 'react-helmet-async';

// Site constants
import { SITE_META, PORTAL_URLS } from '../../utils/constants';

// Keyword helpers
import { buildPageKeywords } from '../../data/keywords';

/**
 * MetaTags
 * Injects comprehensive SEO meta tags into the document <head>.
 * All props are optional — sensible defaults are provided.
 * Override only what changes per page.
 *
 * @param {string}   title         - Page title (50-60 chars ideal)
 * @param {string}   description   - Meta description (150-160 chars ideal)
 * @param {string[]} keywords      - Page-specific keywords array
 * @param {string}   image         - OG image URL (1200x630px ideal)
 * @param {string}   url           - Canonical URL for this page
 * @param {string}   type          - OG type: 'website'|'article'|'product'
 * @param {string}   locale        - Primary locale (default: 'bn_BD')
 * @param {boolean}  noIndex       - Whether to block indexing (login pages)
 * @param {object}   schema        - Schema.org JSON-LD object to inject
 * @param {string}   twitterCard   - Twitter card type
 * @param {string}   author        - Page author
 * @param {string}   publishedTime - Article published time (ISO string)
 * @param {string}   modifiedTime  - Article modified time (ISO string)
 * @param {string}   section       - Article section/category
 * @param {string[]} articleTags   - Article tags (for blog/docs)
 * @param {string}   robots        - Custom robots directive
 * @param {string}   langAlternate - Alternate language URL
 */
const MetaTags = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  locale = 'bn_BD',
  noIndex = false,
  schema = null,
  twitterCard = 'summary_large_image',
  author = SITE_META.developer,
  publishedTime,
  modifiedTime,
  section,
  articleTags = [],
  robots,
  langAlternate,
}) => {

  // ── RESOLVE VALUES WITH SMART DEFAULTS ─────────────────

  // Detect portal type for correct base URL
  const portalType = import.meta.env.VITE_PORTAL_TYPE || 'main';

  // Base URL for this portal
  const baseURL = {
    main:    PORTAL_URLS.main,
    partner: PORTAL_URLS.partner,
    docs:    PORTAL_URLS.docs,
  }[portalType] || PORTAL_URLS.main;

  // Resolved title — ensure it ends with brand name for recognition
  const resolvedTitle = title
    ? title.includes('FlashCart') || title.includes('ফ্ল্যাশকার্ট')
      ? title                                    // Already has brand
      : `${title} | FlashCart`                  // Add brand
    : SITE_META.name;                            // Use default brand title

  // Resolved description — trim to 160 chars max
  const resolvedDescription = description
    ? description.slice(0, 160)
    : SITE_META.description;

  // Resolved image — use OG image as fallback
  const resolvedImage = image || `${baseURL}/og-image.png`;

  // Resolved canonical URL
  const resolvedURL = url || baseURL;

  // Resolved keywords — combine page-specific with global primary keywords
  const resolvedKeywords = buildPageKeywords(keywords);

  // Robots directive
  const resolvedRobots = robots || (noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // ── RENDER HELMET TAGS ─────────────────────────────────
  return (
    <Helmet>
      {/* ── PRIMARY META TAGS ─────────────────────────── */}

      {/* Page title — most important SEO element */}
      <title>{resolvedTitle}</title>

      {/* Meta description — shown in search results */}
      <meta name="description" content={resolvedDescription} />

      {/* Meta keywords — less important for Google but good for Bing */}
      <meta name="keywords" content={resolvedKeywords} />

      {/* Robots directive — controls indexing */}
      <meta name="robots" content={resolvedRobots} />

      {/* Author attribution */}
      <meta name="author" content={author} />

      {/* Copyright */}
      <meta name="copyright" content={`FlashCart — ${SITE_META.organization}`} />

      {/* Canonical URL — prevents duplicate content issues */}
      {/* This is CRITICAL for SEO — always set the canonical */}
      <link rel="canonical" href={resolvedURL} />

      {/* ── OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ─── */}

      {/* OG type — website for most pages, article for docs */}
      <meta property="og:type" content={type} />

      {/* Site name — shown in OG previews */}
      <meta property="og:site_name" content="FlashCart" />

      {/* OG title */}
      <meta property="og:title" content={resolvedTitle} />

      {/* OG description */}
      <meta property="og:description" content={resolvedDescription} />

      {/* OG image — 1200x630px for best display */}
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedTitle} />
      <meta property="og:image:type" content="image/png" />

      {/* OG URL */}
      <meta property="og:url" content={resolvedURL} />

      {/* Primary locale — Bangladesh Bangla */}
      <meta property="og:locale" content={locale} />

      {/* Alternate locale — English */}
      <meta property="og:locale:alternate" content="en_US" />

      {/* Article-specific OG tags (for docs/blog pages) */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && articleTags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}

      {/* ── TWITTER CARD ─────────────────────────────── */}

      {/* Twitter card type — summary_large_image shows full image */}
      <meta name="twitter:card" content={twitterCard} />

      {/* Twitter title */}
      <meta name="twitter:title" content={resolvedTitle} />

      {/* Twitter description */}
      <meta name="twitter:description" content={resolvedDescription} />

      {/* Twitter image */}
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={resolvedTitle} />

      {/* ── HREFLANG (Bilingual SEO) ──────────────────── */}

      {/* Tell Google both Bangla and English exist at the same URL */}
      {/* Both point to same URL since we use dynamic language switching */}
      <link rel="alternate" hreflang="bn" href={resolvedURL} />
      <link rel="alternate" hreflang="en" href={langAlternate || resolvedURL} />

      {/* x-default — the default version for unmatched locales */}
      <link rel="alternate" hreflang="x-default" href={baseURL} />

      {/* ── SCHEMA.ORG JSON-LD ───────────────────────── */}

      {/* Inject schema if provided */}
      {/* React Helmet handles script tags correctly */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* ── PWA & MOBILE META ────────────────────────── */}

      {/* Apple Web App capable — for iOS home screen install */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="FlashCart" />

      {/* Theme color for mobile browser UI */}
      <meta name="theme-color" content="#1B5E20" />

      {/* ── ADDITIONAL SEO SIGNALS ───────────────────── */}

      {/* Geographic targeting — Bangladesh */}
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Bangladesh" />

      {/* Content language */}
      <meta httpEquiv="content-language" content="bn, en" />

      {/* Rating — general audience */}
      <meta name="rating" content="general" />

      {/* Revisit after — suggest recrawl interval */}
      <meta name="revisit-after" content="7 days" />

    </Helmet>
  );
};

export default MetaTags;
