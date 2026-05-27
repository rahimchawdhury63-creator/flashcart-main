// ============================================================
// FlashCart — Loader Component
// Full-screen or inline loading state indicator.
// ============================================================

import React from 'react';
import SVGIcon from '../SVGIcon/SVGIcon';
import './Loader.css';

/**
 * Loader — Loading state indicator.
 *
 * @param {boolean} fullScreen - Takes full viewport (for page loads)
 * @param {string}  message    - Optional message below spinner
 * @param {string}  size       - 'sm'|'md'|'lg'
 */
const Loader = ({
  fullScreen = false,
  message = '',
  size = 'md',
}) => {

  // Icon sizes per loader size
  const iconSizes = { sm: 20, md: 32, lg: 48 };

  return (
    <div
      className={`fc-loader ${fullScreen ? 'loader-fullscreen' : 'loader-inline'}`}
      role="status"         // Screen readers: "Loading" status
      aria-label={message || 'Loading, please wait'}
      aria-live="polite"
    >
      {/* Spinning icon */}
      <div className="loader-spinner">
        <SVGIcon
          name="refresh"
          size={iconSizes[size]}
          color="var(--fc-primary)"
          className="icon-spin"
          ariaHidden={true}
        />
      </div>

      {/* Optional loading message */}
      {message && (
        <p className="loader-message">{message}</p>
      )}
    </div>
  );
};

export default Loader;
