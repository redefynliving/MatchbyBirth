'use strict';

/**
 * exact-astrology.cjs
 *
 * Exact Sun sign calculation from birth date, time, and place.
 * Uses astronomia (VSOP87) for precise solar longitude.
 *
 * Privacy: this module computes signs only. It never stores or
 * logs raw birth time, timezone, or coordinates.
 */

const { solar, base, julian } = require('astronomia');
const { DateTime } = require('luxon');
const ct = require('city-timezones');

// ── Zodiac boundaries ──────────────────────────────────────────────
// Each sign occupies 30° of ecliptic longitude starting from Aries at 0°.
const ZODIAC_SIGNS = [
  { sign: 'Aries',       min: 0,   max: 30 },
  { sign: 'Taurus',      min: 30,  max: 60 },
  { sign: 'Gemini',      min: 60,  max: 90 },
  { sign: 'Cancer',      min: 90,  max: 120 },
  { sign: 'Leo',         min: 120, max: 150 },
  { sign: 'Virgo',       min: 150, max: 180 },
  { sign: 'Libra',       min: 180, max: 210 },
  { sign: 'Scorpio',     min: 210, max: 240 },
  { sign: 'Sagittarius', min: 240, max: 270 },
  { sign: 'Capricorn',   min: 270, max: 300 },
  { sign: 'Aquarius',    min: 300, max: 330 },
  { sign: 'Pisces',      min: 330, max: 360 },
];

/**
 * Convert ecliptic longitude (degrees) to zodiac sign.
 * @param {number} lonDeg — ecliptic longitude in degrees [0, 360)
 * @returns {string} zodiac sign name
 */
function eclipticToSign(lonDeg) {
  const normalized = ((lonDeg % 360) + 360) % 360;
  for (const { sign, min, max } of ZODIAC_SIGNS) {
    if (normalized >= min && normalized < max) return sign;
  }
  // Should never reach here, but Capricorn covers 300→360
  return 'Capricorn';
}

/**
 * Compute the Sun's apparent ecliptic longitude at a given UTC instant.
 * @param {Date} utcDate
 * @returns {number} longitude in degrees [0, 360)
 */
function sunEclipticLongitude(utcDate) {
  const jd = julian.DateToJD(utcDate);
  const T = base.J2000Century(jd);
  const lonRad = solar.apparentLongitude(T);
  let lonDeg = (lonRad * 180) / Math.PI;
  lonDeg = ((lonDeg % 360) + 360) % 360;
  return lonDeg;
}

/**
 * Get the exact Sun sign for a given UTC instant.
 * @param {Date} utcDate
 * @returns {string} zodiac sign
 */
function getExactSunSign(utcDate) {
  return eclipticToSign(sunEclipticLongitude(utcDate));
}

/**
 * Validate an IANA timezone string.
 * @param {string} tz
 * @returns {boolean}
 */
function isValidTimezone(tz) {
  if (typeof tz !== 'string' || !tz) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a local birth time to UTC using the given IANA timezone.
 * Returns null if the local time is invalid, nonexistent (DST gap),
 * or ambiguous (DST overlap).
 *
 * @param {string} dateStr — YYYY-MM-DD
 * @param {string} timeStr — HH:MM
 * @param {string} timezone — IANA timezone
 * @returns {{ utc: Date } | null}
 */
function localToUtc(dateStr, timeStr, timezone) {
  if (!isValidTimezone(timezone)) return null;

  const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: timezone });

  // Reject invalid dates/times
  if (!dt.isValid) return null;

  // DST gap detection: Luxon normalizes nonexistent times (spring-forward).
  // Detect by checking if the reconstructed local time matches the input.
  if (dt.toFormat('yyyy-MM-dd HH:mm') !== `${dateStr} ${timeStr}`) {
    return null; // Time was in a DST gap
  }

  // DST overlap detection: during fall-back, the same local time occurs twice.
  // Check by looking for another valid UTC offset for the same local time.
  const utcMs = dt.toMillis();
  const offset1 = dt.offset;

  for (let m = -120; m <= 120; m += 5) {
    const utcCheck = DateTime.fromMillis(utcMs + m * 60000, { zone: timezone });
    if (utcCheck.offset !== offset1) {
      const otherOffset = utcCheck.offset;
      // Check if shifting by the offset difference produces the same local time
      const altUtc = DateTime.fromMillis(
        utcMs + (offset1 - otherOffset) * 60000,
        { zone: timezone },
      );
      if (altUtc.toFormat('yyyy-MM-dd HH:mm') === `${dateStr} ${timeStr}`) {
        return null; // Ambiguous: same local time maps to two UTC instants
      }
    }
  }

  const utc = dt.toUTC();
  return { utc: utc.toJSDate() };
}

/**
 * Get the exact Sun sign from birth date, time, and timezone.
 * Falls back to date-only calculation if time or timezone is missing/invalid.
 *
 * @param {object} params
 * @param {string} params.date — YYYY-MM-DD
 * @param {string} [params.time] — HH:MM
 * @param {string} [params.timezone] — IANA timezone
 * @returns {{ sign: string, exact: boolean, reason?: string }}
 */
function getSunSignExact({ date, time, timezone } = {}) {
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { sign: null, exact: false, reason: 'invalid_date' };
  }

  // Try exact calculation if time and timezone are provided
  if (time && timezone) {
    const result = localToUtc(date, time, timezone);
    if (result) {
      const sign = getExactSunSign(result.utc);
      return { sign, exact: true };
    }
    // Invalid timezone, nonexistent time, or ambiguous time — fall back
    return { sign: getSunSignDateOnly(date), exact: false, reason: 'invalid_timezone' };
  }

  // Date-only fallback
  return { sign: getSunSignDateOnly(date), exact: false };
}

/**
 * Date-only Sun sign (current behavior, no timezone needed).
 * Uses noon UTC to avoid boundary issues.
 * @param {string} dateStr — YYYY-MM-DD
 * @returns {string}
 */
function getSunSignDateOnly(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return getExactSunSign(utc);
}

// ── Place lookup ────────────────────────────────────────────────────

const US_STATE_CODES = Object.fromEntries([
  'Alabama AL', 'Alaska AK', 'Arizona AZ', 'Arkansas AR', 'California CA',
  'Colorado CO', 'Connecticut CT', 'Delaware DE', 'Florida FL', 'Georgia GA',
  'Hawaii HI', 'Idaho ID', 'Illinois IL', 'Indiana IN', 'Iowa IA', 'Kansas KS',
  'Kentucky KY', 'Louisiana LA', 'Maine ME', 'Maryland MD', 'Massachusetts MA',
  'Michigan MI', 'Minnesota MN', 'Mississippi MS', 'Missouri MO', 'Montana MT',
  'Nebraska NE', 'Nevada NV', 'New Hampshire NH', 'New Jersey NJ', 'New Mexico NM',
  'New York NY', 'North Carolina NC', 'North Dakota ND', 'Ohio OH', 'Oklahoma OK',
  'Oregon OR', 'Pennsylvania PA', 'Rhode Island RI', 'South Carolina SC',
  'South Dakota SD', 'Tennessee TN', 'Texas TX', 'Utah UT', 'Vermont VT',
  'Virginia VA', 'Washington WA', 'West Virginia WV', 'Wisconsin WI', 'Wyoming WY',
  'District of Columbia DC',
].map((entry) => {
  const code = entry.slice(-2);
  return [entry.slice(0, -3).toLowerCase(), code];
}));

function normalizeStateCode(value) {
  const normalized = String(value || '').trim().replace(/\./g, '');
  if (/^[a-z]{2}$/i.test(normalized)) return normalized.toUpperCase();
  return US_STATE_CODES[normalized.toLowerCase()] || null;
}

/**
 * Search for cities by name, optionally filtered by state/province code.
 * Returns results sorted by population (largest first).
 *
 * @param {string} query — city name, optionally "City ST"
 * @param {object} [options]
 * @param {string} [options.stateCode] — ANSI state code (e.g. "MO", "CA")
 * @param {number} [options.limit=8]
 * @returns {Array<{ label: string, city: string, state: string, country: string, timezone: string, lat: number, lng: number }>}
 */
function searchPlaces(query, { stateCode, limit = 8 } = {}) {
  if (typeof query !== 'string' || !query.trim()) return [];

  const trimmed = query.trim().replace(/\s+/g, ' ');

  // Parse "City ST", "City, ST", or "City, State" formats.
  let cityQuery = trimmed;
  let stateFilter = stateCode || null;
  const commaParts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 2 && !stateFilter) {
    const parsedState = normalizeStateCode(commaParts.at(-1));
    if (parsedState) {
      cityQuery = commaParts.slice(0, -1).join(' ');
      stateFilter = parsedState;
    }
  }
  const parts = cityQuery.split(/\s+/);
  if (parts.length >= 2 && !stateFilter) {
    const possibleState = parts[parts.length - 1].toUpperCase();
    if (normalizeStateCode(possibleState)) {
      cityQuery = parts.slice(0, -1).join(' ');
      stateFilter = possibleState;
    }
  }

  let results = ct.lookupViaCity(cityQuery);
  if (!results || results.length === 0) return [];

  // Filter by state if specified
  if (stateFilter) {
    const filtered = results.filter(
      (r) => r.state_ansi === stateFilter,
    );
    // Only use filtered results if we got matches; otherwise fall back
    if (filtered.length > 0) {
      results = filtered;
    }
  }

  // Sort by population descending
  results.sort((a, b) => (b.pop || 0) - (a.pop || 0));

  return results.slice(0, limit).map((r) => ({
    label: `${r.city}, ${r.state_ansi || r.province}`,
    city: r.city,
    state: r.state_ansi || '',
    country: r.country,
    timezone: r.timezone,
    lat: r.lat,
    lng: r.lng,
  }));
}

/**
 * Validate a place object from the suggestion list.
 * Only trusts places that came from searchPlaces (have a label).
 * @param {object} place
 * @returns {boolean}
 */
function isValidPlace(place) {
  return (
    place != null &&
    typeof place === 'object' &&
    typeof place.label === 'string' &&
    place.label.length > 0 &&
    typeof place.timezone === 'string' &&
    isValidTimezone(place.timezone)
  );
}

// ── Exports ─────────────────────────────────────────────────────────

module.exports = {
  // Core
  getSunSignExact,
  getSunSignDateOnly,
  getExactSunSign,
  // Helpers (exported for testing)
  eclipticToSign,
  sunEclipticLongitude,
  localToUtc,
  isValidTimezone,
  // Place lookup
  searchPlaces,
  isValidPlace,
  normalizeStateCode,
};
