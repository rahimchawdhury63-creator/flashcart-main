/**
 * =============================================================================
 * FLASHCART — MetaTags Component (Comprehensive SEO)
 * =============================================================================
 *
 * Purpose: All-in-one comprehensive SEO meta tags component.
 * Combines HelmetManager + useSEO hook for maximum SEO coverage.
 *
 * This is the RECOMMENDED component for use in pages. It ensures meta tags
 * are set BOTH at the React level (via Helmet) AND at the DOM level (via useSEO)
 * for maximum crawler visibility.
 *
 * Usage:
 *   <MetaTags
 *     title="Restaurant Name"
 *     description="Order food from..."
 *     keywords="restaurant, food, delivery"
 *     ogImage="https://..."
 *     canonical="/store/restaurant-slug"
 *   />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import HelmetManager from './HelmetManager';
import { useSEO } from './useSEO';

const MetaTags = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  publishedTime,
  modifiedTime,
  children
}) => {
  /* Set meta tags via direct DOM manipulation (immediate, crawler-friendly) */
  useSEO({ title, description, keywords, ogImage, ogType, canonical, noindex });

  /* Set meta tags via React Helmet (clean React way, plus JSON-LD) */
  return (
    <HelmetManager
      title={title}
      description={description}
      keywords={keywords}
      ogImage={ogImage}
      ogType={ogType}
      canonical={canonical}
      noindex={noindex}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
    >
      {children}
    </HelmetManager>
  );
};

export default MetaTags;
