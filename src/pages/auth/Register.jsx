/**
 * =============================================================================
 * FLASHCART — Registration Page
 * =============================================================================
 *
 * Purpose: New user account creation with comprehensive validation.
 *
 * Features:
 * - Full registration form (name, email, phone, password, confirm)
 * - Password strength meter integration
 * - Terms acceptance checkbox
 * - Google OAuth alternative
 * - Email verification trigger on successful registration
 * - Bilingual UI
 * - SEO optimized
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
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import {
  MailIcon,
  LockIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeOffIcon,
  FlashCartLogoIcon,
  WarningIcon
} from '@/components/icons';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, registerWithEmail, currentUser } = useAuth();
  const t = useTranslation();

  /* --- Form State --- */
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(null);

  /* Redirect destination */
  const from = location.state?.from || '/verify-email';

  /* Redirect if already logged in */
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  /* =========================================================================== */
  /* HANDLERS                                                                    */
  /* =========================================================================== */

  /**
   * Update form field
   */
  const handleFieldChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrorKey(null);
  };

  /**
   * Google sign-in handler
   */
  const handleGoogleSignIn = async () => {
    setErrorKey(null);
    setGoogleLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
      navigate(from === '/verify-email' ? '/' : from, { replace: true });
    } else {
      setErrorKey(result.error);
      setGoogleLoading(false);
    }
  };

  /**
   * Email registration handler with full validation
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorKey(null);

    const { displayName, email, phone, password, confirmPassword } = formData;

    /* --- Validation --- */
    if (!displayName || displayName.trim().length < 2) {
      setErrorKey('auth.errors.invalidName');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorKey('auth.errors.invalidEmail');
      return;
    }
    if (!password || password.length < 8) {
      setErrorKey('auth.errors.weakPassword');
      return;
    }
    if (password !== confirmPassword) {
      setErrorKey('auth.errors.passwordsDoNotMatch');
      return;
    }
    if (!acceptTerms) {
      setErrorKey('auth.errors.acceptTermsRequired');
      return;
    }

    setLoading(true);
    const result = await registerWithEmail(email, password, {
      displayName: displayName.trim(),
      phone: phone.trim()
    });

    if (result.success) {
      /* Redirect to email verification page */
      navigate('/verify-email', { replace: true });
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
      <MetaTags
        title={t('auth.register.title')}
        description={t('auth.register.seoDescription')}
        keywords="FlashCart signup, register, create account, Bangladesh free delivery"
        canonical="/register"
      />

      <div className="auth-page">
        <div className="auth-container">
          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo" aria-label="FlashCart Home">
              <FlashCartLogoIcon size={48} color="var(--color-primary)" />
            </Link>
            <h1 className="auth-title">{t('auth.register.title')}</h1>
            <p className="auth-subtitle">{t('auth.register.subtitle')}</p>
          </div>

          {/* Error */}
          {errorKey && (
            <div className="auth-error" role="alert">
              <WarningIcon size={18} />
              <span>{t(errorKey)}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            loading={googleLoading}
            disabled={loading}
            label={t('auth.register.registerWithGoogle')}
          />

          <div className="auth-divider">
            <span>{t('auth.login.orContinueWith')}</span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="auth-form" noValidate>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                {t('auth.register.nameLabel')}
              </label>
              <div className="form-input-wrapper">
                <UserIcon size={18} className="form-input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.register.namePlaceholder')}
                  value={formData.displayName}
                  onChange={handleFieldChange('displayName')}
                  autoComplete="name"
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                {t('auth.register.emailLabel')}
              </label>
              <div className="form-input-wrapper">
                <MailIcon size={18} className="form-input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.register.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleFieldChange('email')}
                  autoComplete="email"
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="reg-phone" className="form-label">
                {t('auth.register.phoneLabel')}
              </label>
              <div className="form-input-wrapper">
                <PhoneIcon size={18} className="form-input-icon" />
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.register.phonePlaceholder')}
                  value={formData.phone}
                  onChange={handleFieldChange('phone')}
                  autoComplete="tel"
                  pattern="01[3-9][0-9]{8}"
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                {t('auth.register.passwordLabel')}
              </label>
              <div className="form-input-wrapper">
                <LockIcon size={18} className="form-input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.register.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleFieldChange('password')}
                  autoComplete="new-password"
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
              {/* Password Strength Meter */}
              <PasswordStrengthMeter password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm-password" className="form-label">
                {t('auth.register.confirmPasswordLabel')}
              </label>
              <div className="form-input-wrapper">
                <LockIcon size={18} className="form-input-icon" />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input form-input-with-icon"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleFieldChange('confirmPassword')}
                  autoComplete="new-password"
                  required
                  disabled={loading || googleLoading}
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="form-error">
                  <WarningIcon size={14} />
                  {t('auth.errors.passwordsDoNotMatch')}
                </p>
              )}
            </div>

            {/* Terms Acceptance */}
            <label className="auth-checkbox auth-terms">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span>{t('auth.register.acceptTerms')}</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary btn-block btn-lg ${loading ? 'btn-loading' : ''}`}
              disabled={loading || googleLoading || !acceptTerms}
            >
              {t('auth.register.registerButton')}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <span>{t('auth.register.haveAccount')}</span>
            <Link to="/login" className="auth-link auth-link-bold">
              {t('auth.register.loginLink')}
            </Link>
          </div>

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

        {/* Decoration */}
        <div className="auth-decoration" aria-hidden="true">
          <div className="auth-decoration-content">
            <FlashCartLogoIcon size={120} color="white" />
            <h2 className="auth-decoration-title">Welcome</h2>
            <p className="auth-decoration-text">{t('home.becomePartner.subtitle')}</p>
            <div className="auth-decoration-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">10K+</span>
                <span className="auth-feature-label">Customers</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">500+</span>
                <span className="auth-feature-label">Shops</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">64</span>
                <span className="auth-feature-label">Districts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
