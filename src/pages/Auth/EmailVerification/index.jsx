// ============================================================
// FlashCart — Email Verification Page
// Shows after registration. Guides user to verify their email.
// Auto-polls Firebase every 5 seconds to detect verification.
// Allows resending the verification email.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React core imports
import React, {
  useState,    // Local component state
  useEffect,   // Side effects — polling timer, redirect
  useCallback, // Memoized functions
} from 'react';

// React Router for navigation after verification
import { useNavigate, Link } from 'react-router-dom';

// React Helmet Async for page SEO meta tags
import { Helmet } from 'react-helmet-async';

// Auth hook for user state and verification functions
import useAuth from '../../../hooks/useAuth';

// Firebase auth functions for verification checking
import {
  refreshUserEmailVerification, // Reloads user to get latest emailVerified
  resendEmailVerification,      // Sends another verification email
} from '../../../services/firebase/auth';

// Common UI components
import Button from '../../../components/common/Button/Button';
import SVGIcon from '../../../components/common/SVGIcon/SVGIcon';

// Constants for URLs
import { PORTAL_URLS, SITE_META } from '../../../utils/constants';

// Page-specific styles
import './EmailVerification.css';

/**
 * EmailVerificationPage
 * Displayed after registration before email is verified.
 * Also accessible from user profile if email is unverified.
 *
 * FLOW:
 * 1. User registers → redirected here
 * 2. Page polls Firebase every 5s for emailVerified change
 * 3. When verified → shows success → redirects to home/dashboard
 * 4. User can request resend if email not received
 */
const EmailVerificationPage = () => {

  // ── HOOKS ──────────────────────────────────────────────
  const navigate = useNavigate();

  // Get user data and auth functions from context
  const {
    user,            // Firebase Auth user object
    isLoggedIn,      // Whether user is logged in
    authLoading,     // Firebase Auth still initializing
    isEmailVerified, // Whether email is verified
  } = useAuth();

  // ── STATE ──────────────────────────────────────────────

  // Whether we're currently checking verification status
  const [isChecking, setIsChecking] = useState(false);

  // Whether verification was just confirmed (shows success UI)
  const [isVerified, setIsVerified] = useState(false);

  // Whether resend is in progress
  const [isResending, setIsResending] = useState(false);

  // Message shown after resend attempt
  const [resendMessage, setResendMessage] = useState('');

  // Whether resend was successful (controls message style)
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer for resend cooldown (prevent spam)
  const [resendCooldown, setResendCooldown] = useState(0);

  // How many times we've polled (for showing "still checking" message)
  const [pollCount, setPollCount] = useState(0);

  // Portal type detection
  const isPartnerPortal = import.meta.env.VITE_PORTAL_TYPE === 'partner';

  // Where to go after verification
  const afterVerificationPath = isPartnerPortal ? '/onboarding' : '/';

  // ── REDIRECT LOGIC ─────────────────────────────────────

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (!isLoggedIn) {
      // Not logged in — go to login page
      navigate('/login', { replace: true });
      return;
    }

    // If already verified, redirect immediately
    if (isEmailVerified) {
      setIsVerified(true);
      // Small delay for UX — show verified state briefly
      setTimeout(() => {
        navigate(afterVerificationPath, { replace: true });
      }, 2000);
    }
  }, [isLoggedIn, isEmailVerified, authLoading, navigate, afterVerificationPath]);

  // ── AUTO-POLLING FOR VERIFICATION ─────────────────────

  // Poll Firebase every 5 seconds to check if email was verified
  // This lets us auto-redirect when user clicks the email link
  useEffect(() => {
    // Don't poll if already verified or not logged in
    if (isVerified || !isLoggedIn || authLoading) return;

    // Set up polling interval
    const pollInterval = setInterval(async () => {
      try {
        // Reload user from Firebase to get fresh emailVerified status
        const verified = await refreshUserEmailVerification();

        // Increment poll count for UI feedback
        setPollCount(prev => prev + 1);

        if (verified) {
          // Email was verified!
          setIsVerified(true);
          clearInterval(pollInterval); // Stop polling

          // Redirect after brief success display
          setTimeout(() => {
            navigate(afterVerificationPath, { replace: true });
          }, 2500);
        }
      } catch (error) {
        // Polling error — non-critical, just continue
        console.warn('[FlashCart] Verification poll failed:', error.message);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup: stop polling when component unmounts
    return () => clearInterval(pollInterval);

  }, [isVerified, isLoggedIn, authLoading, navigate, afterVerificationPath]);

  // ── MANUAL CHECK HANDLER ───────────────────────────────

  /**
   * handleManualCheck
   * Manually checks if email is verified (user-triggered).
   * Shows loading state while checking.
   */
  const handleManualCheck = useCallback(async () => {
    setIsChecking(true);
    setResendMessage(''); // Clear any previous messages

    try {
      const verified = await refreshUserEmailVerification();

      if (verified) {
        // Verified!
        setIsVerified(true);
        setTimeout(() => {
          navigate(afterVerificationPath, { replace: true });
        }, 2000);
      } else {
        // Still not verified
        setResendMessage('ইমেইল এখনো যাচাই হয়নি। লিংকটিতে ক্লিক করুন। / Email not verified yet. Please click the link in your email.');
        setResendSuccess(false);
      }
    } catch (error) {
      setResendMessage('যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setResendSuccess(false);
    } finally {
      setIsChecking(false);
    }
  }, [navigate, afterVerificationPath]);

  // ── RESEND HANDLER ─────────────────────────────────────

  /**
   * handleResend
   * Resends the verification email.
   * Enforces a 60-second cooldown between resends.
   */
  const handleResend = useCallback(async () => {
    // Enforce cooldown to prevent email spam
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setResendMessage('');

    try {
      await resendEmailVerification();

      // Success — show confirmation message
      setResendMessage('নতুন যাচাই লিংক পাঠানো হয়েছে। আপনার ইমেইল চেক করুন। / New verification link sent. Please check your email.');
      setResendSuccess(true);

      // Start 60-second cooldown
      setResendCooldown(60);

    } catch (error) {
      // Handle specific errors
      if (error.message.includes('too-many-requests') ||
          error.message.includes('অনেক বার')) {
        setResendMessage('অনেক বার চেষ্টা করেছেন। কিছুক্ষণ পরে আবার চেষ্টা করুন।');
      } else {
        setResendMessage(`পাঠানো সম্ভব হয়নি: ${error.message}`);
      }
      setResendSuccess(false);

    } finally {
      setIsResending(false);
    }
  }, [resendCooldown, isResending]);

  // ── COOLDOWN TIMER ─────────────────────────────────────

  // Count down the resend cooldown every second
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

  // ── LOADING STATE ──────────────────────────────────────
  if (authLoading) {
    return (
      <div className="verify-page verify-loading">
        <SVGIcon name="refresh" size={36} className="icon-spin" color="var(--fc-primary)" ariaHidden />
      </div>
    );
  }

  // ── VERIFIED SUCCESS STATE ─────────────────────────────
  if (isVerified) {
    return (
      <>
        <Helmet>
          <title>ইমেইল যাচাই সফল — FlashCart</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="verify-page">
          <div className="verify-card animate-scale-spring">

            {/* Animated success checkmark */}
            <div className="verify-success-icon">
              <SVGIcon
                name="check-circle-filled"
                size={72}
                color="var(--fc-success)"
                ariaHidden
              />
            </div>

            {/* Success message */}
            <h1 className="verify-title verify-title-success">
              ইমেইল যাচাই সফল হয়েছে!
            </h1>

            <p className="verify-message">
              আপনার অ্যাকাউন্ট এখন সক্রিয়।
              {isPartnerPortal
                ? ' এখন আপনার ব্যবসার তথ্য পূরণ করুন।'
                : ' এখন অর্ডার করতে পারবেন।'
              }
            </p>

            {/* Redirecting indicator */}
            <div className="verify-redirecting" aria-live="polite">
              <SVGIcon name="refresh" size={16} className="icon-spin" color="var(--fc-gray-400)" ariaHidden />
              <span>স্বয়ংক্রিয়ভাবে নিয়ে যাওয়া হচ্ছে...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN VERIFICATION WAITING STATE ───────────────────
  return (
    <>
      {/* ── SEO META ────────────────────────────────── */}
      <Helmet>
        <title>
          ইমেইল যাচাই করুন — FlashCart
          {isPartnerPortal ? ' Partner' : ''}
        </title>
        <meta
          name="description"
          content="আপনার FlashCart অ্যাকাউন্ট সক্রিয় করতে ইমেইল যাচাই করুন। Verify your email to activate your FlashCart account."
        />
        {/* Noindex — private page, not for search engines */}
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`${isPartnerPortal ? PORTAL_URLS.partner : PORTAL_URLS.main}/verify-email`}
        />
      </Helmet>

      {/* ── PAGE ────────────────────────────────────── */}
      <div className="verify-page">
        <div className="verify-card animate-slide-up">

          {/* Email icon with pulse animation */}
          <div className="verify-icon-wrapper" aria-hidden="true">
            {/* Outer ping ring */}
            <div className="verify-ping-ring" />
            {/* Inner icon */}
            <div className="verify-icon">
              <SVGIcon
                name="email"
                size={36}
                color="var(--fc-primary)"
                ariaHidden
              />
            </div>
          </div>

          {/* Page heading */}
          <h1 className="verify-title">ইমেইল যাচাই করুন</h1>

          {/* Instruction text */}
          <p className="verify-message">
            আপনার ইমেইলে একটি যাচাই লিংক পাঠানো হয়েছে।
            <br />
            {/* Show masked email if available */}
            {user?.email && (
              <strong className="verify-email">
                {maskEmail(user.email)}
              </strong>
            )}
          </p>

          <p className="verify-instruction">
            ইমেইলে যাচাই লিংকে ক্লিক করুন। এই পেজটি স্বয়ংক্রিয়ভাবে আপডেট হবে।
          </p>

          {/* Polling status indicator */}
          <div className="verify-polling-status" aria-live="polite">
            <SVGIcon name="refresh" size={14} className="icon-spin" color="var(--fc-gray-400)" ariaHidden />
            <span>
              {pollCount > 0
                ? `যাচাই চেক করা হচ্ছে... (${pollCount})`
                : 'অপেক্ষা করা হচ্ছে...'
              }
            </span>
          </div>

          {/* Divider */}
          <div className="verify-divider" role="separator" />

          {/* Actions */}
          <div className="verify-actions">

            {/* Manual check button */}
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleManualCheck}
              loading={isChecking}
              disabled={isChecking}
              icon="check-circle"
            >
              {isChecking ? 'চেক করা হচ্ছে...' : 'এখনই চেক করুন'}
            </Button>

            {/* Resend button with cooldown */}
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              loading={isResending}
              icon="email"
            >
              {resendCooldown > 0
                ? `আবার পাঠান (${resendCooldown}s)`
                : isResending
                  ? 'পাঠানো হচ্ছে...'
                  : 'যাচাই লিংক আবার পাঠান'
              }
            </Button>
          </div>

          {/* Resend result message */}
          {resendMessage && (
            <div
              className={`verify-message-box ${resendSuccess ? 'verify-message-success' : 'verify-message-error'}`}
              role="alert"
              aria-live="polite"
            >
              <SVGIcon
                name={resendSuccess ? 'check-circle' : 'alert-circle'}
                size={16}
                ariaHidden
              />
              <span>{resendMessage}</span>
            </div>
          )}

          {/* Help text */}
          <div className="verify-help">
            <p>
              <strong>ইমেইল না পেলে:</strong>
            </p>
            <ul className="verify-help-list">
              <li>স্প্যাম / জাংক ফোল্ডার চেক করুন</li>
              <li>কয়েক মিনিট অপেক্ষা করুন</li>
              <li>উপরে "আবার পাঠান" বাটনে ক্লিক করুন</li>
            </ul>
          </div>

          {/* Logout link */}
          <p className="verify-logout-text">
            ভুল অ্যাকাউন্টে লগইন করেছেন?{' '}
            <Link to="/login" className="verify-logout-link">
              অন্য অ্যাকাউন্টে লগইন করুন
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

// ── HELPER FUNCTIONS ───────────────────────────────────────

/**
 * maskEmail
 * Masks an email address for privacy display.
 * Example: "rizwan@gmail.com" → "ri***@gmail.com"
 *
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;

  const [local, domain] = email.split('@');

  // Show first 2 characters, mask the rest
  const maskedLocal = local.slice(0, 2) + '***';

  return `${maskedLocal}@${domain}`;
};

export default EmailVerificationPage;
