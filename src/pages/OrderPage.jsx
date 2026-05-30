// OrderPage.jsx — Single order detail: status timeline, items, invoice, rating.

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StarRating from '../components/common/StarRating'
import Modal from '../components/common/Modal'
import { fetchOrder, cancelOrder, submitReview } from '../utils/dataService'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { IconCheck, IconReceipt, IconShare } from '../components/svgs'
import toast from 'react-hot-toast'

// Order status steps in order.
const STEPS = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
const STEP_LABELS = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
}

export default function OrderPage() {
  const { orderId } = useParams()
  const { t, pick } = useLanguage()
  const { profile } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rateOpen, setRateOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const load = async () => {
    const o = await fetchOrder(orderId)
    setOrder(o)
    setLoading(false)
  }
  useEffect(() => { load() }, [orderId]) // eslint-disable-line

  if (loading) return <main className="page"><LoadingSpinner large /></main>
  if (!order) {
    return (
      <main className="page container section" style={{ textAlign: 'center' }}>
        <SEOHead title="Order Not Found" description="Order not found." />
        <h1>{t('noResults')}</h1>
        <Link to="/orders" className="btn btn-primary mt-2">{t('orders')}</Link>
      </main>
    )
  }

  const currentStep = STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  // Cancel only allowed before confirmation.
  const onCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    try { await cancelOrder(order.id); toast.success('Order cancelled'); load() }
    catch { toast.error('Could not cancel') }
  }

  // Submit a review for a delivered order.
  const onRate = async () => {
    try {
      await submitReview({
        orderId: order.id,
        storeId: order.storeId,
        customerId: order.customerId,
        customerName: order.customerName || profile?.displayName || 'Customer',
        customerPhoto: profile?.photoURL || '',
        rating,
        review: reviewText,
        reviewPhoto: '',
      })
      toast.success('Thanks for your review!')
      setRateOpen(false)
      load()
    } catch { toast.error('Could not submit review') }
  }

  // Share receipt summary via WhatsApp.
  const onShare = () => {
    const text = `FlashCart Order ${order.orderId}\nTotal: ৳${order.total}\nStatus: ${STEP_LABELS[order.status] || order.status}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <main className="page container">
      <SEOHead title={`Order ${order.orderId}`} description="Track your FlashCart order." />
      <section className="section">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 style={{ margin: 0 }}>Order {order.orderId}</h1>
          <button className="btn btn-outline btn-sm" onClick={onShare}><IconShare size={16} /> Share</button>
        </div>

        {/* Status timeline */}
        <div className="card card-body mt-2">
          {isCancelled ? (
            <span className="badge badge-error">Cancelled</span>
          ) : (
            <ul className="timeline">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <span className={`timeline-dot ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
                    {i <= currentStep && <IconCheck size={14} />}
                  </span>
                  <div>
                    <strong>{STEP_LABELS[s]}</strong>
                    {i === currentStep && <div><small className="text-primary">Current</small></div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Items + invoice */}
        <div className="card card-body mt-2">
          <h3><IconReceipt size={18} /> Items</h3>
          {order.items?.map((it) => (
            <div key={it.itemId} className="flex justify-between mb-1">
              <span>{pick(it.name)} × {it.quantity}</span>
              <span>৳{it.price * it.quantity}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="flex justify-between"><span className="text-secondary">{t('subtotal')}</span><span>৳{order.subtotal}</span></div>
          <div className="flex justify-between"><span className="text-secondary">{t('deliveryFee')}</span><span>৳{order.deliveryFee}</span></div>
          <div className="flex justify-between mt-1"><strong>{t('total')}</strong><strong className="text-primary">৳{order.total}</strong></div>
          <p className="text-light mt-1"><small>{t('codOnly')}</small></p>
        </div>

        {/* Delivery info */}
        <div className="card card-body mt-2">
          <h3>{t('deliveryAddress')}</h3>
          <p className="text-secondary">{order.deliveryAddress?.address}</p>
          <p className="text-secondary">{order.customerName} · {order.customerPhone}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {order.status === 'placed' && (
            <button className="btn btn-outline" onClick={onCancel} style={{ color: 'var(--color-error)' }}>Cancel Order</button>
          )}
          {order.status === 'delivered' && !order.isRated && (
            <button className="btn btn-accent" onClick={() => setRateOpen(true)}>{t('rateOrder')}</button>
          )}
          <Link to={`/store/${order.storeSlug || ''}`} className="btn btn-primary">{t('reorder')}</Link>
        </div>
      </section>

      {/* Rating modal */}
      <Modal open={rateOpen} title={t('rateOrder')} onClose={() => setRateOpen(false)}>
        <div className="text-center mb-2">
          <StarRating value={rating} editable onChange={setRating} size={32} />
        </div>
        <textarea className="form-textarea" placeholder="Write a review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        <button className="btn btn-primary btn-block mt-2" onClick={onRate}>Submit</button>
      </Modal>
    </main>
  )
}
