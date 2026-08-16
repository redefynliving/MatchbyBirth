'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('relationship timing card loads the internal CycleCalcs route and fails closed', () => {
  const component = read('apps/web/src/components/RelationshipTimingContext.jsx');
  const resultPage = read('apps/web/src/pages/ResultPage.jsx');

  assert.match(component, /\/api\/cyclecalcs\/moon/);
  assert.match(component, /available/);
  assert.match(component, /Current relationship timing/);
  assert.match(component, /not a prediction/);
  assert.match(component, /timing_context_viewed/);
  assert.match(resultPage, /RelationshipTimingContext/);
  assert.match(resultPage, /!isGroup/);
});

test('timing analytics keeps only derived context fields', () => {
  const funnel = require('../api/_lib/funnel-service.cjs');
  const event = funnel.normalizeEvent({
    name: 'timing_context_viewed',
    properties: {
      share_id: 'opaque-share-id',
      relationship_type: 'love',
      score_band: 'good_compatibility',
      moon_phase: 'First Quarter',
      birthDate: '1990-03-21',
      timezone: 'America/New_York',
    },
  });

  assert.equal(event.event_name, 'timing_context_viewed');
  assert.equal(event.properties.moon_phase, 'First Quarter');
  assert.equal(event.properties.birthDate, undefined);
  assert.equal(event.properties.timezone, undefined);
});
