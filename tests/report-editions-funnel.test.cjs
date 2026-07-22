'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Moon, Crush, and Life Path sell distinct nine-section report promises at $9.99', async () => {
  const module = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/report-focus.js'),
  ).href);
  const focuses = ['moon_sign', 'crush', 'life_path'];
  const configs = focuses.map((focus) => module.REPORT_FOCUS_CONFIG[focus]);

  for (const config of configs) {
    assert.match(config.summary, /nine-section report/i);
    assert.match(config.button, /\$9\.99/);
    assert.equal(config.includes.length, 4);
    assert.equal(config.features.length, 4);
    assert.equal(config.clarityGoals.length, 3);
    assert.ok(config.clarityGoals.some(([value]) => value === config.defaultClarityGoal));
  }

  assert.equal(new Set(configs.map((config) => config.label)).size, focuses.length);
  assert.equal(new Set(configs.map((config) => config.previewHeading)).size, focuses.length);
  assert.equal(new Set(configs.map((config) => config.defaultClarityGoal)).size, focuses.length);
});

test('calculator source becomes report focus and survives result, modal, and checkout', () => {
  const calculator = read('apps/web/src/components/CalculatorWithPreview.jsx');
  const resultPage = read('apps/web/src/pages/ResultPage.jsx');
  const resultCard = read('apps/web/src/components/ResultCard.jsx');
  const modal = read('apps/web/src/components/SaveResultModal.jsx');
  const reportView = read('apps/web/src/components/report/ReportView.jsx');

  assert.match(calculator, /reportFocus: source/);
  assert.match(resultPage, /reportContext=\{result\.reportContext\}/);
  assert.match(resultCard, /reportContext\?\.focus/);
  assert.match(resultCard, /defaultClarityGoal/);
  assert.match(modal, /reportFocus/);
  assert.match(modal, /clarityGoal/);
  assert.match(modal, /create-checkout-session/);
  assert.match(reportView, /report\.focusLabel/);
  assert.match(reportView, /report\.evidenceSummary/);
  assert.match(reportView, /report\.precisionNote/);
});

test('Moon and Life Path handoffs remove the second calculator step', () => {
  const moon = read('apps/web/src/pages/MoonSignCompatibilityPage.jsx');
  const lifePath = read('apps/web/src/pages/LifePathCompatibilityPage.jsx');

  for (const source of [moon, lifePath]) {
    assert.match(source, /requestCompatibilityResult/);
    assert.match(source, /buildResultNavigation/);
    assert.match(source, /navigate\(navigation\.path/);
    assert.doesNotMatch(source, /navigate\('\/#calculator'/);
  }
  assert.match(moon, /reportFocus: 'moon_sign'/);
  assert.match(lifePath, /reportFocus: 'life_path'/);
});

test('shared compatibility API helper preserves server errors', async () => {
  const module = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/compatibility-api.js'),
  ).href);
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    json: async () => ({ error: 'Add both names.' }),
  });

  try {
    await assert.rejects(
      () => module.requestCompatibilityResult({ mode: 'pair' }),
      /Add both names/,
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('each purchase pins its own edition and clarity choice without a schema dependency', () => {
  const checkout = read('api/_lib/checkout-service.cjs');
  const fulfillment = read('api/_lib/report-service.cjs');

  assert.match(checkout, /store\.insertResult\(purchaseResultRecord\)/);
  assert.match(checkout, /result_payload: nextPayload/);
  assert.match(checkout, /reportType,/);
  assert.match(fulfillment, /const reportContext = purchase\.result\.result_payload/);
  assert.match(fulfillment, /reportContext\.focus/);
  assert.match(fulfillment, /reportContext\.clarityGoal/);
});
