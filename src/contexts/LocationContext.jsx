// LocationContext.jsx — Holds the customer's chosen/detected location.
// Persists to localStorage; exposes detect() (browser geolocation) and setManual().

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { getCurrentLocation, reverseGeocode } from '../utils/maps'

export const LocationContext = createContext(null)

const STORAGE_KEY = 'flashcart_location'

export function LocationProvider({ children }) {
  // location: { lat, lng, address } | null
  const [location, setLocation] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
    } catch {
      return null
    }
  })
  const [detecting, setDetecting] = useState(false)

  // Persist on change.
  useEffect(() => {
    if (location) localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
  }, [location])

  // Detect the user's location via the browser, then reverse-geocode to an address.
  const detect = useCallback(async () => {
    setDetecting(true)
    try {
      const coords = await getCurrentLocation()
      if (!coords) return null
      const address = await reverseGeocode(coords.lat, coords.lng)
      const loc = { ...coords, address: address || 'Current Location' }
      setLocation(loc)
      return loc
    } finally {
      setDetecting(false)
    }
  }, [])

  // Set a manually chosen location (e.g. from map picker or address search).
  const setManual = useCallback((loc) => setLocation(loc), [])

  return (
    <LocationContext.Provider value={{ location, detecting, detect, setManual }}>
      {children}
    </LocationContext.Provider>
  )
}
