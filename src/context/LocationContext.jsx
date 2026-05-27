// ============================================================
// FlashCart — Location Context Provider
// Manages user's current location state.
// Used for: store discovery, distance calculation, delivery area.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// Geo utilities
import {
  getDhakaCenter,
  findNearestCity,
} from '../utils/geoUtils';

// Cookie manager for persistence
import {
  savePreferredArea,
  getPreferredArea,
} from '../utils/cookieManager';

// Create context
const LocationContext = createContext(null);

/**
 * LocationProvider
 * Provides user location state to all child components.
 */
export const LocationProvider = ({ children }) => {

  // Current user location (lat, lng)
  // Default to Dhaka center if location not available
  const [userLocation, setUserLocation] = useState(null);

  // The area/city object (from BANGLADESH_MAJOR_CITIES)
  const [selectedArea, setSelectedArea] = useState(null);

  // Whether we have GPS coordinates (vs manually selected area)
  const [isGPSLocation, setIsGPSLocation] = useState(false);

  // Whether location has been set at all
  const [hasLocation, setHasLocation] = useState(false);

  // ── LOAD SAVED AREA FROM COOKIE ───────────────────────

  useEffect(() => {
    // Try to restore preferred area from cookie
    const saved = getPreferredArea();

    if (saved && saved.lat && saved.lng) {
      setUserLocation({ lat: saved.lat, lng: saved.lng });
      setSelectedArea(saved);
      setHasLocation(true);
      setIsGPSLocation(false);
    }
  }, []);

  // ── SET GPS LOCATION ──────────────────────────────────

  /**
   * setGPSLocation
   * Sets location from browser GPS coordinates.
   *
   * @param {{ lat, lng }} coords - GPS coordinates
   */
  const setGPSLocation = useCallback((coords) => {
    if (!coords?.lat || !coords?.lng) return;

    setUserLocation({ lat: coords.lat, lng: coords.lng });
    setIsGPSLocation(true);
    setHasLocation(true);

    // Find nearest city for display
    const nearestCity = findNearestCity(coords.lat, coords.lng);
    setSelectedArea(nearestCity);

    // Save to cookie
    savePreferredArea({
      ...nearestCity,
      lat: coords.lat,
      lng: coords.lng,
    });
  }, []);

  /**
   * setManualArea
   * Sets location from user's manual area selection.
   *
   * @param {object} area - Area object from DHAKA_AREAS or BANGLADESH_MAJOR_CITIES
   */
  const setManualArea = useCallback((area) => {
    if (!area?.lat || !area?.lng) return;

    setUserLocation({ lat: area.lat, lng: area.lng });
    setSelectedArea(area);
    setIsGPSLocation(false);
    setHasLocation(true);

    // Save to cookie
    savePreferredArea(area);
  }, []);

  /**
   * clearLocation
   * Resets location to default (Dhaka center).
   */
  const clearLocation = useCallback(() => {
    const dhaka = getDhakaCenter();
    setUserLocation(dhaka);
    setSelectedArea(null);
    setIsGPSLocation(false);
    setHasLocation(false);
  }, []);

  // ── CONTEXT VALUE ─────────────────────────────────────
  const contextValue = useMemo(() => ({
    userLocation: userLocation || getDhakaCenter(),
    selectedArea,
    isGPSLocation,
    hasLocation,
    setGPSLocation,
    setManualArea,
    clearLocation,
    // Display name for the selected area
    areaDisplayName: selectedArea
      ? (selectedArea.nameBn || selectedArea.name || 'Dhaka')
      : 'Dhaka',
  }), [
    userLocation, selectedArea, isGPSLocation, hasLocation,
    setGPSLocation, setManualArea, clearLocation,
  ]);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };
export default LocationProvider;
