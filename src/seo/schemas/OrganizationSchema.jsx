/**
 * =============================================================================
 * FLASHCART — Organization Schema
 * =============================================================================
 *
 * Purpose: Schema.org Organization markup for FlashCart as a business entity.
 * Used by Google for the Knowledge Panel and brand recognition.
 *
 * Usage: Include on About page, homepage, and footer pages.
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FlashCart',
    alternateName: 'ফ্ল্যাশকার্ট',
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512x512.png`,
    description: "Bangladesh's first free all-in-one delivery platform. Connecting local businesses with customers through Cash on Delivery.",
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Rizwan Rahim Chowdhury'
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Bangladesh Software Development Community',
      url: 'https://www.bsdc.info.bd'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
      sameAs: 'https://en.wikipedia.org/wiki/Bangladesh'
    },
    knowsLanguage: ['bn', 'en'],
    sameAs: []
  };

  return <JsonLd data={schema} />;
};

export default OrganizationSchema;
