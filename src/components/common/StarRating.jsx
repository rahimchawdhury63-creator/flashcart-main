// StarRating.jsx — Display (and optionally select) a 1-5 star rating.
import React from 'react'
import { IconStar, IconStarOutline } from '../svgs'

/**
 * @param {number} value - current rating
 * @param {number} count - optional number of ratings to show next to stars
 * @param {boolean} editable - if true, clicking sets the rating
 * @param {(n:number)=>void} onChange - called when editable star clicked
 */
export default function StarRating({ value = 0, count, editable = false, onChange, size = 16 }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <span className="stars" aria-label={`Rating ${value} out of 5`}>
      {stars.map((n) =>
        n <= Math.round(value) ? (
          <IconStar
            key={n}
            size={size}
            className="star-filled"
            style={editable ? { cursor: 'pointer' } : undefined}
            onClick={editable ? () => onChange?.(n) : undefined}
          />
        ) : (
          <IconStarOutline
            key={n}
            size={size}
            className="star-empty"
            style={editable ? { cursor: 'pointer' } : undefined}
            onClick={editable ? () => onChange?.(n) : undefined}
          />
        )
      )}
      {count != null && <small style={{ marginLeft: 4 }}>({count})</small>}
    </span>
  )
}
