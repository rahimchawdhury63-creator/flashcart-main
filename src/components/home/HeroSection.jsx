// HeroSection.jsx — Top hero with headline, subtext, search and trust stats.
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useUserLocation } from '../../hooks/useLocation'
import { IconSearch, IconMapPin } from '../svgs'

export default function HeroSection() {
  const { t } = useLanguage()
  const { location, detect, detecting } = useUserLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const onSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <section className="hero">
      <div className="container">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSubtitle')}</p>

        {/* Hero search */}
        <form className="hero-search" onSubmit={onSearch} role="search">
          <IconSearch size={20} style={{ color: 'var(--color-text-light)' }} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('search')}
          />
          <button className="btn btn-accent" type="submit">{t('search')}</button>
        </form>

        {/* Location detector */}
        <button
          className="btn btn-ghost mt-2"
          style={{ color: '#fff' }}
          onClick={detect}
          disabled={detecting}
        >
          <IconMapPin size={18} />
          {detecting ? t('loading') : location?.address ? location.address.split(',')[0] : t('nearbyStores')}
        </button>

        {/* Trust stats */}
        <div className="hero-stats">
          <div className="hero-stat"><strong>5,000+</strong><span>Orders Delivered</span></div>
          <div className="hero-stat"><strong>20+</strong><span>Store Categories</span></div>
          <div className="hero-stat"><strong>100%</strong><span>{t('codOnly')}</span></div>
        </div>
      </div>
    </section>
  )
}
