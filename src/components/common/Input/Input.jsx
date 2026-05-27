// ============================================================
// FlashCart — Input Component
// Universal text input for all forms across all portals.
// Supports: text, email, password, tel, number, search types.
// Built-in error display, label, helper text, icons.
// ============================================================

import React, { useState } from 'react';
import SVGIcon from '../SVGIcon/SVGIcon';
import './Input.css';

/**
 * Input — Universal form input component.
 *
 * @param {string}   label       - Input label text
 * @param {string}   type        - Input type (text|email|password|tel|number|search)
 * @param {string}   placeholder - Placeholder text
 * @param {string}   value       - Controlled value
 * @param {function} onChange    - Change handler
 * @param {string}   error       - Error message to display
 * @param {string}   helper      - Helper text below input
 * @param {string}   iconLeft    - SVGIcon name for left icon
 * @param {string}   iconRight   - SVGIcon name for right icon
 * @param {boolean}  required    - Required field indicator
 * @param {boolean}  disabled    - Disabled state
 * @param {string}   id          - Input ID (for label association)
 * @param {string}   name        - Input name (for form submission)
 * @param {string}   className   - Additional classes
 * @param {number}   maxLength   - Maximum characters allowed
 */
const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helper = '',
  iconLeft = null,
  iconRight = null,
  required = false,
  disabled = false,
  id,
  name,
  className = '',
  maxLength,
  ...props
}) => {

  // State for password visibility toggle
  // Only relevant when type is 'password'
  const [showPassword, setShowPassword] = useState(false);

  // Generate unique ID if not provided — needed for label association
  const inputId = id || `fc-input-${name || Math.random().toString(36).substr(2, 9)}`;

  // Determine the actual input type
  // For password inputs, toggle between 'password' and 'text'
  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={`fc-input-wrapper ${className}`}>

      {/* Input label — associates with input via htmlFor/id */}
      {label && (
        <label
          htmlFor={inputId}
          className="fc-input-label"
        >
          {/* Label text */}
          {label}
          {/* Required indicator */}
          {required && (
            <span className="fc-input-required" aria-hidden="true"> *</span>
          )}
        </label>
      )}

      {/* Input container — positions icons relative to input */}
      <div className={`fc-input-container ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>

        {/* Left icon */}
        {iconLeft && (
          <span className="fc-input-icon-left" aria-hidden="true">
            <SVGIcon name={iconLeft} size={18} />
          </span>
        )}

        {/* The actual input element */}
        <input
          id={inputId}                   // Links to label
          name={name}                    // Form field name
          type={inputType}               // Dynamic type for password toggle
          placeholder={placeholder}      // Placeholder text
          value={value}                  // Controlled value
          onChange={onChange}            // Change handler
          disabled={disabled}            // Disabled state
          required={required}            // HTML5 required validation
          maxLength={maxLength}          // Character limit
          className={`fc-input ${iconLeft ? 'has-icon-left' : ''} ${iconRight || type === 'password' ? 'has-icon-right' : ''}`}
          aria-invalid={error ? 'true' : 'false'} // ARIA for error state
          aria-describedby={
            // Link to error or helper text for screen readers
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          {...props}               // Spread remaining props (autoComplete, etc.)
        />

        {/* Right icon — for password toggle or custom icon */}
        {type === 'password' ? (
          // Password visibility toggle button
          <button
            type="button"
            className="fc-input-icon-right fc-input-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            <SVGIcon
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              ariaHidden={true}
            />
          </button>
        ) : iconRight ? (
          // Custom right icon (decorative)
          <span className="fc-input-icon-right" aria-hidden="true">
            <SVGIcon name={iconRight} size={18} />
          </span>
        ) : null}
      </div>

      {/* Error message — shown when error prop has content */}
      {error && (
        <p
          id={`${inputId}-error`}       // Referenced by aria-describedby
          className="fc-input-error"
          role="alert"                   // Screen readers announce immediately
          aria-live="polite"             // Polite announcement
        >
          <SVGIcon name="alert-circle" size={14} ariaHidden={true} />
          {error}
        </p>
      )}

      {/* Helper text — shown when no error and helper prop has content */}
      {helper && !error && (
        <p
          id={`${inputId}-helper`}      // Referenced by aria-describedby
          className="fc-input-helper"
        >
          {helper}
        </p>
      )}
    </div>
  );
};

export default Input;
