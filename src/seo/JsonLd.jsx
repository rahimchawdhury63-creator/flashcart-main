/**
 * =============================================================================
 * FLASHCART — JSON-LD Schema Injector
 * =============================================================================
 *
 * Purpose: Generic component for injecting Schema.org JSON-LD structured data.
 * Wraps schema objects in a <script type="application/ld+json"> tag inside <head>.
 *
 * JSON-LD is the preferred format for structured data by Google and other
 * search engines. It enables rich results, knowledge panels, and better
 * search visibility.
 *
 * Usage:
 *   <JsonLd data={{
 *     "@context": "https://schema.org",
 *     "@type": "Restaurant",
 *     "name": "Rahim Restaurant",
 *     ...
 *   }} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * JsonLd Component
 * 
 * @param {object} props
 * @param {object|Array} props.data — Schema.org JSON-LD object (or array of objects)
 */
const JsonLd = ({ data }) => {
  if (!data) return null;

  /* Convert object to JSON string with no extra whitespace */
  const jsonString = JSON.stringify(data);

  return (
    <Helmet>
      <script type="application/ld+json">{jsonString}</script>
    </Helmet>
  );
};

export default JsonLd;
