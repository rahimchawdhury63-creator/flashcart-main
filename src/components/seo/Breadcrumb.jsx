// ============================================================
// FlashCart — Breadcrumb Component
// Visible breadcrumb navigation + Schema.org structured data.
// Helps users navigate and helps Google understand page hierarchy.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

// Schema builder
import { buildBreadcrumbSchema } from '../../utils/schemaBuilder';

// SEO component
import SchemaOrg from './SchemaOrg';

// Icon
import SVGIcon from '../common/SVGIcon/SVGIcon';

// Styles
import './Breadcrumb.css';

/**
 * Breadcrumb
 * Renders visible breadcrumb trail AND injects Schema.org BreadcrumbList.
 *
 * @param {Array} items - Array of { label, labelBn, href } objects
 *   Last item is current page (no link)
 *   Example:
 *   [
 *     { label: 'Home', labelBn: 'হোম', href: '/' },
 *     { label: 'Restaurant', labelBn: 'রেস্টুরেন্ট', href: '/category/restaurant' },
 *     { label: 'ABC Restaurant', labelBn: 'ABC রেস্টুরেন্ট', href: null },
 *   ]
 * @param {string} lang - Current language for label selection
 */
const Breadcrumb = ({ items = [], lang = 'default' }) => {

  // Don't render if only 1 item (just homepage — no breadcrumb needed)
  if (!items || items.length <= 1) return null;

  // Build Schema.org breadcrumb data
  // Use the full URL for schema (required by Google)
  const schemaItems = items.map(item => ({
    name: item.label,
    url:  item.href
      ? `${window.location.origin}${item.href}`
      : window.location.href,
  }));

  const breadcrumbSchema = buildBreadcrumbSchema(schemaItems);

  return (
    <>
      {/* Inject Schema.org BreadcrumbList */}
      <SchemaOrg schema={breadcrumbSchema} />

      {/* Visible breadcrumb navigation */}
      <nav
        className="fc-breadcrumb"
        aria-label="Breadcrumb navigation"
      >
        <ol
          className="breadcrumb-list"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            // Is this the last item (current page)?
            const isLast = index === items.length - 1;

            // Choose label based on language
            const label = lang === 'bn' && item.labelBn
              ? item.labelBn
              : item.label;

            return (
              <li
                key={index}
                className="breadcrumb-item"
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                {/* Hidden meta for Schema.org position */}
                <meta itemProp="position" content={String(index + 1)} />

                {isLast ? (
                  /* Current page — not a link */
                  <span
                    className="breadcrumb-current"
                    aria-current="page"
                    itemProp="name"
                  >
                    {label}
                  </span>
                ) : (
                  /* Parent page — link */
                  <>
                    <Link
                      to={item.href}
                      className="breadcrumb-link"
                      itemProp="item"
                    >
                      <span itemProp="name">{label}</span>
                    </Link>

                    {/* Separator between items */}
                    <span
                      className="breadcrumb-separator"
                      aria-hidden="true"
                    >
                      <SVGIcon
                        name="chevron-right"
                        size={14}
                        ariaHidden
                      />
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
