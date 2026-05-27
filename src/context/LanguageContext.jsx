// ============================================================
// FlashCart — Language Context Provider
// Global language state management.
// Persists language preference via cookies.
// Updates HTML lang attribute on language change.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// React imports
import React, {
  createContext,   // Creates the context
  useContext,      // Consumes the context
  useState,        // Language state
  useEffect,       // Side effects (persistence, DOM updates)
  useMemo,         // Memoized translator function
  useCallback,     // Memoized callbacks
} from 'react';

// i18n engine functions
import {
  getTranslations,      // Get translation strings for a language
  createTranslator,     // Create pre-bound translator function
  getAvailableLanguages,// Get all language options
  getHTMLLang,          // Get HTML lang attribute value
} from '../i18n/index';

// Cookie persistence utilities
import {
  saveLanguagePreference,  // Save to cookie
  getLanguagePreference,   // Read from cookie
} from '../utils/cookieManager';

// Language constants
import { LANGUAGES } from '../utils/constants';

// ── CREATE LANGUAGE CONTEXT ────────────────────────────────
const LanguageContext = createContext(null);

// ── LANGUAGE PROVIDER COMPONENT ───────────────────────────

/**
 * LanguageProvider
 * Provides language state and translation functions to all children.
 * Must wrap the entire application (or at least the app content).
 *
 * @param {node} children - Child components
 */
export const LanguageProvider = ({ children }) => {

  // ── INITIALIZE LANGUAGE ────────────────────────────────
  // Get saved preference from cookie, fall back to 'default'
  const getSavedLanguage = () => {
    const saved = getLanguagePreference();
    // Validate it's a supported language
    const validLanguages = Object.values(LANGUAGES);
    return validLanguages.includes(saved) ? saved : LANGUAGES.DEFAULT;
  };

  // Current language — initialized from cookie
  const [currentLanguage, setCurrentLanguage] = useState(getSavedLanguage);

  // ── GET TRANSLATION STRINGS ────────────────────────────
  // The raw strings object for the current language
  const strings = useMemo(
    () => getTranslations(currentLanguage),
    [currentLanguage]
  );

  // ── UPDATE HTML ATTRIBUTES ON LANGUAGE CHANGE ─────────
  // When language changes, update the HTML element attributes
  // This is important for:
  // 1. SEO — search engines read the lang attribute
  // 2. Screen readers — use lang for pronunciation
  // 3. CSS — font-family rules can target lang attributes
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Set the lang attribute (e.g. 'bn' or 'en')
    htmlElement.lang = getHTMLLang(currentLanguage);

    // All FlashCart languages are LTR
    htmlElement.dir = 'ltr';

    // Save preference to cookie for persistence
    saveLanguagePreference(currentLanguage);

    // Log in development for debugging
    if (import.meta.env.DEV) {
      console.log(`[FlashCart i18n] Language changed to: ${currentLanguage}`);
    }

  }, [currentLanguage]);

  // ── CHANGE LANGUAGE HANDLER ────────────────────────────

  /**
   * changeLanguage
   * Changes the current language.
   * Persists to cookie automatically via the useEffect above.
   *
   * @param {string} lang - New language code ('default'|'bn'|'en')
   */
  const changeLanguage = useCallback((lang) => {
    // Validate the language code
    const validLanguages = Object.values(LANGUAGES);
    if (!validLanguages.includes(lang)) {
      console.warn(`[FlashCart i18n] Invalid language: "${lang}". Using default.`);
      setCurrentLanguage(LANGUAGES.DEFAULT);
      return;
    }

    setCurrentLanguage(lang);
  }, []);

  // ── TRANSLATOR FUNCTION ────────────────────────────────

  /**
   * translate (t)
   * Translates a key to the current language string.
   * This is the main function components use.
   *
   * @param {string} keyPath - Dot-notation key (e.g. 'common.loading')
   * @param {object} params - Variable substitutions
   * @returns {string} Translated string
   */
  const translate = useMemo(
    () => createTranslator(currentLanguage),
    [currentLanguage]
  );

  // ── AVAILABLE LANGUAGES ────────────────────────────────
  // All language options for the language picker component
  const availableLanguages = useMemo(
    () => getAvailableLanguages(),
    [] // Never changes
  );

  // ── CONVENIENCE BOOLEANS ───────────────────────────────
  const isBangla   = currentLanguage === LANGUAGES.BANGLA;
  const isEnglish  = currentLanguage === LANGUAGES.ENGLISH;
  const isDefault  = currentLanguage === LANGUAGES.DEFAULT;

  // ── CONTEXT VALUE ──────────────────────────────────────
  const contextValue = useMemo(() => ({
    // Current language code
    currentLanguage,

    // Translation function — primary API for components
    t: translate,

    // Raw strings object (for when you need multiple strings at once)
    strings,

    // Language changer
    changeLanguage,

    // Available languages for picker
    availableLanguages,

    // Convenience flags
    isBangla,
    isEnglish,
    isDefault,

    // Language constants for comparison
    LANGUAGES,

  }), [
    currentLanguage, translate, strings,
    changeLanguage, availableLanguages,
    isBangla, isEnglish, isDefault,
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the context for the hook
export { LanguageContext };

// Default export
export default LanguageProvider;
