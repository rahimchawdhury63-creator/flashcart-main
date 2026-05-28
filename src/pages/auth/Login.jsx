/**
 * =============================================================================
 * FLASHCART — Login Page
 * =============================================================================
 *
 * Purpose: User login with Google OAuth and Email/Password options.
 * Fully responsive, bilingual, SEO-optimized.
 *
 * Features:
 * - Google OAuth one-click sign-in
 * - Email/Password form with validation
 * - Show/hide password toggle
 * - Remember me option
 * - Forgot password link
 * - Error display with bilingual messages
 * - Redirect to original destination after login
 * - SEO meta tags
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import MetaTags from '@/seo/MetaTags';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  FlashCartLogoIcon,
  WarningIcon
} from '@/components/icons';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithEmail, currentUser } = useAuth();
  const t = useTranslation();

  /* --- Form State --- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(null);

  /* Get redirect destination from location state */
  const from = location.state?.from || '/';

  /* Redirect if already logged in */
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  /* =========================================================================== */
  /* FORM HANDLERS                                                               */
  /* =========================================================================== */

  /**
   * Handle Google sign-in click
   */
  const handleGoogleSignIn = async () => {
    setErrorKey(null);
    setGoogleLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorKey(result.error);
      setGoogleLoading(false);
    }
  };

  /**
   * Handle email/password form submission
   */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorKey(null);

    /* Basic client-side validation */
    if (!email || !email.includes('@')) {
      setErrorKey('auth.errors.invalidEmail');
      return;
    }
    if (!password || password.length < 6) {
      setErrorKey('auth.errors.invalidPassword');
      return;
    }

    setLoading(true);
    const result = await signInWithEmail(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorKey(result.error);
      setLoading(false);
    }
  };

  /* =========================================================================== */
  /* RENDER                                                                      */
  /* =========================================================================== */

  return (
    <>
      {/* SEO Meta Tags */}
      <MetaTags
        title={t('auth.login.title')}
        description={t('auth.login.seoDescription')}
        keywords="FlashCart login, sign in, Bangladesh delivery login, food order login"
        canonical="/login"
      />

      <div className="auth-page">
        <div className="auth-container">
          {/* Logo and Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo" aria-label="FlashCart Home">
              <FlashCartLogoIcon size={56} color="var(--color-primary)" />
            </Link>
            <h1 className="auth-title">{t('auth.login.title')}</h1>
            <p className="auth-subtitle">{t('auth.login.subtitle')}</p>
          </div>

          {/* Error Message */}
          {errorKey && (
            <div className="auth-error" role="alert">
              <WarningIcon size={18} />
              <span>{t(errorKey)}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            loading={googleLoading}
            disabled={loading}
            label={t('auth.login.loginWithGoogle')}
          />

          {/* Divider */}
          <div className="auth-divider">
            <span>{t('auth.login.orContinueWith')}</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                {t('auth.login.emailLabel')}
              </label>
              <div className="form-input-wrapper">
                <MailIcon size={18} className="form-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                {t('auth.login.passwordLabel')}
              </label>
              <div className="form-input-wrapper">
                <LockIcon size={18} className="form-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading || googleLoading}
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="auth-form-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>{t('auth.login.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="auth-link">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary btn-block btn-lg ${loading ? 'btn-loading' : ''}`}
              disabled={loading || googleLoading}
            >
              {t('auth.login.loginButton')}
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer">
            <span>{t('auth.login.noAccount')}</span>
            <Link to="/register" className="auth-link auth-link-bold">
              {t('auth.login.signUpLink')}
            </Link>
          </div>

          {/* Branding Footer */}
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

        {/* Right side decoration (desktop only) */}
        <div className="auth-decoration" aria-hidden="true">
          <div className="auth-decoration-content">
            <FlashCartLogoIcon size={120} color="white" />
            <h2 className="auth-decoration-title">FlashCart</h2>
            <p className="auth-decoration-text">{t('common.tagline')}</p>
            <div className="auth-decoration-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">100%</span>
                <span className="auth-feature-label">Free</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">COD</span>
                <span className="auth-feature-label">Available</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">24/7</span>
                <span className="auth-feature-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
