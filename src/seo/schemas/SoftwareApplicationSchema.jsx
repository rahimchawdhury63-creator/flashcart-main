/**
 * =============================================================================
 * FLASHCART — SoftwareApplication Schema
 * =============================================================================
 *
 * Purpose: Schema.org SoftwareApplication / WebApplication markup.
 * Used for the PWA app pages to identify FlashCart as an installable app.
 *
 * Usage: Include on homepage and PWA-related pages.
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const SoftwareApplicationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FlashCart',
    alternateName: 'ফ্ল্যাশকার্ট',
    url: BASE_URL,
    description: "Bangladesh's first free all-in-one delivery platform PWA. Order food, groceries, medicine and more with Cash on Delivery.",
    applicationCategory: 'ShoppingApplication',
    operatingSystem: 'Web Browser, Android, iOS',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BDT'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1'
    },
    creator: {
      '@type': 'Organization',
      name: 'Bangladesh Software Development Community',
      url: 'https://www.bsdc.info.bd'
    }
  };

  return <JsonLd data={schema} />;
};

export default SoftwareApplicationSchema;
