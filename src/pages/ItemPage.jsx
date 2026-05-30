// ItemPage.jsx — Product/item detail page with add-to-cart and recommendations.
// URL: /store/:storeSlug/item/:itemSlug

import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StarRating from '../components/common/StarRating'
import { fetchItemBySlug, fetchItems } from '../utils/dataService'
import { rankItems } from '../utils/ranking'
import { productJsonLd, breadcrumbJsonLd, truncate } from '../utils/seo'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import { IconPlus, IconMinus } from '../components/svgs'
import toast from 'react-hot-toast'

export default function ItemPage() {
  const { storeSlug, itemSlug } = useParams()
  const { t, pick } = useLanguage()
  const { addItem, replaceCart } = useCart()
  const navigate = useNavigate()
  const [store, setStore] = useState(null)
  const [item, setItem] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      const { store: s, item: it } = await fetchItemBySlug(storeSlug, itemSlug)
      if (!mounted) return
      setStore(s)
      setItem(it)
      if (s) {
        const all = await fetchItems(s.id)
        if (mounted) setRelated(rankItems(all.filter((x) => x.id !== it?.id)).slice(0, 4))
      }
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [storeSlug, itemSlug])

  if (loading) return <main className="page"><LoadingSpinner large /></main>
  if (!item || !store) {
    return (
      <main className="page container section" style={{ textAlign: 'center' }}>
        <SEOHead title="Item Not Found" description="This item is unavailable." />
        <h1>{t('noResults')}</h1>
        <Link to="/stores" className="btn btn-primary mt-2">{t('stores')}</Link>
      </main>
    )
  }

  // Add the chosen quantity to cart, handling cross-store conflicts.
  const handleAdd = () => {
    const { conflict } = addItem(item, store, qty)
    if (conflict) {
      if (window.confirm('Your cart has items from another store. Replace them?')) {
        replaceCart(item, store, qty)
        toast.success(t('addToCart'))
        navigate('/cart')
      }
    } else {
      toast.success(t('addToCart'))
    }
  }

  const price = item.discountPrice || item.price
  const title = `${pick(item.name)} — ${pick(store.name)}`
  const description = truncate(`${pick(item.name)}: ${pick(item.description)} Order from ${pick(store.name)} with cash on delivery.`)
  const jsonLd = [
    productJsonLd(item, store),
    breadcrumbJsonLd([
      { name: 'Home', url: 'https://flashcart.bsdc.info.bd/' },
      { name: pick(store.name), url: `https://flashcart.bsdc.info.bd/store/${store.slug}` },
      { name: pick(item.name), url: `https://flashcart.bsdc.info.bd/store/${store.slug}/item/${item.slug}` },
    ]),
  ]

  return (
    <main className="page container">
      <SEOHead
        title={title}
        description={description}
        canonical={`https://flashcart.bsdc.info.bd/store/${store.slug}/item/${item.slug}`}
        image={item.image}
        jsonLd={jsonLd}
        type="product"
      />

      {/* Breadcrumb */}
      <nav className="section" aria-label="Breadcrumb" style={{ paddingBottom: 0 }}>
        <small className="text-light">
          <Link to="/">{t('home')}</Link> / <Link to={`/store/${store.slug}`}>{pick(store.name)}</Link> / {pick(item.name)}
        </small>
      </nav>

      <section className="section grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-3)' }}>
        <div>
          <img src={item.image} alt={pick(item.name)} style={{ width: '100%', borderRadius: 'var(--radius-card)', maxHeight: 360, objectFit: 'cover' }} />
        </div>
        <div>
          <h1>{pick(item.name)}</h1>
          <div className="flex items-center gap-2 mb-1">
            <StarRating value={item.averageRating} count={item.totalRatings} />
            {item.isBestseller && <span className="badge badge-accent">Bestseller</span>}
          </div>
          <p className="text-secondary">{pick(item.description)}</p>
          <div className="flex items-center gap-1 mb-2">
            <span className="item-price" style={{ fontSize: '1.4rem' }}>৳{price}</span>
            {item.discountPrice > 0 && <span className="item-price-old">৳{item.price}</span>}
          </div>

          {/* Quantity + add */}
          <div className="flex items-center gap-2 mb-2">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><IconMinus size={16} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><IconPlus size={16} /></button>
            </div>
            <button className="btn btn-accent" onClick={handleAdd} disabled={!item.isAvailable}>
              <IconPlus size={18} /> {item.isAvailable ? `${t('addToCart')} — ৳${price * qty}` : t('outOfStock')}
            </button>
          </div>
        </div>
      </section>

      {/* Related items */}
      {related.length > 0 && (
        <section className="section">
          <h2>{t('topItems')}</h2>
          <div className="grid-cards">
            {related.map((r) => (
              <Link key={r.id} to={`/store/${store.slug}/item/${r.slug}`} className="card card-hover" style={{ color: 'inherit' }}>
                <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                  <img src={r.image} alt={pick(r.name)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card-body">
                  <h4 className="truncate" style={{ margin: 0 }}>{pick(r.name)}</h4>
                  <span className="item-price">৳{r.discountPrice || r.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
