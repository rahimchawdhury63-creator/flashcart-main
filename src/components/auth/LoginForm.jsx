// LoginForm.jsx — Email/password login with validation.
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import GoogleSignIn from './GoogleSignIn'
import { IconEye, IconEyeOff } from '../svgs'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const { loginWithEmail } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="email">{t('email')}</label>
        <input id="email" className="form-input" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="password">{t('password')}</label>
        <div className="input-icon">
          <input id="password" className="form-input" type={show ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required
            style={{ paddingLeft: 14, paddingRight: 44 }} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility"
            style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)' }}>
            {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? <span className="spinner" /> : t('login')}
      </button>
      <div className="text-center mt-1">
        <Link to="/reset-password">{t('forgotPassword')}</Link>
      </div>
      <div className="divider-text">or</div>
      <GoogleSignIn />
      <p className="text-center mt-2 text-secondary">
        {t('noAccount')} <Link to="/signup">{t('signup')}</Link>
      </p>
    </form>
  )
}
