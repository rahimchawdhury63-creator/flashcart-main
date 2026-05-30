// GoogleSignIn.jsx — One-click Google sign-in button.
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { IconGoogle } from '../svgs'
import toast from 'react-hot-toast'

export default function GoogleSignIn({ redirectTo = '/' }) {
  const { loginWithGoogle } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Welcome!')
      navigate(redirectTo)
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn btn-outline btn-block" onClick={onClick} disabled={loading} type="button">
      {loading ? <span className="spinner" /> : <IconGoogle size={20} />}
      {t('signInWithGoogle')}
    </button>
  )
}
