// LoadingSpinner.jsx — Centered loading spinner with optional label.
import React from 'react'

export default function LoadingSpinner({ label, large = false }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--sp-4)', gap: 'var(--sp-1)' }}>
      <span className={large ? 'spinner spinner-lg' : 'spinner'} role="status" aria-label="Loading" />
      {label && <span className="text-light" style={{ fontSize: '0.85rem' }}>{label}</span>}
    </div>
  )
}
