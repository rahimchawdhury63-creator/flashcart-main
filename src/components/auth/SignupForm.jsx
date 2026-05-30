// SignupForm.jsx — Email/password registration with strength meter and validation.
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import GoogleSignIn from './GoogleSignIn'
import PasswordStrength from './PasswordStrength'
import toast from 'react-hot-toast'

export default function SignupForm() {
  const { signupWithEmail } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await signupWithEmail(name, email, password)
      toast.success('Account created! Please verify your email.')
      navigate('/')
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already registered.' : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="name">{t('fullName')}</label>
        <input id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="su-email">{t('email')}</label>
        <input id="su-email" className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="su-pass">{t('password')}</label>
        <input id="su-pass" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        <PasswordStrength password={password} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="su-confirm">{t('confirmPassword')}</label>
        <input id="su-confirm" className="form-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? <span className="spinner" /> : t('signup')}
      </button>
      <div className="divider-text">or</div>
      <GoogleSignIn />
      <p className="text-center mt-2 text-secondary">
        {t('haveAccount')} <Link to="/login">{t('login')}</Link>
      </p>
    </form>
  )
}
