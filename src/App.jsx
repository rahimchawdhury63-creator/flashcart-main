// ============================================================
// FlashCart — Main Customer Portal Root Component
// Wires all context providers in the correct dependency order.
// Provider order matters — inner providers can access outer ones.
//
// Provider Order (outer to inner):
// 1. HelmetProvider — already in main.jsx (Step 2)
// 2. BrowserRouter — already in main.jsx
// 3. LanguageProvider — language must be available to AuthProvider
// 4. AuthProvider — auth state for all pages
// 5. CartProvider — cart needs auth for sync
// 6. LocationProvider — location for store discovery
// 7. ThemeProvider — theme preferences
// 8. RouterOutlet — actual page components
//
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React core
import React, {
  Suspense,         // Lazy loading boundary
  Component,        // Class component for error boundary
} from 'react';

// React Router — outlet for nested routes
import { Outlet } from 'react-router-dom';

// Context providers
import { AuthProvider }     from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider }     from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider }    from './context/ThemeContext';

// Loading component for Suspense fallback
import Loader from './components/common/Loader/Loader';

// ── ERROR BOUNDARY CLASS COMPONENT ────────────────────────
// React error boundaries MUST be class components
// They catch JavaScript errors anywhere in the child tree
// and display a fallback UI instead of crashing the whole app

/**
 * ErrorBoundary
 * Catches runtime errors in the component tree.
 * Prevents the entire app from crashing on one page error.
 */
class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    // State tracks whether an error has been caught
    this.state = {
      hasError: false,     // Whether error occurred
      error: null,         // The actual error object
      errorInfo: null,     // React component stack info
    };
  }

  // Called when a descendant component throws an error
  // Updates state to trigger the fallback render
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  // Called after error is caught — for logging
  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[FlashCart ErrorBoundary] Caught error:', error);
      console.error('[FlashCart ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // Store errorInfo for display
    this.setState({ errorInfo });

    // In production: send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  // Reset the error state — allows user to retry
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    // If error occurred, show fallback UI
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: '#F9FAFB',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
          role="alert"
          aria-live="assertive"
        >
          {/* Error icon — inline SVG, no external dependency */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '24px' }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>

          {/* Error heading */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px',
          }}>
            কিছু সমস্যা হয়েছে
          </h1>

          {/* Error subtext */}
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            marginBottom: '8px',
            maxWidth: '400px',
          }}>
            Something went wrong. আবার চেষ্টা করুন।
          </p>

          {/* Error details in development only */}
          {import.meta.env.DEV && this.state.error && (
            <details style={{
              marginBottom: '24px',
              padding: '12px',
              background: '#FEE2E2',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'left',
              fontSize: '12px',
              color: '#DC2626',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Retry button */}
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                background: '#1B5E20',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              আবার চেষ্টা করুন
            </button>

            {/* Go home button */}
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#1B5E20',
                border: '2px solid #1B5E20',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Home-এ যান
            </button>
          </div>

          {/* Attribution */}
          <p style={{
            marginTop: '48px',
            fontSize: '12px',
            color: '#9CA3AF',
          }}>
            FlashCart — Powered by Bangladesh Software Development Community
          </p>
        </div>
      );
    }

    // No error — render children normally
    return this.props.children;
  }
}

// ── SUSPENSE FALLBACK ──────────────────────────────────────
// Shown while lazy-loaded route components are loading
const SuspenseFallback = () => (
  <Loader
    fullScreen
    message="লোড হচ্ছে... / Loading..."
  />
);

// ── ROOT APP COMPONENT ─────────────────────────────────────

/**
 * App
 * Root component that wraps the entire application.
 * Sets up all context providers and error boundaries.
 * The actual routing is handled by router.jsx.
 */
const App = () => {
  return (
    // Error boundary wraps everything — catches any uncaught errors
    <ErrorBoundary>

      {/* Language provider — must be outermost for i18n to work everywhere */}
      <LanguageProvider>

        {/* Auth provider — depends on nothing, provides user state */}
        <AuthProvider>

          {/* Location provider — uses auth for saved addresses */}
          <LocationProvider>

            {/* Cart provider — uses auth for cart sync, location for delivery */}
            <CartProvider>

              {/* Theme provider — wraps everything for consistent theming */}
              <ThemeProvider>

                {/* Suspense boundary for lazy-loaded routes */}
                {/* Shows SuspenseFallback while route chunks load */}
                <Suspense fallback={<SuspenseFallback />}>

                  {/* Outlet renders the matched route component */}
                  {/* This works because App is used as a layout route in router.jsx */}
                  <Outlet />

                </Suspense>

              </ThemeProvider>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
