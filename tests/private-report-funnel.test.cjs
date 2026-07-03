'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('private report funnel routes are wired and crawlable', async () => {
  const app = read('apps/web/src/App.jsx');
  const footer = read('apps/web/src/components/Footer.jsx');
  const ssg = read('tools/build-ssg.mjs');
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));
  const sitemap = generateSitemapXml();

  assert.match(app, /const PrivateCompatibilityReadPage = lazy/);
  assert.match(app, /const SampleReportPage = lazy/);
  assert.match(app, /path="\/reports\/private-compatibility-read"/);
  assert.match(app, /path="\/reports\/sample"/);

  assert.match(footer, /\/reports\/private-compatibility-read/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/reports\/private-compatibility-read/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/reports\/sample/);

  assert.match(ssg, /route: 'reports\/private-compatibility-read'/);
  assert.match(ssg, /route: 'reports\/sample'/);
  assert.match(ssg, /A private read for the connection you keep thinking about/);
  assert.match(ssg, /chemistry, comfort, or chaos/);
});

test('private report pages sell the paid product without fake claims', () => {
  const offer = read('apps/web/src/pages/PrivateCompatibilityReadPage.jsx');
  const sample = read('apps/web/src/pages/SampleReportPage.jsx');
  const data = read('apps/web/src/data/privateReportOffer.js');

  assert.match(offer, /Run the free comparison first/);
  assert.match(offer, /what to say next/);
  assert.match(offer, /No soulmate verdict/);
  assert.match(offer, /professional relationship advice/);
  assert.match(offer, /Product/);
  assert.doesNotMatch(offer, /aggregateRating|ratingValue|ratingCount/);

  assert.match(sample, /Fictional sample/);
  assert.match(sample, /The point is not a bigger score/);
  assert.match(sample, /Run your comparison/);

  assert.match(data, /Mara & Eli/);
  assert.match(data, /What pulls you together/);
  assert.match(data, /Where the rhythm catches/);
  assert.match(data, /What to ask next/);
  assert.match(data, /A line you could send/);
});
