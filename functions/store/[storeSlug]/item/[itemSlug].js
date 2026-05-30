// functions/store/[storeSlug]/item/[itemSlug].js — Edge SSR for item pages.
// Injects the real product title, description, image and Product JSON-LD so
// crawlers see proper content for /store/:slug/item/:slug (fixes 404 indexing).

const FIREBASE_PROJECT = 'flashcart-bd'
const SITE = 'https://flashcart.bsdc.info.bd'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

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

// Generic single-collection slug query against Firestore REST.
async function queryBySlug(collectionId, slug) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents:runQuery`
  const body = {
    structuredQuery: {
      from: [{ collectionId }],
      where: { fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } } },
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
  const { storeSlug, itemSlug } = params

  const assetRes = await env.ASSETS.fetch(new URL('/index.html', request.url))
  let html = await assetRes.text()

  let item = null
  let store = null
  try {
    ;[item, store] = await Promise.all([queryBySlug('items', itemSlug), queryBySlug('stores', storeSlug)])
  } catch {
    item = null
  }

  if (!item) {
    return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } })
  }

  const name = item.name?.en || item.name?.bn || 'Item'
  const storeName = store?.name?.en || store?.name?.bn || 'FlashCart Store'
  const price = item.discountPrice || item.price || 0
  const title = `${name} — ${storeName} | FlashCart Bangladesh`
  const desc =
    (item.seoDescription?.en || item.description?.en ||
      `${name} from ${storeName}. Order online with cash on delivery on FlashCart.`)
      .slice(0, 155)
  const canonical = `${SITE}/store/${storeSlug}/item/${itemSlug}`
  const image = item.image || store?.banner || `${SITE}/favicon.svg`

  // Product structured data.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    image,
    brand: { '@type': 'Brand', name: storeName },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'BDT',
      availability: item.isAvailable === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: canonical,
    },
  }

  const inject =
    `<title>${esc(title)}</title>` +
    `<meta name="description" content="${esc(desc)}" />` +
    `<link rel="canonical" href="${esc(canonical)}" />` +
    `<meta name="robots" content="index, follow" />` +
    `<meta property="og:type" content="product" />` +
    `<meta property="og:title" content="${esc(title)}" />` +
    `<meta property="og:description" content="${esc(desc)}" />` +
    `<meta property="og:url" content="${esc(canonical)}" />` +
    `<meta property="og:image" content="${esc(image)}" />` +
    `<meta property="product:price:amount" content="${esc(price)}" />` +
    `<meta property="product:price:currency" content="BDT" />` +
    `<meta name="twitter:card" content="summary_large_image" />` +
    `<meta name="twitter:title" content="${esc(title)}" />` +
    `<meta name="twitter:description" content="${esc(desc)}" />` +
    `<meta name="twitter:image" content="${esc(image)}" />` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` +
    `<meta name="flashcart:prerendered" content="item" />`

  html = html.replace(/<title>[\s\S]*?<\/title>/, inject)

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  })
}
