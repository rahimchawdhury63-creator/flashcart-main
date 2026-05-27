/**
 * =============================================================================
 * FLASHCART — Breadcrumb Schema
 * =============================================================================
 *
 * Purpose: Schema.org BreadcrumbList for navigation hierarchy.
 * Enables breadcrumb display in Google search results.
 *
 * Usage:
 *   <BreadcrumbSchema items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Restaurants', url: '/category/restaurants' },
 *     { name: 'Rahim Restaurant', url: '/store/rahim-restaurant' }
 *   ]} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const BreadcrumbSchema = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };

  return <JsonLd data={schema} />;
};

export default BreadcrumbSchema;
