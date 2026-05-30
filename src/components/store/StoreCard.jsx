// StoreCard.jsx — Compact store card used in listings, home sections and search.

import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import StarRating from '../common/StarRating'
import { categoryName } from '../../data/categories'
import { IconMapPin, IconClock, IconTruck, IconShield } from '../svgs'

export default function StoreCard({ store, distance }) {
  const { t, pick, lang } = useLanguage()

  return (
    <Link to={`/store/${store.slug}`} className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {/* Banner with status + logo */}
      <div className="store-card-banner">
        <img
          src={store.banner}
          alt={`${pick(store.name)} — ${categoryName(store.category, lang)} in ${store.upazila}`}
          loading="lazy"
        />
        <div className="store-card-status">
          <span className={`badge ${store.isOpen ? 'badge-success' : 'badge-error'}`}>
            {store.isOpen ? t('open') : t('closed')}
          </span>
        </div>
        <img className="store-card-logo" src={store.logo} alt={`${pick(store.name)} logo`} loading="lazy" />
      </div>

      {/* Body */}
      <div className="store-card-body">
        <div className="flex items-center gap-1" style={{ justifyContent: 'space-between' }}>
          <h3 className="truncate" style={{ margin: 0, fontSize: '1.05rem' }}>{pick(store.name)}</h3>
          {store.isVerified && (
            <span className="badge badge-primary" title={t('verified')}>
              <IconShield size={12} /> {t('verified')}
            </span>
          )}
        </div>

        <p className="text-light truncate" style={{ margin: '2px 0 6px', fontSize: '0.82rem' }}>
          {categoryName(store.category, lang)} · {store.upazila}, {store.district}
        </p>

        <div className="flex items-center gap-1" style={{ marginBottom: 6 }}>
          <StarRating value={store.averageRating} />
          <small className="text-light">{store.averageRating} ({store.totalRatings})</small>
        </div>

        {/* Meta row */}
        <div className="store-meta">
          <span className="flex items-center gap-1"><IconClock size={14} /> {store.deliveryTime} {t('minutes')}</span>
          <span className="flex items-center gap-1">
            <IconTruck size={14} /> {store.deliveryFee ? `৳${store.deliveryFee}` : t('freeDelivery')}
          </span>
          {distance != null && (
            <span className="flex items-center gap-1"><IconMapPin size={14} /> {distance} {t('km')}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
