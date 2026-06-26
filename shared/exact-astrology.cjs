'use strict';

const cityTimezones = require('city-timezones');
const { DateTime } = require('luxon');
const { base, julian, solar } = require('astronomia');

const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const DATE_ONLY_RANGES = [
  ['Capricorn', 1, 19],
  ['Aquarius', 2, 18],
  ['Pisces', 3, 20],
  ['Aries', 4, 19],
  ['Taurus', 5, 20],
  ['Gemini', 6, 20],
  ['Cancer', 7, 22],
  ['Leo', 8, 22],
  ['Virgo', 9, 22],
  ['Libra', 10, 22],
  ['Scorpio', 11, 21],
  ['Sagittarius', 12, 21],
  ['Capricorn', 12, 31],
];

const MAX_PLACE_RESULTS = 8;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function parseBirthDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function getDateOnlyZodiacSign(value) {
  const parsed = parseBirthDate(value);
  if (!parsed) {
    throw new Error('Enter a valid birth date.');
  }

  const monthDay = parsed.month * 100 + parsed.day;
  const range = DATE_ONLY_RANGES.find(([, endMonth, endDay]) => (
    monthDay <= endMonth * 100 + endDay
  ));

  return range ? range[0] : 'Capricorn';
}

function getZodiacSignFromLongitude(longitude) {
  if (typeof longitude !== 'number' || !Number.isFinite(longitude)) {
    throw new Error('Solar longitude must be a finite number.');
  }

  const normalized = normalizeDegrees(longitude);
  return ZODIAC_SIGNS[Math.floor(normalized / 30)];
}

function buildPlaceId(place) {
  return [
    place.city,
    place.province,
    place.country,
    place.timezone,
    Number(place.lat).toFixed(4),
    Number(place.lng).toFixed(4),
  ]
    .filter(Boolean)
    .join('|')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sanitizePlace(place) {
  const city = String(place.city || place.city_ascii || '').trim();
  const province = String(place.province || place.state_ansi || '').trim();
  const country = String(place.country || '').trim();
  const iso2 = String(place.iso2 || '').trim();
  const timezone = String(place.timezone || '').trim();
  const lat = Number(place.lat);
  const lng = Number(place.lng);
  const labelParts = [city, province, country].filter(Boolean);

  if (!city || !timezone || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const sanitized = {
    id: '',
    label: labelParts.join(', '),
    city,
    province,
    country,
    iso2,
    timezone,
    lat,
    lng,
  };

  sanitized.id = buildPlaceId(sanitized);
  return sanitized;
}

function lookupPlaces(query) {
  const normalized = String(query || '').trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  const directMatches = cityTimezones.lookupViaCity(normalized);
  if (directMatches.length > 0) return directMatches;

  return cityTimezones.findFromCityStateProvince(normalized);
}

function findBirthPlaceMatches(query, limit = MAX_PLACE_RESULTS) {
  const seen = new Set();
  const safeLimit = Math.max(1, Math.min(Number(limit) || MAX_PLACE_RESULTS, MAX_PLACE_RESULTS));
  const matches = [];

  for (const rawPlace of lookupPlaces(query)) {
    const place = sanitizePlace(rawPlace);
    if (!place || seen.has(place.id)) continue;

    seen.add(place.id);
    matches.push(place);
    if (matches.length >= safeLimit) break;
  }

  return matches;
}

function isValidTimezone(timezone) {
  return Boolean(timezone && DateTime.now().setZone(timezone).isValid);
}

function normalizeSelectedBirthPlace(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const label = String(value.label || '').trim();
  const timezone = String(value.timezone || '').trim();
  const lat = Number(value.lat);
  const lng = Number(value.lng);

  if (!label || !isValidTimezone(timezone) || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    id: String(value.id || '').trim(),
    label,
    city: String(value.city || '').trim(),
    province: String(value.province || '').trim(),
    country: String(value.country || '').trim(),
    iso2: String(value.iso2 || '').trim(),
    timezone,
    lat,
    lng,
  };
}

function hasExactBirthDetails(person) {
  if (!person || typeof person !== 'object') return false;

  return Boolean(
    parseBirthDate(person.birthDate) &&
    typeof person.birthTime === 'string' &&
    TIME_PATTERN.test(person.birthTime) &&
    normalizeSelectedBirthPlace(person.birthPlace),
  );
}

function localBirthDateTimeToUtc(birthDate, birthTime, timezone) {
  const parsedDate = parseBirthDate(birthDate);
  if (!parsedDate) {
    throw new Error('Enter a valid birth date.');
  }
  if (typeof birthTime !== 'string' || !TIME_PATTERN.test(birthTime)) {
    throw new Error('Enter birth time as HH:MM.');
  }
  if (!isValidTimezone(timezone)) {
    throw new Error('Enter a valid birth timezone.');
  }

  const [hour, minute] = birthTime.split(':').map(Number);
  const dateTime = DateTime.fromObject({
    year: parsedDate.year,
    month: parsedDate.month,
    day: parsedDate.day,
    hour,
    minute,
    second: 0,
    millisecond: 0,
  }, { zone: timezone });

  if (!dateTime.isValid) {
    throw new Error('Enter a valid birth timezone.');
  }
  if (
    dateTime.year !== parsedDate.year ||
    dateTime.month !== parsedDate.month ||
    dateTime.day !== parsedDate.day ||
    dateTime.hour !== hour ||
    dateTime.minute !== minute
  ) {
    throw new Error('The selected local birth time does not exist in that timezone.');
  }
  if (
    typeof dateTime.getPossibleOffsets === 'function' &&
    dateTime.getPossibleOffsets().length > 1
  ) {
    throw new Error('The selected local birth time is ambiguous in that timezone.');
  }

  return dateTime.toUTC().toISO({ suppressMilliseconds: true });
}

function calculateSolarLongitude(utcDateTime) {
  const date = utcDateTime instanceof Date ? utcDateTime : new Date(utcDateTime);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Enter a valid UTC birth date and time.');
  }

  const julianDay = new julian.CalendarGregorian(date).toJD();
  const longitudeRadians = solar.apparentLongitude(base.J2000Century(julianDay));
  return normalizeDegrees((longitudeRadians * 180) / Math.PI);
}

function calculateExactSunSign(person) {
  if (!hasExactBirthDetails(person)) {
    throw new Error('Exact Sun sign requires birth date, birth time, and selected birth place.');
  }

  const birthPlace = normalizeSelectedBirthPlace(person.birthPlace);
  const birthTimeUtc = localBirthDateTimeToUtc(
    person.birthDate,
    person.birthTime,
    birthPlace.timezone,
  );
  const solarLongitude = calculateSolarLongitude(birthTimeUtc);

  return {
    sign: getZodiacSignFromLongitude(solarLongitude),
    solarLongitude,
    calculationMode: 'exact-sun',
    exact: true,
    timezone: birthPlace.timezone,
    placeLabel: birthPlace.label,
    birthTimeUtc,
    note: 'MBB Exact Mode calculated from date/time/place.',
  };
}

function resolvePersonAstrology(person) {
  if (hasExactBirthDetails(person)) {
    return calculateExactSunSign(person);
  }

  return {
    sign: getDateOnlyZodiacSign(person && person.birthDate),
    solarLongitude: null,
    calculationMode: 'date-only',
    exact: false,
    timezone: null,
    placeLabel: '',
    birthTimeUtc: '',
    note: 'Date-only astrology used. Add birth time and place to enable Exact Mode.',
  };
}

module.exports = {
  calculateExactSunSign,
  calculateSolarLongitude,
  findBirthPlaceMatches,
  getZodiacSignFromLongitude,
  hasExactBirthDetails,
  localBirthDateTimeToUtc,
  normalizeSelectedBirthPlace,
  resolvePersonAstrology,
};
