'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const presentationModuleUrl = pathToFileURL(
  path.join(
    __dirname,
    '../apps/web/src/lib/result-presentation.js',
  ),
).href;

test('buildPairHighlights reduces the detailed breakdown to three readable insights', async () => {
  const { buildPairHighlights } = await import(presentationModuleUrl);
  const highlights = buildPairHighlights({
    chemistry: 82,
    communication: 91,
    stability: 74,
    growth: 68,
    intuition: 79,
    overall: 80,
  });

  assert.deepEqual(highlights.map((highlight) => highlight.label), [
    'Communication',
    'Emotional rhythm',
    'Growth edge',
  ]);
  assert.equal(highlights[0].score, 91);
  assert.equal(highlights[1].score, 78);
  assert.equal(highlights[2].score, 68);
  assert.match(highlights[2].summary, /growth/i);
});

test('getVisibleGroupPairs keeps the strongest three visible until expanded', async () => {
  const { getVisibleGroupPairs } = await import(presentationModuleUrl);
  const pairs = Array.from({ length: 6 }, (_, index) => ({
    score: 90 - index,
  }));

  assert.deepEqual(getVisibleGroupPairs(pairs, false), pairs.slice(0, 3));
  assert.deepEqual(getVisibleGroupPairs(pairs, true), pairs);
  assert.deepEqual(getVisibleGroupPairs(null, false), []);
});

test('homepage and navigation use the approved simplified content hierarchy', () => {
  const homePage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/HomePage.jsx'),
    'utf8',
  );
  const calculator = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CompatibilityCalculator.jsx'),
    'utf8',
  );
  const header = fs.readFileSync(
    path.join(root, 'apps/web/src/components/Header.jsx'),
    'utf8',
  );
  const app = fs.readFileSync(
    path.join(root, 'apps/web/src/App.jsx'),
    'utf8',
  );

  assert.match(homePage, /Every connection has its own rhythm\./);
  assert.match(homePage, /HomeResultPreview/);
  assert.match(calculator, /Check your connection/);
  assert.match(calculator, /Private, with no signup required\./);
  assert.match(header, /\/how-it-works/);
  assert.match(app, /path="\/how-it-works"/);
});

test('pair and group results progressively reveal detail instead of showing everything at once', () => {
  const pairResult = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ResultCard.jsx'),
    'utf8',
  );
  const groupResult = fs.readFileSync(
    path.join(root, 'apps/web/src/components/GroupCompatibilityResults.jsx'),
    'utf8',
  );
  const shareButtons = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ShareButtons.jsx'),
    'utf8',
  );

  assert.match(pairResult, /buildPairHighlights/);
  assert.match(pairResult, /Want the complete relationship reading\?/);
  assert.match(groupResult, /getVisibleGroupPairs/);
  assert.match(groupResult, /View all .* connections/);
  assert.match(shareButtons, /Share privately/);
});

test('report checkout explains its value while retaining payment and privacy assurances', () => {
  const checkout = fs.readFileSync(
    path.join(root, 'apps/web/src/components/SaveResultModal.jsx'),
    'utf8',
  );

  assert.match(checkout, /Communication and conflict/);
  assert.match(checkout, /Strengths and friction patterns/);
  assert.match(checkout, /Practical next steps/);
  assert.match(checkout, /Payment is handled by Stripe/);
  assert.match(checkout, /birth dates are not stored/i);
});
