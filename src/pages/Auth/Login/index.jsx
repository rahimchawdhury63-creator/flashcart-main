// ============================================================
// FlashCart — Login Page
// Supports: Google OAuth + Email/Password authentication.
// Features: bilingual UI, remember me, show/hide password,
// error display, loading states, React Helmet SEO.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React core
import React, { useState, useEffect } from 'react';

// React Router — navigation after login
import { Link, useNavigate, useLocation } from 'react-router-dom';

// React Helmet Async — SEO meta tags for this page
import { Helmet } from 'react-helmet-async';

// Auth hook — all auth functions from context
import useAuth from '../../../hooks/useAuth';

// Validators from Step 4
import { validateEmail, validateRequired } from '../../../utils/validators';

// Common UI components from Step 3
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import SVGIcon from '../../../components/common/SVGIcon/SVGIcon';

// Page styles
import './Login.css';

// Site constants
import { SITE_META, PORTAL_URLS } from '../../../utils/constants';

/**
 * LoginPage
 * Handles both customer and partner login.
 * Detects portal type from environment variable.
 */
const LoginPage = () => {

  // ── HOOKS ──────────────────────────────────────────────
  const navigate = useNavigate();
  const location = useLocation();

  // Auth context — all login functions and state
  const {
    handleGoogleLogin,
    handleEmailLogin,
    actionLoading,
    authError,
    clearAuthError,
    isLoggedIn,
    authLoading,
  } = useAuth();

  // ── STATE ──────────────────────────────────────────────

  // Form field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Field-level validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Whether form has been submitted (shows validation errors)
  const [submitted, setSubmitted] = useState(false);

  // Which tab is active — 'email' or 'google'
  const [activeTab, setActiveTab] = useState('email');

  // ── PORTAL DETECTION ───────────────────────────────────

  // Determine if this is the partner portal
  const isPartnerPortal = import.meta.env.VITE_PORTAL_TYPE === 'partner';

  // Where to redirect after login
  // If there was a page user tried to access before being redirected to login
  // use that, otherwise go to home/dashboard
  const from = location.state?.from?.pathname ||
    (isPartnerPortal ? '/dashboard' : '/');

  // ── REDIRECT IF ALREADY LOGGED IN ─────────────────────

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    // If user is already logged in, redirect to destination
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, authLoading, navigate, from]);

  // ── CLEAR ERRORS ON TYPING ────────────────────────────

  // Clear auth context error when user starts interacting
  useEffect(() => {
    if (email || password) {
      clearAuthError();
    }
  }, [email, password, clearAuthError]);

  // ── FORM VALIDATION ────────────────────────────────────

  /**
   * validateLoginForm
   * Validates all login fields and sets field errors.
   *
   * @returns {boolean} Whether form is valid
   */
  const validateLoginForm = () => {
    let isValid = true;

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setEmailError(emailResult.error);
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password (just check it exists — no strength check on login)
    const passwordResult = validateRequired(password, 'পাসওয়ার্ড / Password');
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.error);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // ── EVENT HANDLERS ─────────────────────────────────────

  /**
   * handleEmailSubmit
   * Handles the email/password login form submission.
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();        // Prevent page reload
    setSubmitted(true);        // Mark as submitted

    // Validate form first
    if (!validateLoginForm()) return;

    // Attempt login
    const result = await handleEmailLogin(email, password, rememberMe);

    if (result) {
      // Login successful — navigate to destination
      navigate(from, { replace: true });
    }
    // If failed, authError in context will show the error
  };

  /**
   * handleGoogleSubmit
   * Handles Google OAuth login button click.
   */
  const handleGoogleSubmit = async () => {
    const result = await handleGoogleLogin();

    if (result) {
      navigate(from, { replace: true });
    }
  };

  // ── RENDER ─────────────────────────────────────────────

  // Show loading state while auth initializes
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner">
          <SVGIcon name="refresh" size={32} className="icon-spin" color="var(--fc-primary)" ariaHidden />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── SEO META TAGS ───────────────────────────────── */}
      <Helmet>
        {/* Page title — unique and keyword-rich */}
        <title>
          {isPartnerPortal
            ? `পার্টনার লগইন — FlashCart Partner Portal | Bangladesh`
            : `লগইন করুন — FlashCart | Bangladesh Delivery Platform`
          }
        </title>

        {/* Meta description */}
        <meta
          name="description"
          content={isPartnerPortal
            ? 'FlashCart Partner Portal-এ লগইন করুন। আপনার স্টোর ম্যানেজ করুন, অর্ডার দেখুন, ব্যবসা বাড়ান। Login to FlashCart Partner Portal Bangladesh.'
            : 'FlashCart-এ লগইন করুন। অর্ডার ট্র্যাক করুন, প্রোফাইল আপডেট করুন। Login to FlashCart Bangladesh delivery platform.'
          }
        />

        {/* Robots — don't index login page */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Canonical */}
        <link
          rel="canonical"
          href={`${isPartnerPortal ? PORTAL_URLS.partner : PORTAL_URLS.main}/login`}
        />
      </Helmet>

      {/* ── PAGE LAYOUT ─────────────────────────────────── */}
      <div className="auth-page">

        {/* Left panel — branding (hidden on mobile) */}
        <div className="auth-branding" aria-hidden="true">
          <div className="auth-branding-content">

            {/* FlashCart logo */}
            <div className="auth-logo">
              <SVGIcon name="flashcart-logo" size={56} ariaHidden />
              <span className="auth-logo-text">FlashCart</span>
            </div>

            {/* Brand tagline */}
            <h1 className="auth-brand-headline">
              {isPartnerPortal
                ? 'আপনার ব্যবসা পরিচালনা করুন'
                : 'বাংলাদেশের সেরা ফ্রি ডেলিভারি প্ল্যাটফর্ম'
              }
            </h1>

            <p className="auth-brand-subtext">
              {isPartnerPortal
                ? 'Real-time অর্ডার, SEO বিশ্লেষণ, সার্টিফিকেট — সব এক জায়গায়'
                : 'রেস্টুরেন্ট, মুদি দোকান, ওষুধ — ঘরে পৌঁছে দেই'
              }
            </p>

            {/* Feature list */}
            <ul className="auth-feature-list">
              {(isPartnerPortal ? [
                'Real-time অর্ডার নোটিফিকেশন',
                'বিনামূল্যে SEO ওয়েবসাইট',
                'ব্যবসার বিশ্লেষণ ও রিপোর্ট',
                'অ্যাচিভমেন্ট সার্টিফিকেট',
              ] : [
                'সম্পূর্ণ বিনামূল্যে ডেলিভারি',
                'ক্যাশ অন ডেলিভারি',
                'রিয়েল-টাইম অর্ডার ট্র্যাকিং',
                'বিশ্বস্ত স্থানীয় ব্যবসা',
              ]).map((feature, i) => (
                <li key={i} className="auth-feature-item">
                  <SVGIcon name="check-circle" size={18} color="var(--fc-accent)" ariaHidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Attribution */}
            <p className="auth-attribution">
              Powered by{' '}
              <a
                href={SITE_META.orgURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_META.organization}
              </a>
            </p>
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">

            {/* Mobile logo (visible only on mobile) */}
            <div className="auth-mobile-logo">
              <SVGIcon name="flashcart-logo" size={40} ariaHidden />
              <span>FlashCart</span>
            </div>

            {/* Form heading */}
            <div className="auth-form-header">
              <h2 className="auth-form-title">
                {isPartnerPortal ? 'পার্টনার লগইন' : 'লগইন করুন'}
              </h2>
              <p className="auth-form-subtitle">
                {isPartnerPortal
                  ? 'আপনার পার্টনার অ্যাকাউন্টে প্রবেশ করুন'
                  : 'আপনার অ্যাকাউন্টে প্রবেশ করুন'
                }
              </p>
            </div>

            {/* Google login button */}
            <button
              type="button"
              className="google-login-btn"
              onClick={handleGoogleSubmit}
              disabled={actionLoading}
              aria-label="Google দিয়ে লগইন করুন — Sign in with Google"
            >
              {/* Google icon */}
              <span className="google-icon" aria-hidden="true">
                <SVGIcon name="google" size={20} ariaHidden />
              </span>
              <span>
                {actionLoading ? 'লগইন হচ্ছে...' : 'Google দিয়ে লগইন করুন'}
              </span>
            </button>

            {/* Divider between Google and email login */}
            <div className="auth-divider" role="separator">
              <span className="auth-divider-line" aria-hidden="true" />
              <span className="auth-divider-text">অথবা ইমেইল দিয়ে</span>
              <span className="auth-divider-line" aria-hidden="true" />
            </div>

            {/* Email/Password login form */}
            <form
              onSubmit={handleEmailSubmit}
              noValidate        // We handle validation ourselves
              className="auth-form"
              aria-label="ইমেইল ও পাসওয়ার্ড দিয়ে লগইন ফর্ম"
            >

              {/* Email field */}
              <Input
                label="ইমেইল ঠিকানা"
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error when user types
                  if (submitted) setEmailError('');
                }}
                error={submitted ? emailError : ''}
                iconLeft="email"
                required
                autoComplete="email"
                id="login-email"
                name="email"
                aria-describedby="login-email-helper"
              />

              {/* Password field */}
              <Input
                label="পাসওয়ার্ড"
                type="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (submitted) setPasswordError('');
                }}
                error={submitted ? passwordError : ''}
                iconLeft="lock"
                required
                autoComplete="current-password"
                id="login-password"
                name="password"
              />

              {/* Remember me + Forgot password row */}
              <div className="auth-form-options">
                {/* Remember Me checkbox */}
                <label className="remember-me-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-me-checkbox"
                    aria-label="আমাকে মনে রাখুন"
                  />
                  <span className="remember-me-text">মনে রাখুন</span>
                </label>

                {/* Forgot password link */}
                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                  aria-label="পাসওয়ার্ড ভুলে গেছেন?"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              {/* Global auth error display */}
              {authError && (
                <div
                  className="auth-error-box"
                  role="alert"
                  aria-live="assertive"
                >
                  <SVGIcon name="alert-circle" size={16} ariaHidden />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={actionLoading}
                disabled={actionLoading}
                icon="email"
              >
                {actionLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </Button>
            </form>

            {/* Registration link */}
            <p className="auth-switch-text">
              অ্যাকাউন্ট নেই?{' '}
              <Link
                to="/register"
                className="auth-switch-link"
              >
                বিনামূল্যে রেজিস্ট্রেশন করুন
              </Link>
            </p>

            {/* Partner portal link from customer portal */}
            {!isPartnerPortal && (
              <p className="auth-partner-link">
                ব্যবসার মালিক?{' '}
                <a
                  href={`${PORTAL_URLS.partner}/login`}
                  className="auth-switch-link"
                >
                  পার্টনার পোর্টালে যান
                </a>
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
