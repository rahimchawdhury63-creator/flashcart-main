/**
 * =============================================================================
 * FLASHCART — LocalBusiness Schema (For Partner Store Pages)
 * =============================================================================
 *
 * Purpose: Schema.org LocalBusiness markup for individual store pages.
 * This is the KEY SEO schema for partner stores — enables Google to
 * understand the store's location, hours, contact info, and offerings.
 *
 * Result: Rich snippets in search results, Google Maps listing,
 * "Near me" search visibility.
 *
 * Usage:
 *   <LocalBusinessSchema partner={partnerData} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

/**
 * LocalBusinessSchema Component
 *
 * @param {object} props
 * @param {object} props.partner — Partner/store data from Firestore
 */
const LocalBusinessSchema = ({ partner }) => {
  if (!partner) return null;

  /* Map store type to Schema.org type */
  const typeMapping = {
    restaurant: 'Restaurant',
    grocery: 'GroceryStore',
    medical: 'Pharmacy',
    electronics: 'ElectronicsStore',
    clothing: 'ClothingStore',
    books: 'BookStore',
    mobile: 'Store',
    homeKitchen: 'Restaurant',
    supermarket: 'Store',
    other: 'LocalBusiness'
  };

  const schemaType = typeMapping[partner.storeType] || 'LocalBusiness';

  /* Build opening hours specification */
  const openingHoursSpecification = partner.openingHours
    ? Object.entries(partner.openingHours)
        .filter(([_, hours]) => hours.isOpen)
        .map(([day, hours]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
          opens: hours.open,
          closes: hours.close
        }))
    : [];

  /* Build schema object */
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${BASE_URL}/store/${partner.slug}`,
    name: partner.businessName,
    alternateName: partner.businessNameBn,
    description: partner.description,
    url: `${BASE_URL}/store/${partner.slug}`,
    image: partner.banner || partner.logo,
    logo: partner.logo,
    telephone: partner.phone,
    priceRange: '৳৳',
    paymentAccepted: ['Cash'],
    currenciesAccepted: 'BDT',
    address: {
      '@type': 'PostalAddress',
      streetAddress: partner.location?.address || '',
      addressLocality: partner.location?.district || 'Dhaka',
      addressCountry: 'BD'
    }
  };

  /* Add geo coordinates if available */
  if (partner.location?.lat && partner.location?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: partner.location.lat,
      longitude: partner.location.lng
    };
  }

  /* Add opening hours if available */
  if (openingHoursSpecification.length > 0) {
    schema.openingHoursSpecification = openingHoursSpecification;
  }

  /* Add aggregate rating if available */
  if (partner.rating && partner.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: partner.rating.toFixed(1),
      reviewCount: partner.reviewCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  /* Add delivery area for restaurants */
  if (schemaType === 'Restaurant' || schemaType === 'GroceryStore') {
    schema.hasMap = `https://www.openstreetmap.org/?mlat=${partner.location?.lat}&mlon=${partner.location?.lng}`;
    schema.servesCuisine = partner.storeType === 'restaurant' ? 'Bangladeshi' : undefined;
  }

  return <JsonLd data={schema} />;
};

export default LocalBusinessSchema;
