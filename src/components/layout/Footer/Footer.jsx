// ============================================================
// FlashCart — Footer Component
// Fully bilingual footer with attribution, links, and branding.
// Attribution to Rizwan Rahim Chowdhury + BSDC is required.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

import React from 'react';

// React Router link
import { Link } from 'react-router-dom';

// Language hook
import useLanguage from '../../../hooks/useLanguage';

// SVG Icon
import SVGIcon from '../../common/SVGIcon/SVGIcon';

// Constants
import { SITE_META, PORTAL_URLS } from '../../../utils/constants';

// Styles
import './Footer.css';

/**
 * Footer
 * Main customer portal footer.
 * Displays: links, attribution, language info, copyright.
 */
const Footer = () => {

  // Language hook for translations
  const { t, currentLanguage, changeLanguage, availableLanguages, LANGUAGES } = useLanguage();

  // Current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fc-footer" role="contentinfo">
      <div className="footer-container">

        {/* ── TOP SECTION ─────────────────────────────── */}
        <div className="footer-top">

          {/* Brand Column */}
          <div className="footer-brand">
            {/* Logo */}
            <div className="footer-logo">
              <SVGIcon name="flashcart-logo" size={40} ariaHidden />
              <span className="footer-logo-text">FlashCart</span>
            </div>

            {/* Tagline */}
            <p className="footer-tagline">
              {t('footer.tagline')}
            </p>

            {/* Attribution — MANDATORY */}
            <div className="footer-attribution">
              <p className="footer-dev">
                Developed by{' '}
                <strong>{SITE_META.developer}</strong>
              </p>
              <p className="footer-org">
                {t('footer.madeWith')}{' '}
                <span aria-hidden="true" className="footer-heart">
                  {/* Heart SVG instead of emoji */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#DC2626"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </span>
                {' '}{t('footer.madeIn')}
              </p>
              <a
                href={SITE_META.orgURL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-org-link"
                aria-label={`${SITE_META.organization} - opens in new tab`}
              >
                {SITE_META.organization}
              </a>
            </div>
          </div>

          {/* Customer Service Links */}
          <nav className="footer-nav-column" aria-label="Customer service links">
            <h3 className="footer-nav-title">
              {t('footer.customerService')}
            </h3>
            <ul className="footer-nav-list">
              <li>
                <Link to="/orders" className="footer-nav-link">
                  {t('nav.orders')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-nav-link">
                  {t('profile.title')}
                </Link>
              </li>
              <li>
                <a
                  href={`${PORTAL_URLS.docs}/customer`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  {t('footer.docs')}
                </a>
              </li>
              <li>
                <Link to="/search" className="footer-nav-link">
                  {t('nav.search')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* For Business Links */}
          <nav className="footer-nav-column" aria-label="Business partner links">
            <h3 className="footer-nav-title">
              {t('footer.forBusiness')}
            </h3>
            <ul className="footer-nav-list">
              <li>
                <a
                  href={`${PORTAL_URLS.partner}/register`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  {t('footer.becomePartner')}
                </a>
              </li>
              <li>
                <a
                  href={PORTAL_URLS.partner}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  {t('footer.partnerPortal')}
                </a>
              </li>
              <li>
                <a
                  href={`${PORTAL_URLS.docs}/partner`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  {t('partner.onboardingTitle')}
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal Links */}
          <nav className="footer-nav-column" aria-label="Legal links">
            <h3 className="footer-nav-title">
              {t('footer.legal')}
            </h3>
            <ul className="footer-nav-list">
              <li>
                <Link to="/terms" className="footer-nav-link">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-nav-link">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-nav-link">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        {/* ── DIVIDER ──────────────────────────────────── */}
        <div className="footer-divider" role="separator" />

        {/* ── BOTTOM SECTION ───────────────────────────── */}
        <div className="footer-bottom">

          {/* Copyright */}
          <p className="footer-copyright">
            &copy; {currentYear} FlashCart.{' '}
            {t('footer.allRights')}
          </p>

          {/* Language Switcher */}
          <div className="footer-language-switcher" role="group" aria-label="Language selection">
            <SVGIcon name="settings" size={14} ariaHidden />
            <span className="footer-language-label">{t('nav.language')}:</span>

            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`footer-lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => changeLanguage(lang.code)}
                aria-pressed={currentLanguage === lang.code}
                aria-label={`Switch to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Portals */}
          <div className="footer-portals">
            <a
              href={PORTAL_URLS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-portal-link"
            >
              <SVGIcon name="info" size={14} ariaHidden />
              Docs
            </a>
            <a
              href={PORTAL_URLS.partner}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-portal-link"
            >
              <SVGIcon name="analytics" size={14} ariaHidden />
              Partner
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
