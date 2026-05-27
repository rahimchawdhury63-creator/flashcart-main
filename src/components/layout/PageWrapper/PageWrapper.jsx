// ============================================================
// FlashCart — PageWrapper Component
// Consistent layout wrapper for every page.
// Handles: skip navigation, main content area, padding for
// fixed header and bottom nav, SEO semantic structure.
// Every page MUST be wrapped with this component.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React from 'react';

// SEO meta tags
import MetaTags from '../../seo/MetaTags';

// Page styles
import './PageWrapper.css';

/**
 * PageWrapper
 * Layout wrapper providing consistent structure for all pages.
 *
 * @param {node}     children      - Page content
 * @param {string}   className     - Additional CSS classes
 * @param {boolean}  hasHeader     - Whether page has the fixed header (most do)
 * @param {boolean}  hasBottomNav  - Whether to add bottom nav padding (mobile)
 * @param {boolean}  noPadding     - Remove default horizontal padding
 * @param {object}   seo           - SEO props passed to MetaTags
 * @param {boolean}  fullWidth     - Remove max-width constraint
 */
const PageWrapper = ({
  children,
  className = '',
  hasHeader = true,
  hasBottomNav = true,
  noPadding = false,
  seo = {},
  fullWidth = false,
}) => {

  // Build class names
  const mainClasses = [
    'fc-page-wrapper',
    hasHeader ? 'has-header' : '',
    hasBottomNav ? 'has-bottom-nav' : '',
    noPadding ? 'no-padding' : '',
    fullWidth ? 'full-width' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* SEO Meta Tags — injected into <head> */}
      {Object.keys(seo).length > 0 && (
        <MetaTags {...seo} />
      )}

      {/* Skip to main content link — accessibility */}
      {/* Only visible on keyboard focus */}
      <a href="#main-content" className="skip-to-main">
        Main content-এ যান / Skip to main content
      </a>

      {/* Main page content area */}
      <main
        id="main-content"          // Target for skip link
        className={mainClasses}
        role="main"                 // ARIA landmark for screen readers
      >
        {children}
      </main>
    </>
  );
};

export default PageWrapper;
