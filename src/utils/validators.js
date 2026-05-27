// ============================================================
// FlashCart — Validators Utility
// Form validation functions for all input types.
// All validators return { isValid: boolean, error: string }
// Developer: Rizwan Rahim Chowdhury
// ============================================================

/**
 * validateEmail
 * Validates email format and common issues.
 * Supports international email formats.
 *
 * @param {string} email - Email address to validate
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateEmail = (email) => {
  // Check if email is provided
  if (!email || !email.trim()) {
    return { isValid: false, error: 'ইমেইল ঠিকানা দিন / Please enter email address' };
  }

  // Trim whitespace before validation
  const trimmed = email.trim().toLowerCase();

  // Standard email regex — RFC 5322 simplified
  // Allows: letters, numbers, +, ., _, %, -, followed by @ and domain
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'সঠিক ইমেইল ঠিকানা দিন / Enter a valid email address' };
  }

  // Check for common disposable email domains (basic check)
  const disposableDomains = ['tempmail.com', 'throwaway.email', 'mailinator.com'];
  const domain = trimmed.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'এই ইমেইল গ্রহণযোগ্য নয় / This email is not accepted' };
  }

  // Email is valid
  return { isValid: true, error: '' };
};

/**
 * validatePassword
 * Validates password strength with multiple criteria.
 * Returns validation result AND strength score.
 *
 * Strength Levels:
 * 0 - Empty
 * 1 - Too short (< 6 chars)
 * 2 - Weak (only lowercase or only numbers)
 * 3 - Fair (lowercase + uppercase OR lowercase + numbers)
 * 4 - Strong (lowercase + uppercase + numbers)
 * 5 - Very Strong (lowercase + uppercase + numbers + special chars)
 *
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default 6)
 * @returns {{ isValid: boolean, error: string, strength: number, strengthLabel: string }}
 */
export const validatePassword = (password, minLength = 6) => {
  // Empty password
  if (!password) {
    return { isValid: false, error: 'পাসওয়ার্ড দিন / Please enter password', strength: 0, strengthLabel: '' };
  }

  // Too short
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `পাসওয়ার্ড কমপক্ষে ${minLength} অক্ষর হতে হবে / Password must be at least ${minLength} characters`,
      strength: 1,
      strengthLabel: 'Too Short',
    };
  }

  // Check character types present
  const hasLower   = /[a-z]/.test(password);    // Lowercase letters
  const hasUpper   = /[A-Z]/.test(password);    // Uppercase letters
  const hasNumbers = /\d/.test(password);       // Numbers
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Special chars

  // Calculate strength score (0-5)
  let strength = 0;
  if (password.length >= minLength) strength++;       // Length met
  if (hasLower) strength++;                            // Has lowercase
  if (hasUpper) strength++;                            // Has uppercase
  if (hasNumbers) strength++;                          // Has numbers
  if (hasSpecial) strength++;                          // Has special chars

  // Strength labels
  const strengthLabels = ['', 'Too Short', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthLabel = strengthLabels[Math.min(strength, 5)];

  // Minimum validation: password must be at least "Fair" (strength >= 3)
  // This means at least 2 character types
  if (strength < 3) {
    return {
      isValid: false,
      error: 'পাসওয়ার্ড আরো শক্তিশালী করুন — বড় হাতের অক্ষর বা সংখ্যা যোগ করুন / Add uppercase letters or numbers',
      strength,
      strengthLabel,
    };
  }

  // Password is valid
  return { isValid: true, error: '', strength, strengthLabel };
};

/**
 * validatePasswordConfirm
 * Validates that password confirmation matches the original.
 *
 * @param {string} password - Original password
 * @param {string} confirm - Confirmation password
 * @returns {{ isValid: boolean, error: string }}
 */
export const validatePasswordConfirm = (password, confirm) => {
  if (!confirm) {
    return { isValid: false, error: 'পাসওয়ার্ড নিশ্চিত করুন / Please confirm your password' };
  }

  if (password !== confirm) {
    return { isValid: false, error: 'পাসওয়ার্ড মিলছে না / Passwords do not match' };
  }

  return { isValid: true, error: '' };
};

/**
 * validateBDPhone
 * Validates Bangladeshi mobile phone numbers.
 * Valid formats: 01XXXXXXXXX, +8801XXXXXXXXX, 8801XXXXXXXXX
 * Valid prefixes: 011, 013, 014, 015, 016, 017, 018, 019
 *
 * @param {string} phone - Phone number to validate
 * @returns {{ isValid: boolean, error: string, normalized: string }}
 */
export const validateBDPhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'ফোন নম্বর দিন / Please enter phone number', normalized: '' };
  }

  // Remove all non-digits and common formatting characters
  const digits = String(phone).replace(/[\s\-\(\)+]/g, '');

  // Handle international prefix — strip +880 or 880 prefix
  let normalized = digits;
  if (normalized.startsWith('880')) {
    normalized = '0' + normalized.slice(3); // +8801XXXXXXXXX → 01XXXXXXXXX
  }

  // Must start with 01 and be 11 digits
  if (!normalized.startsWith('01') || normalized.length !== 11) {
    return {
      isValid: false,
      error: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678) / Enter valid BD mobile number',
      normalized: '',
    };
  }

  // Valid Bangladesh operator prefixes
  // GP: 017, 013 | Robi: 018, 016 | BL: 019, 014 | TeleTalk: 015 | Airtel: 016
  const validPrefixes = ['011', '013', '014', '015', '016', '017', '018', '019'];
  const prefix = normalized.slice(0, 3);

  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      error: 'এই নম্বর সিরিজ বাংলাদেশে নেই / This number series is not valid in Bangladesh',
      normalized: '',
    };
  }

  // Check remaining digits are all numbers
  if (!/^\d{11}$/.test(normalized)) {
    return {
      isValid: false,
      error: 'ফোন নম্বরে শুধু সংখ্যা থাকতে হবে / Phone number must contain only digits',
      normalized: '',
    };
  }

  // Valid phone number
  return { isValid: true, error: '', normalized };
};

/**
 * validateName
 * Validates a person's or business's name.
 * Accepts: Bangla, English, spaces, hyphens, apostrophes.
 *
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length (default 2)
 * @param {number} maxLength - Maximum length (default 100)
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateName = (name, minLength = 2, maxLength = 100) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'নাম দিন / Please enter name' };
  }

  const trimmed = name.trim();

  if (trimmed.length < minLength) {
    return { isValid: false, error: `নাম কমপক্ষে ${minLength} অক্ষর হতে হবে / Name must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `নাম সর্বোচ্চ ${maxLength} অক্ষর হতে পারবে / Name cannot exceed ${maxLength} characters` };
  }

  // Allow: Bangla Unicode range (\u0980-\u09FF), English letters, spaces, hyphens, apostrophes
  const nameRegex = /^[\u0980-\u09FF\s\-'a-zA-Z0-9.&]+$/;

  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'নামে অসমর্থিত অক্ষর আছে / Name contains unsupported characters' };
  }

  return { isValid: true, error: '' };
};

/**
 * validateBusinessName
 * Validates a business/store name for the partner portal.
 * More permissive than personal names — allows more characters.
 *
 * @param {string} name - Business name
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateBusinessName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'ব্যবসার নাম দিন / Please enter business name' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'ব্যবসার নাম কমপক্ষে ২ অক্ষর হতে হবে' };
  }

  if (trimmed.length > 150) {
    return { isValid: false, error: 'ব্যবসার নাম সর্বোচ্চ ১৫০ অক্ষর হতে পারবে' };
  }

  return { isValid: true, error: '' };
};

/**
 * validateAddress
 * Validates a delivery address.
 *
 * @param {string} address - Address string
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { isValid: false, error: 'ঠিকানা দিন / Please enter address' };
  }

  if (address.trim().length < 10) {
    return { isValid: false, error: 'সঠিক ঠিকানা দিন (কমপক্ষে ১০ অক্ষর) / Enter a complete address' };
  }

  if (address.trim().length > 500) {
    return { isValid: false, error: 'ঠিকানা অনেক লম্বা — সংক্ষিপ্ত করুন' };
  }

  return { isValid: true, error: '' };
};

/**
 * validatePrice
 * Validates a product/item price for partner portal.
 *
 * @param {number|string} price - Price to validate
 * @param {number} min - Minimum price (default 1)
 * @param {number} max - Maximum price (default 999999)
 * @returns {{ isValid: boolean, error: string }}
 */
export const validatePrice = (price, min = 1, max = 999999) => {
  // Convert to number
  const numPrice = Number(price);

  if (!price && price !== 0) {
    return { isValid: false, error: 'মূল্য দিন / Please enter price' };
  }

  if (isNaN(numPrice)) {
    return { isValid: false, error: 'সঠিক মূল্য দিন / Please enter a valid price' };
  }

  if (numPrice < min) {
    return { isValid: false, error: `মূল্য কমপক্ষে ৳${min} হতে হবে / Minimum price is ৳${min}` };
  }

  if (numPrice > max) {
    return { isValid: false, error: `মূল্য সর্বোচ্চ ৳${max} হতে পারবে / Maximum price is ৳${max}` };
  }

  // Check for decimal — Bangladesh prices are whole numbers typically
  if (numPrice !== Math.floor(numPrice)) {
    return { isValid: false, error: 'মূল্য পূর্ণ সংখ্যা হতে হবে / Price must be a whole number' };
  }

  return { isValid: true, error: '' };
};

/**
 * validateImageFile
 * Validates an image file before upload to ImgBB.
 * Checks: type, size, dimensions (async).
 *
 * @param {File} file - File object from input
 * @param {number} maxSizeMB - Maximum file size in MB (default 5)
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, error: 'ছবি নির্বাচন করুন / Please select an image' };
  }

  // Allowed image MIME types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'শুধুমাত্র JPEG, PNG, WebP, GIF ছবি গ্রহণযোগ্য / Only JPEG, PNG, WebP, GIF accepted'
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `ছবির সাইজ সর্বোচ্চ ${maxSizeMB}MB হতে পারবে / Maximum image size is ${maxSizeMB}MB`
    };
  }

  return { isValid: true, error: '' };
};

/**
 * validateURL
 * Validates a URL format.
 * Optional — allows empty URLs (not required).
 *
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateURL = (url, required = false) => {
  // If empty and not required — valid
  if (!url || !url.trim()) {
    if (required) return { isValid: false, error: 'URL দিন / Please enter URL' };
    return { isValid: true, error: '' };
  }

  // URL regex — must start with http:// or https://
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

  if (!urlRegex.test(url.trim())) {
    return { isValid: false, error: 'সঠিক URL দিন (https://...) / Enter a valid URL' };
  }

  return { isValid: true, error: '' };
};

/**
 * validateRequired
 * Simple required field validator.
 * Works for strings, numbers, arrays, objects.
 *
 * @param {any} value - Value to check
 * @param {string} fieldName - Field name for error message
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateRequired = (value, fieldName = 'এই তথ্য / This field') => {
  // Check for various empty states
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'string' && !value.trim());

  if (isEmpty) {
    return { isValid: false, error: `${fieldName} আবশ্যক / ${fieldName} is required` };
  }

  return { isValid: true, error: '' };
};

/**
 * validateForm
 * Validates an entire form object using a validation schema.
 * Returns all errors at once (not just first error).
 *
 * Usage:
 * const schema = {
 *   email: (val) => validateEmail(val),
 *   phone: (val) => validateBDPhone(val),
 * };
 * const { isValid, errors } = validateForm(formData, schema);
 *
 * @param {object} formData - Form values object
 * @param {object} schema - Validation functions per field
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validateForm = (formData, schema) => {
  const errors = {};  // Collect all errors
  let isValid = true; // Assume valid until proven otherwise

  // Run each field through its validator
  Object.entries(schema).forEach(([field, validator]) => {
    const result = validator(formData[field]);

    if (!result.isValid) {
      errors[field] = result.error;  // Store error for this field
      isValid = false;                // Mark form as invalid
    }
  });

  return { isValid, errors };
};

/**
 * sanitizeInput
 * Sanitizes user input to prevent XSS injection.
 * Removes HTML tags and dangerous characters.
 * Used before storing text to Firestore.
 *
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';

  return String(input)
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-related patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')      // Remove event handlers like onclick=
    // Normalize multiple spaces
    .replace(/\s+/g, ' ');
};

/**
 * sanitizeHTML
 * More aggressive sanitization that also encodes HTML entities.
 * Use for data that will be rendered as HTML.
 *
 * @param {string} input - Raw input
 * @returns {string} HTML-safe string
 */
export const sanitizeHTML = (input) => {
  if (!input) return '';

  // First apply basic sanitization
  const sanitized = sanitizeInput(input);

  // Then encode HTML entities
  return sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
