/**
 * =============================================================================
 * FLASHCART — useSEO Hook
 * =============================================================================
 *
 * Purpose: Imperative SEO hook for setting page meta tags directly via
 * DOM manipulation. This is a backup to react-helmet-async — useful when
 * you need to set meta tags IMMEDIATELY on page load (before React renders)
 * for crawlers that don't wait for JS.
 *
 * This is the CRITICAL fix for the "Google sees blank page" problem.
 * Every page component should call this hook in its FIRST useEffect.
 *
 * Usage:
 *   useSEO({
 *     title: 'Page Title',
 *     description: 'Page description',
 *     canonical: '/path'
 *   });
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

/**
 * Set or update a meta tag's content attribute.
 * Creates the tag if it doesn't exist.
 *
 * @param {string} name — Meta tag name attribute
 * @param {string} content — Meta tag content value
 * @param {string} attributeName — 'name' or 'property' (default: 'name')
 */
const setMetaTag = (name, content, attributeName = 'name') => {
  if (!content) return;

  let element = document.querySelector(`meta[${attributeName}="${name}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attributeName, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

/**
 * Set or update the canonical link tag.
 *
 * @param {string} url — Full canonical URL
 */
const setCanonical = (url) => {
  let element = document.querySelector('link[rel="canonical"]');
  if (element) {
    element.setAttribute('href', url);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
    document.head.appendChild(element);
  }
};

/**
 * useSEO Hook
 *
 * @param {object} options — SEO options
 * @param {string} options.title — Page title (without brand suffix)
 * @param {string} options.description — Meta description
 * @param {string} options.keywords — Comma-separated keywords
 * @param {string} options.ogImage — Open Graph image URL
 * @param {string} options.ogType — Open Graph type (default: 'website')
 * @param {string} options.canonical — Canonical path (without domain)
 * @param {boolean} options.noindex — If true, sets noindex,nofollow
 */
export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false
} = {}) => {
  useEffect(() => {
    /* Update document title immediately */
    if (title) {
      document.title = `${title} | FlashCart`;
    }

    /* Update primary meta tags */
    if (description) {
      setMetaTag('description', description);
    }
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    /* Update robots */
    setMetaTag('robots', noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    /* Update canonical URL */
    if (canonical) {
      const fullUrl = canonical.startsWith('http')
        ? canonical
        : `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`;
      setCanonical(fullUrl);
    }

    /* Update Open Graph tags */
    if (title) {
      setMetaTag('og:title', `${title} | FlashCart`, 'property');
    }
    if (description) {
      setMetaTag('og:description', description, 'property');
    }
    setMetaTag('og:type', ogType, 'property');
    if (canonical) {
      const fullUrl = canonical.startsWith('http')
        ? canonical
        : `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`;
      setMetaTag('og:url', fullUrl, 'property');
    }
    if (ogImage) {
      setMetaTag('og:image', ogImage, 'property');
    }

    /* Update Twitter Card tags */
    if (title) {
      setMetaTag('twitter:title', `${title} | FlashCart`);
    }
    if (description) {
      setMetaTag('twitter:description', description);
    }
    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
    }
  }, [title, description, keywords, ogImage, ogType, canonical, noindex]);
};

export default useSEO;
