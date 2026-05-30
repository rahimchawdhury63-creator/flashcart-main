// PasswordStrength.jsx — Visual password strength meter.
import React from 'react'

// Score 0-4 based on length and character variety.
function scorePassword(pw) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function PasswordStrength({ password }) {
  const score = scorePassword(password)
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#1a6b3c']
  if (!password) return null
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? colors[score] : 'var(--color-border)' }} />
        ))}
      </div>
      <small style={{ color: colors[score] }}>{labels[score]}</small>
    </div>
  )
}
