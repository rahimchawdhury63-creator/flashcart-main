/**
 * =============================================================================
 * FLASHCART — SVG Icon System
 * =============================================================================
 *
 * Purpose: Complete SVG icon library as React components.
 * Every icon in the FlashCart ecosystem is defined here.
 *
 * Usage: import { CartIcon, SearchIcon, ... } from '@/components/icons';
 *
 * All icons accept these props:
 * - size (number, default: 24) — width and height in pixels
 * - color (string, default: 'currentColor') — fill or stroke color
 * - className (string) — additional CSS classes
 * - strokeWidth (number, default: 2) — for stroke-based icons
 * - ...rest — any additional SVG attributes
 *
 * Design principles:
 * - All icons use 24x24 viewBox for consistency
 * - Stroke-based icons (not filled) for a modern, clean look
 * - currentColor for color inheritance from parent
 * - Zero emoji characters anywhere (RULE 2)
 *
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import React from 'react';

/* =========================================================================== */
/* HELPER: Default props for all icons                                         */
/* =========================================================================== */

/**
 * createIcon — Factory function to create consistent SVG icon components.
 * Reduces boilerplate: each icon only needs to define its <path> content.
 *
 * @param {string} displayName — Name for React DevTools
 * @param {React.ReactNode} paths — SVG path elements
 * @param {object} defaults — Override default viewBox, fill, etc.
 * @returns {React.FC} — React component
 */
const createIcon = (displayName, paths, defaults = {}) => {
  const IconComponent = ({
    size = 24,
    color = 'currentColor',
    className = '',
    strokeWidth = 2,
    ...rest
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={defaults.viewBox || '0 0 24 24'}
      fill={defaults.fill || 'none'}
      stroke={defaults.stroke !== false ? color : 'none'}
      strokeWidth={defaults.stroke !== false ? strokeWidth : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
      role="img"
      {...rest}
    >
      {typeof paths === 'function' ? paths(color) : paths}
    </svg>
  );

  IconComponent.displayName = displayName;
  return IconComponent;
};

/* =========================================================================== */
/* NAVIGATION ICONS                                                            */
/* =========================================================================== */

/** Home icon — house shape */
export const HomeIcon = createIcon('HomeIcon', (
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>
));

/** Search icon — magnifying glass */
export const SearchIcon = createIcon('SearchIcon', (
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </>
));

/** Menu icon — hamburger (3 horizontal lines) */
export const MenuIcon = createIcon('MenuIcon', (
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
));

/** Close icon — X mark */
export const CloseIcon = createIcon('CloseIcon', (
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
));

/** Back / Arrow Left */
export const ArrowLeftIcon = createIcon('ArrowLeftIcon', (
  <>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </>
));

/** Arrow Right */
export const ArrowRightIcon = createIcon('ArrowRightIcon', (
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </>
));

/** Chevron Down — dropdown indicator */
export const ChevronDownIcon = createIcon('ChevronDownIcon', (
  <polyline points="6 9 12 15 18 9" />
));

/** Chevron Right — list navigation */
export const ChevronRightIcon = createIcon('ChevronRightIcon', (
  <polyline points="9 18 15 12 9 6" />
));

/** Chevron Left */
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', (
  <polyline points="15 18 9 12 15 6" />
));

/** Chevron Up */
export const ChevronUpIcon = createIcon('ChevronUpIcon', (
  <polyline points="18 15 12 9 6 15" />
));

/* =========================================================================== */
/* E-COMMERCE ICONS                                                            */
/* =========================================================================== */

/** Shopping Cart */
export const CartIcon = createIcon('CartIcon', (
  <>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </>
));

/** Shopping Bag */
export const BagIcon = createIcon('BagIcon', (
  <>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </>
));

/** Store / Shop front */
export const StoreIcon = createIcon('StoreIcon', (
  <>
    <path d="M3 9l1-4h16l1 4" />
    <path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9" />
    <path d="M9 21V12h6v9" />
    <path d="M3 9a3 3 0 003 3 3 3 0 003-3 3 3 0 003 3 3 3 0 003-3 3 3 0 003 3 3 3 0 003-3" />
  </>
));

/** Package / Order */
export const PackageIcon = createIcon('PackageIcon', (
  <>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </>
));

/** Tag / Price tag */
export const TagIcon = createIcon('TagIcon', (
  <>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </>
));

/** Delivery Truck */
export const TruckIcon = createIcon('TruckIcon', (
  <>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </>
));

/* =========================================================================== */
/* USER & PROFILE ICONS                                                        */
/* =========================================================================== */

/** User / Person */
export const UserIcon = createIcon('UserIcon', (
  <>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
));

/** User Plus — add user */
export const UserPlusIcon = createIcon('UserPlusIcon', (
  <>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </>
));

/** Users / Multiple people */
export const UsersIcon = createIcon('UsersIcon', (
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </>
));

/** Settings / Gear */
export const SettingsIcon = createIcon('SettingsIcon', (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </>
));

/* =========================================================================== */
/* COMMUNICATION ICONS                                                         */
/* =========================================================================== */

/** Bell / Notification */
export const BellIcon = createIcon('BellIcon', (
  <>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </>
));

/** Phone */
export const PhoneIcon = createIcon('PhoneIcon', (
  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
));

/** Mail / Email */
export const MailIcon = createIcon('MailIcon', (
  <>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22 6 12 13 2 6" />
  </>
));

/** Share */
export const ShareIcon = createIcon('ShareIcon', (
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>
));

/* =========================================================================== */
/* ACTION ICONS                                                                */
/* =========================================================================== */

/** Plus / Add */
export const PlusIcon = createIcon('PlusIcon', (
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
));

/** Minus / Remove */
export const MinusIcon = createIcon('MinusIcon', (
  <line x1="5" y1="12" x2="19" y2="12" />
));

/** Check / Checkmark */
export const CheckIcon = createIcon('CheckIcon', (
  <polyline points="20 6 9 17 4 12" />
));

/** Check Circle */
export const CheckCircleIcon = createIcon('CheckCircleIcon', (
  <>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>
));

/** Edit / Pencil */
export const EditIcon = createIcon('EditIcon', (
  <>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>
));

/** Delete / Trash */
export const DeleteIcon = createIcon('DeleteIcon', (
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
));

/** Download */
export const DownloadIcon = createIcon('DownloadIcon', (
  <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>
));

/** Upload */
export const UploadIcon = createIcon('UploadIcon', (
  <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>
));

/** Filter */
export const FilterIcon = createIcon('FilterIcon', (
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
));

/** Sort */
export const SortIcon = createIcon('SortIcon', (
  <>
    <line x1="4" y1="6" x2="13" y2="6" />
    <line x1="4" y1="12" x2="17" y2="12" />
    <line x1="4" y1="18" x2="21" y2="18" />
  </>
));

/** Refresh / Reload */
export const RefreshIcon = createIcon('RefreshIcon', (
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </>
));

/** Copy */
export const CopyIcon = createIcon('CopyIcon', (
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </>
));

/* =========================================================================== */
/* STATUS & FEEDBACK ICONS                                                     */
/* =========================================================================== */

/** Heart / Favorite */
export const HeartIcon = createIcon('HeartIcon', (
  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
));

/** Heart Filled */
export const HeartFilledIcon = createIcon('HeartFilledIcon', (
  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor" />
), { stroke: false, fill: 'currentColor' });

/** Star / Rating */
export const StarIcon = createIcon('StarIcon', (
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
));

/** Star Filled */
export const StarFilledIcon = createIcon('StarFilledIcon', (color) => (
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke={color} />
), { fill: 'currentColor' });

/** Star Half */
export const StarHalfIcon = createIcon('StarHalfIcon', (color) => (
  <>
    <defs>
      <clipPath id="half-clip">
        <rect x="0" y="0" width="12" height="24" />
      </clipPath>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} fill="none" strokeWidth="1.5" />
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} clipPath="url(#half-clip)" stroke="none" />
  </>
), { fill: 'none' });

/** Info circle */
export const InfoIcon = createIcon('InfoIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
));

/** Warning triangle */
export const WarningIcon = createIcon('WarningIcon', (
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>
));

/** Success / Check circle filled */
export const SuccessIcon = createIcon('SuccessIcon', (
  <>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>
));

/** Error / X circle */
export const ErrorIcon = createIcon('ErrorIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>
));

/* =========================================================================== */
/* SECURITY ICONS                                                              */
/* =========================================================================== */

/** Lock */
export const LockIcon = createIcon('LockIcon', (
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </>
));

/** Unlock */
export const UnlockIcon = createIcon('UnlockIcon', (
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 019.9-1" />
  </>
));

/** Eye / Show password */
export const EyeIcon = createIcon('EyeIcon', (
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>
));

/** Eye Off / Hide password */
export const EyeOffIcon = createIcon('EyeOffIcon', (
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>
));

/** Shield */
export const ShieldIcon = createIcon('ShieldIcon', (
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
));

/* =========================================================================== */
/* LOCATION & MAP ICONS                                                        */
/* =========================================================================== */

/** Map Pin / Location */
export const LocationIcon = createIcon('LocationIcon', (
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </>
));

/** Map */
export const MapIcon = createIcon('MapIcon', (
  <>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </>
));

/** Navigation / Compass */
export const NavigationIcon = createIcon('NavigationIcon', (
  <polygon points="3 11 22 2 13 21 11 13 3 11" />
));

/** Globe */
export const GlobeIcon = createIcon('GlobeIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </>
));

/* =========================================================================== */
/* TIME & SCHEDULE ICONS                                                       */
/* =========================================================================== */

/** Clock */
export const ClockIcon = createIcon('ClockIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
));

/** Calendar */
export const CalendarIcon = createIcon('CalendarIcon', (
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>
));

/* =========================================================================== */
/* ANALYTICS & BUSINESS ICONS                                                  */
/* =========================================================================== */

/** Analytics / Bar Chart */
export const AnalyticsIcon = createIcon('AnalyticsIcon', (
  <>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </>
));

/** Trending Up */
export const TrendingUpIcon = createIcon('TrendingUpIcon', (
  <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </>
));

/** Trending Down */
export const TrendingDownIcon = createIcon('TrendingDownIcon', (
  <>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </>
));

/** Pie Chart */
export const PieChartIcon = createIcon('PieChartIcon', (
  <>
    <path d="M21.21 15.89A10 10 0 118 2.83" />
    <path d="M22 12A10 10 0 0012 2v10z" />
  </>
));

/** Dollar / Money */
export const MoneyIcon = createIcon('MoneyIcon', (
  <>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </>
));

/** Certificate / Award */
export const CertificateIcon = createIcon('CertificateIcon', (
  <>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </>
));

/** Invoice / Receipt */
export const InvoiceIcon = createIcon('InvoiceIcon', (
  <>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </>
));

/* =========================================================================== */
/* MEDIA & CONTENT ICONS                                                       */
/* =========================================================================== */

/** Image / Photo */
export const ImageIcon = createIcon('ImageIcon', (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </>
));

/** Camera */
export const CameraIcon = createIcon('CameraIcon', (
  <>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </>
));

/** File / Document */
export const FileIcon = createIcon('FileIcon', (
  <>
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </>
));

/** Clipboard */
export const ClipboardIcon = createIcon('ClipboardIcon', (
  <>
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </>
));

/** Link */
export const LinkIcon = createIcon('LinkIcon', (
  <>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </>
));

/* =========================================================================== */
/* BRAND & SOCIAL ICONS                                                        */
/* =========================================================================== */

/** Google Logo (simplified) */
export const GoogleIcon = createIcon('GoogleIcon', (color) => (
  <>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" stroke="none" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" stroke="none" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none" />
  </>
), { stroke: false, viewBox: '0 0 24 24' });

/** FlashCart Logo (Lightning bolt in cart) */
export const FlashCartLogoIcon = createIcon('FlashCartLogoIcon', (color) => (
  <>
    {/* Cart body */}
    <rect x="3" y="6" width="18" height="12" rx="2.5" fill="none" stroke={color} strokeWidth="1.8" />
    {/* Lightning bolt */}
    <path d="M13.5 4L9.5 13h3.5l-1 7 5-8h-3.5l2-8h-2z" fill={color} stroke="none" />
    {/* Cart wheels */}
    <circle cx="8.5" cy="20.5" r="1.5" fill={color} stroke="none" />
    <circle cx="15.5" cy="20.5" r="1.5" fill={color} stroke="none" />
    {/* Cart handle */}
    <path d="M3 7.5L1 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </>
), { stroke: false });

/* =========================================================================== */
/* MISCELLANEOUS ICONS                                                         */
/* =========================================================================== */

/** External Link */
export const ExternalLinkIcon = createIcon('ExternalLinkIcon', (
  <>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>
));

/** Logout / Sign Out */
export const LogoutIcon = createIcon('LogoutIcon', (
  <>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </>
));

/** Login / Sign In */
export const LoginIcon = createIcon('LoginIcon', (
  <>
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </>
));

/** Layers / Stack */
export const LayersIcon = createIcon('LayersIcon', (
  <>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </>
));

/** Grid / Category view */
export const GridIcon = createIcon('GridIcon', (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </>
));

/** List view */
export const ListIcon = createIcon('ListIcon', (
  <>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </>
));

/** Power / Toggle */
export const PowerIcon = createIcon('PowerIcon', (
  <>
    <path d="M18.36 6.64a9 9 0 11-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </>
));

/** Zap / Lightning (for FlashCart branding) */
export const ZapIcon = createIcon('ZapIcon', (
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
));

/** Bookmark */
export const BookmarkIcon = createIcon('BookmarkIcon', (
  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
));

/** Volume / Sound */
export const VolumeIcon = createIcon('VolumeIcon', (
  <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
  </>
));

/** Wifi */
export const WifiIcon = createIcon('WifiIcon', (
  <>
    <path d="M5 12.55a11 11 0 0114.08 0" />
    <path d="M1.42 9a16 16 0 0121.16 0" />
    <path d="M8.53 16.11a6 6 0 016.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </>
));

/** Moon (dark mode) */
export const MoonIcon = createIcon('MoonIcon', (
  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
));

/** Sun (light mode) */
export const SunIcon = createIcon('SunIcon', (
  <>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </>
));

/** Language / Translate */
export const LanguageIcon = createIcon('LanguageIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </>
));

/** QR Code */
export const QRCodeIcon = createIcon('QRCodeIcon', (
  <>
    <rect x="2" y="2" width="8" height="8" rx="1" />
    <rect x="14" y="2" width="8" height="8" rx="1" />
    <rect x="2" y="14" width="8" height="8" rx="1" />
    <rect x="14" y="14" width="4" height="4" rx="0.5" />
    <rect x="20" y="14" width="2" height="2" rx="0.5" />
    <rect x="14" y="20" width="2" height="2" rx="0.5" />
    <rect x="20" y="20" width="2" height="2" rx="0.5" />
    <rect x="5" y="5" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="17" y="5" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="5" y="17" width="2" height="2" rx="0.5" fill="currentColor" />
  </>
));

/** Printer */
export const PrinterIcon = createIcon('PrinterIcon', (
  <>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </>
));

/** Megaphone / Announcement */
export const MegaphoneIcon = createIcon('MegaphoneIcon', (
  <>
    <path d="M3 11l18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
  </>
));

/** Food / Restaurant (plate with utensils) */
export const FoodIcon = createIcon('FoodIcon', (
  <>
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </>
));

/** Pill / Medicine */
export const MedicineIcon = createIcon('MedicineIcon', (
  <>
    <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <path d="M12 6v-2" />
  </>
));

/** Book / Library */
export const BookIcon = createIcon('BookIcon', (
  <>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </>
));

/** Smartphone / Mobile */
export const SmartphoneIcon = createIcon('SmartphoneIcon', (
  <>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </>
));

/** Shirt / Clothing */
export const ClothingIcon = createIcon('ClothingIcon', (
  <>
    <path d="M20.38 3.46L16 2h-3.18A3 3 0 0112 4a3 3 0 01-.82-2H8L3.62 3.46a2 2 0 00-.85 2.75L5 10h3v10h8V10h3l2.23-3.79a2 2 0 00-.85-2.75z" />
  </>
));

/** Tv / Electronics */
export const ElectronicsIcon = createIcon('ElectronicsIcon', (
  <>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </>
));

/** Shopping basket / Grocery */
export const GroceryIcon = createIcon('GroceryIcon', (
  <>
    <path d="M5.757 1.071a.5.5 0 01.172.686L3.383 6h17.234l-2.546-4.243a.5.5 0 01.858-.514L21.657 6H23a1 1 0 011 1v2a1 1 0 01-1 1h-.293l-1.598 11.187A3 3 0 0118.131 24H5.869a3 3 0 01-2.978-2.813L1.293 10H1a1 1 0 01-1-1V7a1 1 0 011-1h1.343L5.071 1.243a.5.5 0 01.686-.172z" />
  </>
), { viewBox: '0 0 24 24' });

/** More Horizontal (three dots) */
export const MoreHorizontalIcon = createIcon('MoreHorizontalIcon', (
  <>
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="19" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="12" r="1" fill="currentColor" />
  </>
));

/** More Vertical (three dots vertical) */
export const MoreVerticalIcon = createIcon('MoreVerticalIcon', (
  <>
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </>
));

/** Hash / Number */
export const HashIcon = createIcon('HashIcon', (
  <>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </>
));

/** Flag / Report */
export const FlagIcon = createIcon('FlagIcon', (
  <>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </>
));

/** Target / Aim */
export const TargetIcon = createIcon('TargetIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>
));

/** Gift / Reward */
export const GiftIcon = createIcon('GiftIcon', (
  <>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </>
));

/** Dashboard / Layout */
export const DashboardIcon = createIcon('DashboardIcon', (
  <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>
));

/** Crosshair / GPS Target */
export const CrosshairIcon = createIcon('CrosshairIcon', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </>
));

/** Save / Floppy Disk */
export const SaveIcon = createIcon('SaveIcon', (
  <>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </>
));

/** Send / Paper Plane */
export const SendIcon = createIcon('SendIcon', (
  <>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </>
));
