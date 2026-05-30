// ProfilePage.jsx — User profile: info, photo upload, language, logout.
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import ImageUpload from '../components/common/ImageUpload'
import LanguageSwitch from '../components/common/LanguageSwitch'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { IconUser, IconLogout, IconReceipt, IconBell } from '../components/svgs'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, isLoggedIn, logout, updateUserProfile, resendVerification } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [name, setName] = useState(profile?.displayName || '')
  const [phone, setPhone] = useState(profile?.phoneNumber || '')
  const [photo, setPhoto] = useState(profile?.photoURL || '')
  const [saving, setSaving] = useState(false)

  if (!isLoggedIn) {
    return (
      <main className="page container section" style={{ textAlign: 'center' }}>
        <SEOHead title={t('profile')} description="Manage your FlashCart profile." />
        <IconUser size={48} />
        <h1>{t('profile')}</h1>
        <p className="text-secondary">{t('login')} to manage your account.</p>
        <div className="flex gap-2 justify-center">
          <Link to="/login" className="btn btn-primary">{t('login')}</Link>
          <Link to="/signup" className="btn btn-outline">{t('signup')}</Link>
        </div>
      </main>
    )
  }

  const onSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile({ displayName: name, phoneNumber: phone, photoURL: photo })
      toast.success('Profile updated')
    } catch { toast.error('Could not save') } finally { setSaving(false) }
  }

  const onLogout = async () => { await logout(); navigate('/') }

  return (
    <main className="page container">
      <SEOHead title={t('profile')} description="Manage your FlashCart profile." />
      <section className="section" style={{ maxWidth: 520 }}>
        <h1>{t('profile')}</h1>

        {/* Email verification reminder */}
        {user && !user.emailVerified && (
          <div className="card card-body mb-2" style={{ borderColor: 'var(--color-warning)' }}>
            <p style={{ margin: 0 }}>{t('verifyEmail')}</p>
            <button className="btn btn-outline btn-sm mt-1" onClick={async () => { await resendVerification(); toast.success('Verification email sent') }}>
              Resend verification email
            </button>
          </div>
        )}

        <div className="card card-body">
          <ImageUpload value={photo} onUploaded={setPhoto} label="Profile Photo" />
          <div className="form-group mt-2">
            <label className="form-label">{t('fullName')}</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input className="form-input" value={profile?.email || ''} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">{t('phoneNumber')}</label>
            <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
          </div>
          <button className="btn btn-primary btn-block" onClick={onSave} disabled={saving}>
            {saving ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </div>

        {/* Quick links */}
        <div className="card card-body mt-2">
          <Link to="/orders" className="flex items-center gap-2" style={{ color: 'inherit', padding: '8px 0' }}><IconReceipt size={20} /> {t('orders')}</Link>
          <div className="divider" style={{ margin: '4px 0' }} />
          <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
            <span className="flex items-center gap-2"><IconBell size={20} /> Language</span>
            <LanguageSwitch />
          </div>
        </div>

        <button className="btn btn-outline btn-block mt-2" onClick={onLogout} style={{ color: 'var(--color-error)' }}>
          <IconLogout size={18} /> {t('logout')}
        </button>
      </section>
    </main>
  )
}
