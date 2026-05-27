// ============================================================
// FlashCart — usePermissions Hook
// Manages browser permission requests:
// - Geolocation (for location-based store discovery)
// - Notifications (for order alerts)
// Implements persistent asking until granted.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import { useState, useEffect, useCallback } from 'react';

// Cookie manager for permission state persistence
import {
  setCookie,
  getCookie,
} from '../utils/cookieManager';

// ── PERMISSION STATES ─────────────────────────────────────
// Matches the browser Permissions API states
const PERMISSION_STATES = {
  GRANTED:  'granted',   // User allowed
  DENIED:   'denied',    // User blocked
  PROMPT:   'prompt',    // Not yet asked
  DEFAULT:  'default',   // Not yet asked (Notification API uses 'default')
};

/**
 * usePermissions
 * Hook for managing browser permissions with persistent asking.
 *
 * PERSISTENT ASK STRATEGY:
 * - If permission is 'prompt' — ask on first visit and again after 3 days
 * - If permission is 'denied' — show manual instruction (can't force)
 * - If permission is 'granted' — no action needed
 *
 * @returns {object} Permission state and request functions
 */
const usePermissions = () => {

  // ── GEOLOCATION STATE ────────────────────────────────

  // Current geolocation permission status
  const [geoPermission, setGeoPermission] = useState('prompt');

  // Whether we're currently requesting geolocation
  const [geoLoading, setGeoLoading] = useState(false);

  // The obtained coordinates
  const [geoCoords, setGeoCoords] = useState(null);

  // Geolocation error message
  const [geoError, setGeoError] = useState('');

  // ── NOTIFICATION STATE ────────────────────────────────

  // Current notification permission status
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined'
      ? Notification.permission
      : 'default'
  );

  // Whether we're requesting notification permission
  const [notifLoading, setNotifLoading] = useState(false);

  // ── CHECK CURRENT PERMISSIONS ON MOUNT ────────────────

  useEffect(() => {
    // Check geolocation permission using Permissions API
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setGeoPermission(result.state);

          // Listen for permission changes
          result.addEventListener('change', () => {
            setGeoPermission(result.state);
          });
        })
        .catch(() => {
          // Permissions API not supported — default to 'prompt'
          setGeoPermission('prompt');
        });
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // ── GEOLOCATION PERMISSION ────────────────────────────

  /**
   * requestGeolocation
   * Requests the user's location via browser Geolocation API.
   * Shows browser's native permission dialog.
   *
   * Implements persistent asking:
   * - First time: shows prompt
   * - After denial: shows manual guide (can't re-prompt)
   * - After 3 days: checks again if permission was reset
   *
   * @returns {Promise<{ lat, lng } | null>} Coordinates or null
   */
  const requestGeolocation = useCallback(() => {
    return new Promise((resolve) => {
      setGeoLoading(true);
      setGeoError('');

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setGeoError('আপনার ব্রাউজার Location সমর্থন করে না / Your browser does not support geolocation');
        setGeoLoading(false);
        resolve(null);
        return;
      }

      // Request position
      navigator.geolocation.getCurrentPosition(
        // SUCCESS CALLBACK
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setGeoCoords(coords);
          setGeoPermission(PERMISSION_STATES.GRANTED);
          setGeoError('');
          setGeoLoading(false);

          // Save granted state to cookie
          setCookie('fc_geo_granted', 'true', 90);

          resolve(coords);
        },

        // ERROR CALLBACK
        (error) => {
          setGeoLoading(false);

          // Handle specific error codes
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setGeoPermission(PERMISSION_STATES.DENIED);
              setGeoError(
                'Location permission blocked. Please enable it in browser settings.\n' +
                'ব্রাউজার Settings-এ গিয়ে Location Permission চালু করুন।'
              );
              break;

            case error.POSITION_UNAVAILABLE:
              setGeoError('আপনার Location পাওয়া যাচ্ছে না / Location unavailable');
              break;

            case error.TIMEOUT:
              setGeoError('Location request timeout. আবার চেষ্টা করুন / Try again');
              break;

            default:
              setGeoError('Location error. আবার চেষ্টা করুন / Location error, please try again');
          }

          resolve(null);
        },

        // OPTIONS
        {
          enableHighAccuracy: true,    // Use GPS for best accuracy
          timeout: 10000,              // 10 second timeout
          maximumAge: 300000,          // Accept 5-minute cached position
        }
      );
    });
  }, []);

  // ── NOTIFICATION PERMISSION ───────────────────────────

  /**
   * requestNotificationPermission
   * Requests browser notification permission.
   * Shows native browser permission dialog.
   *
   * Cannot be called more than once programmatically
   * if user denied — user must change browser settings.
   *
   * @returns {Promise<string>} Permission state: 'granted'|'denied'|'default'
   */
  const requestNotificationPermission = useCallback(async () => {
    // Check support
    if (!('Notification' in window)) {
      return 'denied';
    }

    // Already granted
    if (Notification.permission === 'granted') {
      setNotifPermission('granted');
      return 'granted';
    }

    // Already denied — can't re-prompt
    if (Notification.permission === 'denied') {
      setNotifPermission('denied');
      return 'denied';
    }

    setNotifLoading(true);

    try {
      // Request permission — shows browser dialog
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);

      // Save to cookie
      setCookie('fc_notif_permission', permission, 90);

      return permission;

    } catch (error) {
      console.error('[FlashCart Permissions] Notification request failed:', error);
      return 'default';
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // ── PERSISTENT ASKING LOGIC ───────────────────────────

  /**
   * shouldAskForGeolocation
   * Determines if we should ask for geolocation based on timing.
   * Implements the "persistent ask until granted" strategy.
   *
   * Strategy:
   * - First visit: ask immediately
   * - Dismissed without choice: ask again after 1 day
   * - Denied: show manual instructions, check again after 7 days
   *   (in case user changed settings)
   * - Granted: never ask again
   *
   * @returns {boolean} Whether to show the permission prompt
   */
  const shouldAskForGeolocation = useCallback(() => {
    // Already granted — no need to ask
    if (geoPermission === PERMISSION_STATES.GRANTED) return false;

    // Check last asked time from cookie
    const lastAsked = getCookie('fc_geo_last_asked');
    const lastAskedTime = lastAsked ? parseInt(lastAsked) : 0;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (geoPermission === PERMISSION_STATES.DENIED) {
      // Ask to check settings again after 7 days
      return (now - lastAskedTime) > (7 * dayMs);
    }

    // For 'prompt' state — ask if it's been more than 1 day
    // OR if never asked before
    return !lastAsked || (now - lastAskedTime) > dayMs;
  }, [geoPermission]);

  /**
   * recordGeolocationAsked
   * Records the timestamp when we last asked for geolocation.
   * Used by shouldAskForGeolocation to enforce timing.
   */
  const recordGeolocationAsked = useCallback(() => {
    setCookie('fc_geo_last_asked', Date.now().toString(), 30);
  }, []);

  /**
   * shouldAskForNotifications
   * Determines if we should ask for notification permission.
   *
   * @returns {boolean}
   */
  const shouldAskForNotifications = useCallback(() => {
    if (notifPermission === 'granted') return false;
    if (notifPermission === 'denied') return false; // Can't re-prompt

    const lastAsked = getCookie('fc_notif_last_asked');
    const lastAskedTime = lastAsked ? parseInt(lastAsked) : 0;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Ask if never asked or it's been 3 days
    return !lastAsked || (now - lastAskedTime) > (3 * dayMs);
  }, [notifPermission]);

  /**
   * recordNotificationsAsked
   * Records when we last asked for notification permission.
   */
  const recordNotificationsAsked = useCallback(() => {
    setCookie('fc_notif_last_asked', Date.now().toString(), 30);
  }, []);

  // ── RETURN VALUES ─────────────────────────────────────
  return {
    // Geolocation
    geoPermission,
    geoLoading,
    geoCoords,
    geoError,
    requestGeolocation,
    shouldAskForGeolocation,
    recordGeolocationAsked,
    isGeoGranted: geoPermission === PERMISSION_STATES.GRANTED,
    isGeoDenied:  geoPermission === PERMISSION_STATES.DENIED,

    // Notifications
    notifPermission,
    notifLoading,
    requestNotificationPermission,
    shouldAskForNotifications,
    recordNotificationsAsked,
    isNotifGranted: notifPermission === 'granted',
    isNotifDenied:  notifPermission === 'denied',
  };
};

export default usePermissions;
