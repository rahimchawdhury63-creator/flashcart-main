// bangladeshLocations.js — Bangladesh divisions and major districts.
// Used for location selection, filtering, and SEO (location-specific keywords).
// Note: a representative subset of districts is included; extend as needed.

export const DIVISIONS = [
  {
    id: 'dhaka',
    en: 'Dhaka',
    bn: 'ঢাকা',
    districts: [
      { en: 'Dhaka', bn: 'ঢাকা' },
      { en: 'Gazipur', bn: 'গাজীপুর' },
      { en: 'Narayanganj', bn: 'নারায়ণগঞ্জ' },
      { en: 'Tangail', bn: 'টাঙ্গাইল' },
      { en: 'Manikganj', bn: 'মানিকগঞ্জ' },
      { en: 'Munshiganj', bn: 'মুন্সিগঞ্জ' },
      { en: 'Narsingdi', bn: 'নরসিংদী' },
      { en: 'Kishoreganj', bn: 'কিশোরগঞ্জ' },
      { en: 'Faridpur', bn: 'ফরিদপুর' },
    ],
  },
  {
    id: 'chittagong',
    en: 'Chattogram',
    bn: 'চট্টগ্রাম',
    districts: [
      { en: 'Chattogram', bn: 'চট্টগ্রাম' },
      { en: 'Coxs Bazar', bn: 'কক্সবাজার' },
      { en: 'Comilla', bn: 'কুমিল্লা' },
      { en: 'Feni', bn: 'ফেনী' },
      { en: 'Noakhali', bn: 'নোয়াখালী' },
      { en: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া' },
      { en: 'Chandpur', bn: 'চাঁদপুর' },
      { en: 'Rangamati', bn: 'রাঙ্গামাটি' },
    ],
  },
  {
    id: 'sylhet',
    en: 'Sylhet',
    bn: 'সিলেট',
    districts: [
      { en: 'Sylhet', bn: 'সিলেট' },
      { en: 'Moulvibazar', bn: 'মৌলভীবাজার' },
      { en: 'Habiganj', bn: 'হবিগঞ্জ' },
      { en: 'Sunamganj', bn: 'সুনামগঞ্জ' },
    ],
  },
  {
    id: 'rajshahi',
    en: 'Rajshahi',
    bn: 'রাজশাহী',
    districts: [
      { en: 'Rajshahi', bn: 'রাজশাহী' },
      { en: 'Bogura', bn: 'বগুড়া' },
      { en: 'Pabna', bn: 'পাবনা' },
      { en: 'Sirajganj', bn: 'সিরাজগঞ্জ' },
      { en: 'Natore', bn: 'নাটোর' },
      { en: 'Naogaon', bn: 'নওগাঁ' },
    ],
  },
  {
    id: 'khulna',
    en: 'Khulna',
    bn: 'খুলনা',
    districts: [
      { en: 'Khulna', bn: 'খুলনা' },
      { en: 'Jashore', bn: 'যশোর' },
      { en: 'Kushtia', bn: 'কুষ্টিয়া' },
      { en: 'Satkhira', bn: 'সাতক্ষীরা' },
      { en: 'Bagerhat', bn: 'বাগেরহাট' },
    ],
  },
  {
    id: 'barishal',
    en: 'Barishal',
    bn: 'বরিশাল',
    districts: [
      { en: 'Barishal', bn: 'বরিশাল' },
      { en: 'Bhola', bn: 'ভোলা' },
      { en: 'Patuakhali', bn: 'পটুয়াখালী' },
      { en: 'Pirojpur', bn: 'পিরোজপুর' },
    ],
  },
  {
    id: 'rangpur',
    en: 'Rangpur',
    bn: 'রংপুর',
    districts: [
      { en: 'Rangpur', bn: 'রংপুর' },
      { en: 'Dinajpur', bn: 'দিনাজপুর' },
      { en: 'Kurigram', bn: 'কুড়িগ্রাম' },
      { en: 'Gaibandha', bn: 'গাইবান্ধা' },
    ],
  },
  {
    id: 'mymensingh',
    en: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    districts: [
      { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
      { en: 'Jamalpur', bn: 'জামালপুর' },
      { en: 'Netrokona', bn: 'নেত্রকোণা' },
      { en: 'Sherpur', bn: 'শেরপুর' },
    ],
  },
]

/** Flat list of all districts (for dropdowns/filters). */
export function allDistricts() {
  return DIVISIONS.flatMap((d) => d.districts.map((dist) => ({ ...dist, division: d.en })))
}
