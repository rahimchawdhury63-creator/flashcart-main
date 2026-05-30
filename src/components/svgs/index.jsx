// svgs/index.jsx — All SVG icons as React components. NO emojis anywhere in the UI.
// Each icon accepts size + className + ...rest props and inherits color via currentColor.

import React from 'react'

// Base wrapper to keep all icons consistent (stroke style, sizing, accessibility).
const Svg = ({ size = 24, className = '', children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

/* ---------- UI / navigation icons ---------- */
export const IconHome = (p) => (<Svg {...p}><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></Svg>)
export const IconSearch = (p) => (<Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Svg>)
export const IconCart = (p) => (<Svg {...p}><circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" /><path d="M2 3h2l2.4 12.5a2 2 0 0 0 2 1.5h8.7a2 2 0 0 0 2-1.6L22 7H5.2" /></Svg>)
export const IconUser = (p) => (<Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>)
export const IconList = (p) => (<Svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Svg>)
export const IconGrid = (p) => (<Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Svg>)
export const IconMenu = (p) => (<Svg {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Svg>)
export const IconClose = (p) => (<Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>)
export const IconChevronRight = (p) => (<Svg {...p}><path d="m9 18 6-6-6-6" /></Svg>)
export const IconChevronLeft = (p) => (<Svg {...p}><path d="m15 18-6-6 6-6" /></Svg>)
export const IconChevronDown = (p) => (<Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>)
export const IconStar = (p) => (<Svg {...p} fill="currentColor" stroke="none"><path d="m12 2 3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.8 5.1 20.6l1.6-6.9L1.4 9.1l7-.6z" /></Svg>)
export const IconStarOutline = (p) => (<Svg {...p}><path d="m12 2 3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.8 5.1 20.6l1.6-6.9L1.4 9.1l7-.6z" /></Svg>)
export const IconMapPin = (p) => (<Svg {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></Svg>)
export const IconClock = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>)
export const IconPhone = (p) => (<Svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></Svg>)
export const IconHeart = (p) => (<Svg {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></Svg>)
export const IconHeartFilled = (p) => (<Svg {...p} fill="currentColor" stroke="none"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></Svg>)
export const IconPlus = (p) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>)
export const IconMinus = (p) => (<Svg {...p}><path d="M5 12h14" /></Svg>)
export const IconTrash = (p) => (<Svg {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></Svg>)
export const IconCheck = (p) => (<Svg {...p}><path d="m20 6-11 11-5-5" /></Svg>)
export const IconCheckCircle = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></Svg>)
export const IconAlert = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></Svg>)
export const IconGoogle = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.9Z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M6 14.3a6.6 6.6 0 0 1 0-4.6V6.9H2.3a11 11 0 0 0 0 9.9L6 14.3Z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 6.9L6 9.7c.9-2.5 3.2-4.3 6-4.3Z" />
  </svg>
)
export const IconBell = (p) => (<Svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></Svg>)
export const IconFilter = (p) => (<Svg {...p}><path d="M4 5h16M7 12h10M10 19h4" /></Svg>)
export const IconShield = (p) => (<Svg {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></Svg>)
export const IconTruck = (p) => (<Svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></Svg>)
export const IconReceipt = (p) => (<Svg {...p}><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1Z" /><path d="M8 8h8M8 12h8M8 16h5" /></Svg>)
export const IconWallet = (p) => (<Svg {...p}><path d="M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h13" /><path d="M16 13h2" /></Svg>)
export const IconLogout = (p) => (<Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></Svg>)
export const IconEye = (p) => (<Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Svg>)
export const IconEyeOff = (p) => (<Svg {...p}><path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" /><path d="M9.9 5.1A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.6 4.4M6.3 6.3A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.1-.5" /></Svg>)
export const IconWhatsapp = (p) => (<Svg {...p}><path d="M3 21l1.7-5A8 8 0 1 1 8 19.3z" /><path d="M8.5 9.5c0 3 2 5 5 5l1-1.3-1.8-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-1.8z" /></Svg>)
export const IconShare = (p) => (<Svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Svg>)
export const IconInfo = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>)
export const IconGlobe = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></Svg>)

/* ---------- Category icons ---------- */
export const IconRestaurant = (p) => (<Svg {...p}><path d="M4 3v7a2 2 0 0 0 4 0V3M6 11v10M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5ZM16 16v5" /></Svg>)
export const IconFastfood = (p) => (<Svg {...p}><path d="M3 11h18a9 9 0 0 0-18 0ZM4 15h16M5 19h14" /></Svg>)
export const IconHomeKitchen = (p) => (<Svg {...p}><path d="M3 10 12 3l9 7" /><path d="M5 10v10h14V10" /><path d="M9 14h6" /></Svg>)
export const IconCafe = (p) => (<Svg {...p}><path d="M4 8h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2M6 3v2M10 3v2M14 3v2" /></Svg>)
export const IconBakery = (p) => (<Svg {...p}><path d="M4 13a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 13v5M12 13v5M16 13v5" /></Svg>)
export const IconGrocery = (p) => (<Svg {...p}><path d="M5 8h14l-1 11H6zM9 8a3 3 0 0 1 6 0" /></Svg>)
export const IconSupermarket = (p) => (<Svg {...p}><path d="M3 9 5 4h14l2 5M4 9v11h16V9M9 13h6" /></Svg>)
export const IconPharmacy = (p) => (<Svg {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></Svg>)
export const IconClothing = (p) => (<Svg {...p}><path d="M9 3 6 6l-3 2 2 3 2-1v9h10v-9l2 1 2-3-3-2-3-3a3 3 0 0 1-6 0Z" /></Svg>)
export const IconElectronics = (p) => (<Svg {...p}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></Svg>)
export const IconMobile = (p) => (<Svg {...p}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></Svg>)
export const IconLibrary = (p) => (<Svg {...p}><path d="M4 4h7v16H4zM13 4h7v16h-7zM4 9h7M13 9h7" /></Svg>)
export const IconStationery = (p) => (<Svg {...p}><path d="m4 20 2-6 9-9 4 4-9 9zM14 5l4 4" /></Svg>)
export const IconCosmetics = (p) => (<Svg {...p}><path d="M9 2h6v4H9zM8 6h8v3l-1 11H9L8 9z" /></Svg>)
export const IconHardware = (p) => (<Svg {...p}><path d="M14 7a3 3 0 0 0-4 4l-7 7 3 3 7-7a3 3 0 0 0 4-4l-2 2-3-3z" /></Svg>)
export const IconPetshop = (p) => (<Svg {...p}><circle cx="7" cy="9" r="2" /><circle cx="17" cy="9" r="2" /><circle cx="5" cy="14" r="2" /><circle cx="19" cy="14" r="2" /><path d="M12 13c-2 0-4 1.5-4 4a3 3 0 0 0 8 0c0-2.5-2-4-4-4Z" /></Svg>)
export const IconToys = (p) => (<Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M8 12v4a4 4 0 0 0 8 0v-4M10 20h4" /></Svg>)
export const IconSports = (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18M3 12a9 9 0 0 0 18 0" /></Svg>)
export const IconFurniture = (p) => (<Svg {...p}><path d="M4 10V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 10a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2M5 16v3M19 16v3" /></Svg>)
export const IconOther = (p) => (<Svg {...p}><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></Svg>)

// Map of category id -> icon component, used by category grids.
export const CATEGORY_ICONS = {
  restaurant: IconRestaurant,
  fastfood: IconFastfood,
  homekitchen: IconHomeKitchen,
  cafe: IconCafe,
  bakery: IconBakery,
  grocery: IconGrocery,
  supermarket: IconSupermarket,
  pharmacy: IconPharmacy,
  clothing: IconClothing,
  electronics: IconElectronics,
  mobile: IconMobile,
  library: IconLibrary,
  stationery: IconStationery,
  cosmetics: IconCosmetics,
  hardware: IconHardware,
  petshop: IconPetshop,
  toys: IconToys,
  sports: IconSports,
  furniture: IconFurniture,
  other: IconOther,
}

// FlashCart logo mark (lightning bolt inside a cart shape).
export const LogoMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 4h2l2.2 11.5a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 7H6"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m12 8-2.2 3.2h2.4L10 14.5l4.2-4.2h-2.4L13.8 7z" fill="currentColor" />
    <circle cx="9" cy="20" r="1.4" fill="currentColor" />
    <circle cx="17" cy="20" r="1.4" fill="currentColor" />
  </svg>
)
