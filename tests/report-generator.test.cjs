const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateStructuredReport,
} = require('../api/_lib/report-generator.cjs');

const result = {
  mode: 'pair',
  relationshipType: 'love',
  score: 82,
  people: [
    { name: 'Alex', sign: 'Aries', element: 'fire' },
    { name: 'Jordan', sign: 'Libra', element: 'air' },
  ],
  breakdown: {
    chemistry: 85,
    communication: 80,
    stability: 78,
    growth: 84,
    intuition: 81,
    overall: 82,
  },
};

test('generateStructuredReport returns a complete fallback without an AI key', async () => {
  const report = await generateStructuredReport(result, { apiKey: '' });

  assert.equal(report.title, 'Alex & Jordan');
  assert.equal(report.sections.length, 9);
  assert.deepEqual(report.sections.map((section) => section.key), [
    'strengths',
    'friction',
    'communication',
    'emotional_dynamic',
    'stability',
    'growth',
    'practical_advice',
    'do',
    'avoid',
  ]);
  assert.equal(JSON.stringify(report).includes('birthDate'), false);
  assert.doesNotMatch(
    JSON.stringify(report),
    /benefit from intention|emotional safety|growth potential|strongest version of this connection/i,
  );
});

test('generateStructuredReport parses a strict JSON model response', async () => {
  const generated = {
    title: 'Alex & Jordan',
    overview: 'Generated overview',
    sections: Array.from({ length: 9 }, (_, index) => ({
      key: `section-${index}`,
      title: `Section ${index}`,
      body: `Body ${index}`,
    })),
    closing: 'Generated closing',
  };
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
  });

  const report = await generateStructuredReport(result, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(report.overview, 'Generated overview');
  assert.equal(report.model, 'claude-haiku-4-5-20251001');
  assert.equal(report.promptVersion, 'structured-v2');
});

test('generateStructuredReport asks the model for plain and qualified language', async () => {
  let requestBody;
  const generated = {
    title: 'Alex & Jordan',
    overview: 'Generated overview',
    sections: Array.from({ length: 9 }, (_, index) => ({
      key: `section-${index}`,
      title: `Section ${index}`,
      body: `Body ${index}`,
    })),
    closing: 'Generated closing',
  };
  const fakeFetch = async (_url, request) => {
    requestBody = JSON.parse(request.body);
    return {
      ok: true,
      json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
    };
  };

  await generateStructuredReport(result, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.match(requestBody.system, /plain, specific language/i);
  assert.match(requestBody.system, /avoid certainty/i);
  assert.match(requestBody.system, /growth edge/i);
});
