// StorePage.jsx — Individual store landing page (SEO-critical).
// URL: /store/:storeSlug. Renders header, menu, map, reviews + full structured data.

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import StoreHeader from '../components/store/StoreHeader'
import StoreMenu from '../components/store/StoreMenu'
import StoreMap from '../components/store/StoreMap'
import StoreReviews from '../components/store/StoreReviews'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchStoreBySlug, fetchItems, fetchMenuCategories, fetchStoreReviews } from '../utils/dataService'
import { rankItems } from '../utils/ranking'
import { storeJsonLd, breadcrumbJsonLd, truncate } from '../utils/seo'
import { categoryName } from '../data/categories'
import { useLanguage } from '../hooks/useLanguage'

export default function StorePage() {
  const { storeSlug } = useParams()
  const { t, pick, lang } = useLanguage()
  const [store, setStore] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Load all data for this store whenever the slug changes.
  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      const s = await fetchStoreBySlug(storeSlug)
      if (!mounted) return
      if (!s) { setNotFound(true); setLoading(false); return }
      setStore(s)
      const [its, cats, revs] = await Promise.all([
        fetchItems(s.id),
        fetchMenuCategories(s.id),
        fetchStoreReviews(s.id),
      ])
      if (!mounted) return
      setItems(rankItems(its))
      setCategories(cats)
      setReviews(revs)
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [storeSlug])

  if (loading) return <main className="page"><LoadingSpinner large label={t('loading')} /></main>

  if (notFound || !store) {
    return (
      <main className="page container section" style={{ textAlign: 'center' }}>
        <SEOHead title="Store Not Found" description="The store you are looking for does not exist." />
        <h1>{t('noResults')}</h1>
        <Link to="/stores" className="btn btn-primary mt-2">{t('stores')}</Link>
      </main>
    )
  }

  // Build SEO title/description + structured data per project spec.
  const title = `${pick(store.name)} — ${categoryName(store.category, lang)} Delivery in ${store.upazila}`
  const description = truncate(
    `${pick(store.name)} delivers to ${store.upazila}, ${store.district}. Order online with cash on delivery. ${store.averageRating} stars • ${store.totalOrders}+ orders delivered.`
  )
  const jsonLd = [
    storeJsonLd(store),
    breadcrumbJsonLd([
      { name: 'Home', url: 'https://flashcart.bsdc.info.bd/' },
      { name: 'Stores', url: 'https://flashcart.bsdc.info.bd/stores' },
      { name: pick(store.name), url: `https://flashcart.bsdc.info.bd/store/${store.slug}` },
    ]),
  ]

  return (
    <main className="page">
      <SEOHead
        title={title}
        description={description}
        canonical={`https://flashcart.bsdc.info.bd/store/${store.slug}`}
        image={store.banner}
        jsonLd={jsonLd}
        type="business.business"
      />

      <StoreHeader store={store} />

      {/* About / description for SEO context. */}
      <section className="section container">
        <h2>{t('about')}</h2>
        <p className="text-secondary">{pick(store.description)}</p>
      </section>

      <StoreMenu store={store} categories={categories} items={items} />

      {/* Map */}
      <section className="section container">
        <h2>{t('deliveryAddress')}</h2>
        <p className="text-secondary">{pick(store.address)}, {store.upazila}, {store.district}</p>
        <StoreMap store={store} />
      </section>

      <StoreReviews reviews={reviews} />
    </main>
  )
}
