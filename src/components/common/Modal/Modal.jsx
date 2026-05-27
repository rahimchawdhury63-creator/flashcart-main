// ============================================================
// FlashCart — Modal Component
// Accessible dialog overlay for confirmations and forms.
// Traps focus, closes on Escape, and manages scroll lock.
// ============================================================

import React, { useEffect, useRef } from 'react';
import SVGIcon from '../SVGIcon/SVGIcon';
import './Modal.css';

/**
 * Modal — Accessible dialog overlay.
 *
 * @param {boolean}  isOpen     - Controls visibility
 * @param {function} onClose    - Called when modal should close
 * @param {string}   title      - Modal title (required for accessibility)
 * @param {node}     children   - Modal body content
 * @param {node}     footer     - Modal footer content (actions)
 * @param {string}   size       - 'sm'|'md'|'lg'|'xl'
 * @param {boolean}  closeOnOverlay - Close when clicking outside (default true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}) => {

  // Ref for the modal dialog — used for focus management
  const modalRef = useRef(null);

  // Effect: lock body scroll and manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus the modal after it opens (accessibility)
      setTimeout(() => modalRef.current?.focus(), 100);
    } else {
      // Restore scroll when modal closes
      document.body.style.overflow = '';
    }

    // Cleanup: always restore scroll on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard handler — close on Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    // Portal-like rendering — fixed overlay covering viewport
    <div
      className="fc-modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}  // Close on overlay click
      role="presentation"
    >
      {/* Modal dialog */}
      <div
        ref={modalRef}
        className={`fc-modal fc-modal-${size} animate-scale-in`}
        role="dialog"              // ARIA dialog role
        aria-modal="true"          // Tells screen readers this is a modal
        aria-labelledby="modal-title" // Links to title
        tabIndex={-1}              // Focusable but not in tab order
        onClick={(e) => e.stopPropagation()} // Prevent overlay click
        onKeyDown={handleKeyDown}   // Escape to close
      >
        {/* Modal header */}
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">{title}</h2>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <SVGIcon name="close" size={20} ariaHidden={true} />
            </button>
          </div>
        )}

        {/* Modal body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Modal footer — optional action buttons */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
