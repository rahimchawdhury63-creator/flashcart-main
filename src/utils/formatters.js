// ============================================================
// FlashCart — Formatters Utility
// Pure functions for formatting currency, dates, numbers,
// text, and Bangladesh-specific values.
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community
// ============================================================

// ── CURRENCY FORMATTERS ────────────────────────────────────

/**
 * formatCurrency
 * Formats a number as Bangladesh Taka (BDT).
 * Examples:
 *   formatCurrency(150)     → "৳150"
 *   formatCurrency(1500)    → "৳1,500"
 *   formatCurrency(0)       → "৳0"
 *   formatCurrency(null)    → "৳0"
 *
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show ৳ symbol (default true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  // Handle null, undefined, NaN gracefully
  const value = Number(amount) || 0;

  // Format with comma separators for thousands
  // Bangladesh uses comma at thousands (1,000) same as international
  const formatted = value.toLocaleString('en-BD', {
    minimumFractionDigits: 0,  // No decimal for whole Taka amounts
    maximumFractionDigits: 0,  // Bangladeshi prices are always whole numbers
  });

  // Return with or without Taka symbol
  return showSymbol ? `৳${formatted}` : formatted;
};

/**
 * formatCurrencyBangla
 * Formats currency with Bangla numerals for Bangla-language displays.
 * Example: 150 → "১৫০ টাকা"
 *
 * @param {number} amount - Amount to format
 * @returns {string} Bangla numeral formatted currency
 */
export const formatCurrencyBangla = (amount) => {
  // Convert to Bangla numerals
  const bangla = toBanglaDigits(amount || 0);
  return `${bangla} টাকা`;
};

/**
 * formatDiscount
 * Calculates and formats discount percentage between original and sale price.
 * Example: formatDiscount(200, 150) → "25% OFF"
 *
 * @param {number} originalPrice - Original price before discount
 * @param {number} salePrice - Current sale price
 * @returns {string|null} Formatted discount string or null if no discount
 */
export const formatDiscount = (originalPrice, salePrice) => {
  // Validate inputs
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return null;

  // Calculate percentage: ((original - sale) / original) * 100
  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  // Return formatted string
  return `${discountPercent}% OFF`;
};

/**
 * formatSavings
 * Shows how much money the customer saves.
 * Example: formatSavings(200, 150) → "You save ৳50"
 *
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {string|null} Savings string or null
 */
export const formatSavings = (originalPrice, salePrice) => {
  // Validate: sale must be less than original
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return null;

  // Calculate savings amount
  const savings = originalPrice - salePrice;

  // Return formatted savings message
  return `আপনি বাঁচাচ্ছেন ${formatCurrency(savings)}`;
};

// ── NUMBER FORMATTERS ──────────────────────────────────────

/**
 * toBanglaDigits
 * Converts Western Arabic numerals (0-9) to Bangla numerals (০-৯).
 * Example: toBanglaDigits(123) → "১২৩"
 *
 * @param {number|string} number - Number to convert
 * @returns {string} Number with Bangla digits
 */
export const toBanglaDigits = (number) => {
  // Bangla digit mapping: index = Western digit, value = Bangla digit
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  // Convert number to string then replace each Western digit
  return String(number).replace(/[0-9]/g, (digit) => banglaDigits[digit]);
};

/**
 * toWesternDigits
 * Converts Bangla numerals back to Western Arabic numerals.
 * Example: toWesternDigits("১২৩") → "123"
 *
 * @param {string} banglaNumber - String with Bangla digits
 * @returns {string} String with Western digits
 */
export const toWesternDigits = (banglaNumber) => {
  // Reverse mapping: Bangla to Western
  const westernDigits = { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' };

  // Replace each Bangla digit character
  return String(banglaNumber).replace(/[০-৯]/g, (digit) => westernDigits[digit] || digit);
};

/**
 * formatNumber
 * Formats large numbers with K/M suffixes for compact display.
 * Examples:
 *   formatNumber(999)    → "999"
 *   formatNumber(1000)   → "1K"
 *   formatNumber(1500)   → "1.5K"
 *   formatNumber(1000000)→ "1M"
 *
 * @param {number} num - Number to format
 * @returns {string} Compact number string
 */
export const formatNumber = (num) => {
  // Handle invalid inputs
  if (!num || isNaN(num)) return '0';

  const n = Number(num);

  // Million and above
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  }

  // Thousand and above
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  }

  // Below thousand — show as-is
  return String(n);
};

/**
 * formatRating
 * Formats a rating number to one decimal place.
 * Example: formatRating(4.666) → "4.7"
 *
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
  if (!rating || isNaN(rating)) return '0.0';
  return Number(rating).toFixed(1);
};

// ── DATE & TIME FORMATTERS ─────────────────────────────────

/**
 * formatDate
 * Formats a date in Bangladesh locale.
 * Example: formatDate(new Date()) → "১৫ জানুয়ারি ২০২৪" (Bangla)
 *          formatDate(new Date(), 'en') → "15 January 2024"
 *
 * @param {Date|string|number} date - Date to format
 * @param {string} lang - Language 'bn'|'en'|'default' (default: 'default')
 * @param {object} options - Intl.DateTimeFormat options override
 * @returns {string} Formatted date string
 */
export const formatDate = (date, lang = 'default', options = {}) => {
  // Handle null/undefined
  if (!date) return '';

  // Convert to Date object if string or timestamp
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';

  // Determine locale for formatting
  const locale = lang === 'bn' ? 'bn-BD' : 'en-BD';

  // Default date format options
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,  // Allow caller to override
  };

  // Use Intl.DateTimeFormat for locale-aware formatting
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * formatTime
 * Formats time in 12-hour format with AM/PM.
 * Example: formatTime('14:30') → "2:30 PM"
 *
 * @param {string} time - Time string in HH:MM format
 * @param {string} lang - Language for AM/PM
 * @returns {string} Formatted time
 */
export const formatTime = (time, lang = 'default') => {
  // Validate time string format
  if (!time || !time.includes(':')) return '';

  // Split hours and minutes
  const [hours, minutes] = time.split(':').map(Number);

  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12; // Convert 0 → 12, 13 → 1, etc.

  // Format with leading zero for minutes
  const formattedMinutes = String(minutes).padStart(2, '0');

  // Bangla AM/PM labels
  if (lang === 'bn') {
    const banglaHour = toBanglaDigits(hour12);
    const banglaMinutes = toBanglaDigits(formattedMinutes);
    const banglaPeriod = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
    return `${banglaHour}:${banglaMinutes} ${banglaPeriod}`;
  }

  return `${hour12}:${formattedMinutes} ${period}`;
};

/**
 * formatRelativeTime
 * Shows how long ago something happened.
 * Examples:
 *   "Just now" (< 60 seconds)
 *   "5 minutes ago"
 *   "2 hours ago"
 *   "Yesterday"
 *   "3 days ago"
 *   "15 January 2024" (older than 7 days)
 *
 * @param {Date|string|number} date - Past date to compare
 * @param {string} lang - Language 'bn'|'en'|'default'
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, lang = 'default') => {
  // Handle invalid input
  if (!date) return '';

  // Convert to Date
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  // Calculate seconds since the date
  const now = new Date();
  const diffSeconds = Math.floor((now - dateObj) / 1000);

  // Bangla translations object
  const t = {
    justNow:    lang === 'bn' ? 'এইমাত্র'              : 'Just now',
    minsAgo:    lang === 'bn' ? 'মিনিট আগে'             : 'minutes ago',
    minAgo:     lang === 'bn' ? 'মিনিট আগে'             : 'minute ago',
    hoursAgo:   lang === 'bn' ? 'ঘণ্টা আগে'             : 'hours ago',
    hourAgo:    lang === 'bn' ? 'ঘণ্টা আগে'             : 'hour ago',
    yesterday:  lang === 'bn' ? 'গতকাল'                 : 'Yesterday',
    daysAgo:    lang === 'bn' ? 'দিন আগে'               : 'days ago',
  };

  // Less than 60 seconds
  if (diffSeconds < 60) return t.justNow;

  // Less than 1 hour — show minutes
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    const n = lang === 'bn' ? toBanglaDigits(diffMinutes) : diffMinutes;
    return `${n} ${diffMinutes === 1 ? t.minAgo : t.minsAgo}`;
  }

  // Less than 24 hours — show hours
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    const n = lang === 'bn' ? toBanglaDigits(diffHours) : diffHours;
    return `${n} ${diffHours === 1 ? t.hourAgo : t.hoursAgo}`;
  }

  // Yesterday
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return t.yesterday;

  // Less than 7 days — show days
  if (diffDays < 7) {
    const n = lang === 'bn' ? toBanglaDigits(diffDays) : diffDays;
    return `${n} ${t.daysAgo}`;
  }

  // Older than 7 days — show full date
  return formatDate(dateObj, lang);
};

/**
 * formatDeliveryTime
 * Formats estimated delivery time for display.
 * Example: formatDeliveryTime(45) → "৪৫ মিনিট" or "45 mins"
 *
 * @param {number} minutes - Estimated minutes
 * @param {string} lang - Language
 * @returns {string} Formatted delivery time
 */
export const formatDeliveryTime = (minutes, lang = 'default') => {
  if (!minutes || isNaN(minutes)) return '';

  const mins = Number(minutes);

  // Less than 60 minutes — show as minutes
  if (mins < 60) {
    if (lang === 'bn') return `${toBanglaDigits(mins)} মিনিট`;
    return `${mins} mins`;
  }

  // 60+ minutes — convert to hours and minutes
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (lang === 'bn') {
    const h = toBanglaDigits(hours);
    if (remainingMins === 0) return `${h} ঘণ্টা`;
    const m = toBanglaDigits(remainingMins);
    return `${h} ঘণ্টা ${m} মিনিট`;
  }

  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}m`;
};

/**
 * formatOrderId
 * Formats an order ID for display.
 * Example: formatOrderId('abc123') → "#FC-ABC123"
 *
 * @param {string} orderId - Raw order ID
 * @returns {string} Formatted order ID
 */
export const formatOrderId = (orderId) => {
  if (!orderId) return '';
  // Take last 6 chars and uppercase for readability
  const short = String(orderId).slice(-6).toUpperCase();
  return `#FC-${short}`;
};

// ── TEXT FORMATTERS ────────────────────────────────────────

/**
 * formatSlug
 * Converts a string to a URL-safe slug.
 * Example: formatSlug("ABC Restaurant Dhaka") → "abc-restaurant-dhaka"
 * Handles Bangla text by removing non-ASCII characters for URL safety.
 *
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-safe slug
 */
export const formatSlug = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()                          // Lowercase all
    .trim()                                  // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '')               // Remove special characters
    .replace(/[\s_]+/g, '-')                // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')                    // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '');              // Remove leading/trailing hyphens
};

/**
 * formatBanglaSlug
 * Creates a bilingual slug combining English and Bangla transliteration.
 * Used for store URLs that should work for both language searches.
 * Example: "রহিম রেস্টুরেন্ট" → "rahim-restaurant" (best effort)
 *
 * @param {string} banglText - Bangla text
 * @param {string} englishFallback - English version if available
 * @returns {string} URL-safe slug
 */
export const formatBanglaSlug = (banglaText, englishFallback = '') => {
  // If English fallback exists, use it (more SEO friendly for global)
  if (englishFallback) return formatSlug(englishFallback);

  // Basic Bangla to Latin transliteration for common characters
  // This is not a full transliterator — just common cases for Bangladesh
  const translitMap = {
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u',
    'ে': 'e', 'ো': 'o', 'ক': 'k', 'খ': 'kh', 'গ': 'g',
    'ঘ': 'gh', 'ন': 'n', 'প': 'p', 'ব': 'b', 'ম': 'm',
    'র': 'r', 'স': 's', 'হ': 'h', 'ল': 'l', 'শ': 'sh',
    'ত': 't', 'দ': 'd', 'চ': 'ch', 'জ': 'j', 'ট': 't',
    'ড': 'd', 'ফ': 'f', 'ভ': 'v', 'য': 'y', 'ছ': 'ch',
  };

  // Apply transliteration
  let result = banglaText.split('').map(char => translitMap[char] || char).join('');

  // Clean up and format as slug
  return formatSlug(result) || 'store';
};

/**
 * truncateText
 * Truncates text to a maximum length with ellipsis.
 * Respects word boundaries to avoid cutting mid-word.
 * Example: truncateText("Hello World Bangladesh", 10) → "Hello..."
 *
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum character length
 * @param {string} suffix - Suffix to append (default "...")
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  // Find the last space before the maxLength to avoid cutting mid-word
  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');

  // If there's a space, cut at the word boundary
  const cutPoint = lastSpace > 0 ? lastSpace : maxLength - suffix.length;

  return text.substring(0, cutPoint) + suffix;
};

/**
 * capitalize
 * Capitalizes the first letter of each word.
 * Example: capitalize("dhaka food delivery") → "Dhaka Food Delivery"
 *
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * formatPhoneDisplay
 * Formats a Bangladeshi phone number for display.
 * Example: formatPhoneDisplay('01712345678') → "017 1234 5678"
 *          formatPhoneDisplay('+8801712345678') → "+880 17 1234 5678"
 *
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';

  // Remove all non-digits
  const digits = String(phone).replace(/\D/g, '');

  // International format (+880...)
  if (digits.startsWith('880') && digits.length === 13) {
    return `+880 ${digits.slice(3, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
  }

  // Local format (01...)
  if (digits.startsWith('01') && digits.length === 11) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Return as-is if format not recognized
  return phone;
};

/**
 * formatAddress
 * Formats a delivery address object into a single string.
 * Example: { area: 'Gulshan', city: 'Dhaka' } → "Gulshan, Dhaka"
 *
 * @param {object} address - Address object from Firestore
 * @param {string} lang - Language for city names
 * @returns {string} Formatted address string
 */
export const formatAddress = (address, lang = 'default') => {
  if (!address) return '';

  // Build address parts array, filter empty values
  const parts = [
    address.landmark,    // Landmark first (most specific)
    address.fullAddress, // Full address
    address.area,        // Area/neighborhood
    address.city,        // City (Dhaka, Chittagong, etc.)
  ].filter(Boolean);    // Remove null/undefined/empty

  // Join with comma separator
  return parts.join(', ');
};

/**
 * formatStoreStatus
 * Returns a user-friendly store open/close status.
 *
 * @param {boolean} isOpen - Whether store is open
 * @param {string} lang - Language
 * @returns {object} Status object with text and color
 */
export const formatStoreStatus = (isOpen, lang = 'default') => {
  if (isOpen) {
    return {
      text: lang === 'bn' ? 'এখন খোলা' : 'Open Now',
      color: 'var(--fc-success)',
      bgColor: 'var(--fc-success-light)',
    };
  }
  return {
    text: lang === 'bn' ? 'বন্ধ আছে' : 'Closed',
    color: 'var(--fc-error)',
    bgColor: 'var(--fc-error-light)',
  };
};

/**
 * formatOrderStatus
 * Returns display info for each order status.
 *
 * @param {string} status - Order status string
 * @param {string} lang - Language
 * @returns {object} Status display object
 */
export const formatOrderStatus = (status, lang = 'default') => {
  // Status configuration map
  const statusMap = {
    pending: {
      en: 'Pending',           bn: 'অপেক্ষমান',
      color: 'var(--fc-status-pending)',
      bgColor: '#FEF3C7',
      icon: 'clock',
    },
    confirmed: {
      en: 'Confirmed',         bn: 'নিশ্চিত',
      color: 'var(--fc-status-confirmed)',
      bgColor: '#DBEAFE',
      icon: 'check-circle',
    },
    preparing: {
      en: 'Preparing',         bn: 'প্রস্তুত হচ্ছে',
      color: 'var(--fc-status-preparing)',
      bgColor: '#EDE9FE',
      icon: 'clock',
    },
    ready: {
      en: 'Ready for Delivery', bn: 'ডেলিভারির জন্য প্রস্তুত',
      color: 'var(--fc-status-ready)',
      bgColor: '#D1FAE5',
      icon: 'delivery',
    },
    delivered: {
      en: 'Delivered',          bn: 'ডেলিভারি হয়েছে',
      color: 'var(--fc-status-delivered)',
      bgColor: 'var(--fc-success-light)',
      icon: 'check-circle-filled',
    },
    cancelled: {
      en: 'Cancelled',          bn: 'বাতিল',
      color: 'var(--fc-status-cancelled)',
      bgColor: 'var(--fc-error-light)',
      icon: 'x-circle',
    },
  };

  // Get the status config or return unknown status
  const config = statusMap[status] || {
    en: 'Unknown', bn: 'অজানা',
    color: 'var(--fc-gray-500)',
    bgColor: 'var(--fc-gray-100)',
    icon: 'info',
  };

  // Return with text based on language
  return {
    ...config,
    text: lang === 'bn' ? config.bn : config.en,
  };
};

/**
 * formatFileSize
 * Formats a file size in bytes to human-readable form.
 * Example: formatFileSize(1500000) → "1.4 MB"
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;

  // Find appropriate unit
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate value in that unit
  const value = bytes / Math.pow(k, i);

  // Return with 1 decimal place for larger units
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
};

/**
 * generateOrderId
 * Generates a human-readable order ID.
 * Format: FC-YYYYMMDD-XXXXX (where X is random alphanumeric)
 * Example: "FC-20240115-AB3K7"
 *
 * @returns {string} Generated order ID
 */
export const generateOrderId = () => {
  // Get current date in YYYYMMDD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate 5-character random alphanumeric suffix
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return `FC-${dateStr}-${random}`;
};

/**
 * pluralize
 * Returns singular or plural form based on count.
 * Example: pluralize(1, 'item', 'items') → "1 item"
 *          pluralize(5, 'item', 'items') → "5 items"
 *
 * @param {number} count - Number to check
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @param {boolean} showCount - Whether to include the number
 * @returns {string} Pluralized string
 */
export const pluralize = (count, singular, plural, showCount = true) => {
  const word = count === 1 ? singular : plural;
  return showCount ? `${count} ${word}` : word;
};
