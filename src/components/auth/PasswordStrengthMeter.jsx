/**
 * =============================================================================
 * FLASHCART — Password Strength Meter Component
 * =============================================================================
 *
 * Purpose: Real-time visual password strength feedback with bilingual
 * suggestions. Helps users create stronger passwords.
 *
 * Strength criteria:
 * - Length >= 8 (basic)
 * - Length >= 12 (good)
 * - Length >= 16 (excellent)
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (@#$%^&*)
 * - Not a common password (top 100 list check)
 *
 * Score: 0-100 with 4 strength levels
 *
 * Usage:
 *   <PasswordStrengthMeter password={password} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React, { useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { CheckCircleIcon, CloseIcon } from '@/components/icons';
import './PasswordStrengthMeter.css';

/* =========================================================================== */
/* COMMON PASSWORDS LIST (top 100 to avoid)                                    */
/* =========================================================================== */

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  '1234567', '1234567890', 'qwerty', 'abc123', 'monkey', 'dragon', 'letmein',
  'master', 'sunshine', 'princess', 'football', 'baseball', 'welcome', 'admin',
  'login', 'iloveyou', 'starwars', 'jordan', 'superman', 'batman', 'shadow',
  'michael', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1', 'jesus',
  'bangladesh', 'dhaka', 'bangla', 'flashcart', '11111111', '00000000',
  'asdfghjkl', 'qwerty123', 'qwertyuiop', 'p@ssw0rd', 'admin123', 'root',
  '696969', '7777777', '12345', 'asdf1234', 'zaq12wsx', 'qwerty1', 'admin@123',
  '1q2w3e4r', 'password!', 'changeme', 'temppass', 'newpassword', 'football1',
  'computer', 'internet', 'service', 'service123', 'master123', 'system',
  'guest', 'test', 'test123', 'testing', 'demo', 'demo123', 'public', 'user',
  'user123', 'love', 'sex', 'god', 'secret', 'pass', 'pass123', 'mypassword',
  'liverpool', 'manchester', 'arsenal', 'chelsea', 'realmadrid', 'barcelona',
  'cricket', 'tennis', 'basketball', 'hockey', 'rugby', 'golf', 'pakistan',
  'india', 'china', 'usa', 'america', 'london', 'paris', 'tokyo', 'mumbai',
  'sajib', 'rakib', 'karim', 'rahim', 'abdul'
]);

/* =========================================================================== */
/* STRENGTH CALCULATION                                                        */
/* =========================================================================== */

/**
 * Calculate password strength score and details.
 *
 * @param {string} password — The password to evaluate
 * @returns {object} { score, level, requirements, percentage }
 */
const calculateStrength = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    notCommon: !COMMON_PASSWORDS.has(password.toLowerCase()),
    longLength: password.length >= 12,
    veryLongLength: password.length >= 16
  };

  /* Calculate score (0-100) */
  let score = 0;
  if (requirements.length) score += 15;
  if (requirements.longLength) score += 10;
  if (requirements.veryLongLength) score += 10;
  if (requirements.uppercase) score += 15;
  if (requirements.lowercase) score += 10;
  if (requirements.number) score += 15;
  if (requirements.special) score += 15;
  if (requirements.notCommon) score += 10;

  /* Cap score at 100 */
  score = Math.min(score, 100);

  /* Determine strength level */
  let level;
  if (password.length === 0) {
    level = 'empty';
  } else if (score < 40) {
    level = 'weak';
  } else if (score < 65) {
    level = 'medium';
  } else if (score < 85) {
    level = 'strong';
  } else {
    level = 'veryStrong';
  }

  return { score, level, requirements, percentage: score };
};

/* =========================================================================== */
/* COMPONENT                                                                   */
/* =========================================================================== */

/**
 * PasswordStrengthMeter Component
 *
 * @param {object} props
 * @param {string} props.password — Current password input value
 * @param {boolean} props.showRequirements — Show detailed requirements list (default: true)
 */
const PasswordStrengthMeter = ({ password = '', showRequirements = true }) => {
  const t = useTranslation();

  /* Calculate strength (memoized for performance) */
  const { level, requirements, percentage } = useMemo(
    () => calculateStrength(password),
    [password]
  );

  /* Don't render anything if password is empty */
  if (password.length === 0) return null;

  /* Strength level labels */
  const levelLabels = {
    weak: t('auth.passwordStrength.weak'),
    medium: t('auth.passwordStrength.medium'),
    strong: t('auth.passwordStrength.strong'),
    veryStrong: t('auth.passwordStrength.veryStrong')
  };

  /* Requirements list with translation keys */
  const requirementsList = [
    { key: 'length', label: t('auth.passwordStrength.requirements.length'), met: requirements.length },
    { key: 'uppercase', label: t('auth.passwordStrength.requirements.uppercase'), met: requirements.uppercase },
    { key: 'lowercase', label: t('auth.passwordStrength.requirements.lowercase'), met: requirements.lowercase },
    { key: 'number', label: t('auth.passwordStrength.requirements.number'), met: requirements.number },
    { key: 'special', label: t('auth.passwordStrength.requirements.special'), met: requirements.special }
  ];

  return (
    <div className="password-strength-meter" data-level={level}>
      {/* Strength bar */}
      <div className="psm-bar-container">
        <div className="psm-bar-track">
          <div
            className="psm-bar-fill"
            style={{ width: `${percentage}%` }}
            data-level={level}
          />
        </div>
        <span className="psm-label" data-level={level}>
          {levelLabels[level]}
        </span>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <ul className="psm-requirements" aria-label="Password requirements">
          {requirementsList.map((req) => (
            <li key={req.key} className={`psm-req-item ${req.met ? 'psm-req-met' : ''}`}>
              {req.met ? (
                <CheckCircleIcon size={14} className="psm-req-icon" />
              ) : (
                <CloseIcon size={14} className="psm-req-icon" />
              )}
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
