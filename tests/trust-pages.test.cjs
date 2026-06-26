'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('how it works page is the Match by Birth methodology page', () => {
  const source = readSource('apps/web/src/pages/HowItWorksPage.jsx');

  assert.match(source, /Match by Birth methodology/i);
  assert.match(source, /What Match by Birth uses/i);
  assert.match(source, /birth date/i);
  assert.match(source, /optional birth time/i);
  assert.match(source, /birth place/i);
  assert.match(source, /MBB Exact Mode/i);
  assert.match(source, /high-precision Sun sign/i);
  assert.match(source, /birth date, time, and selected birth place/i);
  assert.match(source, /zodiac sign/i);
  assert.match(source, /life path number/i);
  assert.match(source, /Pair mode/i);
  assert.match(source, /Group mode/i);
  assert.match(source, /What the score means/i);
  assert.match(source, /does not claim/i);
  assert.match(source, /birth dates are used for the result/i);
  assert.match(source, /to="\/#calculator"/);
  assert.match(source, /to="\/blog"/);
  assert.match(source, /to="\/blog\/what-is-birth-matching"/);
  assert.doesNotMatch(source, /import Footer/);
  assert.doesNotMatch(source, /predicts relationship success/i);
});

test('about page has trust-focused copy and no overclaiming language', () => {
  const source = readSource('apps/web/src/pages/AboutPage.jsx');

  assert.match(source, /Who Match by Birth is for/i);
  assert.match(source, /What this tool does/i);
  assert.match(source, /What this tool does not claim/i);
  assert.match(source, /How privacy works/i);
  assert.match(source, /entertainment and reflection/i);
  assert.match(source, /support@matchbybirth\.com/);
  assert.doesNotMatch(source, /Astrology meets science/);
  assert.doesNotMatch(source, /oldest compatibility system on earth/);
});
