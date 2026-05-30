// FeaturedStores.jsx — Horizontal-scroll section of featured/promoted stores.
import React from 'react'
import { Link } from 'react-router-dom'
import StoreCard from '../store/StoreCard'
import { useLanguage } from '../../hooks/useLanguage'

export default function FeaturedStores({ stores }) {
  const { t } = useLanguage()
  const featured = stores.filter((s) => s.isFeatured)
  if (!featured.length) return null
  return (
    <section className="section container">
      <div className="section-header">
        <h2 style={{ margin: 0 }}>{t('featuredStores')}</h2>
        <Link to="/stores" className="btn btn-ghost btn-sm">{t('viewAll')}</Link>
      </div>
      <div className="grid-stores">
        {featured.map((s) => <StoreCard key={s.id} store={s} />)}
      </div>
    </section>
  )
}
