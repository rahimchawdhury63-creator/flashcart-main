// ============================================================
// FlashCart — Toast Notification Component
// Brief, non-intrusive notifications for user feedback.
// Auto-dismisses after duration. Accessible with ARIA live.
// ============================================================

import React, { useEffect, useState } from 'react';
import SVGIcon from '../SVGIcon/SVGIcon';
import './Toast.css';

// Icon mapping for toast variants
const TOAST_ICONS = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info',
};

/**
 * Toast — Brief notification message.
 *
 * @param {string}   message   - Notification text
 * @param {string}   variant   - 'success'|'error'|'warning'|'info'
 * @param {number}   duration  - Auto-dismiss duration in ms (default 4000)
 * @param {function} onDismiss - Called when toast is dismissed
 * @param {boolean}  visible   - Controlled visibility
 */
const Toast = ({
  message,
  variant = 'info',
  duration = 4000,
  onDismiss,
  visible = true,
}) => {

  // Internal visibility state for exit animation
  const [isVisible, setIsVisible] = useState(visible);

  // Auto-dismiss timer
  useEffect(() => {
    if (!visible) return;

    // Set timer to dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);           // Trigger exit animation
      setTimeout(onDismiss, 300);    // Wait for animation, then call onDismiss
    }, duration);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  // Don't render if not visible
  if (!isVisible && !visible) return null;

  return (
    <div
      className={`fc-toast fc-toast-${variant} ${isVisible ? 'toast-enter' : 'toast-exit'}`}
      role="alert"          // Screen readers announce immediately
      aria-live="assertive" // Priority announcement
      aria-atomic="true"    // Read entire message as one unit
    >
      {/* Variant icon */}
      <span className="toast-icon" aria-hidden="true">
        <SVGIcon name={TOAST_ICONS[variant]} size={18} />
      </span>

      {/* Message text */}
      <p className="toast-message">{message}</p>

      {/* Manual dismiss button */}
      <button
        type="button"
        className="toast-close"
        onClick={() => { setIsVisible(false); setTimeout(onDismiss, 300); }}
        aria-label="Dismiss notification"
      >
        <SVGIcon name="close" size={16} ariaHidden={true} />
      </button>
    </div>
  );
};

export default Toast;
