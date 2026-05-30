// seo.js — SEO helpers: slug generation, meta builders, and JSON-LD structured data.

/**
 * Convert any text (English or Bangla) into a URL-friendly slug.
 * Keeps Bangla letters, replaces spaces with hyphens, strips unsafe chars.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return ''
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // spaces/underscores -> hyphen
    .replace(/[^\u0980-\u09FFa-z0-9-]/g, '') // keep Bangla unicode + alnum + hyphen
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, '') // trim leading/trailing hyphens
}

/**
 * Truncate a description to a max length (SEO meta descriptions ~155 chars).
 * @param {string} text
 * @param {number} max
 */
export function truncate(text, max = 155) {
  if (!text) return ''
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…'
}

/**
 * Build a standard FlashCart page title.
 * @param {string} pageTitle
 */
export function buildTitle(pageTitle) {
  return pageTitle
    ? `${pageTitle} | FlashCart Bangladesh`
    : 'FlashCart Bangladesh — Free Online Delivery'
}

/**
 * Generate schema.org openingHoursSpecification from a store hours object.
 * @param {object} hours - { monday: {open, close, isOpen}, ... }
 */
export function generateOpeningHours(hours) {
  if (!hours) return []
  const map = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }
  return Object.entries(hours)
    .filter(([, v]) => v?.isOpen)
    .map(([day, v]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: map[day] || day,
      opens: v.open,
      closes: v.close,
    }))
}

/**
 * Build LocalBusiness / FoodEstablishment JSON-LD for a store page.
 * @param {object} store
 */
export function storeJsonLd(store) {
  if (!store) return null
  return {
    '@context': 'https://schema.org',
    '@type': store.category === 'restaurant' ? 'FoodEstablishment' : 'LocalBusiness',
    name: store.name?.en || store.name?.bn || 'Store',
    alternateName: store.name?.bn,
    description: store.seoDescription?.en || store.description?.en,
    url: `https://flashcart.bsdc.info.bd/store/${store.slug}`,
    image: store.banner,
    logo: store.logo,
    telephone: store.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address?.en || store.address?.bn,
      addressLocality: store.upazila,
      addressRegion: store.district,
      addressCountry: 'BD',
    },
    geo:
      store.lat != null && store.lng != null
        ? { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng }
        : undefined,
    openingHoursSpecification: generateOpeningHours(store.hours),
    aggregateRating:
      store.totalRatings > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: store.averageRating,
            ratingCount: store.totalRatings,
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    priceRange: '৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash',
  }
}

/**
 * Build Product JSON-LD for an item page.
 * @param {object} item
 * @param {object} store
 */
export function productJsonLd(item, store) {
  if (!item) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name?.en || item.name?.bn,
    description: item.description?.en || item.description?.bn,
    image: item.image,
    sku: item.id,
    brand: { '@type': 'Brand', name: store?.name?.en || 'FlashCart Store' },
    offers: {
      '@type': 'Offer',
      price: item.discountPrice || item.price,
      priceCurrency: 'BDT',
      availability: item.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      item.totalRatings > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: item.averageRating,
            ratingCount: item.totalRatings,
          }
        : undefined,
  }
}

/**
 * Build BreadcrumbList JSON-LD from an array of {name, url}.
 * @param {Array<{name:string,url:string}>} crumbs
 */
export function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}
