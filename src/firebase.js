/**
 * =============================================================================
 * FLASHCART — Firebase Configuration & Initialization
 * =============================================================================
 * 
 * Purpose: Initialize Firebase services used across the FlashCart platform.
 * 
 * This file:
 * 1. Initializes the Firebase app with project credentials
 * 2. Exports Firebase Authentication (Google OAuth, Email/Password)
 * 3. Exports Firestore (users, partners, products, reviews, etc.)
 * 4. Exports Realtime Database (orders, live tracking, presence)
 * 5. Provides Google Auth Provider for OAuth sign-in
 * 
 * The same Firebase project (flashcart-bd) is shared across all 3 apps.
 * Each app imports this file and uses the same Firebase instance.
 * 
 * Security: These credentials are client-side and pre-approved.
 * Real security is enforced through Firestore Security Rules and
 * RTDB Security Rules (configured in Response 19).
 * 
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

/* --- Firebase SDK Imports --- */
/* We import only the services we need (tree-shaking for smaller bundle) */
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  onSnapshot, 
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  push, 
  onValue, 
  onChildAdded, 
  onChildChanged, 
  onChildRemoved, 
  off, 
  serverTimestamp as rtdbServerTimestamp,
  onDisconnect 
} from 'firebase/database';

/**
 * Firebase Configuration Object
 * These values identify our Firebase project (flashcart-bd).
 * 
 * In production, these are loaded from environment variables via Vite.
 * The fallback hardcoded values ensure the app works even if .env is missing.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDe1BG7CQbG1zRocxCP9naJfi-JsTit3iw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flashcart-bd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flashcart-bd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flashcart-bd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "240971637959",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:240971637959:web:ef506397d505dac1accae2",
  databaseURL: import.meta.env.VITE_FIREBASE_RTDB_URL || "https://flashcart-bd-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

/**
 * Initialize Firebase App
 * This creates the core Firebase instance that all other services use.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication Instance
 * Used for: Google OAuth, Email/Password sign-in, email verification,
 * password reset, persistent auth state
 */
const auth = getAuth(app);

/**
 * Google Authentication Provider
 * Configured for popup-based sign-in (works best on mobile).
 * Scopes: email and profile (default)
 */
const googleProvider = new GoogleAuthProvider();
/* Add custom parameters for Google sign-in */
googleProvider.setCustomParameters({
  prompt: 'select_account'  /* Always show account selector (even if one account) */
});

/**
 * Cloud Firestore Instance
 * Used for: Persistent storage of users, partners, products, categories,
 * reviews, ratings, store profiles, SEO metadata, invoices, certificates
 */
const db = getFirestore(app);

/**
 * Firebase Realtime Database Instance
 * Used for: Real-time data that needs instant synchronization —
 * live orders, order tracking status, partner online/offline presence,
 * notification queue, cart sessions
 */
const rtdb = getDatabase(app);

/**
 * =============================================================================
 * EXPORTED SERVICES & UTILITIES
 * =============================================================================
 * Export everything other modules need. This centralizes all Firebase imports
 * so no other file needs to import directly from 'firebase/*'.
 */

/* --- Core Instances --- */
export { app, auth, db, rtdb, googleProvider };

/* --- Auth Functions --- */
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
};

/* --- Firestore Functions --- */
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp
};

/* --- Realtime Database Functions --- */
export {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  rtdbServerTimestamp,
  onDisconnect
};

/**
 * =============================================================================
 * CONFIGURATION CONSTANTS
 * =============================================================================
 * Additional configuration values used across the application.
 * Centralized here for easy modification.
 */

/* ImgBB API Key for image uploads */
export const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "fdbfbcfd3bc5189e50a50c574515298d";

/* ImgBB Upload URL (key is appended as query parameter) */
export const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

/* Admin password for hidden admin panel */
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "RahimRahim";

/* Application URLs */
export const APP_URLS = {
  main: import.meta.env.VITE_APP_URL || "https://flashcart.bsdc.info.bd",
  partner: import.meta.env.VITE_PARTNER_URL || "https://partner.flashcart.bsdc.info.bd",
  docs: import.meta.env.VITE_DOCS_URL || "https://docs.flashcart.bsdc.info.bd"
};

/* Developer Credits */
export const CREDITS = {
  developer: import.meta.env.VITE_DEVELOPER_NAME || "Rizwan Rahim Chowdhury",
  poweredBy: import.meta.env.VITE_POWERED_BY || "Bangladesh Software Development Community",
  poweredByUrl: import.meta.env.VITE_POWERED_BY_URL || "https://www.bsdc.info.bd"
};

/**
 * =============================================================================
 * HELPER: Collection References
 * =============================================================================
 * Pre-defined collection references for common Firestore collections.
 * Reduces boilerplate when querying specific collections.
 */
export const collections = {
  users: collection(db, 'users'),
  partners: collection(db, 'partners'),
  orders: collection(db, 'orders'),
  reviews: collection(db, 'reviews'),
  notifications: collection(db, 'notifications'),
  certificates: collection(db, 'certificates'),
  analytics: collection(db, 'analytics'),
  docs: collection(db, 'docs'),
  siteSettings: collection(db, 'siteSettings'),
  reports: collection(db, 'reports')
};

/**
 * =============================================================================
 * HELPER: RTDB References
 * =============================================================================
 * Pre-defined Realtime Database references for common paths.
 */
export const rtdbRefs = {
  orders: (orderId) => ref(rtdb, `orders/${orderId}`),
  allOrders: () => ref(rtdb, 'orders'),
  presence: (userId) => ref(rtdb, `presence/${userId}`),
  notifications: (partnerId) => ref(rtdb, `notifications/${partnerId}`),
  analytics: (storeId, date) => ref(rtdb, `analytics/${storeId}/${date}`)
};
