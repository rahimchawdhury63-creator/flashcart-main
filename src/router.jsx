// ============================================================
// FlashCart — Main Portal Router
// All route definitions with:
// - Lazy loading for code splitting (reduces initial bundle)
// - Protected routes for authenticated pages
// - SEO-friendly URL structure
// - Error boundaries per route
//
// URL STRUCTURE:
// /                      → Homepage
// /store/:slug           → Store landing page (partner's free website)
// /store/:slug/item/:itemSlug → Individual item page
// /category/:category    → Category listing
// /search                → Search results
// /cart                  → Shopping cart
// /checkout              → Checkout
// /order/:orderId        → Order tracking
// /orders                → Order history
// /profile               → User profile
// /login                 → Login
// /register              → Register
// /forgot-password       → Password reset
// /verify-email          → Email verification
// /404                   → Not found
//
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React lazy for code splitting — each route is a separate chunk
import React, { lazy, Suspense } from 'react';

// React Router v6 — createBrowserRouter for modern routing
import {
  createBrowserRouter,   // Creates the router with all routes
  Navigate,              // Redirect component
  useLocation,           // Get current URL location
} from 'react-router-dom';

// Root App component (contains all providers)
import App from './App';

// Auth hook for protected routes
import useAuth from './hooks/useAuth';

// Loader component for Suspense fallback
import Loader from './components/common/Loader/Loader';

// ── LAZY LOADED PAGE COMPONENTS ───────────────────────────
// Each page is loaded only when first visited
// React.lazy() + dynamic import() = automatic code splitting
// Vite creates separate chunks for each lazy-loaded component

// Main pages
const HomePage          = lazy(() => import('./pages/Home/index'));
const StoreListingPage  = lazy(() => import('./pages/StoreListing/index'));
const StoreDetailPage   = lazy(() => import('./pages/StoreDetail/index'));
const ItemDetailPage    = lazy(() => import('./pages/ItemDetail/index'));
const CategoryPage      = lazy(() => import('./pages/Category/index'));
const SearchPage        = lazy(() => import('./pages/Search/index'));

// Cart and checkout
const CartPage          = lazy(() => import('./pages/Cart/index'));
const CheckoutPage      = lazy(() => import('./pages/Checkout/index'));

// Orders
const OrderTrackingPage = lazy(() => import('./pages/OrderTracking/index'));
const OrderHistoryPage  = lazy(() => import('./pages/OrderHistory/index'));

// User account
const ProfilePage       = lazy(() => import('./pages/Profile/index'));

// Authentication pages
const LoginPage         = lazy(() => import('./pages/Auth/Login/index'));
const RegisterPage      = lazy(() => import('./pages/Auth/Register/index'));
const ForgotPasswordPage= lazy(() => import('./pages/Auth/ForgotPassword/index'));
const EmailVerifyPage   = lazy(() => import('./pages/Auth/EmailVerification/index'));

// Error page
const NotFoundPage      = lazy(() => import('./pages/NotFound/index'));

// ── SUSPENSE WRAPPER ───────────────────────────────────────
// Wraps each lazy page with a loading fallback
const LazyPage = ({ children }) => (
  <Suspense fallback={<Loader fullScreen message="পেজ লোড হচ্ছে..." />}>
    {children}
  </Suspense>
);

// ── PROTECTED ROUTE COMPONENT ──────────────────────────────

/**
 * ProtectedRoute
 * Guards a route — redirects to login if not authenticated.
 * Preserves the intended destination for post-login redirect.
 *
 * @param {node} children - The protected page component
 * @param {boolean} requireEmailVerified - Whether email must be verified
 */
const ProtectedRoute = ({ children, requireEmailVerified = false }) => {
  const location = useLocation();
  const { isLoggedIn, isEmailVerified, authLoading } = useAuth();

  // Show loader while Firebase Auth initializes
  // Without this, there's a flash of the login page before auth resolves
  if (authLoading) {
    return <Loader fullScreen message="লোড হচ্ছে..." />;
  }

  // Not logged in → redirect to login
  // Save current location so we can redirect back after login
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}  // Saved for post-login redirect
        replace                      // Don't add to browser history
      />
    );
  }

  // Email not verified → redirect to verification page
  if (requireEmailVerified && !isEmailVerified) {
    return (
      <Navigate
        to="/verify-email"
        replace
      />
    );
  }

  // Authenticated — render the protected page
  return children;
};

// ── PUBLIC ONLY ROUTE ──────────────────────────────────────

/**
 * PublicOnlyRoute
 * For auth pages — redirects logged-in users away.
 * Prevents logged-in users from seeing login/register pages.
 *
 * @param {node} children - The auth page component
 */
const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useAuth();

  // Wait for auth to initialize
  if (authLoading) {
    return <Loader fullScreen message="লোড হচ্ছে..." />;
  }

  // Already logged in → redirect to home
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Not logged in — show the auth page
  return children;
};

// ── ROUTER CONFIGURATION ───────────────────────────────────

/**
 * router
 * The complete routing configuration using createBrowserRouter.
 * This is the modern React Router v6.4+ pattern.
 * Provides better error handling than BrowserRouter.
 */
const router = createBrowserRouter([
  {
    // Root route — renders App (with all providers) as layout
    path: '/',
    element: <App />,

    // errorElement shown when any child route throws an error
    errorElement: (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{ fontSize: '24px', color: '#111827', marginBottom: '16px' }}>
          পেজ লোড হয়নি / Page Load Error
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
          কিছু সমস্যা হয়েছে। / Something went wrong.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 24px',
            background: '#1B5E20',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Home-এ যান
        </button>
      </div>
    ),

    // Child routes — rendered inside App's <Outlet />
    children: [

      // ── PUBLIC ROUTES ──────────────────────────────

      {
        // Homepage — main entry point
        index: true,   // index: true means this matches '/' exactly
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },

      {
        // Store listing — browse all stores
        path: 'stores',
        element: (
          <LazyPage>
            <StoreListingPage />
          </LazyPage>
        ),
      },

      {
        // Individual store page — partner's free SEO website
        // :slug is the store's URL-friendly identifier
        path: 'store/:slug',
        element: (
          <LazyPage>
            <StoreDetailPage />
          </LazyPage>
        ),
      },

      {
        // Individual item/product page
        // Nested under store for proper SEO hierarchy
        path: 'store/:slug/item/:itemSlug',
        element: (
          <LazyPage>
            <ItemDetailPage />
          </LazyPage>
        ),
      },

      {
        // Category listing — restaurants, groceries, etc.
        path: 'category/:category',
        element: (
          <LazyPage>
            <CategoryPage />
          </LazyPage>
        ),
      },

      {
        // Search results
        path: 'search',
        element: (
          <LazyPage>
            <SearchPage />
          </LazyPage>
        ),
      },

      {
        // Shopping cart — accessible without login
        // (guests can add to cart, must login to checkout)
        path: 'cart',
        element: (
          <LazyPage>
            <CartPage />
          </LazyPage>
        ),
      },

      // ── AUTH ROUTES (redirect logged-in users) ──────

      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <LazyPage>
              <LoginPage />
            </LazyPage>
          </PublicOnlyRoute>
        ),
      },

      {
        path: 'register',
        element: (
          <PublicOnlyRoute>
            <LazyPage>
              <RegisterPage />
            </LazyPage>
          </PublicOnlyRoute>
        ),
      },

      {
        path: 'forgot-password',
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },

      {
        // Email verification — only for logged-in users with unverified email
        path: 'verify-email',
        element: (
          <ProtectedRoute requireEmailVerified={false}>
            <LazyPage>
              <EmailVerifyPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },

      // ── PROTECTED ROUTES (must be logged in) ────────

      {
        // Checkout — requires login
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <CheckoutPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },

      {
        // Single order tracking — requires login
        path: 'order/:orderId',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <OrderTrackingPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },

      {
        // Order history — requires login
        path: 'orders',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <OrderHistoryPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },

      {
        // User profile — requires login
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <ProfilePage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },

      // ── ERROR ROUTES ──────────────────────────────

      {
        // Explicit 404 path
        path: '404',
        element: (
          <LazyPage>
            <NotFoundPage />
          </LazyPage>
        ),
      },

      {
        // Catch-all — any unmatched URL goes to 404
        // * matches everything not matched above
        path: '*',
        element: (
          <LazyPage>
            <NotFoundPage />
          </LazyPage>
        ),
      },
    ],
  },
]);

export default router;
