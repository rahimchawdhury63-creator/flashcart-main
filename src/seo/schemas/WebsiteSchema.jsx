/**
 * =============================================================================
 * FLASHCART — WebSite Schema
 * =============================================================================
 *
 * Purpose: Schema.org WebSite markup for the FlashCart site.
 * Enables Google Sitelinks Search Box in search results.
 *
 * Usage: Include on homepage only (not on every page).
 *   <WebsiteSchema />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FlashCart',
    alternateName: ['ফ্ল্যাশকার্ট', 'FlashCart Bangladesh', 'FlashCart BD'],
    url: BASE_URL,
    description: "Bangladesh's first free all-in-one Cash-on-Delivery delivery platform for food, groceries, medicine, electronics, and more.",
    inLanguage: ['bn', 'en'],
    /* Enables sitelinks searchbox in Google */
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bangladesh Software Development Community',
      url: 'https://www.bsdc.info.bd'
    }
  };

  return <JsonLd data={schema} />;
};

export default WebsiteSchema;
