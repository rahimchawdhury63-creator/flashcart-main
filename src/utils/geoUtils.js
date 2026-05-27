// ============================================================
// FlashCart — Geolocation Utilities
// Distance calculations, location formatting, and
// Bangladesh-specific geographic data.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

// ── DISTANCE CALCULATIONS ─────────────────────────────────

/**
 * haversineDistance
 * Calculates the straight-line distance between two GPS coordinates
 * using the Haversine formula. Returns distance in kilometers.
 *
 * The Haversine formula accounts for Earth's curvature — gives
 * accurate distances for short-to-medium ranges like within Bangladesh.
 *
 * @param {number} lat1 - Latitude of point 1 (decimal degrees)
 * @param {number} lng1 - Longitude of point 1 (decimal degrees)
 * @param {number} lat2 - Latitude of point 2 (decimal degrees)
 * @param {number} lng2 - Longitude of point 2 (decimal degrees)
 * @returns {number} Distance in kilometers
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  // Earth's radius in kilometers
  const EARTH_RADIUS_KM = 6371;

  // Convert degrees to radians (required for Math.sin/cos)
  const toRad = (degrees) => degrees * (Math.PI / 180);

  // Differences in coordinates
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);

  // Haversine formula components
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  // Angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return EARTH_RADIUS_KM * c;
};

/**
 * formatDistance
 * Formats a distance value for display.
 * Examples:
 *   formatDistance(0.5)   → "500 m"
 *   formatDistance(1.2)   → "1.2 km"
 *   formatDistance(10)    → "10 km"
 *
 * @param {number} km - Distance in kilometers
 * @param {string} lang - Language for units
 * @returns {string} Formatted distance string
 */
export const formatDistance = (km, lang = 'default') => {
  if (km === null || km === undefined || isNaN(km)) return '';

  // Less than 1 km — show in meters
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return lang === 'bn' ? `${meters} মিটার` : `${meters} m`;
  }

  // 1 km and above — show in kilometers with 1 decimal
  const formatted = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return lang === 'bn' ? `${formatted} কিমি` : `${formatted} km`;
};

/**
 * isWithinDeliveryRadius
 * Checks if a customer location is within a store's delivery radius.
 *
 * @param {number} storeLat - Store latitude
 * @param {number} storeLng - Store longitude
 * @param {number} customerLat - Customer latitude
 * @param {number} customerLng - Customer longitude
 * @param {number} radiusKm - Delivery radius in kilometers
 * @returns {boolean} Whether customer is within delivery range
 */
export const isWithinDeliveryRadius = (storeLat, storeLng, customerLat, customerLng, radiusKm = 10) => {
  // Calculate actual distance
  const distance = haversineDistance(storeLat, storeLng, customerLat, customerLng);

  // Return whether distance is within the radius
  return distance <= radiusKm;
};

/**
 * sortByDistance
 * Sorts an array of stores by distance from a reference point.
 * Each store must have location.lat and location.lng properties.
 *
 * @param {Array} stores - Array of store objects
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @returns {Array} Stores sorted by distance (nearest first)
 */
export const sortByDistance = (stores, userLat, userLng) => {
  if (!stores || !userLat || !userLng) return stores || [];

  // Map stores with calculated distance, then sort
  return stores
    .map(store => ({
      ...store,
      // Calculate and attach distance to each store
      distance: haversineDistance(
        store.location?.lat || 0,
        store.location?.lng || 0,
        userLat,
        userLng
      ),
    }))
    .sort((a, b) => a.distance - b.distance); // Ascending — nearest first
};

/**
 * filterByRadius
 * Filters stores to only those within a specified radius.
 *
 * @param {Array} stores - Array of store objects
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {number} radiusKm - Filter radius in kilometers
 * @returns {Array} Filtered stores with distance attached
 */
export const filterByRadius = (stores, userLat, userLng, radiusKm = 10) => {
  if (!stores || !userLat || !userLng) return stores || [];

  return stores
    .map(store => ({
      ...store,
      distance: haversineDistance(
        store.location?.lat || 0,
        store.location?.lng || 0,
        userLat,
        userLng
      ),
    }))
    .filter(store => store.distance <= radiusKm);
};

// ── BANGLADESH GEOGRAPHIC DATA ─────────────────────────────

/**
 * BANGLADESH_DIVISIONS
 * All 8 administrative divisions of Bangladesh.
 * Includes center coordinates for map display.
 */
export const BANGLADESH_DIVISIONS = [
  { id: 'dhaka',      name: 'Dhaka',      nameBn: 'ঢাকা',       lat: 23.8103, lng: 90.4125 },
  { id: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম',  lat: 22.3569, lng: 91.7832 },
  { id: 'rajshahi',   name: 'Rajshahi',   nameBn: 'রাজশাহী',    lat: 24.3745, lng: 88.6042 },
  { id: 'sylhet',     name: 'Sylhet',     nameBn: 'সিলেট',      lat: 24.8949, lng: 91.8687 },
  { id: 'barishal',   name: 'Barishal',   nameBn: 'বরিশাল',     lat: 22.7010, lng: 90.3535 },
  { id: 'khulna',     name: 'Khulna',     nameBn: 'খুলনা',      lat: 22.8456, lng: 89.5403 },
  { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ',  lat: 24.7471, lng: 90.4203 },
  { id: 'rangpur',    name: 'Rangpur',    nameBn: 'রংপুর',      lat: 25.7439, lng: 89.2752 },
];

/**
 * BANGLADESH_MAJOR_CITIES
 * Top cities in Bangladesh with coordinates for location search.
 */
export const BANGLADESH_MAJOR_CITIES = [
  // Dhaka Division
  { id: 'dhaka_city',     name: 'Dhaka',         nameBn: 'ঢাকা',          division: 'dhaka',      lat: 23.8103, lng: 90.4125 },
  { id: 'narayanganj',    name: 'Narayanganj',    nameBn: 'নারায়ণগঞ্জ',  division: 'dhaka',      lat: 23.6238, lng: 90.4998 },
  { id: 'gazipur',        name: 'Gazipur',        nameBn: 'গাজীপুর',      division: 'dhaka',      lat: 23.9999, lng: 90.4203 },
  // Chittagong Division
  { id: 'chittagong_city',name: 'Chittagong',     nameBn: 'চট্টগ্রাম',   division: 'chittagong', lat: 22.3569, lng: 91.7832 },
  { id: 'cox_bazar',      name: "Cox's Bazar",    nameBn: 'কক্সবাজার',    division: 'chittagong', lat: 21.4272, lng: 92.0058 },
  // Sylhet Division
  { id: 'sylhet_city',    name: 'Sylhet',         nameBn: 'সিলেট',        division: 'sylhet',     lat: 24.8949, lng: 91.8687 },
  // Rajshahi Division
  { id: 'rajshahi_city',  name: 'Rajshahi',       nameBn: 'রাজশাহী',     division: 'rajshahi',   lat: 24.3745, lng: 88.6042 },
  // Khulna Division
  { id: 'khulna_city',    name: 'Khulna',         nameBn: 'খুলনা',        division: 'khulna',     lat: 22.8456, lng: 89.5403 },
  // Barishal Division
  { id: 'barishal_city',  name: 'Barishal',       nameBn: 'বরিশাল',      division: 'barishal',   lat: 22.7010, lng: 90.3535 },
  // Mymensingh Division
  { id: 'mymensingh_city',name: 'Mymensingh',     nameBn: 'ময়মনসিংহ',  division: 'mymensingh', lat: 24.7471, lng: 90.4203 },
  // Rangpur Division
  { id: 'rangpur_city',   name: 'Rangpur',        nameBn: 'রংপুর',       division: 'rangpur',    lat: 25.7439, lng: 89.2752 },
];

/**
 * DHAKA_AREAS
 * Popular areas within Dhaka for delivery filtering.
 * Used in the location picker and store search.
 */
export const DHAKA_AREAS = [
  { id: 'gulshan',      name: 'Gulshan',      nameBn: 'গুলশান',      lat: 23.7808, lng: 90.4152 },
  { id: 'banani',       name: 'Banani',       nameBn: 'বনানী',       lat: 23.7937, lng: 90.4066 },
  { id: 'dhanmondi',    name: 'Dhanmondi',    nameBn: 'ধানমন্ডি',   lat: 23.7461, lng: 90.3742 },
  { id: 'mohammadpur',  name: 'Mohammadpur',  nameBn: 'মোহাম্মদপুর',lat: 23.7615, lng: 90.3567 },
  { id: 'mirpur',       name: 'Mirpur',       nameBn: 'মিরপুর',      lat: 23.8223, lng: 90.3654 },
  { id: 'uttara',       name: 'Uttara',       nameBn: 'উত্তরা',      lat: 23.8759, lng: 90.3795 },
  { id: 'motijheel',    name: 'Motijheel',    nameBn: 'মতিঝিল',     lat: 23.7338, lng: 90.4174 },
  { id: 'old_dhaka',    name: 'Old Dhaka',    nameBn: 'পুরান ঢাকা', lat: 23.7104, lng: 90.4074 },
  { id: 'wari',         name: 'Wari',         nameBn: 'ওয়ারী',      lat: 23.7200, lng: 90.4182 },
  { id: 'shyamoli',     name: 'Shyamoli',     nameBn: 'শ্যামলী',    lat: 23.7726, lng: 90.3603 },
  { id: 'badda',        name: 'Badda',        nameBn: 'বাড্ডা',      lat: 23.7813, lng: 90.4340 },
  { id: 'rampura',      name: 'Rampura',      nameBn: 'রামপুরা',     lat: 23.7590, lng: 90.4272 },
  { id: 'khilgaon',     name: 'Khilgaon',     nameBn: 'খিলগাঁও',   lat: 23.7387, lng: 90.4325 },
  { id: 'farmgate',     name: 'Farmgate',     nameBn: 'ফার্মগেট',   lat: 23.7588, lng: 90.3883 },
  { id: 'panthapath',   name: 'Panthapath',   nameBn: 'পান্থপথ',   lat: 23.7502, lng: 90.3870 },
  { id: 'tejgaon',      name: 'Tejgaon',      nameBn: 'তেজগাঁও',   lat: 23.7683, lng: 90.3987 },
  { id: 'malibagh',     name: 'Malibagh',     nameBn: 'মালিবাগ',    lat: 23.7503, lng: 90.4218 },
];

/**
 * getBangladeshBounds
 * Returns the geographic bounding box of Bangladesh.
 * Used to restrict Google Maps to Bangladesh area.
 *
 * @returns {object} Google Maps LatLngBounds-compatible object
 */
export const getBangladeshBounds = () => ({
  north: 26.634,  // Northernmost point
  south: 20.738,  // Southernmost point
  west:  88.028,  // Westernmost point
  east:  92.673,  // Easternmost point
});

/**
 * getBangladeshCenter
 * Returns the geographic center of Bangladesh.
 * Default map center when no user location is available.
 *
 * @returns {{ lat: number, lng: number }}
 */
export const getBangladeshCenter = () => ({
  lat: 23.6850, // Bangladesh geographic center latitude
  lng: 90.3563, // Bangladesh geographic center longitude
});

/**
 * getDhakaCenter
 * Returns Dhaka city center coordinates.
 * Default location when user denies geolocation.
 *
 * @returns {{ lat: number, lng: number }}
 */
export const getDhakaCenter = () => ({
  lat: 23.8103, // Dhaka center latitude
  lng: 90.4125, // Dhaka center longitude
});

/**
 * findNearestCity
 * Finds the nearest major city to given coordinates.
 * Used to determine default city for a user location.
 *
 * @param {number} lat - User latitude
 * @param {number} lng - User longitude
 * @returns {object} Nearest city object
 */
export const findNearestCity = (lat, lng) => {
  if (!lat || !lng) return BANGLADESH_MAJOR_CITIES[0]; // Default to Dhaka

  let nearest = BANGLADESH_MAJOR_CITIES[0];
  let minDistance = haversineDistance(lat, lng, nearest.lat, nearest.lng);

  // Check all cities and find the closest
  BANGLADESH_MAJOR_CITIES.forEach(city => {
    const dist = haversineDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  });

  return nearest;
};

/**
 * isCoordinateInBangladesh
 * Validates that coordinates are within Bangladesh's bounding box.
 * Prevents invalid location data from being stored.
 *
 * @param {number} lat - Latitude to check
 * @param {number} lng - Longitude to check
 * @returns {boolean} Whether coordinates are in Bangladesh
 */
export const isCoordinateInBangladesh = (lat, lng) => {
  const bounds = getBangladeshBounds();

  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
};

/**
 * getCurrentLocation
 * Wrapper around the browser Geolocation API with timeout.
 * Returns a Promise for cleaner async handling.
 *
 * @param {object} options - Geolocation options
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Default options for Bangladesh (good accuracy needed)
    const defaultOptions = {
      enableHighAccuracy: true,    // Use GPS for best accuracy
      timeout: 10000,              // 10 second timeout
      maximumAge: 300000,          // Accept 5-minute cached position
      ...options,
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;

        // Validate coordinates are in Bangladesh
        if (!isCoordinateInBangladesh(latitude, longitude)) {
          // Outside Bangladesh — use Dhaka as fallback
          resolve({
            lat: getDhakaCenter().lat,
            lng: getDhakaCenter().lng,
            isDefault: true,           // Flag that this is a fallback
            accuracy: position.coords.accuracy,
          });
          return;
        }

        // Return coordinates
        resolve({
          lat: latitude,
          lng: longitude,
          isDefault: false,
          accuracy: position.coords.accuracy,
        });
      },
      // Error callback
      (error) => {
        // Handle specific geolocation errors
        const errorMessages = {
          1: 'Location permission denied',     // PERMISSION_DENIED
          2: 'Location unavailable',           // POSITION_UNAVAILABLE
          3: 'Location request timed out',     // TIMEOUT
        };
        reject(new Error(errorMessages[error.code] || 'Unknown location error'));
      },
      defaultOptions
    );
  });
};
