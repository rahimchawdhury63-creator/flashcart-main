// LanguageContext.jsx — Provides the active language and a translate function app-wide.
// Three modes: 'default' (Bangla-English mix), 'bn' (pure Bangla), 'en' (pure English).
// Persists the choice in localStorage and updates <html lang> for SEO/accessibility.

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { translate } from '../data/translations'

export const LanguageContext = createContext(null)

const STORAGE_KEY = 'flashcart_lang'
const VALID = ['default', 'bn', 'en']

export function LanguageProvider({ children }) {
  // Initialize from localStorage, defaulting to the Bangla-English mix.
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return VALID.includes(saved) ? saved : 'default'
  })

  // Keep <html lang> and persistence in sync whenever lang changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    // For SEO, the 'default' mix is treated as Bangla locale.
    document.documentElement.lang = lang === 'en' ? 'en' : 'bn'
  }, [lang])

  // Change the active language (validates input).
  const changeLang = useCallback((next) => {
    if (VALID.includes(next)) setLang(next)
  }, [])

  // Translate a key into the active language.
  const t = useCallback((key) => translate(key, lang), [lang])

  // Pick a localized field from a {bn, en} object (used for store/item names).
  // For 'default' mode we prefer Bangla but fall back to English.
  const pick = useCallback(
    (obj) => {
      if (!obj) return ''
      if (typeof obj === 'string') return obj
      if (lang === 'en') return obj.en || obj.bn || ''
      return obj.bn || obj.en || ''
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  )
}
