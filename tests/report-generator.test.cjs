const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildReportFacts,
  fallbackReport,
  generateStructuredReport,
  validateReportQuality,
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

const sectionKeys = [
  'strengths',
  'friction',
  'communication',
  'emotional_dynamic',
  'stability',
  'growth',
  'practical_advice',
  'do',
  'avoid',
];

function validGeneratedReport(overrides = {}) {
  const sections = sectionKeys.map((key) => ({
    key,
    title: key.replaceAll('_', ' '),
    body: `This ${key.replaceAll('_', ' ')} section gives Alex and Jordan a specific way to read their 82 score in this romantic connection. It names Chemistry as the strongest area and Stability as the watch area, then asks them to choose one practical next step they can discuss.`,
  }));

  return {
    title: 'Alex & Jordan',
    overview: 'Alex and Jordan have an 82 score in this romantic connection. Chemistry is the strongest area, while Stability is the watch area to discuss with care.',
    sections,
    closing: 'Use this report as a reflection and conversation starter, then decide what feels useful in real life.',
    ...overrides,
  };
}

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
  assert.equal(report.promptVersion, 'structured-v3');
  assert.equal(validateReportQuality(report, result), true);
  assert.doesNotMatch(
    JSON.stringify(report),
    /benefit from intention|emotional safety|growth potential|strongest version of this connection/i,
  );
});

test('generateStructuredReport parses a strict JSON model response', async () => {
  const generated = validGeneratedReport();
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
  });

  const report = await generateStructuredReport(result, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(report.overview, generated.overview);
  assert.equal(report.title, 'Alex & Jordan');
  assert.equal(report.model, 'claude-haiku-4-5-20251001');
  assert.equal(report.promptVersion, 'structured-v3');
});

test('generateStructuredReport asks the model for plain and qualified language', async () => {
  let requestBody;
  const generated = validGeneratedReport();
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
  assert.match(requestBody.system, /conversation starter/i);
  assert.match(requestBody.system, /Birth dates and email addresses are not provided/i);
  assert.match(requestBody.system, /strongest area, the watch area, and one practical next step/i);
  assert.match(requestBody.system, /growth edge/i);
  assert.deepEqual(requestBody.messages[0].content.includes('requiredFacts'), true);
});

test('buildReportFacts identifies score, relationship, strongest area, and watch area', () => {
  assert.deepEqual(buildReportFacts(result), {
    score: 82,
    relationship: 'romantic connection',
    strongestKey: 'chemistry',
    strongestLabel: 'Chemistry',
    watchKey: 'stability',
    watchLabel: 'Stability',
  });
});

test('validateReportQuality rejects deterministic and guarantee language', () => {
  const report = validGeneratedReport({
    closing: 'This match is guaranteed and meant to be.',
  });

  assert.throws(
    () => validateReportQuality(report, result),
    /safety and privacy validation/i,
  );
});

test('validateReportQuality rejects professional advice and diagnosis language', () => {
  const report = validGeneratedReport({
    closing: 'This is a clinical diagnosis and therapy plan.',
  });

  assert.throws(
    () => validateReportQuality(report, result),
    /safety and privacy validation/i,
  );
});

test('validateReportQuality rejects raw private data leakage', () => {
  const report = validGeneratedReport({
    closing: 'The private token is abc and the birthDate is 2026-07-05.',
  });

  assert.throws(
    () => validateReportQuality(report, result),
    /safety and privacy validation/i,
  );
});

test('validateReportQuality rejects thin or filler-heavy sections', () => {
  const thin = validGeneratedReport({
    sections: sectionKeys.map((key) => ({ key, title: key, body: 'Communication is important.' })),
  });

  assert.throws(
    () => validateReportQuality(thin, result),
    /safety and privacy validation|too thin/i,
  );
});

test('generateStructuredReport falls back when model output fails guardrails', async () => {
  const generated = validGeneratedReport({
    closing: 'This connection is guaranteed and will never fail.',
  });
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
  });

  const report = await generateStructuredReport(result, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(report.model, 'fallback-v1');
  assert.equal(validateReportQuality(report, result), true);
});

test('fallbackReport passes the report guardrails', () => {
  const report = fallbackReport(result);

  assert.equal(report.model, 'fallback-v1');
  assert.equal(validateReportQuality(report, result), true);
});
