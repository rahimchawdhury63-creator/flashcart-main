// ============================================================
// FlashCart — Skeleton Loading Component
// Placeholder animation shown while content loads.
// Prevents layout shift and improves perceived performance.
// ============================================================

import React from 'react';
import './Skeleton.css';

/**
 * Skeleton — Loading placeholder with shimmer animation.
 *
 * @param {string} variant  - 'text'|'circular'|'rectangular'|'card'
 * @param {number} width    - Width (px or %)
 * @param {number} height   - Height (px)
 * @param {string} className- Additional classes
 * @param {number} count    - Number of skeleton lines (for 'text' variant)
 */
const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  count = 1,
  ...props
}) => {

  // For text variant, render multiple lines
  if (variant === 'text' && count > 1) {
    return (
      <div className="skeleton-text-group">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`fc-skeleton skeleton-${variant} shimmer ${className}`}
            style={{
              width: i === count - 1 ? '60%' : width || '100%', // Last line shorter
              height: height || '16px',
            }}
            aria-hidden="true"
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`fc-skeleton skeleton-${variant} shimmer ${className}`}
      style={{
        width: width || (variant === 'circular' ? '48px' : '100%'),
        height: height || (variant === 'circular' ? '48px' : variant === 'text' ? '16px' : '200px'),
      }}
      aria-hidden="true"   // Hidden from screen readers — it's just a placeholder
      aria-label="Loading" // But label describes purpose for testing
      {...props}
    />
  );
};

// Store card skeleton — composite skeleton for store cards
export const StoreCardSkeleton = () => (
  <div className="fc-skeleton-card">
    <Skeleton variant="rectangular" height={180} />
    <div className="skeleton-card-content">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="skeleton-card-text">
        <Skeleton variant="text" height={20} width="70%" />
        <Skeleton variant="text" height={14} width="50%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
    </div>
  </div>
);

// Item card skeleton
export const ItemCardSkeleton = () => (
  <div className="fc-skeleton-card">
    <Skeleton variant="rectangular" height={140} />
    <div className="skeleton-card-content" style={{ padding: '12px' }}>
      <Skeleton variant="text" height={18} width="80%" />
      <Skeleton variant="text" height={14} width="50%" />
      <Skeleton variant="text" height={20} width="30%" />
    </div>
  </div>
);

export default Skeleton;
