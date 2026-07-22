'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  REPORT_BLUEPRINTS,
  buildReportFacts,
  buildConversationPrompt,
  fallbackReport,
  generateStructuredReport,
  validateReportQuality,
  wordCount,
} = require('../api/_lib/report-generator.cjs');

const baseResult = {
  mode: 'pair',
  relationshipType: 'love',
  score: 82,
  reportContext: {
    focus: 'full_compatibility',
    clarityGoal: 'communication',
  },
  people: [
    {
      name: 'Alex',
      sign: 'Aries',
      element: 'fire',
      moon: {
        sign: 'Aries',
        precision: 'date-only',
        need: 'honesty, momentum, and room to react',
        strength: 'direct emotional courage',
        watch: 'responding before feelings settle',
      },
      lifePath: {
        number: 7,
        masterNumber: false,
        theme: 'depth and reflection',
        strength: 'discernment and meaningful conversation',
        watch: 'withdrawing instead of naming what is happening',
      },
    },
    {
      name: 'Jordan',
      sign: 'Libra',
      element: 'air',
      moon: {
        sign: 'Cancer',
        precision: 'date-only',
        need: 'safety, closeness, and thoughtful reassurance',
        strength: 'protective emotional attunement',
        watch: 'withdrawing when care feels uncertain',
      },
      lifePath: {
        number: 11,
        masterNumber: true,
        theme: 'heightened sensitivity',
        strength: 'intuition and subtle pattern recognition',
        watch: 'absorbing too much tension before naming what is needed',
      },
    },
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

const FOCUS_CASES = [
  ['moon_sign', 'repair_after_conflict'],
  ['crush', 'mixed_signals'],
  ['life_path', 'long_term_fit'],
  ['full_compatibility', 'communication'],
];

function resultFor(focus, clarityGoal) {
  return {
    ...baseResult,
    reportContext: { focus, clarityGoal },
  };
}

function validGeneratedReport(result = baseResult) {
  const fallback = fallbackReport(result);
  return {
    title: fallback.title,
    overview: fallback.overview,
    sections: fallback.sections,
    closing: fallback.closing,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('each paid edition has nine distinct sections and a substantial fallback', async () => {
  const keySets = [];

  for (const [focus, clarityGoal] of FOCUS_CASES) {
    const current = resultFor(focus, clarityGoal);
    const report = await generateStructuredReport(current, { apiKey: '' });
    const copy = JSON.stringify(report);

    assert.equal(report.title, 'Alex & Jordan');
    assert.equal(report.focus, focus);
    assert.equal(report.focusLabel, REPORT_BLUEPRINTS[focus].label);
    assert.equal(report.sections.length, 9);
    assert.equal(report.promptVersion, 'structured-v7');
    assert.equal(report.model, 'fallback-v3');
    assert.equal(validateReportQuality(report, current), true);
    assert.ok(wordCount(copy) >= 650);
    assert.ok(wordCount(copy) <= 1500);
    assert.equal(copy.includes('birthDate'), false);
    assert.doesNotMatch(copy, /—|–|soulmate|fated|guaranteed|meaningful connection/i);
    assert.match(copy, /"/);
    keySets.push(report.sections.map((section) => section.key).join('|'));
  }

  assert.equal(new Set(keySets).size, FOCUS_CASES.length);
});

test('Moon, Crush, and Life Path editions use their own calculated evidence', () => {
  const moon = fallbackReport(resultFor('moon_sign', 'reassurance'));
  const crush = fallbackReport(resultFor('crush', 'next_move'));
  const lifePath = fallbackReport(resultFor('life_path', 'shared_goals'));

  assert.match(JSON.stringify(moon), /Aries Moon/);
  assert.match(JSON.stringify(moon), /Cancer Moon/);
  assert.match(moon.precisionNote, /noon estimate/i);
  assert.match(JSON.stringify(crush), /Chemistry/);
  assert.match(JSON.stringify(crush), /Stability/);
  assert.match(JSON.stringify(crush), /message you can actually send/i);
  assert.match(JSON.stringify(lifePath), /Life Path 7/);
  assert.match(JSON.stringify(lifePath), /Life Path 11/);
  assert.match(JSON.stringify(lifePath), /thirty-day/i);
});

test('Deep Synastry fallback cites every supplied aspect and keeps the same price tier contract', async () => {
  const timedResult = {
    ...resultFor('moon_sign', 'repair_after_conflict'),
    calculationMode: 'full-synastry',
    synastry: {
      evidence: [
        { label: 'Moon trine Venus (0.5° orb)', polarity: 'supportive', categories: ['emotional', 'chemistry'] },
        { label: 'Mercury sextile Moon (1.2° orb)', polarity: 'supportive', categories: ['communication'] },
        { label: 'Mars square Saturn (2.0° orb)', polarity: 'tension', categories: ['stability'] },
      ],
    },
  };

  const report = await generateStructuredReport(timedResult, {
    apiKey: '',
    reportType: 'deep_synastry',
  });
  const serialized = JSON.stringify(report);

  assert.equal(report.reportType, 'deep_synastry');
  assert.match(serialized, /Moon trine Venus \(0\.5° orb\)/);
  assert.match(serialized, /Mercury sextile Moon \(1\.2° orb\)/);
  assert.match(serialized, /Mars square Saturn \(2\.0° orb\)/);
  assert.equal(validateReportQuality(report, timedResult, { reportType: 'deep_synastry' }), true);
});

test('generateStructuredReport parses a strict edition-specific JSON response', async () => {
  const current = resultFor('life_path', 'responsibility');
  const generated = validGeneratedReport(current);
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
  });

  const report = await generateStructuredReport(current, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(report.overview, generated.overview);
  assert.equal(report.focus, 'life_path');
  assert.equal(report.clarityGoal, 'responsibility');
  assert.equal(report.model, 'claude-haiku-4-5-20251001');
  assert.equal(report.promptVersion, 'structured-v7');
});

test('generateStructuredReport gives the model a grounded paid-report contract', async () => {
  let requestBody;
  const current = resultFor('crush', 'mixed_signals');
  const generated = validGeneratedReport(current);
  const fakeFetch = async (_url, request) => {
    requestBody = JSON.parse(request.body);
    return {
      ok: true,
      json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
    };
  };

  await generateStructuredReport(current, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(requestBody.max_tokens, 4200);
  assert.match(requestBody.system, /800 to 1100 words/i);
  assert.match(requestBody.system, /one supplied fact/i);
  assert.match(requestBody.system, /real-life situations/i);
  assert.match(requestBody.system, /line the reader can actually say or send/i);
  assert.match(requestBody.system, /do not use em dashes/i);
  assert.match(requestBody.system, /not facts about what either person has done/i);
  assert.match(requestBody.system, /Moon detail is approximate/i);
  assert.match(requestBody.system, /Never invent a birth detail/i);
  assert.equal(requestBody.messages[0].content.includes('requiredFacts'), true);
  assert.equal(requestBody.messages[0].content.includes('Crush Compatibility Report'), true);
  assert.equal(requestBody.messages[0].content.includes('mixed signals'), true);
});

test('buildConversationPrompt creates a concrete line to say', () => {
  const prompt = buildConversationPrompt(baseResult);

  assert.match(prompt, /Say this first/);
  assert.match(prompt, /chemistry/i);
  assert.match(prompt, /stability/i);
});

test('buildReportFacts includes focus, calculated evidence, and score hierarchy', () => {
  const facts = buildReportFacts(resultFor('life_path', 'shared_goals'));

  assert.equal(facts.score, 82);
  assert.equal(facts.relationship, 'romantic connection');
  assert.equal(facts.strongestKey, 'chemistry');
  assert.equal(facts.watchKey, 'stability');
  assert.equal(facts.focus, 'life_path');
  assert.equal(facts.clarityGoalLabel, 'how to build shared goals');
  assert.equal(facts.people[0].moon.sign, 'Aries');
  assert.equal(facts.people[1].lifePath.number, 11);
  assert.match(facts.evidenceSummary, /Life Paths: Alex 7; Jordan 11/);
});

test('validateReportQuality rejects deterministic, professional, and private-data language', () => {
  for (const closing of [
    'This match is guaranteed and meant to be.',
    'This is a clinical diagnosis and therapy plan.',
    'The private token is abc and the birthDate is 2026-07-05.',
    'This result unlocks a profound tapestry of connection.',
    'This is clear — no further discussion is needed.',
  ]) {
    const report = validGeneratedReport();
    report.closing = closing;
    assert.throws(
      () => validateReportQuality(report, baseResult),
      /safety, privacy, or writing-quality validation/i,
    );
  }
});

test('validateReportQuality rejects thin, repeated, and evidence-free sections', () => {
  const thin = validGeneratedReport();
  thin.sections = thin.sections.map((section) => ({ ...section, body: 'Ask one question. Then listen.' }));
  assert.throws(
    () => validateReportQuality(thin, baseResult),
    /dimension scores as evidence|too thin/i,
  );

  const repeated = validGeneratedReport();
  const repeatedBody = repeated.sections[0].body;
  repeated.sections = repeated.sections.map((section) => ({ ...section, body: repeatedBody }));
  assert.throws(() => validateReportQuality(repeated, baseResult), /must not repeat/i);

  const noEvidence = validGeneratedReport();
  const scoreEvidence = ['Chemistry 85.', 'Growth 84.', 'Stability 78.'];
  noEvidence.sections = noEvidence.sections.map((section, index) => ({
    ...section,
    body: `${scoreEvidence[index] || ''} Exercise ${index + 1} starts with an ordinary situation from the week. Notice what happens before responding, then ask one direct question about the moment. Keep the answer tied to behavior and compare it with what was expected. Choose a small action for the week, write down what changed, and review whether the request reduced guessing. Stop if the exercise adds pressure instead of clarity.`,
  }));
  assert.throws(() => validateReportQuality(noEvidence, baseResult), /supplied evidence/i);
});

test('generateStructuredReport falls back when model output fails guardrails', async () => {
  const generated = validGeneratedReport();
  generated.closing = 'This connection is guaranteed and will never fail.';
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(generated) }] }),
  });

  const report = await generateStructuredReport(baseResult, {
    apiKey: 'test-key',
    fetchImpl: fakeFetch,
  });

  assert.equal(report.model, 'fallback-v3');
  assert.equal(validateReportQuality(report, baseResult), true);
});

test('fallbackReport stays useful across high, middle, and low score results', () => {
  const cases = [
    { score: 88, breakdown: { chemistry: 92, communication: 87, stability: 80, growth: 90, intuition: 85, overall: 88 } },
    { score: 64, breakdown: { chemistry: 70, communication: 62, stability: 55, growth: 68, intuition: 65, overall: 64 } },
    { score: 39, breakdown: { chemistry: 45, communication: 34, stability: 40, growth: 42, intuition: 36, overall: 39 } },
  ];

  for (const current of cases) {
    const currentResult = {
      ...clone(resultFor('crush', 'pace')),
      ...current,
    };
    const report = fallbackReport(currentResult);
    const copy = JSON.stringify(report);

    assert.equal(validateReportQuality(report, currentResult), true);
    assert.match(copy, new RegExp(String(current.score)));
    assert.doesNotMatch(copy, /soulmate|fated|guaranteed|meaningful connection/i);
  }
});
