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
