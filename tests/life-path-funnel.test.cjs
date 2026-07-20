const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('calculator prefill helper sanitizes valid Life Path handoff data', async () => {
  const helper = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/calculator-prefill.js'),
  ).href);

  const prefill = helper.buildCalculatorPrefill({
    firstName: '  Alex  ',
    firstDate: '1990-01-09',
    secondName: '  Jordan  ',
    secondDate: '1993-09-09',
    relationshipType: 'friendship',
    source: 'life_path_compatibility',
  });

  assert.deepEqual(prefill, {
    mode: 'pair',
    relationshipType: 'friendship',
    source: 'life_path_compatibility',
    people: [
      { id: 'pair-1', name: 'Alex', birthDate: '1990-01-09', birthTime: '', place: null },
      { id: 'pair-2', name: 'Jordan', birthDate: '1993-09-09', birthTime: '', place: null },
    ],
  });

  assert.deepEqual(helper.normalizeCalculatorPrefill(prefill), prefill);
});

test('calculator prefill helper rejects invalid or incomplete data', async () => {
  const helper = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/calculator-prefill.js'),
  ).href);

  assert.equal(helper.buildCalculatorPrefill({
    firstName: 'Alex',
    firstDate: 'bad-date',
    secondName: 'Jordan',
    secondDate: '1993-09-09',
  }), null);

  assert.equal(helper.normalizeCalculatorPrefill({
    mode: 'group',
    relationshipType: 'love',
    source: 'life_path_compatibility',
    people: [],
  }), null);
});

test('Life Path tool routes completed users into the full calculator funnel', () => {
  const page = read('apps/web/src/pages/LifePathCompatibilityPage.jsx');

  assert.match(page, /useNavigate/);
  assert.match(page, /buildCalculatorPrefill/);
  assert.match(page, /life_path_to_full_match_clicked/);
  assert.match(page, /Compare full birth-date match/);
  assert.match(page, /navigate\('\/#calculator'/);
  assert.match(page, /calculatorPrefill/);
});

test('Life Path page works as one SEO hub for number and compatibility intent', () => {
  const page = read('apps/web/src/pages/LifePathCompatibilityPage.jsx');
  const ssg = read('tools/build-ssg.mjs');

  assert.match(page, /Life Path Number Calculator/);
  assert.match(page, /Life Path Compatibility Calculator & Number Chart/);
  assert.match(page, /Life Path number compatibility chart/);
  assert.match(page, /useState\('compare'\)/);
  assert.match(page, /Find my number/);
  assert.match(page, /Compare two people/);
  assert.match(page, /calculateLifePathNumber/);
  assert.match(page, /life_path_single_completed/);
  assert.match(page, /\/blog\/life-path-number-compatibility-guide/);
  assert.match(page, /\/blog\/how-to-use-compatibility-results-responsibly/);

  assert.match(ssg, /Life Path Compatibility Calculator & Number Chart/);
  assert.match(ssg, /Compare two people or find one number/);
  assert.match(ssg, /life path number calculator/i);
});

test('homepage reads calculator prefill from route state and passes it into the calculator', () => {
  const page = read('apps/web/src/pages/HomePage.jsx');

  assert.match(page, /useLocation/);
  assert.match(page, /normalizeCalculatorPrefill/);
  assert.match(page, /location\.state\?\.calculatorPrefill/);
  assert.match(page, /prefill=\{calculatorPrefill\}/);
});

test('calculator accepts route-state prefill and tracks Life Path-originated completion', () => {
  const source = read('apps/web/src/components/CalculatorWithPreview.jsx');

  assert.match(source, /prefill/);
  assert.match(source, /setPairPeople\(prefill\.people\)/);
  assert.match(source, /setRelationshipType\(prefill\.relationshipType\)/);
  assert.match(source, /life_path_full_match_completed/);
  assert.match(source, /prefill\.source === 'life_path_compatibility'/);
});
