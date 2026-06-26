'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateExactSunSign,
  findBirthPlaceMatches,
  getZodiacSignFromLongitude,
  hasExactBirthDetails,
  localBirthDateTimeToUtc,
  resolvePersonAstrology,
} = require('../shared/exact-astrology.cjs');

test('getZodiacSignFromLongitude maps tropical sign boundaries', () => {
  assert.equal(getZodiacSignFromLongitude(0), 'Aries');
  assert.equal(getZodiacSignFromLongitude(29.999), 'Aries');
  assert.equal(getZodiacSignFromLongitude(30), 'Taurus');
  assert.equal(getZodiacSignFromLongitude(359.999), 'Pisces');
  assert.equal(getZodiacSignFromLongitude(390), 'Taurus');
  assert.equal(getZodiacSignFromLongitude(-1), 'Pisces');
});

test('findBirthPlaceMatches returns sanitized city choices with timezone data', () => {
  const matches = findBirthPlaceMatches('Atlanta GA');

  assert.ok(matches.length > 0);
  assert.equal(matches[0].city, 'Atlanta');
  assert.equal(matches[0].timezone, 'America/New_York');
  assert.equal(typeof matches[0].lat, 'number');
  assert.equal(typeof matches[0].lng, 'number');
  assert.match(matches[0].label, /Atlanta/);
  assert.equal(Object.hasOwn(matches[0], 'pop'), false);
});

test('findBirthPlaceMatches returns bounded Springfield matches with stable unique ids', () => {
  const matches = findBirthPlaceMatches('Springfield');
  const ids = matches.map((match) => match.id);

  assert.ok(matches.length > 0);
  assert.ok(matches.length <= 8);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, findBirthPlaceMatches('Springfield').map((match) => match.id));
});

test('findBirthPlaceMatches honors state-qualified place queries', () => {
  const springfield = findBirthPlaceMatches('Springfield MO')[0];
  const losAngeles = findBirthPlaceMatches('Los Angeles CA')[0];

  assert.equal(springfield.province, 'Missouri');
  assert.equal(springfield.timezone, 'America/Chicago');
  assert.equal(losAngeles.province, 'California');
  assert.equal(losAngeles.timezone, 'America/Los_Angeles');
});

test('hasExactBirthDetails requires date, HH:MM time, and selected place object', () => {
  const place = {
    label: 'Atlanta, Georgia, United States',
    timezone: 'America/New_York',
    lat: 33.749,
    lng: -84.388,
  };

  assert.equal(hasExactBirthDetails({ birthDate: '2024-03-19', birthTime: '20:00', birthPlace: place }), true);
  assert.equal(hasExactBirthDetails({ birthDate: '2024-03-19', birthTime: '20:00', birthPlace: 'Atlanta GA' }), false);
  assert.equal(hasExactBirthDetails({
    birthDate: '2024-03-19',
    birthTime: '20:00',
    birthPlace: {
      city: 'Atlanta',
      timezone: 'America/New_York',
      lat: 33.749,
      lng: -84.388,
    },
  }), false);
  assert.equal(hasExactBirthDetails({
    birthDate: '2024-03-19',
    birthTime: '20:00',
    birthPlace: {
      label: 'Invalid place',
      timezone: 'Not/AZone',
      lat: 1,
      lng: 2,
    },
  }), false);
  assert.equal(hasExactBirthDetails({ birthDate: '2024-03-19', birthTime: '', birthPlace: place }), false);
  assert.equal(hasExactBirthDetails({ birthDate: '2024-03-19', birthTime: '8:00', birthPlace: place }), false);
  assert.equal(hasExactBirthDetails({ birthDate: '', birthTime: '20:00', birthPlace: place }), false);
});

test('calculateExactSunSign uses birth time and place to resolve cusp birthdays', () => {
  const atlanta = findBirthPlaceMatches('Atlanta GA')[0];

  const before = calculateExactSunSign({
    birthDate: '2024-03-19',
    birthTime: '20:00',
    birthPlace: atlanta,
  });
  const after = calculateExactSunSign({
    birthDate: '2024-03-19',
    birthTime: '23:30',
    birthPlace: atlanta,
  });

  assert.equal(before.sign, 'Pisces');
  assert.equal(before.calculationMode, 'exact-sun');
  assert.ok(before.solarLongitude >= 359);
  assert.equal(after.sign, 'Aries');
  assert.equal(after.calculationMode, 'exact-sun');
  assert.ok(after.solarLongitude < 1);
});

test('localBirthDateTimeToUtc rejects DST edge wall times instead of guessing', () => {
  assert.throws(
    () => localBirthDateTimeToUtc('2024-01-01', '12:00', undefined),
    /timezone/i,
  );
  assert.throws(
    () => localBirthDateTimeToUtc('2024-01-01', '12:00', null),
    /timezone/i,
  );
  assert.throws(
    () => localBirthDateTimeToUtc('2024-03-10', '02:30', 'America/New_York'),
    /does not exist/i,
  );
  assert.throws(
    () => localBirthDateTimeToUtc('2024-11-03', '01:30', 'America/New_York'),
    /ambiguous/i,
  );
});

test('resolvePersonAstrology falls back to date-only when exact details are incomplete', () => {
  const result = resolvePersonAstrology({
    birthDate: '2024-03-19',
    birthTime: '',
    birthPlace: '',
  });

  assert.equal(result.sign, 'Pisces');
  assert.equal(result.calculationMode, 'date-only');
  assert.equal(result.exact, false);
  assert.equal(result.solarLongitude, null);
  assert.equal(result.timezone, null);
  assert.equal(result.placeLabel, '');
  assert.equal(result.birthTimeUtc, '');
  assert.match(result.note, /Date-only/);
});
