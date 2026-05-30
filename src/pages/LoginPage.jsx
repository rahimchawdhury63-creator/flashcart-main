// LoginPage.jsx — Wraps the login form in an auth card layout.
import React from 'react'
import SEOHead from '../components/common/SEOHead'
import LoginForm from '../components/auth/LoginForm'
import { useLanguage } from '../hooks/useLanguage'
import { LogoMark } from '../components/svgs'

export default function LoginPage() {
  const { t } = useLanguage()
  return (
    <main className="page">
      <SEOHead title={t('login')} description="Log in to FlashCart Bangladesh." canonical="https://flashcart.bsdc.info.bd/login" />
      <div className="auth-wrap">
        <div className="text-center mb-2">
          <span className="text-primary"><LogoMark size={40} /></span>
          <h1>{t('login')}</h1>
        </div>
        <div className="auth-card"><LoginForm /></div>
      </div>
    </main>
  )
}
