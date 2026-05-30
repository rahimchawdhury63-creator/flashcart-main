// StoreMenu.jsx — Renders a store's items grouped by menu category, with add-to-cart.
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import StarRating from '../common/StarRating'
import { IconPlus } from '../svgs'
import toast from 'react-hot-toast'

export default function StoreMenu({ store, categories, items }) {
  const { t, pick } = useLanguage()
  const { addItem, replaceCart } = useCart()

  // Add an item; if the cart belongs to another store, confirm replacement.
  const handleAdd = (item) => {
    if (!store.isAcceptingOrders) {
      toast.error(t('closed'))
      return
    }
    const { conflict } = addItem(item, store, 1)
    if (conflict) {
      if (window.confirm('Your cart has items from another store. Replace them?')) {
        replaceCart(item, store, 1)
        toast.success(t('addToCart'))
      }
    } else {
      toast.success(t('addToCart'))
    }
  }

  // Group items by their categoryId.
  const grouped = categories.length
    ? categories.map((c) => ({ category: c, items: items.filter((i) => i.categoryId === c.id) }))
    : [{ category: null, items }]

  return (
    <section className="section container">
      <h2>{t('menu')}</h2>
      {grouped.map(({ category, items: catItems }) => (
        <div key={category?.id || 'all'} className="mb-3">
          {category && <h3 style={{ marginTop: 'var(--sp-2)' }}>{pick(category.name)}</h3>}
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            {catItems.map((item) => (
              <div key={item.id} className="card">
                <div className="item-card">
                  <Link to={`/store/${store.slug}/item/${item.slug}`}>
                    <img className="item-card-img" src={item.image} alt={pick(item.name)} loading="lazy" />
                  </Link>
                  <div className="item-card-info">
                    <Link to={`/store/${store.slug}/item/${item.slug}`} style={{ color: 'inherit' }}>
                      <h4 className="truncate" style={{ margin: 0 }}>{pick(item.name)}</h4>
                    </Link>
                    <p className="text-light line-clamp-2" style={{ margin: '2px 0', fontSize: '0.82rem' }}>
                      {pick(item.description)}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="item-price">৳{item.discountPrice || item.price}</span>
                      {item.discountPrice > 0 && <span className="item-price-old">৳{item.price}</span>}
                      <StarRating value={item.averageRating} size={14} />
                    </div>
                  </div>
                  <button
                    className="btn btn-accent btn-sm"
                    onClick={() => handleAdd(item)}
                    disabled={!item.isAvailable}
                    aria-label={`${t('addToCart')} ${pick(item.name)}`}
                  >
                    <IconPlus size={16} /> {item.isAvailable ? t('addToCart') : t('outOfStock')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
