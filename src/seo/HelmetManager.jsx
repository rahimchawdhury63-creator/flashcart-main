/**
 * =============================================================================
 * FLASHCART — Helmet Manager (Dynamic SEO Meta Tags)
 * =============================================================================
 *
 * Purpose: Reusable component for managing page-level SEO meta tags
 * using react-helmet-async. Inserts all necessary tags for:
 * - Search engine indexing (title, description, keywords)
 * - Social media previews (Open Graph, Twitter Card)
 * - Bilingual SEO (hreflang for Bangla/English)
 * - Canonical URLs (prevent duplicate content)
 * - Robots directives (index/noindex)
 * 
 * This component should be included in every page for proper SEO.
 *
 * Usage:
 *   <HelmetManager
 *     title="Page Title"
 *     description="Page description"
 *     keywords="keyword1, keyword2"
 *     ogImage="https://example.com/image.png"
 *     canonical="/store/restaurant-name"
 *   />
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/i18n/LanguageContext';

/* Base URL for canonical and OG URLs — read from environment */
const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';
const DEFAULT_OG_IMAGE = `${BASE_URL}/icon-512x512.png`;

/**
 * HelmetManager Component
 *
 * @param {object} props
 * @param {string} props.title — Page title (max 60 chars for SEO)
 * @param {string} props.description — Meta description (max 160 chars)
 * @param {string} props.keywords — Comma-separated keywords
 * @param {string} props.ogImage — Social share image URL
 * @param {string} props.ogType — Open Graph type (website, article, restaurant)
 * @param {string} props.canonical — Canonical URL path (without domain)
 * @param {boolean} props.noindex — If true, adds noindex to robots
 * @param {string} props.author — Content author
 * @param {string} props.publishedTime — ISO date for articles
 * @param {string} props.modifiedTime — ISO date for last update
 * @param {React.ReactNode} props.children — Additional Helmet tags (e.g., JSON-LD)
 */
const HelmetManager = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
  noindex = false,
  author = 'Rizwan Rahim Chowdhury',
  publishedTime,
  modifiedTime,
  children
}) => {
  /* Get current language from context */
  const { language, languageData } = useLanguage();

  /* Construct full title with brand suffix */
  const fullTitle = title
    ? `${title} | FlashCart`
    : 'FlashCart - Bangladesh\'s Free Delivery Platform';

  /* Construct canonical URL */
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`
    : BASE_URL;

  /* Robots meta value */
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* ================================================================ */}
      {/* PRIMARY META TAGS                                                */}
      {/* ================================================================ */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ================================================================ */}
      {/* HREFLANG (Bilingual SEO)                                          */}
      {/* ================================================================ */}
      <link rel="alternate" hreflang="bn" href={`${canonicalUrl}?lang=bn`} />
      <link rel="alternate" hreflang="en" href={`${canonicalUrl}?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={canonicalUrl} />

      {/* ================================================================ */}
      {/* OPEN GRAPH (Facebook, LinkedIn, WhatsApp)                         */}
      {/* ================================================================ */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="FlashCart" />
      <meta property="og:locale" content={languageData.ogLocale} />
      <meta property="og:locale:alternate" content="bn_BD" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || 'FlashCart'} />

      {/* Article-specific tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* ================================================================ */}
      {/* TWITTER CARD                                                      */}
      {/* ================================================================ */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* ================================================================ */}
      {/* MOBILE APP META                                                   */}
      {/* ================================================================ */}
      <meta name="apple-mobile-web-app-title" content="FlashCart" />
      <meta name="application-name" content="FlashCart" />
      <meta name="theme-color" content="#1B5E20" />

      {/* ================================================================ */}
      {/* ADDITIONAL CUSTOM TAGS (passed as children)                       */}
      {/* Usually contains JSON-LD schema markup                            */}
      {/* ================================================================ */}
      {children}
    </Helmet>
  );
};

export default HelmetManager;
