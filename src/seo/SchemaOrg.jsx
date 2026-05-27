/**
 * =============================================================================
 * FLASHCART — Schema Org Aggregator
 * =============================================================================
 *
 * Purpose: Convenience component that exports all schema components from
 * a single location for easier importing in pages.
 *
 * Usage:
 *   import { LocalBusinessSchema, BreadcrumbSchema } from '@/seo/SchemaOrg';
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

export { default as WebsiteSchema } from './schemas/WebsiteSchema';
export { default as OrganizationSchema } from './schemas/OrganizationSchema';
export { default as LocalBusinessSchema } from './schemas/LocalBusinessSchema';
export { default as RestaurantSchema } from './schemas/RestaurantSchema';
export { default as ProductSchema } from './schemas/ProductSchema';
export { default as BreadcrumbSchema } from './schemas/BreadcrumbSchema';
export { default as FAQSchema } from './schemas/FAQSchema';
export { default as SoftwareApplicationSchema } from './schemas/SoftwareApplicationSchema';
