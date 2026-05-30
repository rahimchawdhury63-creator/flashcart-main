// StoresPage.jsx — Browse all stores with category filter, sort and distance.

import React, { useEffect, useMemo, useState } from 'react'
import SEOHead from '../components/common/SEOHead'
import StoreCard from '../components/store/StoreCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchStores } from '../utils/dataService'
import { rankStores } from '../utils/ranking'
import { haversineDistance } from '../utils/maps'
import { CATEGORIES } from '../data/categories'
import { useLanguage } from '../hooks/useLanguage'
import { useUserLocation } from '../hooks/useLocation'
import { useSEO } from '../hooks/useSEO'

export default function StoresPage() {
  const { t, lang } = useLanguage()
  const { location } = useUserLocation()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('relevance')

  useEffect(() => {
    let mounted = true
    fetchStores().then((all) => {
      if (mounted) { setStores(all); setLoading(false) }
    })
    return () => { mounted = false }
  }, [])

  // Apply category filter, distance calc and sorting.
  const visible = useMemo(() => {
    let list = stores
    if (category !== 'all') list = list.filter((s) => s.category === category)

    // Attach distance when location is known.
    if (location) {
      list = list.map((s) => ({ ...s, _distance: haversineDistance(location.lat, location.lng, s.lat, s.lng) }))
    }

    if (sort === 'rating') list = [...list].sort((a, b) => b.averageRating - a.averageRating)
    else if (sort === 'distance' && location) list = [...list].sort((a, b) => a._distance - b._distance)
    else if (sort === 'newest') list = [...list].sort((a, b) => (b.totalOrders < a.totalOrders ? -1 : 1))
    else list = rankStores(list)

    return list
  }, [stores, category, sort, location])

  const seo = useSEO({
    title: 'All Stores — Order Online in Bangladesh',
    description: 'Browse all local stores on FlashCart — restaurants, grocery, pharmacy, fashion and more with cash on delivery.',
    canonical: 'https://flashcart.bsdc.info.bd/stores',
  })

  return (
    <main className="page container">
      <SEOHead {...seo} />
      <section className="section">
        <h1>{t('stores')}</h1>

        {/* Category filter pills */}
        <div className="flex gap-1 flex-wrap mb-2" style={{ overflowX: 'auto' }}>
          <button className={`pill ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>{t('viewAll')}</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`pill ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
              {lang === 'bn' ? c.bn : c.en}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 mb-3">
          <label className="form-label" style={{ margin: 0 }} htmlFor="sort">Sort:</label>
          <select id="sort" className="form-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            {location && <option value="distance">Distance</option>}
            <option value="newest">Popular</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner large />
        ) : visible.length ? (
          <div className="grid-stores">
            {visible.map((s) => <StoreCard key={s.id} store={s} distance={s._distance} />)}
          </div>
        ) : (
          <p className="empty-state">{t('noResults')}</p>
        )}
      </section>
    </main>
  )
}
