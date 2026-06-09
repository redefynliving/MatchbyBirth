'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('production source cannot create raw birth-date result URLs', () => {
  const permalinkPath = path.join(
    root,
    'apps',
    'web',
    'src',
    'utils',
    'resultPermalink.js',
  );

  assert.equal(fs.existsSync(permalinkPath), false);
});

test('diagnostic astrology endpoint is not deployed publicly', () => {
  assert.equal(fs.existsSync(path.join(root, 'api', 'test-swisseph.js')), false);
});
