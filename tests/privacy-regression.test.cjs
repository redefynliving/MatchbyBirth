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

test('privacy page discloses Google AdSense cookies and partner data use', () => {
  const privacySource = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/PrivacyPolicyPage.jsx'),
    'utf8',
  );

  assert.match(privacySource, /Google AdSense/);
  assert.match(privacySource, /optional birth time and birth place/);
  assert.match(privacySource, /Raw birth dates, times, and places are not stored/);
  assert.match(privacySource, /selected birth place/);
  assert.match(privacySource, /timezone/);
  assert.match(privacySource, /Raw birth dates, times, places, coordinates, and timezones are not stored/);
  assert.match(privacySource, /third-party vendors may place or read cookies/);
  assert.match(privacySource, /web beacons/);
  assert.match(privacySource, /https:\/\/policies\.google\.com\/technologies\/partner-sites/);
});

test('cookie banner does not claim no third-party sharing while ads are enabled', () => {
  const bannerSource = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CookieConsentBanner.jsx'),
    'utf8',
  );

  assert.doesNotMatch(bannerSource, /No personal data is shared with third parties/);
  assert.match(bannerSource, /advertising/);
  assert.match(bannerSource, /Google and other partners/);
});
