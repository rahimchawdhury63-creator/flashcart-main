// OrdersPage.jsx — Customer order history with reorder/track links.
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchUserOrders } from '../utils/dataService'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { IconReceipt } from '../components/svgs'

const STATUS_BADGE = {
  placed: 'badge-accent', confirmed: 'badge-primary', preparing: 'badge-primary',
  out_for_delivery: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
}

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuth()
  const { t } = useLanguage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!user) { setLoading(false); return }
    fetchUserOrders(user.uid).then((o) => { if (mounted) { setOrders(o); setLoading(false) } })
    return () => { mounted = false }
  }, [user])

  if (!isLoggedIn) {
    return (
      <main className="page container section" style={{ textAlign: 'center' }}>
        <SEOHead title={t('orders')} description="Your order history." />
        <h1>{t('orders')}</h1>
        <p className="text-secondary">{t('login')} to view your orders.</p>
        <Link to="/login" className="btn btn-primary">{t('login')}</Link>
      </main>
    )
  }

  return (
    <main className="page container">
      <SEOHead title={t('orders')} description="Your FlashCart order history." />
      <section className="section">
        <h1>{t('orders')}</h1>
        {loading ? <LoadingSpinner large /> : orders.length ? (
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-2)' }}>
            {orders.map((o) => (
              <Link key={o.id} to={`/order/${o.id}`} className="card card-body card-hover" style={{ color: 'inherit' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{o.orderId}</strong>
                    <p className="text-light" style={{ margin: 0, fontSize: '0.82rem' }}>{o.items?.length} items · ৳{o.total}</p>
                  </div>
                  <span className={`badge ${STATUS_BADGE[o.status] || 'badge-muted'}`}>{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <IconReceipt />
            <p>{t('noResults')}</p>
            <Link to="/stores" className="btn btn-primary">{t('continueShopping')}</Link>
          </div>
        )}
      </section>
    </main>
  )
}
