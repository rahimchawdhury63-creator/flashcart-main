// functions/store/[storeSlug].js — Cloudflare Pages Function (edge SSR for meta).
// Intercepts /store/:storeSlug requests, fetches the store from Firestore via the
// public REST API, and returns index.html with the store's REAL <title>, meta
// description, canonical, OpenGraph and JSON-LD already injected — so Google and
// social crawlers see proper content WITHOUT running JavaScript.
//
// The React app still hydrates normally for users; Helmet simply overwrites the
// same tags client-side (identical values).

const FIREBASE_PROJECT = 'flashcart-bd'
const SITE = 'https://flashcart.bsdc.info.bd'

// Escape a string for safe insertion into HTML attributes/text.
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Decode a Firestore REST "fields" object into a plain JS object (shallow + nested maps).
function decode(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields || {})) out[k] = decodeValue(v)
  return out
}
function decodeValue(v) {
  if (v == null) return null
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('mapValue' in v) return decode(v.mapValue.fields)
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue)
  return null
}

// Query Firestore REST for a store by slug.
async function fetchStore(slug) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents:runQuery`
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'stores' }],
      where: {
        fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } },
      },
      limit: 1,
    },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  const data = await res.json()
  const doc = Array.isArray(data) ? data.find((d) => d.document) : null
  return doc ? decode(doc.document.fields) : null
}

export async function onRequest(context) {
  const { params, env, request } = context
  const slug = params.storeSlug

  // Always start from the built index.html so the SPA still boots.
  const assetRes = await env.ASSETS.fetch(new URL('/index.html', request.url))
  let html = await assetRes.text()

  let store = null
  try {
    store = await fetchStore(slug)
  } catch {
    store = null
  }

  // If the store doesn't exist, return index.html as-is (the SPA shows a 404 UI).
  if (!store) {
    return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } })
  }

  const name = store.name?.en || store.name?.bn || 'Store'
  const nameBn = store.name?.bn || name
  const area = store.upazila || store.district || 'Bangladesh'
  const title = `${name} — Online Delivery in ${area} | FlashCart Bangladesh`
  const desc =
    (store.seoDescription?.en || store.description?.en ||
      `${name} delivers to ${area}. Order online with cash on delivery on FlashCart.`)
      .slice(0, 155)
  const canonical = `${SITE}/store/${slug}`
  const image = store.banner || store.logo || `${SITE}/favicon.svg`

  // LocalBusiness / FoodEstablishment structured data.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': store.category === 'restaurant' ? 'FoodEstablishment' : 'LocalBusiness',
    name,
    alternateName: nameBn,
    description: desc,
    url: canonical,
    image,
    telephone: store.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: store.upazila || '',
      addressRegion: store.district || '',
      addressCountry: 'BD',
    },
    priceRange: '৳',
    paymentAccepted: 'Cash',
  }

  // Build the replacement <head> meta block.
  const inject =
    `<title>${esc(title)}</title>` +
    `<meta name="description" content="${esc(desc)}" />` +
    `<link rel="canonical" href="${esc(canonical)}" />` +
    `<meta name="robots" content="index, follow" />` +
    `<meta property="og:type" content="business.business" />` +
    `<meta property="og:title" content="${esc(title)}" />` +
    `<meta property="og:description" content="${esc(desc)}" />` +
    `<meta property="og:url" content="${esc(canonical)}" />` +
    `<meta property="og:image" content="${esc(image)}" />` +
    `<meta name="twitter:card" content="summary_large_image" />` +
    `<meta name="twitter:title" content="${esc(title)}" />` +
    `<meta name="twitter:description" content="${esc(desc)}" />` +
    `<meta name="twitter:image" content="${esc(image)}" />` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` +
    // Visible H1 in the initial HTML helps crawlers that don't run JS.
    `<meta name="flashcart:prerendered" content="store" />`

  // Replace the default <title>…</title> with our injected block.
  html = html.replace(/<title>[\s\S]*?<\/title>/, inject)

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      // Cache at the edge for an hour; crawlers and repeat visits get it fast.
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  })
}
