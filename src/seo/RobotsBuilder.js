/**
 * =============================================================================
 * FLASHCART — Robots.txt Builder
 * =============================================================================
 *
 * Purpose: Generate robots.txt content for the FlashCart sites.
 * Used by the admin panel to regenerate robots.txt if needed.
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

/**
 * Generate robots.txt content.
 *
 * @param {object} options
 * @param {boolean} options.allowAll — Allow all crawlers (default: true)
 * @param {Array<string>} options.disallow — Paths to disallow
 * @returns {string} robots.txt content
 */
export const generateRobotsTxt = ({
  allowAll = true,
  disallow = ['/admin', '/admin/']
} = {}) => {
  let content = '';

  /* User-agent rules */
  if (allowAll) {
    content += 'User-agent: *\nAllow: /\n\n';
  }

  /* Disallow paths */
  if (disallow && disallow.length > 0) {
    disallow.forEach((path) => {
      content += `Disallow: ${path}\n`;
    });
    content += '\n';
  }

  /* Sitemap reference */
  content += `Sitemap: ${BASE_URL}/sitemap.xml\n`;

  return content;
};

export default generateRobotsTxt;
