// ============================================================
// FlashCart — Badge Component
// Small labels for status indicators, counts, tags.
// ============================================================

import React from 'react';
import './Badge.css';

/**
 * Badge — Status indicator, count, or label.
 *
 * @param {string} variant  - 'default'|'success'|'warning'|'error'|'info'|'primary'
 * @param {string} size     - 'sm'|'md'|'lg'
 * @param {node}   children - Badge content
 * @param {string} className- Additional classes
 */
const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`fc-badge fc-badge-${variant} badge-${size} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
