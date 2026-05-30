// Footer.jsx — Site footer with links and mandatory developer/community credits.
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { LogoMark } from '../svgs'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand + tagline */}
          <div>
            <div className="app-logo" style={{ marginBottom: 'var(--sp-1)' }}>
              <span className="logo-mark"><LogoMark size={24} /></span> FlashCart
            </div>
            <p style={{ opacity: 0.8, maxWidth: 320 }}>{t('tagline')}</p>
            <p style={{ opacity: 0.8 }}>{t('codOnly')}</p>
          </div>

          {/* Explore links */}
          <div>
            <h4 style={{ color: '#fff' }}>{t('stores')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
              <li><Link to="/stores">{t('stores')}</Link></li>
              <li><Link to="/search">{t('search')}</Link></li>
              <li><Link to="/orders">{t('orders')}</Link></li>
            </ul>
          </div>

          {/* Partner / account links */}
          <div>
            <h4 style={{ color: '#fff' }}>{t('profile')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
              <li><Link to="/login">{t('login')}</Link></li>
              <li><Link to="/signup">{t('signup')}</Link></li>
              <li>
                <a href="https://partner.flashcart.bsdc.info.bd" target="_blank" rel="noopener noreferrer">
                  {t('becomePartner')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory credits */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            {t('developedBy')} <strong>Rizwan Rahim Chowdhury</strong>
          </p>
          <p style={{ margin: '4px 0 0' }}>
            {t('poweredBy')}{' '}
            <a href="https://www.bsdc.info.bd" target="_blank" rel="noopener noreferrer">
              Bangladesh Software Development Community
            </a>
          </p>
          <p style={{ margin: '4px 0 0', opacity: 0.6 }}>© {year} FlashCart Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
