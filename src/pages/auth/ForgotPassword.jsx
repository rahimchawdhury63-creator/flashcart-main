/**
 * =============================================================================
 * FLASHCART — Forgot Password Page
 * =============================================================================
 *
 * Purpose: Send password reset email to user.
 *
 * Features:
 * - Simple email input form
 * - Success state with clear instructions
 * - Resend option
 * - Back to login link
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import MetaTags from '@/seo/MetaTags';
import {
  MailIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  FlashCartLogoIcon,
  WarningIcon
} from '@/components/icons';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const t = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorKey, setErrorKey] = useState(null);

  /**
   * Handle password reset email request
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorKey(null);

    if (!email || !email.includes('@')) {
      setErrorKey('auth.errors.invalidEmail');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setErrorKey(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <MetaTags
        title={t('auth.forgotPassword.title')}
        description={t('auth.forgotPassword.seoDescription')}
        canonical="/forgot-password"
      />

      <div className="auth-page">
        <div className="auth-container">
          {/* Back Link */}
          <Link to="/login" className="auth-back-link">
            <ArrowLeftIcon size={18} />
            <span>{t('auth.forgotPassword.backToLogin')}</span>
          </Link>

          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <FlashCartLogoIcon size={56} color="var(--color-primary)" />
            </Link>

            {!success ? (
              <>
                <h1 className="auth-title">{t('auth.forgotPassword.title')}</h1>
                <p className="auth-subtitle">{t('auth.forgotPassword.subtitle')}</p>
              </>
            ) : (
              <>
                <div className="auth-success-icon">
                  <CheckCircleIcon size={64} color="var(--color-success)" />
                </div>
                <h1 className="auth-title">{t('auth.forgotPassword.successTitle')}</h1>
                <p className="auth-subtitle">{t('auth.forgotPassword.successMessage')}</p>
              </>
            )}
          </div>

          {!success ? (
            <>
              {/* Error */}
              {errorKey && (
                <div className="auth-error" role="alert">
                  <WarningIcon size={18} />
                  <span>{t(errorKey)}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleResetPassword} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="fp-email" className="form-label">
                    {t('auth.forgotPassword.emailLabel')}
                  </label>
                  <div className="form-input-wrapper">
                    <MailIcon size={18} className="form-input-icon" />
                    <input
                      id="fp-email"
                      type="email"
                      className="form-input form-input-with-icon"
                      placeholder={t('auth.forgotPassword.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-block btn-lg ${loading ? 'btn-loading' : ''}`}
                  disabled={loading}
                >
                  {t('auth.forgotPassword.sendButton')}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-actions">
              <p className="auth-success-note">
                {email}
              </p>
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={() => { setSuccess(false); setEmail(''); }}
              >
                {t('auth.verifyEmail.resendButton')}
              </button>
              <Link to="/login" className="btn btn-ghost btn-block">
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </div>
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

export default ForgotPassword;
