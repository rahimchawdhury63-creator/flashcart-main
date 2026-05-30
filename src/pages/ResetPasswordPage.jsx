// ResetPasswordPage.jsx — Send a Firebase password-reset email.
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { LogoMark } from '../components/svgs'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try { await resetPassword(email); setSent(true); toast.success('Reset link sent') }
    catch { toast.error('Could not send reset email') } finally { setLoading(false) }
  }

  return (
    <main className="page">
      <SEOHead title={t('resetPassword')} description="Reset your FlashCart password." />
      <div className="auth-wrap">
        <div className="text-center mb-2">
          <span className="text-primary"><LogoMark size={40} /></span>
          <h1>{t('resetPassword')}</h1>
        </div>
        <div className="auth-card">
          {sent ? (
            <div className="text-center">
              <p>Check your email for a reset link.</p>
              <Link to="/login" className="btn btn-primary">{t('login')}</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : t('sendResetLink')}
              </button>
              <p className="text-center mt-2"><Link to="/login">{t('login')}</Link></p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
