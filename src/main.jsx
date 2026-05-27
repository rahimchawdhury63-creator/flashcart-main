/**
 * =============================================================================
 * FLASHCART MAIN — Application Entry Point
 * =============================================================================
 * 
 * Purpose: Bootstrap the React application.
 * 
 * This file:
 * 1. Creates the React root and renders the App component
 * 2. Wraps the app in HelmetProvider for SEO meta tag management
 * 3. Wraps the app in BrowserRouter for client-side routing
 * 4. Registers the service worker for PWA functionality
 * 5. Imports global CSS styles
 * 
 * The rendering order ensures that all context providers are available
 * to every component in the tree:
 * 
 *   HelmetProvider (SEO)
 *     └── BrowserRouter (Routing)
 *           └── App (Main application with all other providers)
 * 
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

/* --- React Imports --- */
import React from 'react';
import ReactDOM from 'react-dom/client';

/* --- Router Import --- */
import { BrowserRouter } from 'react-router-dom';

/* --- SEO Provider Import --- */
import { HelmetProvider } from 'react-helmet-async';

/* --- Main App Component --- */
import App from './App';

/* --- Global Styles --- */
/* Import order matters: variables first, then reset/global, then components */
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/animations.css';
import './styles/fabric-overrides.css';

/**
 * Create React Root
 * StrictMode enables additional development checks and warnings.
 * In production builds, StrictMode has no performance impact.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* HelmetProvider: Manages <head> meta tags for SEO across all pages */}
    <HelmetProvider>
      {/* BrowserRouter: Enables clean URL routing (/store/name, /orders, etc.) */}
      <BrowserRouter>
        {/* App: Main application component with all routes and providers */}
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

/**
 * =============================================================================
 * SERVICE WORKER REGISTRATION
 * =============================================================================
 * Register the service worker for PWA functionality:
 * - Offline support with cached pages
 * - Background sync for offline orders
 * - App install prompt
 * - Push notifications (partner portal only)
 * 
 * We register after the app renders to avoid blocking the initial paint.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[FlashCart] Service Worker registered:', registration.scope);

        /* Check for service worker updates periodically (every 60 minutes) */
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        /* Listen for service worker update found */
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                /* New service worker is installed and waiting */
                /* Dispatch custom event for UpdatePrompt component to handle */
                window.dispatchEvent(new CustomEvent('swUpdateAvailable', {
                  detail: { registration }
                }));
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('[FlashCart] Service Worker registration failed:', error);
      });
  });
}

/**
 * =============================================================================
 * PERFORMANCE MONITORING
 * =============================================================================
 * Track Core Web Vitals for performance optimization.
 * These metrics are logged to console in development and can be
 * sent to an analytics service in production.
 */
if (import.meta.env.DEV) {
  /* Log performance metrics in development */
  const reportWebVitals = (metric) => {
    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms`);
  };

  /* Observe LCP (Largest Contentful Paint) */
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportWebVitals({ name: 'LCP', value: lastEntry.startTime });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      /* Observe CLS (Cumulative Layout Shift) */
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        reportWebVitals({ name: 'CLS', value: clsValue * 1000 });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      /* PerformanceObserver not supported for this metric */
    }
  }
}
