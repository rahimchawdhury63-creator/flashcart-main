// ============================================================
// FlashCart — Register Page
// New user registration with email and password.
// Features: real-time password strength meter, bilingual
// validation, terms acceptance, Google registration.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Auth hook
import useAuth from '../../../hooks/useAuth';

// Validators
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateName,
} from '../../../utils/validators';

// Common components
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import SVGIcon from '../../../components/common/SVGIcon/SVGIcon';

// Constants
import { SITE_META, PORTAL_URLS } from '../../../utils/constants';

// Styles
import './Register.css';

/**
 * RegisterPage
 * Handles new user registration.
 * Includes real-time password strength visualization.
 */
const RegisterPage = () => {

  // ── HOOKS ──────────────────────────────────────────────
  const navigate = useNavigate();

  const {
    handleRegister,
    handleGoogleLogin,
    actionLoading,
    authError,
    clearAuthError,
    isLoggedIn,
    authLoading,
  } = useAuth();

  // ── STATE ──────────────────────────────────────────────

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted]     = useState(false);

  // Validation errors (shown after submit attempt)
  const [nameError, setNameError]         = useState('');
  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError]   = useState('');
  const [termsError, setTermsError]       = useState('');

  // Password strength (0-5)
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('');

  // Form submitted flag — shows validation errors
  const [submitted, setSubmitted] = useState(false);

  // Registration success — show verification email notice
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Portal detection
  const isPartnerPortal = import.meta.env.VITE_PORTAL_TYPE === 'partner';

  // ── REDIRECT IF LOGGED IN ──────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn && !registrationSuccess) {
      navigate(isPartnerPortal ? '/dashboard' : '/', { replace: true });
    }
  }, [isLoggedIn, authLoading, navigate, isPartnerPortal, registrationSuccess]);

  // ── PASSWORD STRENGTH METER ────────────────────────────
  // Update strength meter in real-time as user types password
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordStrengthLabel('');
      return;
    }

    // Use validator to calculate strength
    const result = validatePassword(password);
    setPasswordStrength(result.strength);
    setPasswordStrengthLabel(result.strengthLabel);

  }, [password]); // Re-run every time password changes

  // ── CLEAR ERRORS ON TYPING ────────────────────────────
  useEffect(() => {
    if (displayName || email || password || confirmPassword) {
      clearAuthError();
    }
  }, [displayName, email, password, confirmPassword, clearAuthError]);

  // ── FORM VALIDATION ────────────────────────────────────

  /**
   * validateRegisterForm
   * Validates all registration fields.
   * Sets individual field errors for inline display.
   */
  const validateRegisterForm = () => {
    let isValid = true;

    // Validate display name
    const nameResult = validateName(displayName);
    if (!nameResult.isValid) {
      setNameError(nameResult.error);
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setEmailError(emailResult.error);
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password strength
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.error);
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate password confirmation
    const confirmResult = validatePasswordConfirm(password, confirmPassword);
    if (!confirmResult.isValid) {
      setConfirmError(confirmResult.error);
      isValid = false;
    } else {
      setConfirmError('');
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      setTermsError('শর্তাবলী সম্মত হতে হবে / You must accept the terms');
      isValid = false;
    } else {
      setTermsError('');
    }

    return isValid;
  };

  // ── EVENT HANDLERS ─────────────────────────────────────

  /**
   * handleSubmit
   * Handles registration form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate before sending
    if (!validateRegisterForm()) return;

    // Register the user
    const result = await handleRegister(email, password, displayName);

    if (result) {
      // Show success message — they need to verify email
      setRegistrationSuccess(true);
    }
  };

  /**
   * handleGoogleRegister
   * Registers/logs in with Google.
   */
  const handleGoogleRegister = async () => {
    const result = await handleGoogleLogin();
    if (result) {
      navigate(isPartnerPortal ? '/dashboard' : '/', { replace: true });
    }
  };

  // ── PASSWORD STRENGTH VISUAL ───────────────────────────

  // Strength level to color mapping
  const strengthColors = {
    0: 'transparent',
    1: 'var(--fc-error)',         // Too short — Red
    2: '#F59E0B',                  // Weak — Amber
    3: '#EAB308',                  // Fair — Yellow
    4: 'var(--fc-accent)',         // Strong — Green
    5: 'var(--fc-primary)',        // Very Strong — Dark Green
  };

  // Fill ratio for the strength bar (strength/5 = portion filled)
  const strengthFillWidth = `${(passwordStrength / 5) * 100}%`;

  // ── REGISTRATION SUCCESS SCREEN ────────────────────────
  if (registrationSuccess) {
    return (
      <>
        <Helmet>
          <title>ইমেইল যাচাই করুন — FlashCart</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="auth-page auth-success-page">
          <div className="auth-success-container">

            {/* Success icon */}
            <div className="auth-success-icon">
              <SVGIcon
                name="check-circle-filled"
                size={64}
                color="var(--fc-success)"
                ariaHidden
              />
            </div>

            {/* Success message */}
            <h1 className="auth-success-title">
              রেজিস্ট্রেশন সফল হয়েছে!
            </h1>

            <p className="auth-success-message">
              আপনার ইমেইল ঠিকানায় একটি যাচাই লিংক পাঠানো হয়েছে।
              <br />
              <strong>{email}</strong>
              <br />
              লিংকে ক্লিক করে আপনার অ্যাকাউন্ট যাচাই করুন।
            </p>

            <p className="auth-success-note">
              ইমেইল না পেলে স্প্যাম ফোল্ডার চেক করুন।
            </p>

            {/* Go to login button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              icon="email"
            >
              লগইন পেজে যান
            </Button>

          </div>
        </div>
      </>
    );
  }

  // ── MAIN RENDER ────────────────────────────────────────
  return (
    <>
      {/* ── SEO META TAGS ─────────────────────────────── */}
      <Helmet>
        <title>
          {isPartnerPortal
            ? `পার্টনার রেজিস্ট্রেশন — FlashCart Partner | Bangladesh`
            : `বিনামূল্যে রেজিস্ট্রেশন — FlashCart | Bangladesh`
          }
        </title>
        <meta
          name="description"
          content={isPartnerPortal
            ? 'FlashCart পার্টনার হিসেবে বিনামূল্যে রেজিস্ট্রেশন করুন। আপনার ব্যবসা অনলাইনে আনুন। Register as FlashCart partner Bangladesh.'
            : 'FlashCart-এ বিনামূল্যে রেজিস্ট্রেশন করুন। অর্ডার করুন, ট্র্যাক করুন, রিভিউ দিন। Free registration Bangladesh delivery.'
          }
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`${isPartnerPortal ? PORTAL_URLS.partner : PORTAL_URLS.main}/register`}
        />
      </Helmet>

      {/* ── PAGE LAYOUT ───────────────────────────────── */}
      <div className="auth-page">

        {/* Left branding panel — same as login */}
        <div className="auth-branding" aria-hidden="true">
          <div className="auth-branding-content">
            <div className="auth-logo">
              <SVGIcon name="flashcart-logo" size={56} ariaHidden />
              <span className="auth-logo-text">FlashCart</span>
            </div>

            <h1 className="auth-brand-headline">
              {isPartnerPortal
                ? 'আপনার ব্যবসা অনলাইনে আনুন'
                : 'বিনামূল্যে অ্যাকাউন্ট তৈরি করুন'
              }
            </h1>

            <p className="auth-brand-subtext">
              {isPartnerPortal
                ? 'ফ্রি ওয়েবসাইট, SEO, অর্ডার ম্যানেজমেন্ট — সব বিনামূল্যে'
                : 'বাংলাদেশের সেরা ডেলিভারি প্ল্যাটফর্মে স্বাগতম'
              }
            </p>

            <ul className="auth-feature-list">
              {(isPartnerPortal ? [
                'বিনামূল্যে SEO ওয়েবসাইট পাবেন',
                'Real-time অর্ডার নোটিফিকেশন',
                'গ্রাহক রিভিউ ম্যানেজমেন্ট',
                'ব্যবসার সার্টিফিকেট অর্জন করুন',
              ] : [
                'সম্পূর্ণ বিনামূল্যে',
                'দ্রুত ও নির্ভরযোগ্য ডেলিভারি',
                'অর্ডার রিয়েল-টাইম ট্র্যাক করুন',
                'বিশ্বস্ত স্থানীয় ব্যবসা',
              ]).map((f, i) => (
                <li key={i} className="auth-feature-item">
                  <SVGIcon name="check-circle" size={18} color="var(--fc-accent)" ariaHidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="auth-attribution">
              Powered by{' '}
              <a href={SITE_META.orgURL} target="_blank" rel="noopener noreferrer">
                {SITE_META.organization}
              </a>
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">

            {/* Mobile logo */}
            <div className="auth-mobile-logo">
              <SVGIcon name="flashcart-logo" size={40} ariaHidden />
              <span>FlashCart</span>
            </div>

            {/* Form header */}
            <div className="auth-form-header">
              <h2 className="auth-form-title">
                {isPartnerPortal ? 'পার্টনার হিসেবে যোগ দিন' : 'অ্যাকাউন্ট তৈরি করুন'}
              </h2>
              <p className="auth-form-subtitle">বিনামূল্যে রেজিস্ট্রেশন করুন</p>
            </div>

            {/* Google register button */}
            <button
              type="button"
              className="google-login-btn"
              onClick={handleGoogleRegister}
              disabled={actionLoading}
              aria-label="Google দিয়ে রেজিস্ট্রেশন করুন"
            >
              <span className="google-icon" aria-hidden="true">
                <SVGIcon name="google" size={20} ariaHidden />
              </span>
              <span>
                {actionLoading ? 'প্রক্রিয়া হচ্ছে...' : 'Google দিয়ে রেজিস্ট্রেশন করুন'}
              </span>
            </button>

            {/* Divider */}
            <div className="auth-divider" role="separator">
              <span className="auth-divider-line" aria-hidden="true" />
              <span className="auth-divider-text">অথবা ইমেইল দিয়ে</span>
              <span className="auth-divider-line" aria-hidden="true" />
            </div>

            {/* Registration form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="auth-form"
              aria-label="রেজিস্ট্রেশন ফর্ম"
            >

              {/* Display name field */}
              <Input
                label="আপনার নাম"
                type="text"
                placeholder="আপনার পূর্ণ নাম লিখুন"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (submitted) setNameError('');
                }}
                error={submitted ? nameError : ''}
                iconLeft="user"
                required
                autoComplete="name"
                id="reg-name"
                name="displayName"
              />

              {/* Email field */}
              <Input
                label="ইমেইল ঠিকানা"
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitted) setEmailError('');
                }}
                error={submitted ? emailError : ''}
                iconLeft="email"
                required
                autoComplete="email"
                id="reg-email"
                name="email"
              />

              {/* Password field with strength meter */}
              <div className="password-field-wrapper">
                <Input
                  label="পাসওয়ার্ড"
                  type="password"
                  placeholder="শক্তিশালী পাসওয়ার্ড তৈরি করুন"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (submitted) setPasswordError('');
                  }}
                  error={submitted ? passwordError : ''}
                  iconLeft="lock"
                  required
                  autoComplete="new-password"
                  id="reg-password"
                  name="password"
                />

                {/* Password strength meter — shown when password has content */}
                {password && (
                  <div
                    className="password-strength-meter"
                    aria-label={`পাসওয়ার্ড শক্তি: ${passwordStrengthLabel}`}
                  >
                    {/* Strength bar track */}
                    <div
                      className="strength-bar-track"
                      aria-hidden="true"
                    >
                      {/* Filled portion */}
                      <div
                        className="strength-bar-fill"
                        style={{
                          width: strengthFillWidth,
                          backgroundColor: strengthColors[passwordStrength],
                        }}
                      />
                    </div>

                    {/* Strength label text */}
                    <span
                      className="strength-label"
                      style={{ color: strengthColors[passwordStrength] }}
                    >
                      {passwordStrengthLabel}
                    </span>
                  </div>
                )}

                {/* Password requirements hint */}
                {!password && (
                  <p className="password-hint">
                    কমপক্ষে ৬ অক্ষর, বড় হাতের অক্ষর ও সংখ্যা ব্যবহার করুন
                  </p>
                )}
              </div>

              {/* Confirm password field */}
              <Input
                label="পাসওয়ার্ড নিশ্চিত করুন"
                type="password"
                placeholder="পাসওয়ার্ড আবার লিখুন"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (submitted) setConfirmError('');
                }}
                error={submitted ? confirmError : ''}
                iconLeft="lock"
                required
                autoComplete="new-password"
                id="reg-confirm-password"
                name="confirmPassword"
              />

              {/* Terms and conditions acceptance */}
              <div className="terms-wrapper">
                <label className="terms-label">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (submitted) setTermsError('');
                    }}
                    className="terms-checkbox"
                    aria-required="true"
                    aria-describedby={submitted && termsError ? 'terms-error' : undefined}
                  />
                  <span className="terms-text">
                    আমি{' '}
                    <Link to="/terms" className="terms-link" target="_blank">
                      শর্তাবলী
                    </Link>
                    {' '}এবং{' '}
                    <Link to="/privacy" className="terms-link" target="_blank">
                      গোপনীয়তা নীতি
                    </Link>
                    {' '}সম্মত
                  </span>
                </label>

                {/* Terms error */}
                {submitted && termsError && (
                  <p
                    id="terms-error"
                    className="terms-error"
                    role="alert"
                  >
                    <SVGIcon name="alert-circle" size={14} ariaHidden />
                    {termsError}
                  </p>
                )}
              </div>

              {/* Global auth error */}
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
                icon="user"
              >
                {actionLoading ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্ট্রেশন করুন'}
              </Button>
            </form>

            {/* Login link */}
            <p className="auth-switch-text">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <Link to="/login" className="auth-switch-link">
                লগইন করুন
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
