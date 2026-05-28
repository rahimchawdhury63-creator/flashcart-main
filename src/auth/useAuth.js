/**
 * =============================================================================
 * FLASHCART — useAuth Hook (Convenience Export)
 * =============================================================================
 *
 * Purpose: Convenience re-export of the auth context hook with a cleaner name.
 *
 * Usage:
 *   import { useAuth } from '@/auth/useAuth';
 *   
 *   function MyComponent() {
 *     const { currentUser, signInWithGoogle, signOut } = useAuth();
 *     ...
 *   }
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import { useAuthContext } from './AuthContext';

/**
 * useAuth — Returns the authentication context.
 * Provides currentUser, userProfile, auth methods, and loading state.
 */
export const useAuth = () => useAuthContext();

export default useAuth;
