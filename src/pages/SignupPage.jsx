// SignupPage.jsx — Wraps the signup form in an auth card layout.
import React from 'react'
import SEOHead from '../components/common/SEOHead'
import SignupForm from '../components/auth/SignupForm'
import { useLanguage } from '../hooks/useLanguage'
import { LogoMark } from '../components/svgs'

export default function SignupPage() {
  const { t } = useLanguage()
  return (
    <main className="page">
      <SEOHead title={t('signup')} description="Create your FlashCart account." canonical="https://flashcart.bsdc.info.bd/signup" />
      <div className="auth-wrap">
        <div className="text-center mb-2">
          <span className="text-primary"><LogoMark size={40} /></span>
          <h1>{t('signup')}</h1>
        </div>
        <div className="auth-card"><SignupForm /></div>
      </div>
    </main>
  )
}
