// SEOHead.jsx — Centralized SEO meta injector using react-helmet-async.
// Renders title, description, canonical, OpenGraph, Twitter, hreflang and JSON-LD.

import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * @param {object} props
 * @param {string} props.title - full <title>
 * @param {string} props.description - meta description
 * @param {string} props.canonical - canonical URL
 * @param {string} props.image - OG/Twitter image URL
 * @param {object|object[]} props.jsonLd - structured data object(s)
 * @param {string} props.type - og:type
 */
export default function SEOHead({ title, description, canonical, image, jsonLd, type = 'website' }) {
  // Normalize JSON-LD into an array so we can render multiple schema blocks.
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="FlashCart Bangladesh" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* hreflang */}
      {canonical && <link rel="alternate" hrefLang="bn" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}

      {/* JSON-LD structured data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
