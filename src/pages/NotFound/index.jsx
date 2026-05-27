// ============================================================
// FlashCart — 404 Not Found Page
// SEO-optimized 404 page with helpful navigation.
// Suggests popular pages to keep users engaged.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Language hook
import useLanguage from '../../hooks/useLanguage';

// SEO hook
import useSEO from '../../hooks/useSEO';

// Components
import Button from '../../components/common/Button/Button';
import SVGIcon from '../../components/common/SVGIcon/SVGIcon';

// Constants
import { PORTAL_URLS } from '../../utils/constants';
import { PARTNER_CATEGORIES, getPopularCategories } from '../../data/categories';

// Styles
import './NotFound.css';

/**
 * NotFoundPage
 * Displayed for any URL that doesn't match a known route.
 * Provides helpful navigation to bring users back.
 */
const NotFoundPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // SEO data for 404 page
  const seo = useSEO('404');

  // Countdown for auto-redirect
  const [countdown, setCountdown] = useState(0); // 0 = no auto-redirect

  // The path that wasn't found (for display)
  const notFoundPath = location.pathname;

  // Popular categories to suggest
  const popularCategories = getPopularCategories().slice(0, 4);

  // ── QUICK LINKS ──────────────────────────────────────
  const quickLinks = [
    {
      label: 'Home',
      labelBn: 'হোম',
      href: '/',
      icon: 'home',
      description: 'কাছের দোকান দেখুন',
    },
    {
      label: 'Search',
      labelBn: 'খুঁজুন',
      href: '/search',
      icon: 'search',
      description: 'রেস্টুরেন্ট, খাবার খুঁজুন',
    },
    {
      label: 'Orders',
      labelBn: 'অর্ডার',
      href: '/orders',
      icon: 'orders',
      description: 'আপনার অর্ডার দেখুন',
    },
    {
      label: 'Partner Portal',
      labelBn: 'পার্টনার পোর্টাল',
      href: PORTAL_URLS.partner,
      icon: 'analytics',
      description: 'ব্যবসা শুরু করুন',
      external: true,
    },
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>404 — Page Not Found | FlashCart Bangladesh</title>
        <meta
          name="description"
          content="This page could not be found on FlashCart. Go back to browse restaurants, groceries, and medicines in Bangladesh."
        />
        {/* Noindex — 404 pages should not be indexed */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="not-found-page">
        <div className="not-found-container">

          {/* ── 404 VISUAL ─────────────────────────────── */}
          <div className="not-found-visual" aria-hidden="true">
            {/* Large 404 text */}
            <div className="not-found-number">
              <span>4</span>
              {/* Cart icon as the middle 0 */}
              <span className="not-found-cart-icon">
                <SVGIcon
                  name="cart"
                  size={64}
                  color="var(--fc-primary-pale)"
                  ariaHidden
                />
              </span>
              <span>4</span>
            </div>
          </div>

          {/* ── ERROR MESSAGE ───────────────────────────── */}
          <div className="not-found-content">
            <h1 className="not-found-title">
              {t('errors.notFound')}
            </h1>

            <p className="not-found-message">
              {t('errors.notFoundMsg')}
            </p>

            {/* Show the path that wasn't found */}
            {notFoundPath && notFoundPath !== '/' && (
              <p className="not-found-path" aria-label={`Attempted URL: ${notFoundPath}`}>
                <code>{notFoundPath}</code>
              </p>
            )}
          </div>

          {/* ── PRIMARY ACTIONS ─────────────────────────── */}
          <div className="not-found-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
              icon="home"
            >
              {t('errors.goHome')}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              icon="arrow-left"
            >
              পিছনে যান / Go Back
            </Button>
          </div>

          {/* ── QUICK LINKS ─────────────────────────────── */}
          <div className="not-found-quick-links">
            <h2 className="not-found-section-title">
              জনপ্রিয় পেজ / Popular Pages
            </h2>

            <div className="not-found-links-grid">
              {quickLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="not-found-link-card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="not-found-link-icon">
                      <SVGIcon name={link.icon} size={24} color="var(--fc-primary)" ariaHidden />
                    </span>
                    <span className="not-found-link-text">
                      <strong>{link.labelBn}</strong>
                      <small>{link.description}</small>
                    </span>
                    <SVGIcon name="chevron-right" size={16} color="var(--fc-gray-400)" ariaHidden />
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="not-found-link-card"
                  >
                    <span className="not-found-link-icon">
                      <SVGIcon name={link.icon} size={24} color="var(--fc-primary)" ariaHidden />
                    </span>
                    <span className="not-found-link-text">
                      <strong>{link.labelBn}</strong>
                      <small>{link.description}</small>
                    </span>
                    <SVGIcon name="chevron-right" size={16} color="var(--fc-gray-400)" ariaHidden />
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* ── CATEGORY LINKS ───────────────────────────── */}
          <div className="not-found-categories">
            <h2 className="not-found-section-title">
              বিভাগ দেখুন / Browse Categories
            </h2>

            <div className="not-found-category-chips">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="not-found-category-chip"
                >
                  <SVGIcon name={cat.icon} size={16} ariaHidden />
                  <span>{cat.labelBn}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── PARTNER CTA ──────────────────────────────── */}
          <div className="not-found-partner-cta">
            <p>
              ব্যবসার মালিক?{' '}
              <a
                href={`${PORTAL_URLS.partner}/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="not-found-partner-link"
              >
                বিনামূল্যে পার্টনার হোন
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
