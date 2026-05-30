// App.jsx — Partner Portal root: providers, protected routing, shell, notifications.

import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { OrderProvider } from './contexts/OrderContext'

import PartnerSidebar from './components/layout/PartnerSidebar'
import PartnerHeader from './components/layout/PartnerHeader'
import PartnerMobileNav from './components/layout/PartnerMobileNav'
import NotificationBanner from './components/layout/NotificationBanner'
import PermissionPrompt from './components/common/PermissionPrompt'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import { useAuth } from './hooks/useAuth'

// Lazy-loaded pages (route-based code splitting).
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const AddItemPage = lazy(() => import('./pages/AddItemPage'))
const EditItemPage = lazy(() => import('./pages/EditItemPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const GuidePage = lazy(() => import('./pages/GuidePage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))

// Legacy safety net for any cached sessionStorage redirect. Routing now uses
// public/_redirects (200 rewrite), so this is a no-op for fresh sessions.
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

// Scroll to top on route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Maps the current path to a header title.
function useTitle() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/orders')) return 'Orders'
  if (pathname.startsWith('/menu')) return 'Menu'
  if (pathname.startsWith('/settings')) return 'Settings'
  if (pathname.startsWith('/analytics')) return 'Analytics'
  if (pathname.startsWith('/certificates')) return 'Certificates'
  if (pathname.startsWith('/reviews')) return 'Reviews'
  if (pathname.startsWith('/profile')) return 'Profile'
  if (pathname.startsWith('/notifications')) return 'Notifications'
  if (pathname.startsWith('/guide')) return 'Setup Guide'
  return 'Dashboard'
}

// The authenticated app shell with sidebar + content + live notifications.
function PartnerShell() {
  const title = useTitle()
  return (
    <OrderProvider>
      <NotificationProvider>
        <div className="partner-shell">
          <PartnerSidebar />
          <div className="partner-content">
            <PartnerHeader title={title} />
            <NotificationBanner />
            <Suspense fallback={<LoadingSpinner large label="Loading..." />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/menu/add-item" element={<AddItemPage />} />
                <Route path="/menu/edit-item/:itemId" element={<EditItemPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
          <PartnerMobileNav />
        </div>
        {/* Persistent permission prompt loop (re-asks until enabled). */}
        <PermissionPrompt />
      </NotificationProvider>
    </OrderProvider>
  )
}

// Gatekeeper: shows auth pages when logged out, the shell when logged in.
function Gate() {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <LoadingSpinner large label="Loading..." />
  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner large />}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    )
  }
  return <PartnerShell />
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <RedirectHandler />
            <ScrollToTop />
            <ErrorBoundary>
              <Gate />
            </ErrorBoundary>
            <Toaster
              position="top-center"
              toastOptions={{
                style: { fontFamily: 'var(--font-primary)', fontSize: '0.9rem' },
                success: { iconTheme: { primary: '#1a6b3c', secondary: '#fff' } },
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}
