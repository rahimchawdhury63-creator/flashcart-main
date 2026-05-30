// StoreReviews.jsx — Lists customer reviews for a store.
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import StarRating from '../common/StarRating'
import { IconUser } from '../svgs'

export default function StoreReviews({ reviews }) {
  const { t } = useLanguage()
  return (
    <section className="section container">
      <h2>{t('reviews')}</h2>
      {!reviews.length && <p className="text-light">{t('noResults')}</p>}
      <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
        {reviews.map((r) => (
          <div key={r.id} className="card card-body">
            <div className="flex items-center gap-2">
              {r.customerPhoto
                ? <img className="avatar" src={r.customerPhoto} alt={r.customerName} width={36} height={36} />
                : <span className="avatar flex items-center justify-center" style={{ width: 36, height: 36, background: 'var(--color-bg)' }}><IconUser size={18} /></span>}
              <div>
                <strong>{r.customerName || 'Customer'}</strong>
                <div><StarRating value={r.rating} size={14} /></div>
              </div>
            </div>
            <p style={{ margin: '8px 0 0' }}>{r.review}</p>
            {r.reviewPhoto && <img src={r.reviewPhoto} alt="Review" className="mt-1" style={{ maxWidth: 160, borderRadius: 8 }} />}
            {r.partnerReply && (
              <div className="mt-1" style={{ background: 'var(--color-bg)', padding: 8, borderRadius: 8 }}>
                <small className="text-primary font-semibold">Store reply:</small>
                <p style={{ margin: 0 }}>{r.partnerReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
