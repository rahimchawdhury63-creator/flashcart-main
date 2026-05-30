// TopItems.jsx — Popular items across stores (ranked).
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import StarRating from '../common/StarRating'

export default function TopItems({ items }) {
  const { t, pick } = useLanguage()
  if (!items.length) return null
  return (
    <section className="section container">
      <div className="section-header"><h2 style={{ margin: 0 }}>{t('topItems')}</h2></div>
      <div className="grid-cards">
        {items.slice(0, 8).map((it) => (
          <Link
            key={it.id}
            to={`/store/${it._storeSlug}/item/${it.slug}`}
            className="card card-hover"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--color-bg)' }}>
              <img src={it.image} alt={pick(it.name)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="card-body">
              <h4 className="truncate" style={{ margin: 0 }}>{pick(it.name)}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="item-price">৳{it.discountPrice || it.price}</span>
                <StarRating value={it.averageRating} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
