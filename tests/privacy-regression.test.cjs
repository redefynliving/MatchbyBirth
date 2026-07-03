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

test('cookie banner uses ads-aware third-party disclosure language', () => {
  const banner = fs.readFileSync(
    path.join(root, 'apps', 'web', 'src', 'components', 'CookieConsentBanner.jsx'),
    'utf8',
  );

  assert.match(banner, /Google and other partners may use cookies/);
  assert.match(banner, /analytics, preferences, and ads measurement/);
  assert.doesNotMatch(banner, /No personal data is shared with third parties/);
});
