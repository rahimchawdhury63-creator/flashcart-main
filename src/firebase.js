// firebase.js — Firebase initialization for FlashCart Main (Customer Portal).
// Initializes the shared Firebase project used by BOTH the customer and partner apps.
// Exports ready-to-use service instances (auth, Firestore, Realtime DB).

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// Firebase project configuration — shared across both FlashCart apps.
const firebaseConfig = {
  apiKey: 'AIzaSyDe1BG7CQbG1zRocxCP9naJfi-JsTit3iw',
  authDomain: 'flashcart-bd.firebaseapp.com',
  projectId: 'flashcart-bd',
  storageBucket: 'flashcart-bd.firebasestorage.app',
  messagingSenderId: '240971637959',
  appId: '1:240971637959:web:ef506397d505dac1accae2',
  databaseURL: 'https://flashcart-bd-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

// Initialize the Firebase app once and reuse the instance everywhere.
const app = initializeApp(firebaseConfig)

// Authentication (Google + Email/Password + reset + email verification).
export const auth = getAuth(app)

// Google sign-in provider, configured to always show the account chooser.
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Firestore — primary structured data store (users, stores, items, orders, reviews).
export const db = getFirestore(app)

// Realtime Database — live order feed and store-status updates.
export const realtimeDb = getDatabase(app)

export default app
