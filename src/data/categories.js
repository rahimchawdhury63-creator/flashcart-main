// categories.js — All supported business/store categories with names in 3 languages.
// Each category references an SVG icon component key (rendered via components/svgs).

export const CATEGORIES = [
  { id: 'restaurant', icon: 'restaurant', en: 'Restaurant', bn: 'রেস্তোরাঁ', mix: 'Restaurant রেস্তোরাঁ' },
  { id: 'fastfood', icon: 'fastfood', en: 'Fast Food', bn: 'ফাস্ট ফুড', mix: 'Fast Food' },
  { id: 'homekitchen', icon: 'homekitchen', en: 'Home Kitchen', bn: 'হোম কিচেন', mix: 'Home Kitchen' },
  { id: 'cafe', icon: 'cafe', en: 'Café', bn: 'ক্যাফে', mix: 'Café' },
  { id: 'bakery', icon: 'bakery', en: 'Bakery', bn: 'বেকারি', mix: 'Bakery' },
  { id: 'grocery', icon: 'grocery', en: 'Grocery Store', bn: 'মুদি দোকান', mix: 'Grocery মুদি' },
  { id: 'supermarket', icon: 'supermarket', en: 'Supermarket', bn: 'সুপার মার্কেট', mix: 'Supermarket' },
  { id: 'pharmacy', icon: 'pharmacy', en: 'Pharmacy', bn: 'ফার্মেসি', mix: 'Pharmacy ফার্মেসি' },
  { id: 'clothing', icon: 'clothing', en: 'Clothing Store', bn: 'পোশাকের দোকান', mix: 'Clothing' },
  { id: 'electronics', icon: 'electronics', en: 'Electronics', bn: 'ইলেকট্রনিক্স', mix: 'Electronics' },
  { id: 'mobile', icon: 'mobile', en: 'Mobile Shop', bn: 'মোবাইল শপ', mix: 'Mobile Shop' },
  { id: 'library', icon: 'library', en: 'Library / Books', bn: 'লাইব্রেরি', mix: 'Books লাইব্রেরি' },
  { id: 'stationery', icon: 'stationery', en: 'Stationery', bn: 'স্টেশনারি', mix: 'Stationery' },
  { id: 'cosmetics', icon: 'cosmetics', en: 'Cosmetics', bn: 'কসমেটিক্স', mix: 'Cosmetics' },
  { id: 'hardware', icon: 'hardware', en: 'Hardware Store', bn: 'হার্ডওয়্যার', mix: 'Hardware' },
  { id: 'petshop', icon: 'petshop', en: 'Pet Shop', bn: 'পেট শপ', mix: 'Pet Shop' },
  { id: 'toys', icon: 'toys', en: 'Toys Store', bn: 'খেলনার দোকান', mix: 'Toys' },
  { id: 'sports', icon: 'sports', en: 'Sports Shop', bn: 'স্পোর্টস', mix: 'Sports' },
  { id: 'furniture', icon: 'furniture', en: 'Furniture', bn: 'আসবাবপত্র', mix: 'Furniture' },
  { id: 'other', icon: 'other', en: 'Other', bn: 'অন্যান্য', mix: 'Other অন্যান্য' },
]

/**
 * Look up a category by id.
 * @param {string} id
 */
export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

/**
 * Get a category display name in the requested language.
 * @param {string} id
 * @param {'default'|'bn'|'en'} lang
 */
export function categoryName(id, lang = 'default') {
  const c = getCategory(id)
  if (lang === 'bn') return c.bn
  if (lang === 'en') return c.en
  return c.mix
}
