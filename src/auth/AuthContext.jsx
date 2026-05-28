/**
 * =============================================================================
 * FLASHCART — Authentication Context Provider
 * =============================================================================
 *
 * Purpose: Global authentication state management using Firebase Auth.
 * Provides user authentication state, login/register/logout functions,
 * and Firestore user document synchronization across the entire app.
 *
 * Features:
 * - Firebase Auth integration (Google OAuth + Email/Password)
 * - Persistent auth state via onAuthStateChanged listener
 * - Automatic Firestore user document creation/sync on login
 * - Loading state during initial auth check
 * - Email verification status tracking
 * - Comprehensive error handling with bilingual error messages
 * - Last login timestamp tracking
 *
 * Firestore User Document Schema:
 *   users/{uid}: {
 *     uid: string,
 *     email: string,
 *     displayName: string,
 *     photoURL: string,
 *     phone: string,
 *     language: 'default' | 'bangla' | 'english',
 *     addresses: [{ label, address, lat, lng, isDefault }],
 *     favorites: [storeId],
 *     emailVerified: boolean,
 *     oneSignalPlayerId: string,
 *     authProvider: 'google' | 'email',
 *     createdAt: timestamp,
 *     lastLoginAt: timestamp,
 *     updatedAt: timestamp
 *   }
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from '@/firebase';

/* =========================================================================== */
/* CONTEXT CREATION                                                            */
/* =========================================================================== */

const AuthContext = createContext(null);

/* =========================================================================== */
/* AUTH ERROR CODE MAPPING                                                     */
/* =========================================================================== */

/**
 * Map Firebase Auth error codes to translation keys.
 * Components should pass these keys to t() for localized error messages.
 *
 * @param {string} errorCode — Firebase error code (e.g., 'auth/user-not-found')
 * @returns {string} Translation key (e.g., 'auth.errors.userNotFound')
 */
export const mapAuthErrorCode = (errorCode) => {
  const errorMap = {
    'auth/invalid-email': 'auth.errors.invalidEmail',
    'auth/user-disabled': 'auth.errors.userDisabled',
    'auth/user-not-found': 'auth.errors.userNotFound',
    'auth/wrong-password': 'auth.errors.wrongPassword',
    'auth/email-already-in-use': 'auth.errors.emailInUse',
    'auth/operation-not-allowed': 'auth.errors.operationNotAllowed',
    'auth/weak-password': 'auth.errors.weakPassword',
    'auth/network-request-failed': 'auth.errors.networkError',
    'auth/too-many-requests': 'auth.errors.tooManyRequests',
    'auth/popup-closed-by-user': 'auth.errors.popupClosed',
    'auth/cancelled-popup-request': 'auth.errors.popupClosed',
    'auth/popup-blocked': 'auth.errors.popupBlocked',
    'auth/account-exists-with-different-credential': 'auth.errors.accountExists',
    'auth/credential-already-in-use': 'auth.errors.credentialInUse',
    'auth/invalid-credential': 'auth.errors.invalidCredential',
    'auth/invalid-verification-code': 'auth.errors.invalidVerificationCode',
    'auth/invalid-verification-id': 'auth.errors.invalidVerificationCode',
    'auth/missing-verification-code': 'auth.errors.missingVerificationCode',
    'auth/requires-recent-login': 'auth.errors.requiresRecentLogin',
    'auth/internal-error': 'auth.errors.genericError'
  };
  return errorMap[errorCode] || 'auth.errors.genericError';
};

/* =========================================================================== */
/* AUTH PROVIDER COMPONENT                                                     */
/* =========================================================================== */

/**
 * AuthProvider — Wraps the app with authentication context.
 * Must be placed at the top of the component tree (above any routes).
 */
export const AuthProvider = ({ children }) => {
  /* --- State --- */
  const [currentUser, setCurrentUser] = useState(null);  /* Firebase Auth user */
  const [userProfile, setUserProfile] = useState(null);  /* Firestore user doc */
  const [loading, setLoading] = useState(true);          /* Initial auth check */
  const [error, setError] = useState(null);              /* Last auth error */

  /* =========================================================================== */
  /* HELPER: Create or sync user document in Firestore                           */
  /* =========================================================================== */

  /**
   * Creates a Firestore document for a new user, or syncs an existing one.
   * Called after every successful login/registration.
   *
   * @param {object} user — Firebase Auth user object
   * @param {object} extraData — Additional user data (phone, etc.)
   * @param {string} authProvider — 'google' | 'email'
   */
  const syncUserDocument = async (user, extraData = {}, authProvider = 'email') => {
    if (!user) return null;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        /* --- New user — create document --- */
        const newUserData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || extraData.displayName || '',
          photoURL: user.photoURL || '',
          phone: extraData.phone || '',
          language: 'default',
          addresses: [],
          favorites: [],
          emailVerified: user.emailVerified || false,
          oneSignalPlayerId: '',
          authProvider: authProvider,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(userRef, newUserData);
        return newUserData;
      } else {
        /* --- Existing user — update last login + email verification status --- */
        const existingData = userSnap.data();
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          emailVerified: user.emailVerified || false,
          /* Update photo URL if changed (e.g., from Google account) */
          ...(user.photoURL && user.photoURL !== existingData.photoURL && { photoURL: user.photoURL }),
          ...(user.displayName && user.displayName !== existingData.displayName && { displayName: user.displayName })
        });

        /* Return merged data */
        return { ...existingData, emailVerified: user.emailVerified };
      }
    } catch (err) {
      console.error('[Auth] Failed to sync user document:', err);
      return null;
    }
  };

  /* =========================================================================== */
  /* AUTH METHOD: Sign in with Google                                            */
  /* =========================================================================== */

  /**
   * Sign in with Google OAuth (popup flow).
   * Creates Firestore user doc if first time.
   *
   * @returns {Promise<object>} { success, user, error }
   */
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = await syncUserDocument(user, {}, 'google');
      setUserProfile(profile);
      return { success: true, user, profile };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      console.error('[Auth] Google sign-in error:', err);
      return { success: false, error: errorKey, errorCode: err.code };
    }
  }, []);

  /* =========================================================================== */
  /* AUTH METHOD: Sign in with Email/Password                                    */
  /* =========================================================================== */

  /**
   * Sign in with email and password.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} { success, user, error }
   */
  const signInWithEmail = useCallback(async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const profile = await syncUserDocument(user, {}, 'email');
      setUserProfile(profile);
      return { success: true, user, profile };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      console.error('[Auth] Email sign-in error:', err);
      return { success: false, error: errorKey, errorCode: err.code };
    }
  }, []);

  /* =========================================================================== */
  /* AUTH METHOD: Register with Email/Password                                   */
  /* =========================================================================== */

  /**
   * Create a new user account with email and password.
   * Automatically sends email verification.
   *
   * @param {string} email
   * @param {string} password
   * @param {object} extraData — { displayName, phone }
   * @returns {Promise<object>} { success, user, error }
   */
  const registerWithEmail = useCallback(async (email, password, extraData = {}) => {
    setError(null);
    try {
      /* Create Firebase Auth user */
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      /* Update display name in Firebase Auth profile */
      if (extraData.displayName) {
        await updateProfile(user, {
          displayName: extraData.displayName
        });
      }

      /* Send verification email automatically */
      try {
        await sendEmailVerification(user, {
          url: window.location.origin /* Redirect URL after verification */
        });
      } catch (verifyErr) {
        /* Non-blocking — registration succeeds even if email fails */
        console.warn('[Auth] Failed to send verification email:', verifyErr);
      }

      /* Create Firestore user document */
      const profile = await syncUserDocument(user, extraData, 'email');
      setUserProfile(profile);

      return { success: true, user, profile };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      console.error('[Auth] Registration error:', err);
      return { success: false, error: errorKey, errorCode: err.code };
    }
  }, []);

  /* =========================================================================== */
  /* AUTH METHOD: Send Password Reset Email                                      */
  /* =========================================================================== */

  /**
   * Send a password reset link to the given email.
   *
   * @param {string} email
   * @returns {Promise<object>} { success, error }
   */
  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`
      });
      return { success: true };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      console.error('[Auth] Password reset error:', err);
      return { success: false, error: errorKey, errorCode: err.code };
    }
  }, []);

  /* =========================================================================== */
  /* AUTH METHOD: Resend Verification Email                                      */
  /* =========================================================================== */

  /**
   * Resend the email verification link to the current user.
   *
   * @returns {Promise<object>} { success, error }
   */
  const resendVerificationEmail = useCallback(async () => {
    setError(null);
    if (!currentUser) {
      return { success: false, error: 'auth.errors.notLoggedIn' };
    }
    try {
      await sendEmailVerification(currentUser, {
        url: window.location.origin
      });
      return { success: true };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      return { success: false, error: errorKey };
    }
  }, [currentUser]);

  /* =========================================================================== */
  /* AUTH METHOD: Sign Out                                                       */
  /* =========================================================================== */

  /**
   * Sign out the current user.
   *
   * @returns {Promise<object>} { success, error }
   */
  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (err) {
      const errorKey = mapAuthErrorCode(err.code);
      setError(errorKey);
      console.error('[Auth] Sign out error:', err);
      return { success: false, error: errorKey };
    }
  }, []);

  /* =========================================================================== */
  /* AUTH METHOD: Update User Profile                                            */
  /* =========================================================================== */

  /**
   * Update the Firestore user document with new data.
   *
   * @param {object} updates — Fields to update
   * @returns {Promise<object>} { success, error }
   */
  const updateUserProfile = useCallback(async (updates) => {
    if (!currentUser) {
      return { success: false, error: 'auth.errors.notLoggedIn' };
    }
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      /* Update local state */
      setUserProfile((prev) => ({ ...prev, ...updates }));

      /* Also update Firebase Auth profile if displayName/photoURL changed */
      const authUpdates = {};
      if (updates.displayName) authUpdates.displayName = updates.displayName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(currentUser, authUpdates);
      }

      return { success: true };
    } catch (err) {
      console.error('[Auth] Update profile error:', err);
      return { success: false, error: 'auth.errors.genericError' };
    }
  }, [currentUser]);

  /* =========================================================================== */
  /* AUTH STATE LISTENER (Critical for persistent auth)                          */
  /* =========================================================================== */

  useEffect(() => {
    /* onAuthStateChanged fires whenever auth state changes:
     * - Page load: restores session from Firebase Auth persistence
     * - Login: fires with user object
     * - Logout: fires with null
     */
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          /* User is signed in */
          setCurrentUser(user);

          /* Load Firestore user document */
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserProfile({ ...userSnap.data(), emailVerified: user.emailVerified });
          } else {
            /* Edge case: Firebase Auth user exists but no Firestore doc */
            /* This can happen if the doc was deleted manually */
            const profile = await syncUserDocument(user);
            setUserProfile(profile);
          }
        } else {
          /* User is signed out */
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('[Auth] State change handler error:', err);
      } finally {
        /* Mark initial auth check as complete */
        setLoading(false);
      }
    });

    /* Cleanup listener on unmount */
    return () => unsubscribe();
  }, []);

  /* =========================================================================== */
  /* CONTEXT VALUE                                                               */
  /* =========================================================================== */

  const value = {
    /* State */
    currentUser,        /* Firebase Auth user object */
    userProfile,        /* Firestore user document */
    loading,            /* True during initial auth check */
    error,              /* Last auth error key */
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,

    /* Methods */
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    resetPassword,
    resendVerificationEmail,
    signOut,
    updateUserProfile,

    /* Utilities */
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================================================================== */
/* AUTH CONTEXT HOOK                                                           */
/* =========================================================================== */

/**
 * useAuthContext — Hook to access authentication context.
 * For convenience, also exported as default useAuth() in useAuth.js
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
