/**
 * =============================================================================
 * FLASHCART — Email Verification Page
 * =============================================================================
 *
 * Purpose: Page shown after registration prompting user to verify their email.
 * Allows resending verification email and checking verification status.
 *
 * Features:
 * - Clear instructions
 * - Resend verification email button (with cooldown)
 * - Auto-redirect when verified
 * - Sign out option
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import MetaTags from '@/seo/MetaTags';
import {
  MailIcon,
  CheckCircleIcon,
  FlashCartLogoIcon,
  LogoutIcon
} from '@/components/icons';
import './ForgotPassword.css';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { currentUser, isEmailVerified, resendVerificationEmail, signOut } = useAuth();
  const t = useTranslation();

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  /* Auto-redirect if email is verified */
  useEffect(() => {
    if (isEmailVerified) {
      const timer = setTimeout(() => navigate('/', { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [isEmailVerified, navigate]);

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  /* Cooldown timer for resend button */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Handle resend verification email
   */
  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);

    const result = await resendVerificationEmail();

    if (result.success) {
      setResendSuccess(true);
      setResendCooldown(60); /* 60-second cooldown */
    }
    setResending(false);
  };

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <MetaTags
        title={t('auth.verifyEmail.title')}
        description="Verify your email to access FlashCart"
        canonical="/verify-email"
        noindex={true}
      />

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <FlashCartLogoIcon size={56} color="var(--color-primary)" />
            </Link>

            {isEmailVerified ? (
              <>
                <div className="auth-success-icon">
                  <CheckCircleIcon size={64} color="var(--color-success)" />
                </div>
                <h1 className="auth-title">{t('auth.verifyEmail.verified')}</h1>
                <p className="auth-subtitle">{t('auth.verifyEmail.continueShopping')}...</p>
              </>
            ) : (
              <>
                <div className="auth-success-icon">
                  <MailIcon size={64} color="var(--color-primary)" />
                </div>
                <h1 className="auth-title">{t('auth.verifyEmail.title')}</h1>
                <p className="auth-subtitle">{t('auth.verifyEmail.subtitle')}</p>
              </>
            )}
          </div>

          {!isEmailVerified && (
            <>
              {/* Current email display */}
              <p className="auth-success-note">{currentUser?.email}</p>

              {/* Resend success notification */}
              {resendSuccess && (
                <div className="auth-error" style={{
                  backgroundColor: 'var(--color-success-light)',
                  borderColor: 'var(--color-success)',
                  color: 'var(--color-success)'
                }} role="status">
                  <CheckCircleIcon size={18} />
                  <span>{t('auth.forgotPassword.successTitle')}</span>
                </div>
              )}

              <div className="auth-success-actions">
                <button
                  type="button"
                  className={`btn btn-primary btn-block btn-lg ${resending ? 'btn-loading' : ''}`}
                  onClick={handleResend}
                  disabled={resending || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `${t('auth.verifyEmail.resendButton')} (${resendCooldown}s)`
                    : t('auth.verifyEmail.resendButton')}
                </button>

                <p className="auth-success-note" style={{ marginTop: 'var(--space-4)', backgroundColor: 'transparent' }}>
                  {t('auth.verifyEmail.checkSpam')}
                </p>

                <button
                  type="button"
                  className="btn btn-ghost btn-block"
                  onClick={handleSignOut}
                >
                  <LogoutIcon size={18} />
                  {t('nav.logout')}
                </button>
              </div>
            </>
          )}

          <div className="auth-brand-footer">
            <span>{t('common.poweredBy')}</span>
            <a
              href="https://www.bsdc.info.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-brand-link"
            >
              Bangladesh Software Development Community
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
