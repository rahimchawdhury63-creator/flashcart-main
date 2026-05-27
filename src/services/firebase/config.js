// ============================================================
// FlashCart — Firebase Configuration
// IDENTICAL FILE for all 3 portals (main, partner, docs)
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community (bsdc.info.bd)
//
// IMPORTANT SECURITY NOTE:
// Firebase API keys for web apps are NOT secret — they are
// public identifiers. Security is enforced through:
// 1. Firebase Security Rules (Firestore + RTDB)
// 2. Firebase Auth — only authenticated users can write
// 3. Authorized domains — only allowed origins can use the key
// Firebase console → Authentication → Settings → Authorized domains
// Add: flashcart.bsdc.info.bd, partner.flashcart.bsdc.info.bd
// ============================================================

// Import Firebase App — the core Firebase SDK
// initializeApp creates and registers the Firebase app instance
import { initializeApp, getApps, getApp } from 'firebase/app';

// Import Firebase Authentication service
// Handles Google login, email/password, session persistence
import { getAuth } from 'firebase/auth';

// Import Firestore database service
// NoSQL document database for users, stores, orders, reviews
import { getFirestore } from 'firebase/firestore';

// Import Firebase Realtime Database service
// Used for real-time order status, partner presence, notifications
import { getDatabase } from 'firebase/database';

// Import Firebase Analytics (optional — tracks user behavior)
// Only initializes if supported by the browser
import { getAnalytics, isSupported } from 'firebase/analytics';

// ── FIREBASE CONFIGURATION OBJECT ────────────────────────────
// These values come from Firebase Console → Project Settings
// They are loaded from environment variables for security
// In development: .env file
// In production: Cloudflare Pages Environment Variables
const firebaseConfig = {
  // API Key — identifies the Firebase project
  // SAFE to expose publicly — security is via Firebase Rules
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDe1BG7CQbG1zRocxCP9naJfi-JsTit3iw",

  // Auth domain — used for OAuth redirects (Google login)
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flashcart-bd.firebaseapp.com",

  // Project ID — unique identifier for the Firebase project
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flashcart-bd",

  // Storage Bucket — for Firebase Storage (not used — we use ImgBB instead)
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flashcart-bd.firebasestorage.app",

  // Messaging Sender ID — for Firebase Cloud Messaging (FCM) push notifications
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "240971637959",

  // App ID — unique identifier for this web app within the project
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:240971637959:web:ef506397d505dac1accae2",

  // Realtime Database URL — Asia Southeast region for Bangladesh
  // This is the RTDB endpoint, different from Firestore
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://flashcart-bd-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// ── FIREBASE APP INITIALIZATION ───────────────────────────────
// Prevent duplicate initialization error in React development mode
// React StrictMode renders components twice in development
// getApps() returns array of initialized apps
// If empty, initialize; if already exists, get the existing instance
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)  // First time — initialize Firebase
  : getApp();                       // Already initialized — get existing

// ── FIREBASE SERVICES ─────────────────────────────────────────
// Initialize each Firebase service separately
// This enables tree-shaking — only import what you use

// Authentication service
// Handles: Google OAuth, email/password, session management
const auth = getAuth(app);

// Firestore database service
// Used for: users, partners, stores, orders, reviews, items
const db = getFirestore(app);

// Realtime Database service
// Used for: live order status, partner presence, notification queue
const rtdb = getDatabase(app);

// ── FIREBASE ANALYTICS (async initialization) ──────────────────
// Analytics might not be supported in all environments
// (e.g., when cookies are blocked, or in certain browser configs)
// Using a promise to handle this gracefully
let analytics = null;

// Initialize analytics only if the browser supports it
// isSupported() returns a promise that resolves to true/false
isSupported()
  .then((supported) => {
    if (supported) {
      // Browser supports analytics — initialize it
      analytics = getAnalytics(app);
      // Log initialization for debugging (development only)
      if (import.meta.env.DEV) {
        console.log('[FlashCart] Firebase Analytics initialized');
      }
    }
  })
  .catch((error) => {
    // Analytics failed — not critical, continue without it
    // This can happen in Firefox with strict privacy settings
    console.warn('[FlashCart] Firebase Analytics not supported:', error.message);
  });

// ── DEVELOPMENT LOGGING ───────────────────────────────────────
// Only log in development mode — never in production
if (import.meta.env.DEV) {
  console.log('[FlashCart] Firebase initialized successfully');
  console.log('[FlashCart] Project:', firebaseConfig.projectId);
  console.log('[FlashCart] Auth domain:', firebaseConfig.authDomain);
  console.log('[FlashCart] RTDB URL:', firebaseConfig.databaseURL);
}

// ── EXPORTS ───────────────────────────────────────────────────
// Export Firebase instances for use throughout the application
// Other files import what they need:
// import { auth } from '@services/firebase/config';
// import { db } from '@services/firebase/config';
// import { rtdb } from '@services/firebase/config';

export {
  app,        // Firebase app instance (rarely needed directly)
  auth,       // Authentication service
  db,         // Firestore database
  rtdb,       // Realtime Database
  analytics,  // Analytics (may be null if not supported)
};

// Default export — the app instance
export default app;
