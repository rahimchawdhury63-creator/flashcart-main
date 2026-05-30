// Header.jsx — Sticky top header: logo, desktop search, language switch, cart, account.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import LanguageSwitch from '../common/LanguageSwitch'
import { LogoMark, IconSearch, IconCart, IconUser } from '../svgs'

export default function Header() {
  const { t } = useLanguage()
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // Submit search -> navigate to results page with query param.
  const onSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="app-header">
      <div className="container">
        {/* Brand logo links home */}
        <Link to="/" className="app-logo" aria-label="FlashCart home">
          <span className="logo-mark"><LogoMark size={26} /></span>
          FlashCart
        </Link>

        {/* Desktop search bar */}
        <form className="header-search" onSubmit={onSearch} role="search">
          <div className="input-icon">
            <IconSearch size={18} />
            <input
              className="form-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('search')}
            />
          </div>
        </form>

        {/* Right-side actions */}
        <div className="header-actions">
          <LanguageSwitch />

          <Link to="/cart" className="icon-btn" aria-label={t('cart')}>
            <IconCart size={22} />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          <Link
            to={isLoggedIn ? '/profile' : '/login'}
            className="icon-btn"
            aria-label={isLoggedIn ? t('profile') : t('login')}
          >
            <IconUser size={22} />
          </Link>
        </div>
      </div>
    </header>
  )
}
