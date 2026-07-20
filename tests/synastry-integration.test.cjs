'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { calculatePairResult } = require('../shared/compatibility.cjs');
const { buildReportFacts, fallbackReport } = require('../api/_lib/report-generator.cjs');

const place = {
  label: 'London, UK',
  city: 'London',
  country: 'GB',
  timezone: 'Europe/London',
  lat: 51.5,
  lng: -0.12,
};

test('pair result includes real synastry evidence when both birth times and places are present', () => {
  const result = calculatePairResult([
    { id: 'a', name: 'Alex', birthDate: '2000-01-01', birthTime: '12:00', place },
    { id: 'b', name: 'Jordan', birthDate: '2000-01-03', birthTime: '12:00', place },
  ], 'love');

  assert.equal(result.calculationMode, 'full-synastry');
  assert.ok(result.synastry);
  assert.ok(result.synastry.aspects.length > 0);
  assert.ok(result.synastry.topSupportiveAspects.length > 0);
  assert.ok(result.synastry.evidence.length > 0);
  assert.equal(result.precisionComparison.dateOnlyScore >= 0, true);
  assert.equal(result.precisionComparison.exactScore, result.score);
  assert.equal(result.precisionComparison.delta, result.score - result.precisionComparison.dateOnlyScore);
  assert.equal(result.precisionComparison.categoryDeltas.length, 5);
  assert.equal(result.precisionComparison.categoryDeltas.every((item) => (
    typeof item.key === 'string'
      && Number.isFinite(item.dateOnly)
      && Number.isFinite(item.exact)
      && item.delta === item.exact - item.dateOnly
  )), true);
  assert.equal(result.synastry.aspects[0].from.chart, 'A');
  assert.equal(result.synastry.aspects[0].to.chart, 'B');
  assert.equal(result.people[0].birthTime, undefined);
  assert.equal(result.people[0].place, undefined);
  assert.equal(JSON.stringify(result).includes('Europe/London'), false);
  assert.equal(JSON.stringify(result.precisionComparison).includes('London'), false);
});

test('pair result stays in basic mode when exact birth data is incomplete', () => {
  const result = calculatePairResult([
    { id: 'a', name: 'Alex', birthDate: '2000-01-01' },
    { id: 'b', name: 'Jordan', birthDate: '2000-01-03' },
  ], 'love');

  assert.equal(result.calculationMode, 'basic-sun');
  assert.equal(result.synastry, undefined);
});

test('report facts and fallback report cite real synastry aspects when available', () => {
  const result = calculatePairResult([
    { id: 'a', name: 'Alex', birthDate: '2000-01-01', birthTime: '12:00', place },
    { id: 'b', name: 'Jordan', birthDate: '2000-01-03', birthTime: '12:00', place },
  ], 'love');

  const facts = buildReportFacts(result);
  assert.equal(facts.calculationMode, 'full-synastry');
  assert.ok(facts.topAspectLabels.length >= 1);

  const report = fallbackReport(result);
  const serialized = JSON.stringify(report);
  assert.match(serialized, /Timed evidence/i);
  assert.match(serialized, /orb/i);
});
