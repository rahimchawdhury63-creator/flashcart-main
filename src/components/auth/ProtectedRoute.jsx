/**
 * =============================================================================
 * FLASHCART — Protected Route Component
 * =============================================================================
 *
 * Purpose: HOC that guards routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * Shows loading state while initial auth check is in progress.
 *
 * Optionally requires email verification.
 *
 * Usage:
 *   <Route path="/profile" element={
 *     <ProtectedRoute>
 *       <UserProfile />
 *     </ProtectedRoute>
 *   } />
 *
 *   <ProtectedRoute requireEmailVerified={true}>
 *     <SensitivePage />
 *   </ProtectedRoute>
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

/**
 * ProtectedRoute Component
 *
 * @param {object} props
 * @param {React.ReactNode} props.children — Protected content
 * @param {boolean} props.requireEmailVerified — Require email verification (default: false)
 * @param {string} props.redirectTo — Where to redirect if not authenticated (default: /login)
 */
const ProtectedRoute = ({
  children,
  requireEmailVerified = false,
  redirectTo = '/login'
}) => {
  const { currentUser, loading, isEmailVerified } = useAuth();
  const location = useLocation();

  /* Show loading state during initial auth check */
  if (loading) {
    return (
      <div className="loader-fullpage">
        <div className="spinner spinner-lg" aria-label="Loading authentication" />
      </div>
    );
  }

  /* Redirect to login if not authenticated */
  if (!currentUser) {
    /* Save the attempted URL so we can redirect back after login */
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  /* Optionally require email verification */
  if (requireEmailVerified && !isEmailVerified) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} replace />;
  }

  /* User is authenticated — render protected content */
  return children;
};

export default ProtectedRoute;
