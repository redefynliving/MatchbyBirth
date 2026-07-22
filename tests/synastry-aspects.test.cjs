'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  angularDistance,
  detectSynastryAspects,
} = require('../shared/astro/synastry-aspects.cjs');

test('angularDistance handles the 0/360 boundary', () => {
  assert.equal(angularDistance(359, 1), 2);
  assert.equal(angularDistance(10, 350), 20);
  assert.equal(angularDistance(90, 270), 180);
});

test('detectSynastryAspects finds cross-chart aspects with orb and strength', () => {
  const chartA = {
    placements: {
      Moon: { longitude: 10, sign: 'Aries', degree: 10 },
      Mercury: { longitude: 42, sign: 'Taurus', degree: 12 },
    },
  };
  const chartB = {
    placements: {
      Venus: { longitude: 130.5, sign: 'Leo', degree: 10.5 },
      Saturn: { longitude: 132, sign: 'Leo', degree: 12 },
    },
  };

  const aspects = detectSynastryAspects(chartA, chartB);
  const moonVenus = aspects.find((aspect) => aspect.id === 'A-Moon__trine__B-Venus');
  const mercurySaturn = aspects.find((aspect) => aspect.id === 'A-Mercury__square__B-Saturn');

  assert.ok(moonVenus);
  assert.equal(moonVenus.aspect, 'trine');
  assert.equal(moonVenus.orb, 0.5);
  assert.equal(moonVenus.polarity, 'supportive');
  assert.ok(moonVenus.strength > 0.9);
  assert.deepEqual(moonVenus.categoryHints, ['emotional', 'chemistry']);

  assert.ok(mercurySaturn);
  assert.equal(mercurySaturn.aspect, 'square');
  assert.equal(mercurySaturn.polarity, 'tension');
  assert.ok(mercurySaturn.categoryHints.includes('communication'));
});

test('detectSynastryAspects excludes pairs outside allowed orb', () => {
  const chartA = { placements: { Moon: { longitude: 10 } } };
  const chartB = { placements: { Venus: { longitude: 140 } } };

  assert.deepEqual(detectSynastryAspects(chartA, chartB), []);
});
