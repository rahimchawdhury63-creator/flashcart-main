// CategoryGrid.jsx — Grid of all business categories with SVG icons.
import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'
import { CATEGORY_ICONS } from '../svgs'
import { useLanguage } from '../../hooks/useLanguage'

export default function CategoryGrid() {
  const { t, lang } = useLanguage()
  return (
    <section className="section container">
      <div className="section-header">
        <h2 style={{ margin: 0 }}>{t('browseCategories')}</h2>
      </div>
      <div className="grid-categories">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] || CATEGORY_ICONS.other
          const label = lang === 'bn' ? cat.bn : lang === 'en' ? cat.en : cat.bn
          return (
            <Link key={cat.id} to={`/category/${cat.id}`} className="cat-tile" aria-label={cat.en}>
              <span className="cat-icon"><Icon size={24} /></span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
