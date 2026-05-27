// ============================================================
// FlashCart — i18n Engine
// Translation resolver and language utilities.
// Provides the t() function used throughout the app.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// Import all translation files
import bn from './bn';           // Pure Bangla
import en from './en';           // Pure English
import defaultStrings from './default'; // Bangla-English mix

// Import language constants
import { LANGUAGES } from '../utils/constants';

// ── TRANSLATION MAP ─────────────────────────────────────────
// Maps language code to its translation object
const translations = {
  [LANGUAGES.BANGLA]:  bn,              // 'bn' → Bangla strings
  [LANGUAGES.ENGLISH]: en,              // 'en' → English strings
  [LANGUAGES.DEFAULT]: defaultStrings,  // 'default' → Mix strings
};

// ── TRANSLATION RESOLVER ───────────────────────────────────

/**
 * getTranslations
 * Returns the full translation object for a given language.
 *
 * @param {string} lang - Language code ('default'|'bn'|'en')
 * @returns {object} Translation strings object
 */
export const getTranslations = (lang = LANGUAGES.DEFAULT) => {
  // Return the matching translation object
  // Fall back to default if language not found
  return translations[lang] || translations[LANGUAGES.DEFAULT];
};

/**
 * t (translate)
 * Resolves a translation string by dot-notation key path.
 * The primary function used in all components.
 *
 * @param {object} strings - The translation object (from useLanguage hook)
 * @param {string} keyPath - Dot-notation path (e.g. 'common.loading')
 * @param {object} params - Variable substitution (e.g. { name: 'Rizwan' })
 * @returns {string} Translated string
 *
 * @example
 * // In a component:
 * const { t } = useLanguage();
 * t('common.loading')           // → 'লোড হচ্ছে...' (in Bangla mode)
 * t('order.status.pending')     // → 'Pending' (in default mode)
 * t('common.appName')           // → 'FlashCart'
 */
export const t = (strings, keyPath, params = {}) => {
  // Guard against missing strings object
  if (!strings || !keyPath) return keyPath || '';

  // Split the key path by dots to traverse nested object
  // 'common.loading' → ['common', 'loading']
  const keys = keyPath.split('.');

  // Traverse the translation object following the key path
  let result = strings;

  for (const key of keys) {
    // If key doesn't exist at this level, return the key path itself
    // This makes missing translations visible during development
    if (result === null || result === undefined || typeof result !== 'object') {
      if (import.meta.env.DEV) {
        console.warn(`[FlashCart i18n] Missing translation key: "${keyPath}"`);
      }
      return keyPath; // Return the key path as fallback
    }

    result = result[key];
  }

  // If result is not a string (e.g. still an object), return key path
  if (typeof result !== 'string') {
    if (import.meta.env.DEV) {
      console.warn(`[FlashCart i18n] Key "${keyPath}" resolves to non-string value`);
    }
    return keyPath;
  }

  // Variable substitution — replace {variable} placeholders
  // Example: t('welcome', { name: 'Rizwan' }) with string "Hello, {name}!"
  // → "Hello, Rizwan!"
  if (Object.keys(params).length > 0) {
    return result.replace(
      /\{(\w+)\}/g,           // Match {variableName} patterns
      (match, key) => {
        // Replace with param value or keep the placeholder
        return params[key] !== undefined ? String(params[key]) : match;
      }
    );
  }

  return result;
};

/**
 * createTranslator
 * Factory function that creates a pre-bound translator for a language.
 * Used in LanguageContext to create the t() function.
 *
 * @param {string} lang - Language code
 * @returns {function} Translator function pre-bound to the language
 *
 * @example
 * const translate = createTranslator('bn');
 * translate('common.loading') // → 'লোড হচ্ছে...'
 */
export const createTranslator = (lang) => {
  const strings = getTranslations(lang);
  return (keyPath, params) => t(strings, keyPath, params);
};

/**
 * getAvailableLanguages
 * Returns all available language options for the language picker.
 *
 * @returns {Array} Language options with code, label, flag
 */
export const getAvailableLanguages = () => [
  {
    code:  LANGUAGES.DEFAULT,
    label: 'বাংলা-English',
    labelNative: 'Default Mix',
    flag:  'BD',
    dir:   'ltr',
  },
  {
    code:  LANGUAGES.BANGLA,
    label: 'বাংলা',
    labelNative: 'বাংলা',
    flag:  'BD',
    dir:   'ltr',
  },
  {
    code:  LANGUAGES.ENGLISH,
    label: 'English',
    labelNative: 'English',
    flag:  'GB',
    dir:   'ltr',
  },
];

/**
 * getHTMLLang
 * Returns the HTML lang attribute value for a given language code.
 * Used to set the <html lang="..."> attribute for SEO and accessibility.
 *
 * @param {string} lang - FlashCart language code
 * @returns {string} HTML lang attribute value
 */
export const getHTMLLang = (lang) => {
  const htmlLangMap = {
    [LANGUAGES.DEFAULT]: 'bn',    // Default mix — use bn as primary
    [LANGUAGES.BANGLA]:  'bn',    // Pure Bangla
    [LANGUAGES.ENGLISH]: 'en',    // Pure English
  };

  return htmlLangMap[lang] || 'bn';
};

/**
 * isRTL
 * Checks if the language is right-to-left.
 * Bangla is LTR, English is LTR.
 * This is here for future Arabic/Urdu support.
 *
 * @param {string} lang - Language code
 * @returns {boolean} Whether language is RTL
 */
export const isRTL = (lang) => {
  const rtlLanguages = []; // Bangla and English are both LTR
  return rtlLanguages.includes(lang);
};

// Export the translations object for direct access
export { translations, bn, en, defaultStrings };
