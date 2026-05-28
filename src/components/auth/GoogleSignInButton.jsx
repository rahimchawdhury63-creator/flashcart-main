/**
 * =============================================================================
 * FLASHCART — Google Sign-In Button Component
 * =============================================================================
 *
 * Purpose: Branded Google sign-in button with official Google logo (SVG).
 * Follows Google's branding guidelines for OAuth buttons.
 *
 * Usage:
 *   <GoogleSignInButton 
 *     onClick={handleGoogleSignIn}
 *     loading={isLoading}
 *     label="Continue with Google"
 *   />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import { GoogleIcon } from '@/components/icons';

/**
 * GoogleSignInButton Component
 *
 * @param {object} props
 * @param {Function} props.onClick — Click handler
 * @param {boolean} props.loading — Show loading state
 * @param {boolean} props.disabled — Disable button
 * @param {string} props.label — Button text
 * @param {string} props.className — Additional CSS classes
 */
const GoogleSignInButton = ({
  onClick,
  loading = false,
  disabled = false,
  label = 'Continue with Google',
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`google-signin-btn ${loading ? 'loading' : ''} ${className}`}
      aria-label={label}
    >
      {loading ? (
        <span className="google-signin-spinner" aria-hidden="true" />
      ) : (
        <GoogleIcon size={20} className="google-signin-icon" />
      )}
      <span className="google-signin-label">{label}</span>
    </button>
  );
};

export default GoogleSignInButton;
