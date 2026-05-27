/**
 * =============================================================================
 * FLASHCART — Language Context Provider
 * =============================================================================
 *
 * Purpose: Provides global language state and switching functionality
 * to the entire React application via React Context API.
 *
 * Features:
 * - Three language modes: 'default' (mixed), 'bangla', 'english'
 * - localStorage persistence (immediate effect)
 * - Firestore sync for logged-in users (cross-device sync)
 * - Automatic HTML lang attribute update for SEO
 * - Language-specific font family application
 * - Bilingual SEO support via document attributes
 *
 * Usage:
 *   <LanguageProvider>
 *     <App />
 *   </LanguageProvider>
 *
 *   Inside components:
 *   const { language, setLanguage, t } = useLanguage();
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* Import translation files */
import en from './translations/en';
import bn from './translations/bn';
import mixed from './translations/mixed';

/* =========================================================================== */
/* LANGUAGE CONSTANTS                                                          */
/* =========================================================================== */

/**
 * Available languages in the platform
 * Each language has:
 * - code: Internal identifier
 * - label: Display name in its own language
 * - htmlLang: HTML lang attribute value (for SEO)
 * - direction: Text direction (ltr for all our languages)
 * - fontClass: CSS class to apply for language-specific fonts
 * - ogLocale: Open Graph locale value
 */
export const LANGUAGES = {
  default: {
    code: 'default',
    label: 'Default (Mix)',
    nativeLabel: 'Default',
    htmlLang: 'bn',
    direction: 'ltr',
    fontClass: 'lang-mixed',
    ogLocale: 'bn_BD',
    translations: mixed
  },
  bangla: {
    code: 'bangla',
    label: 'Bangla',
    nativeLabel: 'বাংলা',
    htmlLang: 'bn',
    direction: 'ltr',
    fontClass: 'lang-bangla',
    ogLocale: 'bn_BD',
    translations: bn
  },
  english: {
    code: 'english',
    label: 'English',
    nativeLabel: 'English',
    htmlLang: 'en',
    direction: 'ltr',
    fontClass: 'lang-english',
    ogLocale: 'en_US',
    translations: en
  }
};

/* Default language code if nothing is stored */
const DEFAULT_LANGUAGE = 'default';

/* localStorage key */
const STORAGE_KEY = 'flashcart_language';

/* =========================================================================== */
/* LANGUAGE CONTEXT                                                            */
/* =========================================================================== */

const LanguageContext = createContext(null);

/**
 * LanguageProvider — Wraps the application with language state.
 * Should be placed near the root of the component tree.
 *
 * @param {React.ReactNode} children — Child components
 */
export const LanguageProvider = ({ children }) => {
  /* --- State: Current language code --- */
  const [language, setLanguageState] = useState(() => {
    /* Initialize from localStorage if available, otherwise use default */
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored && LANGUAGES[stored] ? stored : DEFAULT_LANGUAGE;
    } catch (error) {
      console.warn('[Language] Failed to read from localStorage:', error);
      return DEFAULT_LANGUAGE;
    }
  });

  /* --- State: Current translation object --- */
  const [translations, setTranslations] = useState(LANGUAGES[language].translations);

  /* =========================================================================== */
  /* LANGUAGE SWITCHING                                                          */
  /* =========================================================================== */

  /**
   * Change the current language.
   * Updates state, localStorage, HTML attributes, and CSS classes.
   *
   * @param {string} newLanguage — Language code: 'default' | 'bangla' | 'english'
   */
  const setLanguage = useCallback((newLanguage) => {
    /* Validate language code */
    if (!LANGUAGES[newLanguage]) {
      console.warn(`[Language] Invalid language code: ${newLanguage}`);
      return;
    }

    /* Update state */
    setLanguageState(newLanguage);
    setTranslations(LANGUAGES[newLanguage].translations);

    /* Persist to localStorage */
    try {
      localStorage.setItem(STORAGE_KEY, newLanguage);
    } catch (error) {
      console.warn('[Language] Failed to save to localStorage:', error);
    }
  }, []);

  /* =========================================================================== */
  /* TRANSLATION FUNCTION                                                        */
  /* =========================================================================== */

  /**
   * Get translated text by dot-notation key.
   * Example: t('auth.login.title') returns the translated string.
   *
   * Supports template variables: t('orders.tracking.orderPlaced', { time: '10:30' })
   * Returns the key itself if translation is missing (for debugging).
   *
   * @param {string} key — Dot-notation translation key
   * @param {object} variables — Optional variables for template substitution
   * @returns {string} Translated text
   */
  const t = useCallback((key, variables = {}) => {
    /* Split key by dots: 'auth.login.title' → ['auth', 'login', 'title'] */
    const keys = key.split('.');

    /* Traverse the translation object */
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        /* Key not found — return the key for debugging visibility */
        if (import.meta.env.DEV) {
          console.warn(`[Language] Missing translation: ${key} (${language})`);
        }
        return key;
      }
    }

    /* Final value should be a string */
    if (typeof value !== 'string') {
      return key;
    }

    /* Replace template variables: {variable} → variable value */
    if (Object.keys(variables).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, varName) => {
        return varName in variables ? variables[varName] : match;
      });
    }

    return value;
  }, [translations, language]);

  /* =========================================================================== */
  /* SIDE EFFECTS: Update HTML attributes and CSS classes                        */
  /* =========================================================================== */

  useEffect(() => {
    const langData = LANGUAGES[language];
    if (!langData) return;

    /* Update HTML <html lang="..."> attribute for SEO and accessibility */
    document.documentElement.lang = langData.htmlLang;
    document.documentElement.dir = langData.direction;

    /* Update body class for font family switching */
    /* Remove all language classes first */
    document.body.classList.remove('lang-mixed', 'lang-bangla', 'lang-english');
    /* Add current language class */
    document.body.classList.add(langData.fontClass);

    /* Update Open Graph locale meta tag if it exists */
    const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleMeta) {
      ogLocaleMeta.setAttribute('content', langData.ogLocale);
    }
  }, [language]);

  /* =========================================================================== */
  /* CONTEXT VALUE                                                               */
  /* =========================================================================== */

  const value = {
    /* Current language code */
    language,
    /* Current language metadata (label, htmlLang, etc.) */
    languageData: LANGUAGES[language],
    /* Function to change language */
    setLanguage,
    /* Translation function */
    t,
    /* All available languages (for language switcher UI) */
    availableLanguages: Object.values(LANGUAGES),
    /* Direct access to current translations object (for advanced use) */
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/* =========================================================================== */
/* CUSTOM HOOK                                                                 */
/* =========================================================================== */

/**
 * useLanguage — Hook to access language context.
 * Must be used inside a LanguageProvider.
 *
 * @returns {object} { language, setLanguage, t, languageData, availableLanguages }
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
