// ============================================================
// FlashCart — Main Customer Portal Entry Point
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community (bsdc.info.bd)
// ============================================================

// Import React 18 core — required for JSX
import React from 'react';

// Import React 18 createRoot — the new concurrent rendering API
// replaces ReactDOM.render() which is deprecated in React 18
import { createRoot } from 'react-dom/client';

// Import React Router — BrowserRouter provides URL-based navigation
// Uses the browser History API for clean URLs without # hashes
import { BrowserRouter } from 'react-router-dom';

// Import React Helmet Async provider
// HelmetProvider must wrap the entire app to enable dynamic meta tags
// on every route — this is the core of our SEO strategy
import { HelmetProvider } from 'react-helmet-async';

// Import the root App component
// App.jsx contains all providers and the router configuration
import App from './App';

// ── GLOBAL STYLES ────────────────────────────────────────────
// Import in correct order — tokens first, then global, then utilities
// This order ensures CSS custom properties are defined before use

// Design tokens — CSS custom properties (--fc-primary, etc.)
import './styles/design-tokens.css';

// CSS reset + base global styles
import './styles/global.css';

// Typography styles — font sizes, line heights, headings
import './styles/typography.css';

// Utility classes — margin, padding, flex, grid helpers
import './styles/utilities.css';

// Keyframe animations — fade, slide, bounce, pulse
import './styles/animations.css';

// Responsive utilities — breakpoint-specific helper classes
import './styles/responsive.css';

// Fabric CSS — grid and layout system
import './styles/fabric.css';

// ── STRICT MODE ───────────────────────────────────────────────
// React.StrictMode enables:
// 1. Double-invokes functions to detect side effects
// 2. Warns about deprecated lifecycle methods
// 3. Warns about legacy string ref usage
// 4. Detects unexpected side effects
// NOTE: Double-invocation only happens in development, not production

// ── ROOT ELEMENT ─────────────────────────────────────────────
// Get the DOM element with id="root" from index.html
// This is where React will mount the entire application
const rootElement = document.getElementById('root');

// Safety check — throw clear error if root element not found
// This prevents confusing "Cannot read property of null" errors
if (!rootElement) {
  throw new Error(
    'FlashCart: Root element #root not found in index.html. ' +
    'Please check that index.html contains <div id="root"></div>'
  );
}

// ── CREATE REACT ROOT ─────────────────────────────────────────
// createRoot enables React 18 concurrent features:
// - Automatic batching of state updates
// - Transitions API (useTransition)
// - Suspense improvements
// - Concurrent rendering for better UX
const root = createRoot(rootElement);

// ── RENDER APPLICATION ────────────────────────────────────────
// Render the application with all required providers
root.render(
  // StrictMode — development-only checks and warnings
  <React.StrictMode>

    {/* HelmetProvider — enables React Helmet Async globally */}
    {/* Every component can now use <Helmet> to set meta tags */}
    {/* helmetContext is not needed here — only for SSR */}
    <HelmetProvider>

      {/* BrowserRouter — provides URL-based routing context */}
      {/* All Link, useNavigate, useLocation hooks work inside this */}
      {/* future={{ v7_startTransition: true }} enables React Router v7 transitions */}
      <BrowserRouter
        future={{
          // Enable React Router v7 transition behavior
          v7_startTransition: true,
          // Enable relative splat path resolution (v7 behavior)
          v7_relativeSplatPath: true,
        }}
      >
        {/* App component — contains all context providers and routes */}
        <App />

      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
