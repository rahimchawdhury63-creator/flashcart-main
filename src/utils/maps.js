// maps.js — Free mapping utilities using Leaflet + OpenStreetMap + Nominatim.
// No API keys required. Provides distance math, geolocation, and geocoding.

/**
 * Haversine formula — distance between two lat/lng points in kilometers.
 * Used to filter and rank stores by proximity to the customer.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in km (2 decimal places)
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371 // Earth radius in km

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 100) / 100
}

/**
 * Get the user's current location using the browser Geolocation API.
 * Resolves gracefully — returns null coords if denied/unavailable.
 * @returns {Promise<{lat:number, lng:number}|null>}
 */
export function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null), // permission denied or error — fail gracefully
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

/**
 * Forward geocoding — convert an address string to coordinates using Nominatim.
 * @param {string} query - address / place name
 * @returns {Promise<{lat:number, lng:number, displayName:string}|null>}
 */
export async function geocodeAddress(query) {
  if (!query) return null
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=bd&q=${encodeURIComponent(
    query
  )}`
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    if (!data.length) return null
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    }
  } catch {
    return null
  }
}

/**
 * Reverse geocoding — convert coordinates to a human-readable address.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string|null>}
 */
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    return data?.display_name || null
  } catch {
    return null
  }
}

/**
 * Check if a customer location falls within a store's delivery range.
 * @param {object} store - must have lat, lng, deliveryRadius, allBangladeshDelivery
 * @param {{lat:number,lng:number}} customer
 * @returns {{inRange:boolean, distance:number|null}}
 */
export function isInDeliveryRange(store, customer) {
  if (store?.allBangladeshDelivery) return { inRange: true, distance: null }
  if (!customer || store?.lat == null || store?.lng == null) {
    return { inRange: false, distance: null }
  }
  const distance = haversineDistance(customer.lat, customer.lng, store.lat, store.lng)
  return { inRange: distance <= (store.deliveryRadius || 10), distance }
}
