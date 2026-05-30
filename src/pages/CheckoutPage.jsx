// CheckoutPage.jsx — COD checkout: delivery details, location detect, place order.

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import CartSummary from '../components/cart/CartSummary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { useUserLocation } from '../hooks/useLocation'
import { placeOrder } from '../utils/dataService'
import { fetchStoreBySlug } from '../utils/dataService'
import { IconMapPin, IconWallet } from '../components/svgs'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, subtotal, deliveryFee, total, itemCount, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const { location, detect, detecting } = useUserLocation()
  const navigate = useNavigate()

  const [name, setName] = useState(profile?.displayName || '')
  const [phone, setPhone] = useState(profile?.phoneNumber || '')
  const [address, setAddress] = useState(location?.address || '')
  const [instructions, setInstructions] = useState('')
  const [placing, setPlacing] = useState(false)

  // Prefill address when location is detected.
  useEffect(() => { if (location?.address && !address) setAddress(location.address) }, [location]) // eslint-disable-line

  // Redirect to cart if empty.
  useEffect(() => { if (itemCount === 0) navigate('/cart') }, [itemCount, navigate])

  const onDetect = async () => {
    const loc = await detect()
    if (loc?.address) setAddress(loc.address)
    else toast.error('Could not detect location')
  }

  // Validate and place the order (COD only).
  const onPlace = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('Please fill name, phone and address.')
      return
    }
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('Enter a valid Bangladeshi phone number.')
      return
    }
    setPlacing(true)
    try {
      // Resolve the store's partnerId so the order reaches the right partner.
      const store = await fetchStoreBySlug(cart.storeSlug)
      const orderId = await placeOrder({
        customerId: user?.uid || 'guest',
        storeId: cart.storeId,
        partnerId: store?.partnerId || store?.id || cart.storeId,
        items: cart.items,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: {
          address,
          lat: location?.lat || null,
          lng: location?.lng || null,
          district: store?.district || '',
          upazila: store?.upazila || '',
        },
        customerName: name,
        customerPhone: phone,
        specialInstructions: instructions,
      })
      clearCart()
      toast.success(t('orderPlaced'))
      navigate(`/order/${orderId}`)
    } catch (err) {
      toast.error('Could not place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (itemCount === 0) return <main className="page"><LoadingSpinner /></main>

  return (
    <main className="page container">
      <SEOHead title={t('checkout')} description="Complete your order with cash on delivery." canonical="https://flashcart.bsdc.info.bd/checkout" />
      <section className="section">
        <h1>{t('checkout')}</h1>
        <form onSubmit={onPlace} className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-3)' }}>
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="co-name">{t('fullName')}</label>
              <input id="co-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="co-phone">{t('phoneNumber')}</label>
              <input id="co-phone" className="form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="co-addr">{t('deliveryAddress')}</label>
              <textarea id="co-addr" className="form-textarea" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <button type="button" className="btn btn-outline btn-sm mt-1" onClick={onDetect} disabled={detecting}>
                <IconMapPin size={16} /> {detecting ? t('loading') : 'Use my location'}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="co-note">{t('specialInstructions')}</label>
              <textarea id="co-note" className="form-textarea" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
          </div>

          <div style={{ maxWidth: 420 }}>
            <CartSummary>
              <div className="badge badge-success mb-2"><IconWallet size={14} /> {t('codOnly')}</div>
              <button className="btn btn-primary btn-block" type="submit" disabled={placing}>
                {placing ? <span className="spinner" /> : `${t('placeOrder')} — ৳${total}`}
              </button>
            </CartSummary>
          </div>
        </form>
      </section>
    </main>
  )
}
