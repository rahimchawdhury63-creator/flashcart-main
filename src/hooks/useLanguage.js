// ============================================================
// FlashCart — useLanguage Custom Hook
// Clean interface for components to access language state.
//
// Usage:
//   const { t, currentLanguage, changeLanguage } = useLanguage();
//   <h1>{t('home.heroTitle')}</h1>
//
// Developer: Rizwan Rahim Chowdhury
// ============================================================

// React's context consumer hook
import { useContext } from 'react';

// The language context
import { LanguageContext } from '../context/LanguageContext';

/**
 * useLanguage
 * Provides access to the language context.
 * Must be used within a LanguageProvider.
 *
 * @returns {object} Language context with t(), currentLanguage, changeLanguage
 *
 * @example
 * // Translate a string
 * const { t } = useLanguage();
 * return <h1>{t('home.heroTitle')}</h1>;
 *
 * @example
 * // Change language
 * const { changeLanguage, currentLanguage } = useLanguage();
 * <button onClick={() => changeLanguage('bn')}>বাংলা</button>
 *
 * @example
 * // Check current language
 * const { isBangla, isEnglish } = useLanguage();
 * const fontClass = isBangla ? 'bangla-font' : '';
 */
const useLanguage = () => {
  const context = useContext(LanguageContext);

  // Guard against use outside provider
  if (!context) {
    throw new Error(
      '[FlashCart useLanguage] useLanguage() must be used within a LanguageProvider. ' +
      'Wrap your app with <LanguageProvider> in App.jsx.'
    );
  }

  return context;
};

export default useLanguage;
