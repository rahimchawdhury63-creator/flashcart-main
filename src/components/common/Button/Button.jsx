// ============================================================
// FlashCart — Button Component
// The universal button used across the entire platform.
// Supports: primary, secondary, outline, ghost, danger variants.
// All buttons meet 44px minimum touch target for mobile.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React from 'react';
import SVGIcon from '../SVGIcon/SVGIcon';  // Icon support
import './Button.css';                     // Component styles

/**
 * Button — Universal button component.
 *
 * @param {string}    variant    - 'primary'|'secondary'|'outline'|'ghost'|'danger'
 * @param {string}    size       - 'sm'|'md'|'lg'
 * @param {boolean}   fullWidth  - Stretches button to container width
 * @param {boolean}   loading    - Shows loading spinner, disables button
 * @param {boolean}   disabled   - Disables the button
 * @param {string}    icon       - SVGIcon name to show on left
 * @param {string}    iconRight  - SVGIcon name to show on right
 * @param {string}    type       - HTML button type (button|submit|reset)
 * @param {function}  onClick    - Click handler
 * @param {string}    className  - Additional classes
 * @param {node}      children   - Button label content
 */
const Button = ({
  variant = 'primary',   // Default to primary brand button
  size = 'md',           // Default medium size (44px height — touch friendly)
  fullWidth = false,     // Does not stretch by default
  loading = false,       // Not loading by default
  disabled = false,      // Not disabled by default
  icon = null,           // No left icon by default
  iconRight = null,      // No right icon by default
  type = 'button',       // Default type prevents accidental form submission
  onClick,               // Click handler
  className = '',        // Additional classes from parent
  children,              // Button label
  ...props               // Any other HTML button attributes (aria-*, data-*, etc.)
}) => {

  // Map size names to CSS classes and icon sizes
  const sizeConfig = {
    sm: { class: 'btn-sm', iconSize: 14 }, // Small — 36px height
    md: { class: 'btn-md', iconSize: 16 }, // Medium — 44px height (touch target)
    lg: { class: 'btn-lg', iconSize: 20 }, // Large — 52px height
  };

  // Get the size configuration (fallback to md if invalid size provided)
  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Build the complete className string from all modifiers
  const buttonClasses = [
    'fc-btn',                          // Base button class
    `fc-btn-${variant}`,               // Variant class (color scheme)
    currentSize.class,                 // Size class
    fullWidth ? 'btn-full' : '',       // Full width modifier
    loading ? 'btn-loading' : '',      // Loading state modifier
    disabled || loading ? 'btn-disabled' : '', // Disabled visual state
    className,                         // Additional classes from parent
  ]
    .filter(Boolean)                   // Remove empty strings
    .join(' ');                        // Join into single string

  // Handle click — prevent clicks when loading or disabled
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();  // Stop event
      return;              // Do nothing
    }
    onClick?.(e);          // Call the provided onClick handler if it exists
  };

  return (
    <button
      type={type}              // HTML button type attribute
      className={buttonClasses} // All computed CSS classes
      onClick={handleClick}     // Click handler with guard
      disabled={disabled || loading} // Native disabled attribute
      aria-disabled={disabled || loading} // ARIA disabled for screen readers
      aria-busy={loading}       // ARIA busy — screen readers say "busy"
      {...props}                // Spread remaining props (aria-label, data-*, etc.)
    >
      {/* Loading spinner — shown when loading prop is true */}
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          {/* Spinning refresh icon as loading indicator */}
          <SVGIcon
            name="refresh"
            size={currentSize.iconSize}
            className="icon-spin"
            ariaHidden={true}
          />
        </span>
      )}

      {/* Left icon — shown when icon prop is provided and not loading */}
      {icon && !loading && (
        <span className="btn-icon-left" aria-hidden="true">
          <SVGIcon
            name={icon}
            size={currentSize.iconSize}
            ariaHidden={true}
          />
        </span>
      )}

      {/* Button label — the text content */}
      {/* Wrap in span to allow proper flex alignment with icons */}
      <span className="btn-label">
        {children}
      </span>

      {/* Right icon — shown when iconRight prop is provided */}
      {iconRight && !loading && (
        <span className="btn-icon-right" aria-hidden="true">
          <SVGIcon
            name={iconRight}
            size={currentSize.iconSize}
            ariaHidden={true}
          />
        </span>
      )}
    </button>
  );
};

// Export as default
export default Button;
