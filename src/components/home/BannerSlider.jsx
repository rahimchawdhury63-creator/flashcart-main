// BannerSlider.jsx — Simple promotional banners (no external images, CSS-only).
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { IconTruck, IconWallet } from '../svgs'

export default function BannerSlider() {
  const { t } = useLanguage()
  return (
    <section className="section container">
      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-2)' }}>
        <div className="banner">
          <div className="flex items-center gap-2">
            <IconWallet size={28} />
            <div>
              <h3 style={{ margin: 0 }}>{t('codOnly')}</h3>
              <p style={{ margin: 0 }}>{t('heroSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
