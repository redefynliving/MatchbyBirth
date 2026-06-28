const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(
  path.join(root, 'apps/web/src/components/CalculatorWithPreview.jsx'),
  'utf8',
);

test('calculator submits actual form field values for date-only mode', () => {
  assert.match(source, /new FormData\(form\)/);
  assert.match(source, /buildSubmittedPeople\(event\.currentTarget\)/);
  assert.match(source, /name=\{`name-\$\{person\.id\}`\}/);
  assert.match(source, /name=\{`dob-\$\{person\.id\}`\}/);
  assert.match(source, /name=\{`gname-\$\{person\.id\}`\}/);
  assert.match(source, /name=\{`gdob-\$\{person\.id\}`\}/);
});
