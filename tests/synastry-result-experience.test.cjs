'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('full synastry evidence is rendered from calculated aspect payloads', () => {
  const resultPage = read('apps/web/src/pages/ResultPage.jsx');
  const resultCard = read('apps/web/src/components/ResultCard.jsx');
  const saveResultModal = read('apps/web/src/components/SaveResultModal.jsx');
  const evidence = read('apps/web/src/components/SynastryEvidence.jsx');

  assert.match(resultPage, /calculationMode=\{result\.calculationMode\}/);
  assert.match(resultPage, /synastry=\{result\.synastry\}/);
  assert.match(resultPage, /precisionComparison=\{result\.precisionComparison\}/);
  assert.match(resultCard, /calculationMode === 'full-synastry'/);
  assert.match(resultCard, /priceLabel: '\$9\.99'/);
  assert.doesNotMatch(resultCard, /\$19\.99|priceCents: 1999/);
  assert.match(saveResultModal, /reportType === 'deep_synastry'/);
  assert.match(saveResultModal, /Timed aspect evidence/);
  assert.match(saveResultModal, /priceLabel: '\$9\.99'/);
  assert.doesNotMatch(saveResultModal, /\$19\.99|priceCents: 1999/);
  assert.match(resultCard, /<SynastryEvidence[\s\S]*synastry=\{synastry\}[\s\S]*precisionComparison=\{precisionComparison\}/);
  assert.match(evidence, /topSupportiveAspects/);
  assert.match(evidence, /topTensionAspects/);
  assert.match(evidence, /aspect\.from\?\.body/);
  assert.match(evidence, /aspect\.orb/);
  assert.match(evidence, /What Exact Mode changed/);
  assert.match(evidence, /Interpretations are reflective, not predictive/);
});

test('Moon Sign handoff keeps exact data and opens the stored focused result directly', () => {
  const moonPage = read('apps/web/src/pages/MoonSignCompatibilityPage.jsx');
  const calculator = read('apps/web/src/components/CalculatorWithPreview.jsx');

  assert.match(moonPage, /birthTime: first\.birthTime/);
  assert.match(moonPage, /place: first\.place/);
  assert.match(moonPage, /birthTime: second\.birthTime/);
  assert.match(moonPage, /place: second\.place/);
  assert.match(moonPage, /reportFocus: 'moon_sign'/);
  assert.match(moonPage, /requestCompatibilityResult/);
  assert.match(moonPage, /navigate\(navigation\.path/);
  assert.match(calculator, /setExactMode\(prefill\.exactMode === true\)/);
});
