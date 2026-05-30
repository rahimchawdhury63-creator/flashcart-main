// functions/sitemap-stores.xml.js — Dynamic sitemap of all store + item URLs.
// Runs at the Cloudflare edge, reads Firestore via REST, and emits XML so Google
// can discover every store landing page and item page automatically.

const FIREBASE_PROJECT = 'flashcart-bd'
const SITE = 'https://flashcart.bsdc.info.bd'

function decode(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields || {})) {
    if ('stringValue' in v) out[k] = v.stringValue
    else if ('mapValue' in v) out[k] = decode(v.mapValue.fields)
  }
  return out
}

// List all documents in a collection (paginated). Returns {id, ...fields}.
async function listAll(collectionId) {
  const docs = []
  let pageToken = ''
  do {
    const url =
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${collectionId}` +
      `?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}`
    const res = await fetch(url)
    if (!res.ok) break
    const data = await res.json()
    for (const d of data.documents || []) {
      // Firestore REST doc name ends with /<docId>; extract it.
      const id = (d.name || '').split('/').pop()
      docs.push({ id, ...decode(d.fields) })
    }
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return docs
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function onRequest() {
  let stores = []
  let items = []
  try {
    ;[stores, items] = await Promise.all([listAll('stores'), listAll('items')])
  } catch {
    /* emit whatever we have */
  }

  // Build storeId -> slug lookup so item URLs can be resolved reliably.
  const slugByStoreId = {}
  for (const s of stores) if (s.id && s.slug) slugByStoreId[s.id] = s.slug

  const urls = []
  const today = new Date().toISOString().slice(0, 10)

  for (const s of stores) {
    if (!s.slug) continue
    urls.push(
      `<url><loc>${SITE}/store/${esc(s.slug)}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`
    )
  }

  // Resolve each item's parent store slug via its storeId.
  for (const it of items) {
    const storeSlug = it.storeSlug || slugByStoreId[it.storeId]
    if (it.slug && storeSlug) {
      urls.push(
        `<url><loc>${SITE}/store/${esc(storeSlug)}/item/${esc(it.slug)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`
      )
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8',
      'cache-control': 'public, max-age=600, s-maxage=3600',
    },
  })
}
