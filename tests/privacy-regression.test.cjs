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

test('free email capture avoids unsupported weekly or result-copy promises', () => {
  const newsletter = fs.readFileSync(
    path.join(root, 'apps', 'web', 'src', 'components', 'NewsletterCapture.jsx'),
    'utf8',
  );
  const resultCapture = fs.readFileSync(
    path.join(root, 'apps', 'web', 'src', 'components', 'EmailCaptureSection.jsx'),
    'utf8',
  );
  const faq = fs.readFileSync(
    path.join(root, 'apps', 'web', 'src', 'pages', 'FAQPage.jsx'),
    'utf8',
  );
  const emailService = fs.readFileSync(
    path.join(root, 'api', '_lib', 'email-service.cjs'),
    'utf8',
  );

  const combined = [newsletter, resultCapture, faq, emailService].join('\n');

  assert.match(combined, /occasional Match by Birth updates|Occasional notes/);
  assert.match(combined, /new compatibility guides, tools, or product/);
  assert.doesNotMatch(combined, /weekly compatibility insights/i);
  assert.doesNotMatch(combined, /weekly astrological compatibility guide/i);
  assert.doesNotMatch(combined, /timing notes, relationship prompts/i);
  assert.doesNotMatch(resultCapture, /send a private copy/i);
  assert.doesNotMatch(resultCapture, /Send result/);
});
