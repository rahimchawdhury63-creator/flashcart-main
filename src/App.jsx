// App.jsx — Root component: providers, router, layout shell and lazy-loaded routes.

import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LocationProvider } from './contexts/LocationContext'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MobileNav from './components/layout/MobileNav'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'

// Route-based code splitting: each page loads only when visited (better LCP).
const HomePage = lazy(() => import('./pages/HomePage'))
const StoresPage = lazy(() => import('./pages/StoresPage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const ItemPage = lazy(() => import('./pages/ItemPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderPage = lazy(() => import('./pages/OrderPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

// Handles the Cloudflare Pages 404.html SPA redirect technique.
// 404.html stores the original path in sessionStorage; we restore it here.
function RedirectHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect')
    if (redirect && redirect !== '/') {
      sessionStorage.removeItem('redirect')
      navigate(redirect, { replace: true })
    }
  }, [navigate])
  return null
}

// Scrolls to top whenever the route path changes (better UX on mobile).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HelmetProvider>
      {/* Context providers wrap the whole tree. */}
      <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <BrowserRouter>
                <RedirectHandler />
                <ScrollToTop />
                <ErrorBoundary>
                  <Header />
                  {/* Suspense fallback shows while a lazy page chunk loads. */}
                  <Suspense fallback={<LoadingSpinner large label="Loading..." />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/stores" element={<StoresPage />} />
                      <Route path="/store/:storeSlug" element={<StorePage />} />
                      <Route path="/store/:storeSlug/item/:itemSlug" element={<ItemPage />} />
                      <Route path="/category/:categorySlug" element={<CategoryPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order/:orderId" element={<OrderPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      {/* Fallback: render home for any unknown route. */}
                      <Route path="*" element={<HomePage />} />
                    </Routes>
                  </Suspense>
                  <Footer />
                  <MobileNav />
                </ErrorBoundary>

                {/* Global toast notifications. */}
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: { fontFamily: 'var(--font-primary)', fontSize: '0.9rem' },
                    success: { iconTheme: { primary: '#1a6b3c', secondary: '#fff' } },
                  }}
                />
              </BrowserRouter>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}
