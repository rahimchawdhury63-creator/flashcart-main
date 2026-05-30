// AuthContext.jsx — Authentication state and actions (Google + Email/Password).
// Wraps Firebase Auth and mirrors the user profile document in Firestore.

import React, { createContext, useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // Firebase auth user
  const [profile, setProfile] = useState(null) // Firestore user document
  const [loading, setLoading] = useState(true) // true until first auth state resolves

  // Ensure a Firestore user document exists; create on first login.
  const ensureUserDoc = useCallback(async (fbUser) => {
    const ref = doc(db, 'users', fbUser.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      const newProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || '',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        phoneNumber: fbUser.phoneNumber || '',
        role: 'customer',
        language: 'default',
        savedAddresses: [],
        favorites: [],
        emailVerified: fbUser.emailVerified,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      }
      await setDoc(ref, newProfile)
      setProfile(newProfile)
    } else {
      setProfile(snap.data())
      // Update last-active timestamp (best-effort, non-blocking).
      setDoc(ref, { lastActive: serverTimestamp() }, { merge: true }).catch(() => {})
    }
  }, [])

  // Subscribe to Firebase auth state once on mount.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser)
      if (fbUser) {
        try {
          await ensureUserDoc(fbUser)
        } catch {
          // Network/permission error — keep auth user but no profile.
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [ensureUserDoc])

  // --- Auth actions (all throw on error so callers can show toasts) ---

  const loginWithGoogle = useCallback(async () => {
    const res = await signInWithPopup(auth, googleProvider)
    await ensureUserDoc(res.user)
    return res.user
  }, [ensureUserDoc])

  const loginWithEmail = useCallback(async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return res.user
  }, [])

  const signupWithEmail = useCallback(async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    // Set the display name on the auth profile.
    if (name) await updateProfile(res.user, { displayName: name })
    // Send a verification email immediately.
    await sendEmailVerification(res.user).catch(() => {})
    await ensureUserDoc(res.user)
    return res.user
  }, [ensureUserDoc])

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), [])

  const resendVerification = useCallback(async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser)
  }, [])

  const logout = useCallback(() => signOut(auth), [])

  // Merge updates into the Firestore profile and local state.
  const updateUserProfile = useCallback(
    async (updates) => {
      if (!user) return
      const ref = doc(db, 'users', user.uid)
      await setDoc(ref, { ...updates, lastActive: serverTimestamp() }, { merge: true })
      setProfile((prev) => ({ ...prev, ...updates }))
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLoggedIn: !!user,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        resendVerification,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
