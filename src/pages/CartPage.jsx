// CartPage.jsx — Full cart view: line items, summary and checkout CTA.

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'
import { IconCart } from '../components/svgs'

export default function CartPage() {
  const { cart, itemCount } = useCart()
  const { t, pick } = useLanguage()
  const navigate = useNavigate()

  return (
    <main className="page container">
      <SEOHead title={t('yourCart')} description="Review your cart and checkout with cash on delivery." canonical="https://flashcart.bsdc.info.bd/cart" />
      <section className="section">
        <h1>{t('yourCart')}</h1>

        {itemCount === 0 ? (
          <div className="empty-state">
            <IconCart />
            <p>{t('emptyCart')}</p>
            <Link to="/stores" className="btn btn-primary">{t('continueShopping')}</Link>
          </div>
        ) : (
          <>
            {/* Store name banner */}
            {cart.storeName && (
              <p className="text-secondary mb-2">
                {t('stores')}: <Link to={`/store/${cart.storeSlug}`}>{pick(cart.storeName)}</Link>
              </p>
            )}

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-2)' }}>
              {cart.items.map((item) => <CartItem key={item.itemId} item={item} />)}
            </div>

            <div className="mt-3" style={{ maxWidth: 420 }}>
              <CartSummary>
                <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
                  {t('checkout')}
                </button>
              </CartSummary>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
