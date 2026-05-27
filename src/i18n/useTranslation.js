/**
 * =============================================================================
 * FLASHCART — useTranslation Hook
 * =============================================================================
 *
 * Purpose: Convenience hook that provides just the translation function.
 * For when you only need `t()` without other language context features.
 *
 * Usage:
 *   const t = useTranslation();
 *   return <h1>{t('home.hero.title')}</h1>;
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import { useLanguage } from './LanguageContext';

/**
 * useTranslation — Returns only the translation function.
 * Simpler alternative to useLanguage() when you only need translations.
 *
 * @returns {Function} Translation function: t(key, variables)
 */
export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};

export default useTranslation;
