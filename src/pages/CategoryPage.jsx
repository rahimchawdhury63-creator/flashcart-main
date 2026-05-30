// CategoryPage.jsx — Lists stores within a single business category.
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import StoreCard from '../components/store/StoreCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchStores } from '../utils/dataService'
import { rankStores } from '../utils/ranking'
import { getCategory, categoryName } from '../data/categories'
import { useLanguage } from '../hooks/useLanguage'

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const { t, lang } = useLanguage()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const cat = getCategory(categorySlug)

  useEffect(() => {
    let mounted = true
    fetchStores().then((all) => { if (mounted) { setStores(all); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  const visible = useMemo(
    () => rankStores(stores.filter((s) => s.category === categorySlug)),
    [stores, categorySlug]
  )

  return (
    <main className="page container">
      <SEOHead
        title={`${categoryName(categorySlug, 'en')} Stores in Bangladesh`}
        description={`Order from the best ${categoryName(categorySlug, 'en')} stores near you on FlashCart with cash on delivery.`}
        canonical={`https://flashcart.bsdc.info.bd/category/${categorySlug}`}
      />
      <section className="section">
        <h1>{categoryName(categorySlug, lang)}</h1>
        {loading ? <LoadingSpinner large /> : visible.length ? (
          <div className="grid-stores">{visible.map((s) => <StoreCard key={s.id} store={s} />)}</div>
        ) : (
          <div className="empty-state">
            <p>{t('noResults')}</p>
            <Link to="/stores" className="btn btn-primary">{t('stores')}</Link>
          </div>
        )}
      </section>
    </main>
  )
}
