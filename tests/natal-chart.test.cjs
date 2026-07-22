'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateMoonPlacement,
  calculateNatalChart,
  normalizeLongitude,
  longitudeToPlacement,
} = require('../shared/astro/natal-chart.cjs');

test('calculateMoonPlacement returns only the derived placement and precision', () => {
  const dateOnly = calculateMoonPlacement({ birthDate: '2000-01-01' });
  const timed = calculateMoonPlacement({
    birthDate: '2000-01-01',
    birthTime: '12:00',
    place: { label: 'London, UK', timezone: 'Europe/London', lat: 51.5, lng: -0.12 },
  });

  assert.equal(dateOnly.precision, 'date-only');
  assert.equal(timed.precision, 'timed');
  assert.equal(timed.sign, 'Scorpio');
  assert.equal(typeof timed.degree, 'number');
  assert.equal(timed.utc, undefined);
});

test('normalizeLongitude wraps values into the zodiac circle', () => {
  assert.equal(normalizeLongitude(0), 0);
  assert.equal(normalizeLongitude(360), 0);
  assert.equal(normalizeLongitude(-1), 359);
  assert.equal(normalizeLongitude(721.5), 1.5);
});

test('longitudeToPlacement returns sign and degree within sign', () => {
  assert.deepEqual(longitudeToPlacement(0), { sign: 'Aries', degree: 0 });
  assert.deepEqual(longitudeToPlacement(29.99), { sign: 'Aries', degree: 29.99 });
  assert.deepEqual(longitudeToPlacement(30), { sign: 'Taurus', degree: 0 });
  assert.deepEqual(longitudeToPlacement(299.42), { sign: 'Capricorn', degree: 29.42 });
});

test('calculateNatalChart returns deterministic core planetary placements for a timed chart', () => {
  const chart = calculateNatalChart({
    birthDate: '2000-01-01',
    birthTime: '12:00',
    place: { label: 'London, UK', timezone: 'Europe/London', lat: 51.5, lng: -0.12 },
  });

  assert.equal(chart.precision, 'timed');
  assert.equal(chart.zodiac, 'tropical');
  assert.match(chart.utc, /^2000-01-01T12:00:00/);

  for (const body of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']) {
    assert.ok(chart.placements[body], `${body} placement should exist`);
    assert.equal(typeof chart.placements[body].longitude, 'number');
    assert.ok(chart.placements[body].longitude >= 0 && chart.placements[body].longitude < 360);
    assert.ok(chart.placements[body].degree >= 0 && chart.placements[body].degree < 30);
    assert.equal(typeof chart.placements[body].sign, 'string');
  }

  assert.equal(chart.placements.Sun.sign, 'Capricorn');
  assert.equal(chart.placements.Moon.sign, 'Scorpio');
  assert.equal(chart.placements.Venus.sign, 'Sagittarius');
});

test('calculateNatalChart omits angles and houses until a trusted house engine exists', () => {
  const chart = calculateNatalChart({ birthDate: '2000-01-01' });

  assert.equal(chart.precision, 'date-only');
  assert.equal(chart.angles, undefined);
  assert.equal(chart.houses, undefined);
  assert.ok(chart.placements.Sun);
  assert.ok(chart.placements.Moon);
});

test('calculateNatalChart rejects invalid birth data instead of guessing', () => {
  assert.throws(() => calculateNatalChart({ birthDate: 'not-a-date' }), /birth date/i);
  assert.throws(() => calculateNatalChart({ birthDate: '2999-01-01' }), /future/i);
});
