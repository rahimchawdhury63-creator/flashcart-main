// ============================================================
// FlashCart — Firebase Authentication Service
// All authentication operations: Google OAuth, email/password,
// session management, email verification, password reset.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// Import Firebase Auth functions — modular SDK (tree-shakeable)
import {
  createUserWithEmailAndPassword,  // Register new user with email
  signInWithEmailAndPassword,      // Login with email and password
  signInWithPopup,                 // OAuth popup (Google login)
  signInWithRedirect,              // OAuth redirect (mobile fallback)
  getRedirectResult,               // Get result after redirect OAuth
  GoogleAuthProvider,              // Google OAuth provider
  signOut,                         // Logout current user
  sendEmailVerification,           // Send email verification link
  sendPasswordResetEmail,          // Send password reset link
  updateProfile,                   // Update displayName, photoURL
  updateEmail,                     // Update user email
  updatePassword,                  // Update user password
  reauthenticateWithCredential,    // Re-authenticate before sensitive ops
  EmailAuthProvider,               // For re-authentication
  onAuthStateChanged,              // Auth state listener
  deleteUser,                      // Delete user account
  setPersistence,                  // Set session persistence type
  browserLocalPersistence,         // Remember across browser sessions
  browserSessionPersistence,       // Forget when browser closes
} from 'firebase/auth';

// Import the auth instance from our config
import { auth } from './config';

// Import Firestore user creation function (defined in firestore.js)
// We create the Firestore document when a new user registers
import { createUserDocument } from './firestore';

// ── GOOGLE AUTH PROVIDER SETUP ─────────────────────────────

// Create a Google OAuth provider instance
const googleProvider = new GoogleAuthProvider();

// Add required OAuth scopes for Google login
// email and profile are standard — always requested
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Force Google to show account selection even if only one account
// This prevents accidentally logging in with the wrong Google account
googleProvider.setCustomParameters({
  prompt: 'select_account',     // Always show account picker
  login_hint: '',               // No email hint — let user choose
});

// ── SIGN IN WITH GOOGLE ────────────────────────────────────

/**
 * signInWithGoogle
 * Signs in a user using Google OAuth popup.
 * Falls back to redirect on mobile if popup fails.
 * Creates Firestore user document on first login.
 *
 * @param {string} portalType - 'customer' | 'partner' — affects Firestore doc
 * @returns {Promise<{ user: object, isNewUser: boolean }>}
 */
export const signInWithGoogle = async (portalType = 'customer') => {
  try {
    // Set persistence to local — remember user across sessions
    await setPersistence(auth, browserLocalPersistence);

    // Try popup first — better UX on desktop
    let result;

    try {
      // Attempt popup login
      result = await signInWithPopup(auth, googleProvider);
    } catch (popupError) {
      // Popup blocked — this is common on mobile browsers
      // Fall back to redirect method
      if (popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user') {
        // Use redirect for mobile — will leave page and come back
        await signInWithRedirect(auth, googleProvider);
        return null; // Redirect will handle completion
      }
      throw popupError; // Re-throw other errors
    }

    // Extract user data from the result
    const { user } = result;

    // Check if this is a new user (first login)
    // Firebase includes this in additional user info
    const isNewUser = result._tokenResponse?.isNewUser || false;

    // Create or update Firestore user document
    await createUserDocument(user, {
      authProvider: 'google',       // Track how they signed in
      portalType,                   // Track which portal they registered on
    });

    // Return the user and new user flag
    return { user, isNewUser };

  } catch (error) {
    // Handle specific Google auth errors with user-friendly messages
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * handleGoogleRedirectResult
 * Processes the result when user returns from Google redirect login.
 * Call this on app mount to complete the redirect flow.
 *
 * @param {string} portalType - 'customer' | 'partner'
 * @returns {Promise<object|null>} User if redirect completed, null otherwise
 */
export const handleGoogleRedirectResult = async (portalType = 'customer') => {
  try {
    // Get the redirect result — returns null if no redirect pending
    const result = await getRedirectResult(auth);

    // No redirect result — user didn't just come from Google redirect
    if (!result) return null;

    const { user } = result;
    const isNewUser = result._tokenResponse?.isNewUser || false;

    // Create Firestore user document for new users
    await createUserDocument(user, {
      authProvider: 'google',
      portalType,
    });

    return { user, isNewUser };

  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// ── EMAIL/PASSWORD AUTHENTICATION ─────────────────────────

/**
 * registerWithEmail
 * Creates a new user account with email and password.
 * Sends email verification automatically after registration.
 * Creates Firestore user document.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's chosen password
 * @param {string} displayName - User's display name
 * @param {string} portalType - 'customer' | 'partner'
 * @returns {Promise<{ user: object, isNewUser: boolean }>}
 */
export const registerWithEmail = async (email, password, displayName, portalType = 'customer') => {
  try {
    // Set persistence — remember user across browser sessions
    await setPersistence(auth, browserLocalPersistence);

    // Create the Firebase Auth account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = result;

    // Update the user's display name in Firebase Auth profile
    // This shows the name in Auth console and in user.displayName
    await updateProfile(user, {
      displayName: displayName.trim(),  // Set the display name
      photoURL: null,                   // No photo yet — user can add later
    });

    // Send email verification to confirm their email address
    // This triggers a verification email from Firebase
    await sendEmailVerification(user, {
      // After clicking the link, redirect to the app
      url: `${window.location.origin}/?emailVerified=true`,
      handleCodeInApp: false,  // Let Firebase handle the verification URL
    });

    // Create the Firestore user document with initial data
    await createUserDocument(user, {
      displayName: displayName.trim(),
      authProvider: 'email',
      portalType,
      emailVerified: false,    // Not verified yet
    });

    return { user, isNewUser: true };

  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * loginWithEmail
 * Signs in an existing user with email and password.
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Whether to persist across browser sessions
 * @returns {Promise<{ user: object }>}
 */
export const loginWithEmail = async (email, password, rememberMe = true) => {
  try {
    // Set persistence based on "Remember Me" preference
    const persistence = rememberMe
      ? browserLocalPersistence    // Remember across browser closes
      : browserSessionPersistence; // Forget when browser closes

    await setPersistence(auth, persistence);

    // Sign in with provided credentials
    const result = await signInWithEmailAndPassword(auth, email, password);

    return { user: result.user };

  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// ── PASSWORD MANAGEMENT ────────────────────────────────────

/**
 * sendPasswordReset
 * Sends a password reset email to the specified address.
 * The email contains a link to reset the password.
 *
 * @param {string} email - Email address to send reset link to
 * @returns {Promise<void>}
 */
export const sendPasswordReset = async (email) => {
  try {
    // Send the reset email via Firebase
    await sendPasswordResetEmail(auth, email, {
      // After resetting, redirect back to login page
      url: `${window.location.origin}/login?passwordReset=true`,
      handleCodeInApp: false,  // Firebase handles the reset URL
    });
    // Returns void on success — caller shows success message
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * changePassword
 * Updates the user's password.
 * Requires re-authentication first for security.
 *
 * @param {string} currentPassword - User's current password (for re-auth)
 * @param {string} newPassword - New password to set
 * @returns {Promise<void>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;

    // Must be logged in to change password
    if (!user) throw new Error('No user logged in');

    // Re-authenticate the user before changing sensitive info
    // Firebase requires this for security (prevents account takeover)
    const credential = EmailAuthProvider.credential(
      user.email,       // Their current email
      currentPassword   // Their current password for verification
    );

    // Re-authenticate — throws if current password is wrong
    await reauthenticateWithCredential(user, credential);

    // Now safe to update the password
    await updatePassword(user, newPassword);

  } catch (error) {
    // Customize the re-auth error message
    if (error.code === 'auth/wrong-password') {
      throw new Error('বর্তমান পাসওয়ার্ড সঠিক নয় / Current password is incorrect');
    }
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// ── EMAIL VERIFICATION ─────────────────────────────────────

/**
 * resendEmailVerification
 * Resends the email verification link to the current user.
 * Use when user didn't receive the original email.
 *
 * @returns {Promise<void>}
 */
export const resendEmailVerification = async () => {
  try {
    const user = auth.currentUser;

    // Must be logged in to resend
    if (!user) throw new Error('No user logged in');

    // Check if already verified — no need to resend
    if (user.emailVerified) {
      throw new Error('ইমেইল ইতিমধ্যে যাচাই হয়েছে / Email is already verified');
    }

    // Send the verification email again
    await sendEmailVerification(user, {
      url: `${window.location.origin}/?emailVerified=true`,
      handleCodeInApp: false,
    });

  } catch (error) {
    // Rate limiting error — user is sending too many
    if (error.code === 'auth/too-many-requests') {
      throw new Error('অনেক বার চেষ্টা করেছেন। কিছুক্ষণ পরে চেষ্টা করুন / Too many requests. Please wait.');
    }
    throw error;
  }
};

/**
 * refreshUserEmailVerification
 * Refreshes the current user's token to get updated emailVerified status.
 * Call after user clicks the verification link to check if verified.
 *
 * @returns {Promise<boolean>} Whether email is now verified
 */
export const refreshUserEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    // Reload user data from Firebase — gets latest emailVerified status
    await user.reload();

    return user.emailVerified;

  } catch (error) {
    console.error('[FlashCart Auth] Email verification refresh failed:', error);
    return false;
  }
};

// ── PROFILE MANAGEMENT ─────────────────────────────────────

/**
 * updateUserProfile
 * Updates the user's display name and/or photo URL in Firebase Auth.
 * Note: Also update the Firestore user document separately.
 *
 * @param {object} profileData - { displayName?, photoURL? }
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Only include defined fields in the update
    const updates = {};
    if (profileData.displayName !== undefined) {
      updates.displayName = profileData.displayName;
    }
    if (profileData.photoURL !== undefined) {
      updates.photoURL = profileData.photoURL;
    }

    // Update the Firebase Auth profile
    await updateProfile(user, updates);

  } catch (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }
};

/**
 * updateUserEmail
 * Updates the user's email address.
 * Requires re-authentication for security.
 *
 * @param {string} currentPassword - Current password for re-auth
 * @param {string} newEmail - New email address
 * @returns {Promise<void>}
 */
export const updateUserEmailAddress = async (currentPassword, newEmail) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Re-authenticate before changing email
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update the email in Firebase Auth
    await updateEmail(user, newEmail);

    // Send verification to the new email
    await sendEmailVerification(user);

  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('পাসওয়ার্ড সঠিক নয় / Password is incorrect');
    }
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('এই ইমেইল ইতিমধ্যে ব্যবহার হচ্ছে / Email already in use');
    }
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// ── SESSION MANAGEMENT ─────────────────────────────────────

/**
 * logoutUser
 * Signs out the current user from Firebase Auth.
 * Clears all session data.
 *
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    // Sign out from Firebase — clears the auth token
    await signOut(auth);
    // Note: Clear localStorage cart data in the component after calling this
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * getCurrentUser
 * Returns the currently logged-in user synchronously.
 * Returns null if no user is logged in.
 *
 * @returns {object|null} Firebase user object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * onAuthStateChange
 * Subscribes to auth state changes (login/logout events).
 * Returns an unsubscribe function — call it to stop listening.
 * Used in AuthContext to track global auth state.
 *
 * @param {function} callback - Called with (user) on state change
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  // Subscribe to auth state changes
  // This fires immediately with current user, then on every change
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is logged in — reload to get fresh data (emailVerified, etc.)
      try {
        await user.reload();
      } catch {
        // Reload failed — use cached user data
      }
    }
    // Call the callback with the user (or null if logged out)
    callback(user);
  });
};

/**
 * deleteUserAccount
 * Permanently deletes the user's Firebase Auth account.
 * Requires re-authentication. Firestore cleanup is separate.
 *
 * @param {string} password - Current password (for email accounts)
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Re-authenticate before deleting account
    if (user.providerData[0]?.providerId === 'password') {
      // Email/password user — re-auth with password
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }
    // Google users don't need password re-auth here
    // (they re-authenticate via popup in a more complete implementation)

    // Delete the Firebase Auth account
    await deleteUser(user);

  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('পাসওয়ার্ড সঠিক নয় / Password is incorrect');
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('নিরাপত্তার জন্য আবার লগইন করুন / Please log in again for security');
    }
    throw error;
  }
};

// ── ERROR MESSAGE HELPER ───────────────────────────────────

/**
 * getAuthErrorMessage
 * Converts Firebase Auth error codes to bilingual user-friendly messages.
 * Firebase error codes are technical — this makes them readable.
 *
 * @param {string} errorCode - Firebase Auth error code (e.g. 'auth/user-not-found')
 * @returns {string} User-friendly error message in Bangla-English
 */
export const getAuthErrorMessage = (errorCode) => {
  // Map of Firebase error codes to bilingual messages
  const errorMessages = {
    // Account errors
    'auth/user-not-found':
      'এই ইমেইলে কোনো অ্যাকাউন্ট নেই / No account found with this email',
    'auth/wrong-password':
      'পাসওয়ার্ড সঠিক নয় / Incorrect password',
    'auth/email-already-in-use':
      'এই ইমেইল ইতিমধ্যে ব্যবহার হচ্ছে / Email is already registered',
    'auth/invalid-email':
      'সঠিক ইমেইল ঠিকানা দিন / Please enter a valid email address',
    'auth/weak-password':
      'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে / Password must be at least 6 characters',
    'auth/user-disabled':
      'এই অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে / This account has been disabled',

    // Network errors
    'auth/network-request-failed':
      'ইন্টারনেট সংযোগ পরীক্ষা করুন / Please check your internet connection',
    'auth/too-many-requests':
      'অনেক বার চেষ্টা করেছেন। কিছুক্ষণ পরে চেষ্টা করুন / Too many attempts. Please wait.',

    // Google OAuth errors
    'auth/popup-blocked':
      'পপআপ ব্লক হয়েছে। পপআপ অনুমতি দিন / Popup blocked. Please allow popups.',
    'auth/popup-closed-by-user':
      'লগইন বাতিল হয়েছে / Login was cancelled',
    'auth/cancelled-popup-request':
      'লগইন বাতিল হয়েছে / Login request cancelled',
    'auth/account-exists-with-different-credential':
      'এই ইমেইলে ভিন্ন পদ্ধতিতে অ্যাকাউন্ট আছে / Account exists with different sign-in method',

    // Token errors
    'auth/invalid-action-code':
      'লিংকটি মেয়াদোত্তীর্ণ বা ভুল / Link has expired or is invalid',
    'auth/expired-action-code':
      'লিংকটির মেয়াদ শেষ হয়ে গেছে / Link has expired',

    // Requires recent login
    'auth/requires-recent-login':
      'নিরাপত্তার জন্য আবার লগইন করুন / Please log in again for security',
  };

  // Return the specific message or a generic fallback
  return errorMessages[errorCode] ||
    `লগইন সমস্যা হয়েছে। আবার চেষ্টা করুন / Authentication error. Please try again. (${errorCode})`;
};

// ── AUTH STATE UTILITY ─────────────────────────────────────

/**
 * waitForAuthReady
 * Returns a Promise that resolves when Firebase Auth has initialized.
 * Firebase Auth has an async initialization period — use this to wait.
 * Useful for preventing flash of login page before checking auth state.
 *
 * @returns {Promise<object|null>} Current user or null
 */
export const waitForAuthReady = () => {
  return new Promise((resolve) => {
    // onAuthStateChanged fires once immediately with current auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening after first emission
      resolve(user); // Resolve with current user (or null)
    });
  });
};
