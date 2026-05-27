// ============================================================
// FlashCart — Partner Business Categories
// Complete category data with SEO metadata, icon names,
// Schema.org types, and bilingual labels.
// Used in: store registration, filtering, search, SEO.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

/**
 * PARTNER_CATEGORIES
 * All supported business categories on FlashCart.
 * Each category includes:
 * - id: URL-safe identifier
 * - label: English display name
 * - labelBn: Bangla display name
 * - description: SEO description (English)
 * - descriptionBn: SEO description (Bangla)
 * - icon: SVGIcon component name
 * - schema: Schema.org @type for structured data
 * - keywords: SEO keywords for this category
 * - keywordsBn: Bangla SEO keywords
 * - color: Accent color for category card
 * - sortOrder: Display order (lower = first)
 */
export const PARTNER_CATEGORIES = [
  {
    id: 'restaurant',
    label: 'Restaurant',
    labelBn: 'রেস্টুরেন্ট',
    description: 'Restaurants and food establishments offering dine-in, takeout, and delivery in Bangladesh',
    descriptionBn: 'বাংলাদেশে খাবার ও রেস্টুরেন্ট সেবা — বিরিয়ানি, ভাত, রুটি সহ সব ধরনের খাবার',
    icon: 'restaurant',
    schema: 'Restaurant',
    keywords: ['restaurant', 'food delivery', 'biryani', 'Bengali food', 'dining', 'takeout', 'meal delivery'],
    keywordsBn: ['রেস্টুরেন্ট', 'খাবার', 'বিরিয়ানি', 'ভাত', 'ডেলিভারি'],
    color: '#FF6B35',          // Orange
    sortOrder: 1,
    popular: true,             // Show in featured categories
    deliveryTimeAvg: 35,       // Average delivery time (minutes)
  },
  {
    id: 'grocery',
    label: 'Grocery Store',
    labelBn: 'মুদি দোকান',
    description: 'Grocery stores and daily essentials delivery in Bangladesh. Vegetables, fruits, rice, dal and more.',
    descriptionBn: 'মুদি দোকান — সবজি, ফল, চাল, ডাল সহ দৈনন্দিন প্রয়োজনীয় জিনিসপত্র',
    icon: 'grocery',
    schema: 'GroceryStore',
    keywords: ['grocery', 'vegetables', 'fruits', 'rice', 'dal', 'daily essentials', 'bazaar', 'market'],
    keywordsBn: ['মুদি দোকান', 'সবজি', 'ফল', 'চাল', 'বাজার', 'দৈনন্দিন'],
    color: '#4CAF50',          // Green
    sortOrder: 2,
    popular: true,
    deliveryTimeAvg: 45,
  },
  {
    id: 'pharmacy',
    label: 'Medical Shop',
    labelBn: 'ওষুধের দোকান',
    description: 'Medicine and pharmacy delivery in Bangladesh. Prescription medicines, health products, medical supplies.',
    descriptionBn: 'ওষুধ ও ফার্মেসি ডেলিভারি — প্রেসক্রিপশন ওষুধ, স্বাস্থ্য পণ্য',
    icon: 'pharmacy',
    schema: 'Pharmacy',
    keywords: ['pharmacy', 'medicine', 'medical shop', 'prescription', 'health products', 'drug store', 'ওষুধ'],
    keywordsBn: ['ওষুধ', 'ফার্মেসি', 'ওষুধের দোকান', 'স্বাস্থ্য'],
    color: '#2196F3',          // Blue
    sortOrder: 3,
    popular: true,
    deliveryTimeAvg: 25,
  },
  {
    id: 'home_kitchen',
    label: 'Home Kitchen',
    labelBn: 'হোম কিচেন',
    description: 'Home-cooked meals from local home kitchens in Bangladesh. Authentic homemade food delivered to your door.',
    descriptionBn: 'হোম কিচেন — ঘরের রান্না, হাতের রান্না, দেশীয় খাবার ডেলিভারি',
    icon: 'restaurant',
    schema: 'FoodEstablishment',
    keywords: ['home kitchen', 'homemade food', 'home-cooked meals', 'tiffin service', 'desi food', 'authentic Bengali food'],
    keywordsBn: ['হোম কিচেন', 'ঘরের রান্না', 'হাতের রান্না', 'টিফিন', 'দেশি খাবার'],
    color: '#FF9800',          // Amber
    sortOrder: 4,
    popular: true,
    deliveryTimeAvg: 40,
  },
  {
    id: 'bakery',
    label: 'Bakery',
    labelBn: 'বেকারি',
    description: 'Bakeries offering fresh bread, cakes, pastries and sweets in Bangladesh. Birthday cakes, wedding cakes, and daily baked goods.',
    descriptionBn: 'বেকারি — তাজা পাউরুটি, কেক, পেস্ট্রি, মিষ্টি ডেলিভারি',
    icon: 'bakery',
    schema: 'Bakery',
    keywords: ['bakery', 'cake', 'bread', 'pastry', 'sweets', 'birthday cake', 'pitha', 'baked goods'],
    keywordsBn: ['বেকারি', 'কেক', 'পাউরুটি', 'পেস্ট্রি', 'মিষ্টি', 'পিঠা'],
    color: '#A0522D',          // Brown
    sortOrder: 5,
    popular: false,
    deliveryTimeAvg: 30,
  },
  {
    id: 'cafe',
    label: 'Cafe',
    labelBn: 'ক্যাফে',
    description: 'Cafes and coffee shops in Bangladesh offering tea, coffee, snacks and beverages for delivery.',
    descriptionBn: 'ক্যাফে — চা, কফি, স্ন্যাকস, ঠান্ডা পানীয় ডেলিভারি',
    icon: 'cafe',
    schema: 'CafeOrCoffeeShop',
    keywords: ['cafe', 'coffee shop', 'tea shop', 'beverages', 'snacks', 'adda', 'chai', 'coffee delivery'],
    keywordsBn: ['ক্যাফে', 'চায়ের দোকান', 'কফি', 'চা', 'নাস্তা', 'আড্ডা'],
    color: '#795548',          // Dark Brown
    sortOrder: 6,
    popular: false,
    deliveryTimeAvg: 20,
  },
  {
    id: 'supermarket',
    label: 'Supermarket',
    labelBn: 'সুপারমার্কেট',
    description: 'Supermarkets and department stores in Bangladesh. Wide range of products from groceries to household items.',
    descriptionBn: 'সুপারমার্কেট — মুদি থেকে গৃহস্থালি সামগ্রী সব এক জায়গায়',
    icon: 'grocery',
    schema: 'GroceryStore',
    keywords: ['supermarket', 'supershop', 'department store', 'shopping', 'meena bazaar', 'shopno', 'agora'],
    keywordsBn: ['সুপারমার্কেট', 'সুপারশপ', 'শপিং', 'ডিপার্টমেন্ট স্টোর'],
    color: '#9C27B0',          // Purple
    sortOrder: 7,
    popular: false,
    deliveryTimeAvg: 50,
  },
  {
    id: 'electronics',
    label: 'Electronics Shop',
    labelBn: 'ইলেকট্রনিক্স শপ',
    description: 'Electronics stores in Bangladesh. Phones, laptops, TVs, accessories and gadgets delivered to your home.',
    descriptionBn: 'ইলেকট্রনিক্স — ফোন, ল্যাপটপ, টিভি, গ্যাজেট হোম ডেলিভারি',
    icon: 'electronics',
    schema: 'ElectronicsStore',
    keywords: ['electronics', 'mobile phone', 'laptop', 'computer', 'TV', 'gadgets', 'accessories', 'Bangladesh electronics'],
    keywordsBn: ['ইলেকট্রনিক্স', 'মোবাইল', 'ল্যাপটপ', 'কম্পিউটার', 'টিভি'],
    color: '#607D8B',          // Blue Grey
    sortOrder: 8,
    popular: false,
    deliveryTimeAvg: 60,
  },
  {
    id: 'clothing',
    label: 'Clothing Store',
    labelBn: 'পোশাকের দোকান',
    description: 'Clothing and fashion stores in Bangladesh. Traditional and modern clothing, sarees, panjabi, shirts delivered home.',
    descriptionBn: 'পোশাক — শাড়ি, পাঞ্জাবি, শার্ট, ড্রেস হোম ডেলিভারি',
    icon: 'clothing',
    schema: 'ClothingStore',
    keywords: ['clothing', 'fashion', 'dress', 'saree', 'panjabi', 'shirt', 'salwar kameez', 'Bangladesh fashion'],
    keywordsBn: ['পোশাক', 'শাড়ি', 'পাঞ্জাবি', 'শার্ট', 'কাপড়', 'ড্রেস'],
    color: '#E91E63',          // Pink
    sortOrder: 9,
    popular: false,
    deliveryTimeAvg: 60,
  },
  {
    id: 'mobile_shop',
    label: 'Mobile Shop',
    labelBn: 'মোবাইল শপ',
    description: 'Mobile phone shops in Bangladesh. Smartphones, feature phones, accessories, screen protectors and cases.',
    descriptionBn: 'মোবাইল শপ — স্মার্টফোন, ফিচার ফোন, অ্যাক্সেসরিজ ডেলিভারি',
    icon: 'phone',
    schema: 'MobilePhoneStore',
    keywords: ['mobile shop', 'smartphone', 'phone accessories', 'charger', 'earphone', 'screen guard', 'phone cover'],
    keywordsBn: ['মোবাইল', 'স্মার্টফোন', 'ফোন', 'চার্জার', 'ইয়ারফোন'],
    color: '#00BCD4',          // Cyan
    sortOrder: 10,
    popular: false,
    deliveryTimeAvg: 45,
  },
  {
    id: 'library',
    label: 'Library & Books',
    labelBn: 'লাইব্রেরি ও বই',
    description: 'Bookshops and stationery in Bangladesh. Bangla and English books, study materials, notebooks, pens delivered.',
    descriptionBn: 'লাইব্রেরি ও বই — বাংলা-ইংরেজি বই, স্টেশনারি, স্টাডি ম্যাটেরিয়াল',
    icon: 'library',
    schema: 'BookStore',
    keywords: ['bookstore', 'library', 'stationery', 'books', 'study materials', 'notebooks', 'Bangla books', 'textbooks'],
    keywordsBn: ['বইয়ের দোকান', 'লাইব্রেরি', 'স্টেশনারি', 'বই', 'পড়াশোনা'],
    color: '#3F51B5',          // Indigo
    sortOrder: 11,
    popular: false,
    deliveryTimeAvg: 60,
  },
  {
    id: 'diner',
    label: 'Diner / Fast Food',
    labelBn: 'ডাইনার / ফাস্ট ফুড',
    description: 'Diners and fast food restaurants in Bangladesh. Burgers, fried chicken, sandwiches, and quick meals delivered fast.',
    descriptionBn: 'ডাইনার ও ফাস্ট ফুড — বার্গার, চিকেন, স্যান্ডউইচ দ্রুত ডেলিভারি',
    icon: 'diner',
    schema: 'Restaurant',
    keywords: ['fast food', 'diner', 'burger', 'fried chicken', 'sandwich', 'pizza', 'quick food', 'takeaway'],
    keywordsBn: ['ফাস্ট ফুড', 'বার্গার', 'চিকেন', 'স্যান্ডউইচ', 'পিৎজা'],
    color: '#F44336',          // Red
    sortOrder: 12,
    popular: true,
    deliveryTimeAvg: 25,
  },
  {
    id: 'other',
    label: 'Other Business',
    labelBn: 'অন্যান্য ব্যবসা',
    description: 'Other businesses and services in Bangladesh offering home delivery.',
    descriptionBn: 'অন্যান্য ব্যবসা ও সেবা — হোম ডেলিভারি',
    icon: 'delivery',
    schema: 'Store',
    keywords: ['delivery', 'business', 'service', 'home delivery', 'Bangladesh'],
    keywordsBn: ['ডেলিভারি', 'ব্যবসা', 'সেবা', 'হোম ডেলিভারি'],
    color: '#78909C',          // Grey
    sortOrder: 13,
    popular: false,
    deliveryTimeAvg: 60,
  },
];

// ── HELPER FUNCTIONS ───────────────────────────────────────

/**
 * getCategoryById
 * Finds a category by its ID.
 *
 * @param {string} id - Category ID to find
 * @returns {object|null} Category object or null
 */
export const getCategoryById = (id) => {
  return PARTNER_CATEGORIES.find(cat => cat.id === id) || null;
};

/**
 * getPopularCategories
 * Returns only the popular categories for homepage display.
 *
 * @returns {Array} Popular categories sorted by sortOrder
 */
export const getPopularCategories = () => {
  return PARTNER_CATEGORIES
    .filter(cat => cat.popular)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * getAllCategories
 * Returns all categories sorted by sortOrder.
 *
 * @returns {Array} All categories
 */
export const getAllCategories = () => {
  return [...PARTNER_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * getCategorySchemaType
 * Returns the Schema.org type for a category.
 * Used in structured data generation.
 *
 * @param {string} categoryId - Category ID
 * @returns {string} Schema.org type string
 */
export const getCategorySchemaType = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.schema || 'Store';
};

/**
 * getCategoryKeywords
 * Returns all SEO keywords for a category (English + Bangla combined).
 *
 * @param {string} categoryId - Category ID
 * @returns {Array<string>} Combined keywords array
 */
export const getCategoryKeywords = (categoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return [];

  return [...(category.keywords || []), ...(category.keywordsBn || [])];
};

// Default export for convenient import
export default PARTNER_CATEGORIES;
