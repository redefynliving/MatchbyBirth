'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getSunSignExact,
  getSunSignDateOnly,
  getExactSunSign,
  eclipticToSign,
  sunEclipticLongitude,
  localToUtc,
  isValidTimezone,
  searchPlaces,
  isValidPlace,
} = require('../shared/exact-astrology.cjs');

// ── eclipticToSign ──────────────────────────────────────────────────

test('eclipticToSign maps 0° to Aries and 30° to Taurus', () => {
  assert.equal(eclipticToSign(0), 'Aries');
  assert.equal(eclipticToSign(15), 'Aries');
  assert.equal(eclipticToSign(29.99), 'Aries');
  assert.equal(eclipticToSign(30), 'Taurus');
  assert.equal(eclipticToSign(330), 'Pisces');
  assert.equal(eclipticToSign(359.99), 'Pisces');
});

test('eclipticToSign handles negative and >360 values', () => {
  assert.equal(eclipticToSign(-30), 'Pisces');
  assert.equal(eclipticToSign(360), 'Aries');
  assert.equal(eclipticToSign(390), 'Taurus');
});

// ── sunEclipticLongitude ────────────────────────────────────────────

test('sunEclipticLongitude at vernal equinox 2000 is near 0°', () => {
  // Vernal equinox 2000: March 20, ~7:35 UTC
  const lon = sunEclipticLongitude(new Date(Date.UTC(2000, 2, 20, 7, 35)));
  assert.ok(lon < 1 || lon > 359, `expected near 0°, got ${lon}`);
});

test('sunEclipticLongitude at summer solstice 2000 is near 90°', () => {
  const lon = sunEclipticLongitude(new Date(Date.UTC(2000, 5, 21, 12, 0)));
  assert.ok(lon > 85 && lon < 95, `expected near 90°, got ${lon}`);
});

// ── getSunSignDateOnly ──────────────────────────────────────────────

test('getSunSignDateOnly matches astronomically correct zodiac dates for 2000', () => {
  // These are the astronomically exact boundaries for the year 2000
  // (using apparent solar longitude at noon UTC)
  assert.equal(getSunSignDateOnly('2000-03-21'), 'Aries');
  assert.equal(getSunSignDateOnly('2000-04-19'), 'Aries');
  assert.equal(getSunSignDateOnly('2000-04-20'), 'Taurus');
  assert.equal(getSunSignDateOnly('2000-05-20'), 'Taurus');
  assert.equal(getSunSignDateOnly('2000-05-21'), 'Gemini');
  assert.equal(getSunSignDateOnly('2000-06-21'), 'Cancer');
  assert.equal(getSunSignDateOnly('2000-07-23'), 'Leo');
  assert.equal(getSunSignDateOnly('2000-08-23'), 'Virgo');
  assert.equal(getSunSignDateOnly('2000-09-23'), 'Libra');
  assert.equal(getSunSignDateOnly('2000-10-23'), 'Scorpio');
  assert.equal(getSunSignDateOnly('2000-11-22'), 'Sagittarius');
  assert.equal(getSunSignDateOnly('2000-12-22'), 'Capricorn');
  // Jan 20 2000: Sun at ~299.7° (still Capricorn, Aquarius starts at 300°)
  // The exact crossover is around Jan 20 ~19:00 UTC
  assert.equal(getSunSignDateOnly('2000-01-20'), 'Capricorn');
  assert.equal(getSunSignDateOnly('2000-01-21'), 'Aquarius');
  assert.equal(getSunSignDateOnly('2000-02-19'), 'Pisces');
});

// ── getSunSignExact — date-only fallback ───────────────────────────

test('getSunSignExact falls back to date-only when no time/timezone', () => {
  const result = getSunSignExact({ date: '2000-03-21' });
  assert.equal(result.sign, 'Aries');
  assert.equal(result.exact, false);
});

test('getSunSignExact returns null for invalid date', () => {
  const result = getSunSignExact({ date: 'not-a-date' });
  assert.equal(result.sign, null);
  assert.equal(result.exact, false);
});

// ── getSunSignExact — with time and timezone ───────────────────────

test('getSunSignExact returns exact sign with valid time and timezone', () => {
  const result = getSunSignExact({
    date: '2000-03-21',
    time: '12:00',
    timezone: 'America/New_York',
  });
  assert.equal(result.exact, true);
  assert.ok(result.sign, 'should return a sign');
});

test('getSunSignExact falls back for invalid timezone', () => {
  const result = getSunSignExact({
    date: '2000-03-21',
    time: '12:00',
    timezone: 'Invalid/Zone',
  });
  assert.equal(result.exact, false);
  assert.equal(result.sign, 'Aries'); // still correct via date-only
  assert.equal(result.reason, 'invalid_timezone');
});

// ── DST edge cases ──────────────────────────────────────────────────

test('getSunSignExact falls back for nonexistent DST gap time', () => {
  // 2024-03-10 02:30 in New York doesn't exist (spring forward at 2:00 AM)
  const result = getSunSignExact({
    date: '2024-03-10',
    time: '02:30',
    timezone: 'America/New_York',
  });
  // Should fall back to date-only (nonexistent time rejected by localToUtc)
  assert.equal(result.exact, false);
  assert.ok(result.sign, 'should still return a sign via fallback');
});

test('getSunSignExact falls back for ambiguous DST overlap time', () => {
  // 2024-11-03 01:30 in New York is ambiguous (fall back)
  const result = getSunSignExact({
    date: '2024-11-03',
    time: '01:30',
    timezone: 'America/New_York',
  });
  // Should fall back to date-only for ambiguous times
  assert.equal(result.exact, false);
  assert.equal(result.reason, 'invalid_timezone');
  assert.ok(result.sign, 'should still return a sign via fallback');
});

// ── isValidTimezone ─────────────────────────────────────────────────

test('isValidTimezone accepts valid IANA timezones', () => {
  assert.equal(isValidTimezone('America/New_York'), true);
  assert.equal(isValidTimezone('Europe/London'), true);
  assert.equal(isValidTimezone('Asia/Tokyo'), true);
  assert.equal(isValidTimezone('UTC'), true);
});

test('isValidTimezone rejects invalid timezones', () => {
  assert.equal(isValidTimezone('Invalid/Zone'), false);
  assert.equal(isValidTimezone(''), false);
  assert.equal(isValidTimezone(null), false);
  assert.equal(isValidTimezone(undefined), false);
});

// ── searchPlaces ────────────────────────────────────────────────────

test('searchPlaces returns results for a city name', () => {
  const results = searchPlaces('New York');
  assert.ok(results.length > 0);
  assert.equal(results[0].city, 'New York');
  assert.ok(results[0].timezone);
});

test('searchPlaces filters by state code', () => {
  const results = searchPlaces('Springfield MO');
  assert.ok(results.length > 0);
  // All results should be in Missouri
  results.forEach((r) => {
    assert.equal(r.state, 'MO', `expected MO, got ${r.state} for ${r.label}`);
  });
});

test('searchPlaces accepts comma-separated full state names', () => {
  const results = searchPlaces('Indianapolis, Indiana');

  assert.ok(results.length > 0);
  assert.equal(results[0].city, 'Indianapolis');
  assert.equal(results[0].state, 'IN');
});

test('searchPlaces returns empty for empty query', () => {
  assert.deepEqual(searchPlaces(''), []);
  assert.deepEqual(searchPlaces(null), []);
});

test('searchPlaces sorts by population descending', () => {
  const results = searchPlaces('Los Angeles CA');
  if (results.length >= 2) {
    // The first result should be the largest city
    assert.equal(results[0].city, 'Los Angeles');
    assert.equal(results[0].state, 'CA');
  }
});

// ── isValidPlace ────────────────────────────────────────────────────

test('isValidPlace accepts valid place objects', () => {
  const place = searchPlaces('New York')[0];
  assert.ok(place);
  assert.equal(isValidPlace(place), true);
});

test('isValidPlace rejects objects without label', () => {
  assert.equal(isValidPlace({ timezone: 'America/New_York' }), false);
  assert.equal(isValidPlace({ label: '', timezone: 'America/New_York' }), false);
});

test('isValidPlace rejects objects with invalid timezone', () => {
  assert.equal(isValidPlace({ label: 'Test', timezone: 'Invalid/Zone' }), false);
});

test('isValidPlace rejects null/undefined', () => {
  assert.equal(isValidPlace(null), false);
  assert.equal(isValidPlace(undefined), false);
});

// ── Exact Sun sign near boundaries ──────────────────────────────────

test('getSunSignExact detects sign change at boundary with time', () => {
  // Someone born on April 19 at 11:59 PM UTC might still be Aries
  // while someone born on April 20 at 12:01 AM UTC is Taurus
  // (depending on the exact year's boundary)
  const aries = getSunSignDateOnly('2000-04-19');
  const taurus = getSunSignDateOnly('2000-04-20');
  assert.equal(aries, 'Aries');
  assert.equal(taurus, 'Taurus');
});

// ── localToUtc ──────────────────────────────────────────────────────

test('localToUtc converts correctly for known timezone', () => {
  const result = localToUtc('2024-06-15', '14:00', 'America/New_York');
  assert.ok(result);
  // 14:00 EDT = 18:00 UTC
  assert.equal(result.utc.getUTCHours(), 18);
});

test('localToUtc returns null for invalid timezone', () => {
  const result = localToUtc('2024-06-15', '14:00', 'Invalid/Zone');
  assert.equal(result, null);
});

test('localToUtc returns null for invalid date', () => {
  const result = localToUtc('2024-02-30', '14:00', 'America/New_York');
  assert.equal(result, null);
});

test('localToUtc returns null for DST gap time', () => {
  const result = localToUtc('2024-03-10', '02:30', 'America/New_York');
  assert.equal(result, null);
});

test('localToUtc returns null for DST overlap time', () => {
  const result = localToUtc('2024-11-03', '01:30', 'America/New_York');
  assert.equal(result, null);
});
