// ============================================================
// FlashCart — Authentication Context
// Global auth state provider. Wraps the entire application.
// All components access auth state via useAuth() hook.
// Handles: login state, user data, loading, email verification.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React imports for context creation and hooks
import React, {
  createContext,   // Creates the context object
  useContext,      // Hook to consume context
  useState,        // Local state management
  useEffect,       // Side effects (auth listener)
  useCallback,     // Memoized callback functions
  useMemo,         // Memoized derived values
} from 'react';

// Firebase auth service functions from Step 5
import {
  onAuthStateChange,           // Subscribes to auth state changes
  logoutUser,                  // Signs out the user
  signInWithGoogle,            // Google OAuth login
  loginWithEmail,              // Email/password login
  registerWithEmail,           // Email/password registration
  sendPasswordReset,           // Password reset email
  resendEmailVerification,     // Resend verification email
  handleGoogleRedirectResult,  // Handle OAuth redirect result
  updateUserProfile,           // Update Auth profile
  waitForAuthReady,            // Wait for Firebase Auth init
} from '../services/firebase/auth';

// Firestore operations from Step 5
import {
  getUserDocument,       // Fetch user's Firestore document
  updateUserDocument,    // Update user's Firestore document
  getPartnerDocument,    // Fetch partner's Firestore document
} from '../services/firebase/firestore';

// Cookie utilities for preference persistence
import { clearAllTrackingCookies } from '../utils/cookieManager';

// ── CREATE THE AUTH CONTEXT ────────────────────────────────
// The context object — used internally by the provider
// External components use useAuth() hook, not this directly
const AuthContext = createContext(null);

// ── AUTH PROVIDER COMPONENT ────────────────────────────────

/**
 * AuthProvider
 * Wraps the entire application to provide auth state globally.
 * Must be placed above any component that needs auth state.
 * Handles the Firebase auth state listener lifecycle.
 *
 * @param {node} children - Child components to wrap
 */
export const AuthProvider = ({ children }) => {

  // ── STATE ──────────────────────────────────────────────

  // The Firebase Auth user object (or null if not logged in)
  const [user, setUser] = useState(null);

  // The Firestore user document (additional user data)
  const [userDocument, setUserDocument] = useState(null);

  // The Firestore partner document (only for partner portal users)
  const [partnerDocument, setPartnerDocument] = useState(null);

  // Whether Firebase Auth has finished initializing
  // true = Auth has responded (user or null) — safe to render
  // false = Auth is still loading — show loading screen
  const [authLoading, setAuthLoading] = useState(true);

  // Whether a specific auth action is in progress (login, register, etc.)
  // Different from authLoading — this is for button loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Error message from last auth action
  const [authError, setAuthError] = useState('');

  // Whether we're currently fetching the Firestore user document
  const [documentLoading, setDocumentLoading] = useState(false);

  // ── DERIVED STATE ──────────────────────────────────────

  // Convenient boolean — is user logged in?
  const isLoggedIn = Boolean(user);

  // Is user's email verified?
  const isEmailVerified = user?.emailVerified || false;

  // Is this user a partner? (Check if partner document exists)
  const isPartner = Boolean(partnerDocument);

  // ── USER DOCUMENT FETCHER ──────────────────────────────

  /**
   * fetchUserDocument
   * Loads the user's Firestore document after login.
   * Also fetches partner document if on partner portal.
   *
   * @param {string} uid - Firebase Auth UID
   * @param {string} portalType - 'main' | 'partner' | 'docs'
   */
  const fetchUserDocument = useCallback(async (uid, portalType = 'main') => {
    if (!uid) return;

    setDocumentLoading(true);

    try {
      // Always fetch the user document
      const userDoc = await getUserDocument(uid);
      setUserDocument(userDoc);

      // Only fetch partner document on partner portal
      // Avoids unnecessary Firestore reads on customer portal
      if (portalType === 'partner' || import.meta.env.VITE_PORTAL_TYPE === 'partner') {
        const partnerDoc = await getPartnerDocument(uid);
        setPartnerDocument(partnerDoc);
      }

    } catch (error) {
      // Non-fatal — user can still use app without Firestore doc
      console.error('[FlashCart Auth] Document fetch failed:', error.message);
    } finally {
      setDocumentLoading(false);
    }
  }, []);

  // ── FIREBASE AUTH STATE LISTENER ───────────────────────

  // Subscribe to Firebase Auth state changes on mount
  // This fires: immediately with current user, then on login/logout
  useEffect(() => {

    // Handle Google redirect result first
    // (needed when user came back from Google OAuth redirect)
    const initRedirectResult = async () => {
      try {
        await handleGoogleRedirectResult(
          import.meta.env.VITE_PORTAL_TYPE || 'customer'
        );
      } catch (error) {
        // Redirect errors are usually benign (no redirect was pending)
        if (import.meta.env.DEV) {
          console.warn('[FlashCart Auth] Redirect result:', error.message);
        }
      }
    };

    initRedirectResult();

    // Subscribe to auth state changes
    // onAuthStateChange returns an unsubscribe function
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in — update state
        setUser(firebaseUser);

        // Fetch their Firestore document
        await fetchUserDocument(firebaseUser.uid);

      } else {
        // User is logged out — clear all state
        setUser(null);
        setUserDocument(null);
        setPartnerDocument(null);
      }

      // Auth has responded — safe to render the app
      setAuthLoading(false);
    });

    // Cleanup: unsubscribe when component unmounts
    // This prevents memory leaks and stale listeners
    return () => unsubscribe();

  }, [fetchUserDocument]); // Re-run if fetchUserDocument changes (it won't)

  // ── AUTH ACTION HANDLERS ───────────────────────────────
  // These wrap the auth service functions with:
  // 1. Loading state management
  // 2. Error handling
  // 3. State updates

  /**
   * handleGoogleLogin
   * Signs in with Google OAuth.
   * Clears any previous errors before attempting.
   */
  const handleGoogleLogin = useCallback(async () => {
    setAuthError('');          // Clear previous error
    setActionLoading(true);    // Show loading state

    try {
      const result = await signInWithGoogle(
        import.meta.env.VITE_PORTAL_TYPE || 'customer'
      );

      // result is null if redirect was initiated (mobile fallback)
      // Auth state listener will handle the rest
      return result;

    } catch (error) {
      setAuthError(error.message);
      return null;
    } finally {
      setActionLoading(false); // Always stop loading
    }
  }, []);

  /**
   * handleEmailLogin
   * Signs in with email and password.
   *
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe
   */
  const handleEmailLogin = useCallback(async (email, password, rememberMe = true) => {
    setAuthError('');
    setActionLoading(true);

    try {
      const result = await loginWithEmail(email, password, rememberMe);
      return result;
    } catch (error) {
      setAuthError(error.message);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * handleRegister
   * Creates a new account with email and password.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   */
  const handleRegister = useCallback(async (email, password, displayName) => {
    setAuthError('');
    setActionLoading(true);

    try {
      const result = await registerWithEmail(
        email,
        password,
        displayName,
        import.meta.env.VITE_PORTAL_TYPE || 'customer'
      );
      return result;
    } catch (error) {
      setAuthError(error.message);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * handleLogout
   * Signs out the current user.
   * Clears all tracking cookies for privacy.
   */
  const handleLogout = useCallback(async () => {
    setActionLoading(true);

    try {
      await logoutUser();

      // Clear tracking cookies on logout for privacy
      clearAllTrackingCookies();

      // Clear local storage cart data
      try {
        localStorage.removeItem('fc_cart');
      } catch {
        // localStorage might be blocked — fail silently
      }

    } catch (error) {
      setAuthError(error.message);
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * handlePasswordReset
   * Sends a password reset email.
   *
   * @param {string} email
   */
  const handlePasswordReset = useCallback(async (email) => {
    setAuthError('');
    setActionLoading(true);

    try {
      await sendPasswordReset(email);
      return true; // Success
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * handleResendVerification
   * Resends the email verification link.
   */
  const handleResendVerification = useCallback(async () => {
    setAuthError('');
    setActionLoading(true);

    try {
      await resendEmailVerification();
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * refreshUserDocument
   * Re-fetches the user's Firestore document.
   * Call after making changes to user data.
   */
  const refreshUserDocument = useCallback(async () => {
    if (!user?.uid) return;
    await fetchUserDocument(user.uid);
  }, [user, fetchUserDocument]);

  /**
   * updateUserData
   * Updates user data in both Firestore and auth profile.
   *
   * @param {object} updates - Fields to update
   */
  const updateUserData = useCallback(async (updates) => {
    if (!user?.uid) throw new Error('No user logged in');

    try {
      // Update Firestore document
      await updateUserDocument(user.uid, updates);

      // If displayName or photoURL changed, update Auth profile too
      if (updates.displayName || updates.photoURL) {
        await updateUserProfile({
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }

      // Refresh the local user document state
      await refreshUserDocument();

    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }, [user, refreshUserDocument]);

  /**
   * clearAuthError
   * Clears the current auth error message.
   * Call when user starts typing to dismiss old errors.
   */
  const clearAuthError = useCallback(() => {
    setAuthError('');
  }, []);

  // ── MEMOIZED CONTEXT VALUE ─────────────────────────────
  // Memoize the context value to prevent unnecessary re-renders
  // Only recalculates when dependencies actually change
  const contextValue = useMemo(() => ({
    // State
    user,                  // Firebase Auth user object
    userDocument,          // Firestore user document
    partnerDocument,       // Firestore partner document (partner portal)
    authLoading,           // Firebase Auth initializing
    actionLoading,         // Auth action in progress
    documentLoading,       // Fetching Firestore document
    authError,             // Current error message

    // Derived state
    isLoggedIn,            // Boolean: user logged in?
    isEmailVerified,       // Boolean: email verified?
    isPartner,             // Boolean: user is a partner?

    // Actions
    handleGoogleLogin,     // Sign in with Google
    handleEmailLogin,      // Sign in with email/password
    handleRegister,        // Register with email/password
    handleLogout,          // Sign out
    handlePasswordReset,   // Send password reset email
    handleResendVerification, // Resend verification email
    updateUserData,        // Update user data
    refreshUserDocument,   // Re-fetch user document
    clearAuthError,        // Clear error message

  }), [
    user, userDocument, partnerDocument,
    authLoading, actionLoading, documentLoading, authError,
    isLoggedIn, isEmailVerified, isPartner,
    handleGoogleLogin, handleEmailLogin, handleRegister,
    handleLogout, handlePasswordReset, handleResendVerification,
    updateUserData, refreshUserDocument, clearAuthError,
  ]);

  // ── RENDER ─────────────────────────────────────────────
  return (
    // Provide context value to all children
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ── EXPORT THE CONTEXT ─────────────────────────────────────
// Exported for direct use in useAuth hook
export { AuthContext };

// Default export of the provider
export default AuthProvider;
