// ============================================================
// FlashCart — Forgot Password Page
// Allows users to request a password reset email.
// Multi-state UI: form → loading → success → error.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React core
import React, { useState, useEffect } from 'react';

// React Router — back to login, query params for success state
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// React Helmet Async — per-page SEO
import { Helmet } from 'react-helmet-async';

// Auth hook
import useAuth from '../../../hooks/useAuth';

// Validator for email
import { validateEmail } from '../../../utils/validators';

// Common UI components
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import SVGIcon from '../../../components/common/SVGIcon/SVGIcon';

// Constants
import { PORTAL_URLS } from '../../../utils/constants';

// Page styles
import './ForgotPassword.css';

/**
 * ForgotPasswordPage
 * Three states:
 * 1. FORM — User enters email address
 * 2. SUCCESS — Email sent confirmation + resend option
 * 3. PASSWORD_RESET_CONFIRMED — User came back after resetting
 *    (detected via ?passwordReset=true query param)
 */
const ForgotPasswordPage = () => {

  // ── HOOKS ──────────────────────────────────────────────
  const navigate = useNavigate();

  // Get query params — check if user just reset their password
  const [searchParams] = useSearchParams();
  const justReset = searchParams.get('passwordReset') === 'true';

  // Auth functions from context
  const {
    handlePasswordReset,
    actionLoading,
    authError,
    clearAuthError,
    isLoggedIn,
    authLoading,
  } = useAuth();

  // ── STATE ──────────────────────────────────────────────

  // Email input value
  const [email, setEmail] = useState('');

  // Field-level email validation error
  const [emailError, setEmailError] = useState('');

  // Whether form has been submitted (enables validation display)
  const [submitted, setSubmitted] = useState(false);

  // Whether reset email was successfully sent
  const [emailSent, setEmailSent] = useState(false);

  // The email address the reset was sent to (for display in success)
  const [sentToEmail, setSentToEmail] = useState('');

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  // Whether resend is in progress
  const [isResending, setIsResending] = useState(false);

  // Portal detection
  const isPartnerPortal = import.meta.env.VITE_PORTAL_TYPE === 'partner';

  // ── REDIRECT IF ALREADY LOGGED IN ─────────────────────
  useEffect(() => {
    if (authLoading) return;
    // If logged in, no need to reset password via this page
    if (isLoggedIn) {
      navigate(isPartnerPortal ? '/dashboard' : '/', { replace: true });
    }
  }, [isLoggedIn, authLoading, navigate, isPartnerPortal]);

  // ── CLEAR ERROR ON TYPING ──────────────────────────────
  useEffect(() => {
    if (email) clearAuthError();
  }, [email, clearAuthError]);

  // ── RESEND COOLDOWN TIMER ──────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ── FORM VALIDATION ────────────────────────────────────

  /**
   * validateForm
   * Validates the email field.
   */
  const validateForm = () => {
    const result = validateEmail(email);
    if (!result.isValid) {
      setEmailError(result.error);
      return false;
    }
    setEmailError('');
    return true;
  };

  // ── EVENT HANDLERS ─────────────────────────────────────

  /**
   * handleSubmit
   * Handles the password reset form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate email first
    if (!validateForm()) return;

    // Send the reset email
    const success = await handlePasswordReset(email.trim().toLowerCase());

    if (success) {
      // Save the email for display in success screen
      setSentToEmail(email.trim().toLowerCase());
      setEmailSent(true);

      // Start cooldown for resend button
      setResendCooldown(60);
    }
    // Error is shown via authError from context
  };

  /**
   * handleResend
   * Resends the password reset email.
   */
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);

    try {
      const success = await handlePasswordReset(sentToEmail);
      if (success) {
        setResendCooldown(60); // Reset the cooldown
      }
    } finally {
      setIsResending(false);
    }
  };

  /**
   * handleTryDifferentEmail
   * Resets the form to try a different email address.
   */
  const handleTryDifferentEmail = () => {
    setEmailSent(false);
    setSentToEmail('');
    setEmail('');
    setSubmitted(false);
    setEmailError('');
    clearAuthError();
  };

  // ── LOADING STATE ──────────────────────────────────────
  if (authLoading) {
    return (
      <div className="forgot-page forgot-loading">
        <SVGIcon name="refresh" size={36} className="icon-spin" color="var(--fc-primary)" ariaHidden />
      </div>
    );
  }

  // ── PASSWORD RESET SUCCESS SCREEN ──────────────────────
  // Shown when user comes back from clicking the reset link
  if (justReset) {
    return (
      <>
        <Helmet>
          <title>পাসওয়ার্ড পরিবর্তন সফল — FlashCart</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="forgot-page">
          <div className="forgot-card animate-scale-spring">

            {/* Success icon */}
            <div className="forgot-success-icon">
              <SVGIcon
                name="check-circle-filled"
                size={72}
                color="var(--fc-success)"
                ariaHidden
              />
            </div>

            <h1 className="forgot-title forgot-title-success">
              পাসওয়ার্ড পরিবর্তন সফল!
            </h1>

            <p className="forgot-message">
              আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।
              নতুন পাসওয়ার্ড দিয়ে লগইন করুন।
            </p>

            {/* Go to login */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/login')}
              icon="email"
            >
              লগইন করুন
            </Button>

          </div>
        </div>
      </>
    );
  }

  // ── EMAIL SENT SUCCESS SCREEN ──────────────────────────
  if (emailSent) {
    return (
      <>
        <Helmet>
          <title>রিসেট লিংক পাঠানো হয়েছে — FlashCart</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="forgot-page">
          <div className="forgot-card animate-slide-up">

            {/* Sent email icon */}
            <div className="forgot-sent-icon" aria-hidden="true">
              <div className="forgot-icon-circle">
                <SVGIcon name="email" size={36} color="var(--fc-primary)" ariaHidden />
              </div>
            </div>

            {/* Title */}
            <h1 className="forgot-title">
              রিসেট লিংক পাঠানো হয়েছে
            </h1>

            {/* Confirmation message */}
            <p className="forgot-message">
              পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে:
            </p>

            {/* Show the email address */}
            <div className="forgot-sent-email" aria-label={`ইমেইল: ${sentToEmail}`}>
              <SVGIcon name="email" size={16} color="var(--fc-primary)" ariaHidden />
              <strong>{sentToEmail}</strong>
            </div>

            {/* Instructions */}
            <div className="forgot-instructions">
              <p className="forgot-instruction-item">
                <SVGIcon name="check" size={16} color="var(--fc-success)" ariaHidden />
                <span>আপনার ইমেইল ইনবক্স খুলুন</span>
              </p>
              <p className="forgot-instruction-item">
                <SVGIcon name="check" size={16} color="var(--fc-success)" ariaHidden />
                <span>FlashCart থেকে ইমেইল খুঁজুন</span>
              </p>
              <p className="forgot-instruction-item">
                <SVGIcon name="check" size={16} color="var(--fc-success)" ariaHidden />
                <span>"পাসওয়ার্ড রিসেট করুন" লিংকে ক্লিক করুন</span>
              </p>
              <p className="forgot-instruction-item forgot-instruction-warning">
                <SVGIcon name="alert-triangle" size={16} color="var(--fc-warning)" ariaHidden />
                <span>লিংকটি ১ ঘণ্টা পর মেয়াদোত্তীর্ণ হবে</span>
              </p>
            </div>

            {/* Spam notice */}
            <div className="forgot-spam-notice">
              <SVGIcon name="info" size={14} color="var(--fc-gray-400)" ariaHidden />
              <span>ইমেইল না পেলে স্প্যাম / জাংক ফোল্ডার চেক করুন</span>
            </div>

            {/* Action buttons */}
            <div className="forgot-actions">

              {/* Resend button with cooldown */}
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                loading={isResending}
                icon="refresh"
              >
                {resendCooldown > 0
                  ? `আবার পাঠান (${resendCooldown}s)`
                  : 'ইমেইল আবার পাঠান'
                }
              </Button>

              {/* Try different email */}
              <button
                type="button"
                className="forgot-text-btn"
                onClick={handleTryDifferentEmail}
              >
                ভিন্ন ইমেইল ঠিকানা ব্যবহার করুন
              </button>

            </div>

            {/* Back to login */}
            <Link to="/login" className="forgot-back-link">
              <SVGIcon name="arrow-left" size={16} ariaHidden />
              <span>লগইন পেজে ফিরে যান</span>
            </Link>

          </div>
        </div>
      </>
    );
  }

  // ── MAIN FORM STATE ────────────────────────────────────
  return (
    <>
      {/* ── SEO META ────────────────────────────────── */}
      <Helmet>
        <title>
          পাসওয়ার্ড ভুলে গেছেন? — FlashCart
          {isPartnerPortal ? ' Partner' : ''}
        </title>
        <meta
          name="description"
          content="FlashCart পাসওয়ার্ড ভুলে গেলে রিসেট করুন। আপনার ইমেইলে রিসেট লিংক পাঠানো হবে। Reset your FlashCart password via email."
        />
        {/* Noindex — private utility page */}
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`${isPartnerPortal ? PORTAL_URLS.partner : PORTAL_URLS.main}/forgot-password`}
        />
      </Helmet>

      {/* ── PAGE ────────────────────────────────────── */}
      <div className="forgot-page">
        <div className="forgot-card animate-slide-up">

          {/* Back button */}
          <Link
            to="/login"
            className="forgot-back-btn"
            aria-label="লগইন পেজে ফিরে যান"
          >
            <SVGIcon name="arrow-left" size={20} ariaHidden />
          </Link>

          {/* Lock icon */}
          <div className="forgot-icon-wrapper" aria-hidden="true">
            <div className="forgot-icon-circle">
              <SVGIcon
                name="lock"
                size={32}
                color="var(--fc-primary)"
                ariaHidden
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="forgot-title">পাসওয়ার্ড ভুলে গেছেন?</h1>

          {/* Description */}
          <p className="forgot-message">
            চিন্তা নেই! আপনার রেজিস্টার্ড ইমেইল ঠিকানা দিন।
            আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব।
          </p>

          {/* Reset form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="forgot-form"
            aria-label="পাসওয়ার্ড রিসেট ফর্ম"
          >

            {/* Email field */}
            <Input
              label="ইমেইল ঠিকানা"
              type="email"
              placeholder="আপনার রেজিস্টার্ড ইমেইল লিখুন"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitted) {
                  setEmailError('');
                  clearAuthError();
                }
              }}
              error={submitted ? emailError : ''}
              iconLeft="email"
              required
              autoComplete="email"
              id="forgot-email"
              name="email"
              helper="আপনার অ্যাকাউন্টে ব্যবহৃত ইমেইল ঠিকানা দিন"
            />

            {/* Global auth error */}
            {authError && (
              <div
                className="forgot-error-box"
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
              {actionLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
            </Button>

          </form>

          {/* Security note */}
          <div className="forgot-security-note">
            <SVGIcon name="lock" size={14} color="var(--fc-gray-400)" ariaHidden />
            <span>
              নিরাপত্তার জন্য লিংকটি ১ ঘণ্টা পর মেয়াদোত্তীর্ণ হবে
            </span>
          </div>

          {/* Back to login */}
          <p className="forgot-login-text">
            পাসওয়ার্ড মনে পড়ে গেছে?{' '}
            <Link to="/login" className="forgot-login-link">
              লগইন করুন
            </Link>
          </p>

          {/* Register link */}
          <p className="forgot-register-text">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="forgot-login-link">
              বিনামূল্যে রেজিস্ট্রেশন করুন
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
