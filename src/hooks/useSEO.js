// useSEO.js — Small helper that returns a memoized SEO meta object for a page.
// Components pass the result to <SEOHead/>. Keeps SEO logic out of page bodies.
import { useMemo } from 'react'
import { buildTitle, truncate } from '../utils/seo'

export function useSEO({ title, description, canonical, image, jsonLd, type = 'website' } = {}) {
  return useMemo(
    () => ({
      title: buildTitle(title),
      description: truncate(description || 'FlashCart Bangladesh — free cash-on-delivery delivery platform for local stores.'),
      canonical: canonical || (typeof window !== 'undefined' ? window.location.href : 'https://flashcart.bsdc.info.bd/'),
      image: image || 'https://flashcart.bsdc.info.bd/favicon.svg',
      jsonLd,
      type,
    }),
    [title, description, canonical, image, jsonLd, type]
  )
}
