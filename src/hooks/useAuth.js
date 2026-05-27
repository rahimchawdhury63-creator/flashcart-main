// ============================================================
// FlashCart — useAuth Custom Hook
// Clean interface for components to access auth state.
// Usage: const { user, isLoggedIn, handleLogout } = useAuth();
// Developer: Rizwan Rahim Chowdhury
// ============================================================

// React's useContext hook to consume the AuthContext
import { useContext } from 'react';

// Import the AuthContext created in AuthContext.jsx
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth
 * Custom hook that provides access to the authentication context.
 * Must be used inside a component wrapped by AuthProvider.
 *
 * Throws a descriptive error if used outside AuthProvider
 * — helps developers catch misconfiguration immediately.
 *
 * @returns {object} Complete auth context value
 *
 * @example
 * // Basic usage — check if logged in
 * const { isLoggedIn, user } = useAuth();
 *
 * @example
 * // Login with Google
 * const { handleGoogleLogin, actionLoading } = useAuth();
 * const login = async () => {
 *   const result = await handleGoogleLogin();
 *   if (result) navigate('/');
 * };
 *
 * @example
 * // Protect a page
 * const { authLoading, isLoggedIn } = useAuth();
 * if (authLoading) return <Loader />;
 * if (!isLoggedIn) return <Navigate to="/login" />;
 */
const useAuth = () => {
  // Consume the AuthContext
  const context = useContext(AuthContext);

  // If context is null, the hook was used outside AuthProvider
  // This is a developer error — throw a clear message
  if (!context) {
    throw new Error(
      '[FlashCart useAuth] useAuth() must be used within an AuthProvider. ' +
      'Wrap your application root with <AuthProvider> in App.jsx or main.jsx.'
    );
  }

  // Return the full context value
  return context;
};

export default useAuth;
