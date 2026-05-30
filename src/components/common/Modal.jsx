// Modal.jsx — Reusable accessible modal dialog.
import React, { useEffect } from 'react'
import { IconClose } from '../svgs'

export default function Modal({ open, title, onClose, children, footer }) {
  // Close on Escape key for accessibility.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <IconClose size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-body" style={{ borderTop: '1px solid var(--color-border)' }}>{footer}</div>}
      </div>
    </div>
  )
}
