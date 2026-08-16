'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  clearMoonContextCache,
  getMoonContext,
} = require('../api/_lib/cyclecalcs-service.cjs');

const NOW = new Date('2026-08-16T12:00:00.000Z');

function makeResponse(payload, ok = true, status = 200) {
  return {
    ok,
    status,
    async json() {
      return payload;
    },
  };
}

test.beforeEach(() => {
  clearMoonContextCache();
});

test('normalizes the CycleCalcs moon response without exposing upstream fields', async () => {
  let requestedUrl = '';
  const payload = {
    endpoint: '/v2/moon',
    data: {
      phase: {
        name: 'Waning Gibbous',
        illumination_percent: 95.2,
        day_of_cycle: 18,
      },
      summary: 'The Moon is a waning gibbous.',
      next_phases: [
        {
          name: 'Last Quarter',
          instant: '2026-08-21T02:21:58.672Z',
          days_until: 5.28,
        },
      ],
    },
    meta: {
      api_version: '2',
      attribution: 'not exposed to the client contract',
    },
  };

  const result = await getMoonContext({
    now: NOW,
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      assert.equal(options.method, 'GET');
      return makeResponse(payload);
    },
  });

  assert.match(requestedUrl, /^https:\/\/www\.cyclecalcs\.com\/v2\/moon\?at=/);
  assert.deepEqual(result, {
    available: true,
    source: 'cyclecalcs',
    current: {
      phase: 'Waning Gibbous',
      illuminationPercent: 95.2,
      cycleDay: 18,
      summary: 'The Moon is a waning gibbous.',
    },
    nextPhase: {
      name: 'Last Quarter',
      instant: '2026-08-21T02:21:58.672Z',
      daysUntil: 5.28,
    },
  });
  assert.equal(Object.hasOwn(result, 'meta'), false);
});

test('returns an unavailable result for an upstream failure', async () => {
  const result = await getMoonContext({
    now: NOW,
    fetchImpl: async () => makeResponse({}, false, 429),
  });

  assert.deepEqual(result, {
    available: false,
    source: 'cyclecalcs',
  });
});

test('reuses a cached response within the TTL', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return makeResponse({
      data: {
        phase: { name: 'New Moon', illumination_percent: 0, day_of_cycle: 0 },
        summary: 'New moon.',
        next_phases: [],
      },
    });
  };

  const first = await getMoonContext({ now: NOW, fetchImpl });
  const second = await getMoonContext({
    now: new Date('2026-08-16T12:05:00.000Z'),
    fetchImpl,
  });

  assert.equal(calls, 1);
  assert.deepEqual(second, first);
});
