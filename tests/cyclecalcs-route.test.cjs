'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { createCycleCalcsHandler } = require('../api/_lib/cyclecalcs.js');

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('GET cyclecalcs route returns normalized timing context with cache headers', async () => {
  const handler = createCycleCalcsHandler({
    getMoonContext: async () => ({
      available: true,
      source: 'cyclecalcs',
      current: {
        phase: 'First Quarter',
        illuminationPercent: 50,
        cycleDay: 7,
        summary: 'First quarter.',
      },
      nextPhase: {
        name: 'Full Moon',
        instant: '2026-08-23T06:00:00.000Z',
        daysUntil: 7,
      },
    }),
  });
  const response = makeResponse();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Cache-Control'], 'public, s-maxage=900, stale-while-revalidate=3600');
  assert.deepEqual(response.body.current, {
    phase: 'First Quarter',
    illuminationPercent: 50,
    cycleDay: 7,
    summary: 'First quarter.',
  });
});

test('GET cyclecalcs route preserves the app when upstream is unavailable', async () => {
  const handler = createCycleCalcsHandler({
    getMoonContext: async () => ({ available: false, source: 'cyclecalcs' }),
  });
  const response = makeResponse();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { available: false, source: 'cyclecalcs' });
});

test('cyclecalcs route rejects non-GET requests', async () => {
  const handler = createCycleCalcsHandler({
    getMoonContext: async () => ({ available: true }),
  });
  const response = makeResponse();

  await handler({ method: 'POST' }, response);

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, 'GET');
  assert.deepEqual(response.body, { ok: false, error: 'Method Not Allowed' });
});
