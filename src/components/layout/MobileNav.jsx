// MobileNav.jsx — Bottom navigation bar shown on mobile (<768px).
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import { IconHome, IconGrid, IconCart, IconReceipt, IconUser } from '../svgs'

export default function MobileNav() {
  const { t } = useLanguage()
  const { itemCount } = useCart()

  // Helper for active-link class.
  const cls = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <nav className="mobile-nav" aria-label="Primary mobile navigation">
      <NavLink to="/" className={cls} end>
        <IconHome size={22} />
        <span>{t('home')}</span>
      </NavLink>
      <NavLink to="/stores" className={cls}>
        <IconGrid size={22} />
        <span>{t('stores')}</span>
      </NavLink>
      <NavLink to="/cart" className={cls} style={{ position: 'relative' }}>
        <span style={{ position: 'relative' }}>
          <IconCart size={22} />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </span>
        <span>{t('cart')}</span>
      </NavLink>
      <NavLink to="/orders" className={cls}>
        <IconReceipt size={22} />
        <span>{t('orders')}</span>
      </NavLink>
      <NavLink to="/profile" className={cls}>
        <IconUser size={22} />
        <span>{t('profile')}</span>
      </NavLink>
    </nav>
  )
}
