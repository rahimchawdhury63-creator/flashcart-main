// StoreHeader.jsx — Hero banner + logo + name + key info for a store landing page.
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import StarRating from '../common/StarRating'
import { categoryName } from '../../data/categories'
import { IconShield, IconClock, IconTruck, IconMapPin, IconPhone } from '../svgs'

export default function StoreHeader({ store }) {
  const { t, pick, lang } = useLanguage()
  return (
    <section className="store-hero">
      <div className="store-hero-banner">
        <img src={store.banner} alt={`${pick(store.name)} banner — ${categoryName(store.category, lang)}`} />
      </div>
      <div className="container">
        <div className="store-hero-info">
          <img className="store-hero-logo" src={store.logo} alt={`${pick(store.name)} logo`} />
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-1 flex-wrap">
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{pick(store.name)}</h1>
              {store.isVerified && <span className="badge badge-primary"><IconShield size={12} /> {t('verified')}</span>}
              <span className={`badge ${store.isOpen ? 'badge-success' : 'badge-error'}`}>
                {store.isOpen ? t('open') : t('closed')}
              </span>
            </div>
            <p className="text-light" style={{ margin: '4px 0' }}>
              {categoryName(store.category, lang)} · {store.upazila}, {store.district}
            </p>
            <div className="flex items-center gap-1">
              <StarRating value={store.averageRating} />
              <small className="text-light">{store.averageRating} ({store.totalRatings} {t('reviews')})</small>
            </div>
          </div>
        </div>

        {/* Quick info chips */}
        <div className="flex items-center gap-2 flex-wrap mt-2 mb-2">
          <span className="pill"><IconClock size={16} /> {store.deliveryTime} {t('minutes')}</span>
          <span className="pill"><IconTruck size={16} /> {store.deliveryFee ? `৳${store.deliveryFee}` : t('freeDelivery')}</span>
          <span className="pill"><IconMapPin size={16} /> {store.allBangladeshDelivery ? 'All Bangladesh' : `${store.deliveryRadius} ${t('km')}`}</span>
          <a className="pill" href={`tel:${store.phone}`}><IconPhone size={16} /> {store.phone}</a>
        </div>
      </div>
    </section>
  )
}
