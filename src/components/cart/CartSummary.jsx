// CartSummary.jsx — Price breakdown box used in cart and checkout.
import React from 'react'
import { useCart } from '../../hooks/useCart'
import { useLanguage } from '../../hooks/useLanguage'
import { IconWallet } from '../svgs'

export default function CartSummary({ children }) {
  const { subtotal, deliveryFee, total } = useCart()
  const { t } = useLanguage()
  return (
    <div className="card card-body">
      <div className="flex justify-between mb-1"><span className="text-secondary">{t('subtotal')}</span><span>৳{subtotal}</span></div>
      <div className="flex justify-between mb-1"><span className="text-secondary">{t('deliveryFee')}</span><span>{deliveryFee ? `৳${deliveryFee}` : t('freeDelivery')}</span></div>
      <div className="divider" />
      <div className="flex justify-between mb-2"><strong>{t('total')}</strong><strong className="text-primary">৳{total}</strong></div>
      <div className="badge badge-accent mb-2"><IconWallet size={14} /> {t('codOnly')}</div>
      {children}
    </div>
  )
}
