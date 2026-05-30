// translations.js — All UI text in three language modes.
// 'default' = Bangla-English mix (best BD SEO), 'bn' = pure Bangla, 'en' = pure English.
// Access via the useLanguage() hook's t() function.

export const TRANSLATIONS = {
  // --- Brand & generic ---
  appName: { default: 'FlashCart', bn: 'ফ্ল্যাশকার্ট', en: 'FlashCart' },
  tagline: {
    default: 'আপনার কাছের দোকান থেকে Fast Delivery',
    bn: 'আপনার কাছের দোকান থেকে দ্রুত ডেলিভারি',
    en: 'Fast Delivery From Stores Near You',
  },
  poweredBy: { default: 'Powered by', bn: 'পরিচালনায়', en: 'Powered by' },
  developedBy: { default: 'Developed by', bn: 'ডেভেলপার', en: 'Developed by' },

  // --- Navigation ---
  home: { default: 'Home', bn: 'হোম', en: 'Home' },
  stores: { default: 'Stores', bn: 'দোকান', en: 'Stores' },
  categories: { default: 'Categories', bn: 'ক্যাটাগরি', en: 'Categories' },
  cart: { default: 'Cart', bn: 'কার্ট', en: 'Cart' },
  orders: { default: 'Orders', bn: 'অর্ডার', en: 'Orders' },
  profile: { default: 'Profile', bn: 'প্রোফাইল', en: 'Profile' },
  search: { default: 'Search', bn: 'খুঁজুন', en: 'Search' },
  login: { default: 'Login', bn: 'লগইন', en: 'Login' },
  signup: { default: 'Sign Up', bn: 'সাইন আপ', en: 'Sign Up' },
  logout: { default: 'Logout', bn: 'লগআউট', en: 'Logout' },

  // --- Home ---
  heroTitle: {
    default: 'আপনার এলাকার সব দোকান, এক জায়গায়',
    bn: 'আপনার এলাকার সব দোকান, এক জায়গায়',
    en: 'All Your Local Stores, In One Place',
  },
  heroSubtitle: {
    default: 'খাবার, মুদি, ওষুধ ও আরও অনেক কিছু — Cash on Delivery তে অর্ডার করুন',
    bn: 'খাবার, মুদি, ওষুধ ও আরও অনেক কিছু — ক্যাশ অন ডেলিভারিতে অর্ডার করুন',
    en: 'Food, groceries, medicine and more — order with Cash on Delivery',
  },
  searchPlaceholder: {
    default: 'দোকান বা পণ্য খুঁজুন...',
    bn: 'দোকান বা পণ্য খুঁজুন...',
    en: 'Search stores or products...',
  },
  browseCategories: { default: 'Browse Categories', bn: 'ক্যাটাগরি দেখুন', en: 'Browse Categories' },
  featuredStores: { default: 'Featured Stores', bn: 'ফিচার্ড দোকান', en: 'Featured Stores' },
  nearbyStores: { default: 'Stores Near You', bn: 'আপনার কাছের দোকান', en: 'Stores Near You' },
  topItems: { default: 'Popular Items', bn: 'জনপ্রিয় পণ্য', en: 'Popular Items' },
  topRated: { default: 'Top Rated', bn: 'টপ রেটেড', en: 'Top Rated' },
  newOnFlashcart: { default: 'New on FlashCart', bn: 'নতুন দোকান', en: 'New on FlashCart' },
  flashDeals: { default: 'Flash Deals', bn: 'ফ্ল্যাশ ডিল', en: 'Flash Deals' },
  viewAll: { default: 'View All', bn: 'সব দেখুন', en: 'View All' },

  // --- Store / item ---
  open: { default: 'Open', bn: 'খোলা', en: 'Open' },
  closed: { default: 'Closed', bn: 'বন্ধ', en: 'Closed' },
  verified: { default: 'Verified', bn: 'ভেরিফাইড', en: 'Verified' },
  freeDelivery: { default: 'Free Delivery', bn: 'ফ্রি ডেলিভারি', en: 'Free Delivery' },
  codOnly: { default: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery' },
  addToCart: { default: 'Add to Cart', bn: 'কার্টে যোগ করুন', en: 'Add to Cart' },
  outOfStock: { default: 'Out of Stock', bn: 'স্টক শেষ', en: 'Out of Stock' },
  menu: { default: 'Menu', bn: 'মেনু', en: 'Menu' },
  reviews: { default: 'Reviews', bn: 'রিভিউ', en: 'Reviews' },
  about: { default: 'About', bn: 'বিস্তারিত', en: 'About' },
  deliveryTime: { default: 'Delivery Time', bn: 'ডেলিভারি সময়', en: 'Delivery Time' },
  minutes: { default: 'min', bn: 'মিনিট', en: 'min' },
  km: { default: 'km', bn: 'কিমি', en: 'km' },
  orders_count: { default: 'orders', bn: 'অর্ডার', en: 'orders' },

  // --- Cart / checkout ---
  yourCart: { default: 'Your Cart', bn: 'আপনার কার্ট', en: 'Your Cart' },
  emptyCart: { default: 'Your cart is empty', bn: 'আপনার কার্ট খালি', en: 'Your cart is empty' },
  subtotal: { default: 'Subtotal', bn: 'সাবটোটাল', en: 'Subtotal' },
  deliveryFee: { default: 'Delivery Fee', bn: 'ডেলিভারি ফি', en: 'Delivery Fee' },
  total: { default: 'Total', bn: 'মোট', en: 'Total' },
  checkout: { default: 'Checkout', bn: 'চেকআউট', en: 'Checkout' },
  placeOrder: { default: 'Place Order', bn: 'অর্ডার করুন', en: 'Place Order' },
  continueShopping: { default: 'Continue Shopping', bn: 'কেনাকাটা চালিয়ে যান', en: 'Continue Shopping' },
  deliveryAddress: { default: 'Delivery Address', bn: 'ডেলিভারি ঠিকানা', en: 'Delivery Address' },
  fullName: { default: 'Full Name', bn: 'পুরো নাম', en: 'Full Name' },
  phoneNumber: { default: 'Phone Number', bn: 'ফোন নম্বর', en: 'Phone Number' },
  specialInstructions: { default: 'Special Instructions', bn: 'বিশেষ নির্দেশনা', en: 'Special Instructions' },
  orderPlaced: { default: 'Order Placed Successfully!', bn: 'অর্ডার সফল হয়েছে!', en: 'Order Placed Successfully!' },

  // --- Auth ---
  email: { default: 'Email', bn: 'ইমেইল', en: 'Email' },
  password: { default: 'Password', bn: 'পাসওয়ার্ড', en: 'Password' },
  confirmPassword: { default: 'Confirm Password', bn: 'পাসওয়ার্ড নিশ্চিত করুন', en: 'Confirm Password' },
  forgotPassword: { default: 'Forgot Password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?', en: 'Forgot Password?' },
  signInWithGoogle: { default: 'Continue with Google', bn: 'Google দিয়ে চালিয়ে যান', en: 'Continue with Google' },
  noAccount: { default: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?', en: "Don't have an account?" },
  haveAccount: { default: 'Already have an account?', bn: 'অ্যাকাউন্ট আছে?', en: 'Already have an account?' },
  resetPassword: { default: 'Reset Password', bn: 'পাসওয়ার্ড রিসেট', en: 'Reset Password' },
  sendResetLink: { default: 'Send Reset Link', bn: 'রিসেট লিংক পাঠান', en: 'Send Reset Link' },
  verifyEmail: { default: 'Please verify your email', bn: 'আপনার ইমেইল ভেরিফাই করুন', en: 'Please verify your email' },

  // --- Misc ---
  loading: { default: 'Loading...', bn: 'লোড হচ্ছে...', en: 'Loading...' },
  noResults: { default: 'No results found', bn: 'কিছু পাওয়া যায়নি', en: 'No results found' },
  retry: { default: 'Retry', bn: 'আবার চেষ্টা করুন', en: 'Retry' },
  somethingWrong: { default: 'Something went wrong', bn: 'কিছু একটা সমস্যা হয়েছে', en: 'Something went wrong' },
  reorder: { default: 'Reorder', bn: 'আবার অর্ডার করুন', en: 'Reorder' },
  rateOrder: { default: 'Rate Order', bn: 'রেটিং দিন', en: 'Rate Order' },
  becomePartner: { default: 'Become a Partner', bn: 'পার্টনার হোন', en: 'Become a Partner' },
}

/**
 * Translate a key into the active language.
 * Falls back to 'default' then 'en' then the key itself.
 * @param {string} key
 * @param {'default'|'bn'|'en'} lang
 * @returns {string}
 */
export function translate(key, lang = 'default') {
  const entry = TRANSLATIONS[key]
  if (!entry) return key
  return entry[lang] || entry.default || entry.en || key
}
