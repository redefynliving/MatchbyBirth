'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('result card sells the private report from the highest-intent moment', () => {
  const source = read('apps/web/src/components/ResultCard.jsx');

  assert.match(source, /Unlock the part people usually overthink/);
  assert.match(source, /why this feels familiar/);
  assert.match(source, /where the rhythm may catch/);
  assert.match(source, /what each person may misread/);
  assert.match(source, /what to say next/);
  assert.match(source, /Unlock private report/);
  assert.match(source, /PRIVATE_REPORT_PRICE/);
  assert.match(source, /\/reports\/sample/);
  assert.match(source, /A line you could actually send/);
  assert.doesNotMatch(source, /Want a more detailed breakdown/);
});
