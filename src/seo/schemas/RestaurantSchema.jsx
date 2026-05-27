/**
 * =============================================================================
 * FLASHCART — Restaurant Schema (Enhanced for Restaurant Stores)
 * =============================================================================
 *
 * Purpose: Detailed Schema.org Restaurant markup with menu, cuisine,
 * accepts reservations, etc. Used specifically for restaurant-type stores.
 *
 * Usage:
 *   <RestaurantSchema restaurant={restaurantData} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const RestaurantSchema = ({ restaurant }) => {
  if (!restaurant) return null;

  const openingHours = restaurant.openingHours
    ? Object.entries(restaurant.openingHours)
        .filter(([_, hours]) => hours.isOpen)
        .map(([day, hours]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
          opens: hours.open,
          closes: hours.close
        }))
    : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BASE_URL}/store/${restaurant.slug}`,
    name: restaurant.businessName,
    alternateName: restaurant.businessNameBn,
    description: restaurant.description,
    url: `${BASE_URL}/store/${restaurant.slug}`,
    image: restaurant.banner || restaurant.logo,
    logo: restaurant.logo,
    telephone: restaurant.phone,
    priceRange: '৳৳',
    servesCuisine: ['Bangladeshi', 'South Asian'],
    acceptsReservations: false,
    paymentAccepted: ['Cash'],
    currenciesAccepted: 'BDT',
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.location?.address || '',
      addressLocality: restaurant.location?.district || 'Dhaka',
      addressCountry: 'BD'
    },
    /* Menu link */
    hasMenu: `${BASE_URL}/store/${restaurant.slug}#menu`,
    /* Delivery options */
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/store/${restaurant.slug}`,
        inLanguage: 'bn-BD',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      },
      deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'
    }
  };

  if (restaurant.location?.lat && restaurant.location?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: restaurant.location.lat,
      longitude: restaurant.location.lng
    };
  }

  if (openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours;
  }

  if (restaurant.rating && restaurant.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating.toFixed(1),
      reviewCount: restaurant.reviewCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  return <JsonLd data={schema} />;
};

export default RestaurantSchema;
