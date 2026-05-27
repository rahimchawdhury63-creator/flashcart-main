// ============================================================
// FlashCart — Main Customer Portal Entry Point
// CORRECTED VERSION — replaces Step 2 main.jsx
//
// CHANGE FROM STEP 2:
// Step 2 used BrowserRouter wrapping App directly.
// Step 11 introduced createBrowserRouter + RouterProvider.
// These two router patterns cannot coexist.
// This file now uses RouterProvider with the router from router.jsx.
// BrowserRouter has been removed entirely from this file.
//
// The router.jsx file contains createBrowserRouter which:
// 1. Internally creates its own BrowserRouter equivalent
// 2. Provides the Outlet for nested routes
// 3. Handles all route definitions with lazy loading
// 4. Provides better error handling than BrowserRouter
//
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community (bsdc.info.bd)
// ============================================================

// React 18 core — required for JSX and hooks
import React from 'react';

// React 18 createRoot — concurrent rendering API
// Replaces the old ReactDOM.render() which is deprecated
import { createRoot } from 'react-dom/client';

// RouterProvider — the component that renders the router
// created by createBrowserRouter in router.jsx
// This REPLACES BrowserRouter from Step 2
import { RouterProvider } from 'react-router-dom';

// React Helmet Async Provider — enables <Helmet> in all components
// Must wrap the entire app so all pages can inject meta tags
// Kept here because it wraps RouterProvider (outside all routes)
import { HelmetProvider } from 'react-helmet-async';

// The router configuration from router.jsx
// Contains all routes, lazy loading, protected routes, etc.
// createBrowserRouter was called in router.jsx — we just use its result
import router from './router';

// ── GLOBAL STYLES (same order as Step 2) ─────────────────────

// 1. Design tokens FIRST — defines all CSS custom properties
//    All other stylesheets reference these variables
import './styles/design-tokens.css';

// 2. Global reset and base element styles
//    Normalizes browser defaults (margin, padding, box-sizing)
import './styles/global.css';

// 3. Typography — font sizes, line heights, heading scales
import './styles/typography.css';

// 4. Utility classes — flex, grid, spacing, color helpers
import './styles/utilities.css';

// 5. Animation keyframes — all @keyframes definitions
import './styles/animations.css';

// 6. Responsive utilities — breakpoint-specific helper classes
import './styles/responsive.css';

// 7. Fabric CSS — 12-column grid system and layout utilities
import './styles/fabric.css';

// ── ROOT ELEMENT ──────────────────────────────────────────────

// Get the DOM element where React mounts
// This is the <div id="root"> in index.html
const rootElement = document.getElementById('root');

// Safety check — fail fast with a clear error message
// Prevents the confusing "Cannot read properties of null" error
if (!rootElement) {
  throw new Error(
    '[FlashCart] Root element #root not found in index.html. ' +
    'Ensure index.html contains <div id="root"></div> in the body.'
  );
}

// ── CREATE REACT 18 CONCURRENT ROOT ──────────────────────────

// createRoot enables React 18 features:
// - Concurrent rendering (smoother UI updates)
// - Automatic batching (fewer re-renders)
// - Suspense improvements (better lazy loading)
// - useTransition and useDeferredValue hooks
const root = createRoot(rootElement);

// ── RENDER THE APPLICATION ────────────────────────────────────

root.render(
  // StrictMode — development-only helper
  // Double-invokes render functions to detect side effects
  // Warns about deprecated APIs and lifecycle methods
  // Has ZERO impact on production builds
  <React.StrictMode>

    {/* HelmetProvider — must be the outermost wrapper */}
    {/* Enables React Helmet Async on every route */}
    {/* Every page component can now use <Helmet> to set meta tags */}
    {/* This is the core of our SEO strategy */}
    <HelmetProvider>

      {/* RouterProvider replaces BrowserRouter from Step 2 */}
      {/* It receives the complete router configuration */}
      {/* from createBrowserRouter defined in router.jsx */}
      {/* RouterProvider handles: */}
      {/* - URL matching to route components */}
      {/* - Navigation (Link, useNavigate) */}
      {/* - Route params (useParams) */}
      {/* - Location state (useLocation) */}
      {/* - Error boundaries per route */}
      {/* - Lazy loading with Suspense */}
      <RouterProvider
        router={router}

        // fallbackElement shown while the router initializes
        // This is different from Suspense — it's the router's own loading
        // Usually resolves in < 50ms so users rarely see it
        fallbackElement={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: '#FAFAFA',
              fontFamily: 'Inter, sans-serif',
            }}
            role="status"
            aria-label="Application loading"
          >
            {/* Simple inline spinner — no external dependencies needed */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid #E8F5E9',
                borderTopColor: '#1B5E20',
                animation: 'spin 0.8s linear infinite',
              }}
              aria-hidden="true"
            />

            {/* Inline keyframes for the spinner */}
            {/* Cannot use animation.css here — styles not loaded yet */}
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }
      />

    </HelmetProvider>
  </React.StrictMode>
);
