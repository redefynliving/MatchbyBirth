const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('life path helper calculates and compares birth dates', async () => {
  const helper = await import(pathToFileURL(path.join(root, 'apps/web/src/lib/lifePath.js')).href);

  assert.equal(helper.calculateLifePathNumber('1990-01-01'), 3);
  assert.equal(helper.calculateLifePathNumber('1995-12-17'), 8);
  assert.equal(helper.calculateLifePathNumber('1995-08-24'), 2);
  assert.equal(helper.calculateLifePathNumber('1990-01-09'), 11);
  assert.equal(helper.calculateLifePathNumber('1993-09-09'), 22);
  assert.equal(helper.reduceLifePathTotal(33), 33);
  assert.equal(helper.calculateLifePathNumber('not-a-date'), null);

  const compatible = helper.compareLifePaths('1990-01-01', '1995-12-17');

  assert.equal(compatible.personA.lifePath, 3);
  assert.equal(compatible.personB.lifePath, 8);
  assert.ok(compatible.score >= 0 && compatible.score <= 100);
  assert.match(compatible.pattern, /creative|focus|tempo|different/i);
  assert.match(compatible.nextStep, /ask|notice|name|talk/i);
  assert.match(compatible.sharedTranslation, /shared plan/i);
  assert.match(compatible.watchArea, /real behavior/i);
  assert.match(compatible.personA.action, /promise|choose|name|ask|finish|set|tell|define|write|break|offer/i);
});

test('life path compatibility page is routed, crawlable, and in the sitemap', async () => {
  const app = read('apps/web/src/App.jsx');
  const ssg = read('tools/build-ssg.mjs');
  const page = read('apps/web/src/pages/LifePathCompatibilityPage.jsx');
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));

  assert.match(app, /const LifePathCompatibilityPage = lazy/);
  assert.match(app, /path="\/tools\/life-path-compatibility"/);
  assert.match(ssg, /route: 'tools\/life-path-compatibility'/);
  assert.match(ssg, /rel="canonical" href="\$\{canonicalUrl\}"/);
  assert.match(ssg, /property="og:title" content="\$\{safeTitle\}"/);
  assert.match(generateSitemapXml(), /https:\/\/matchbybirth\.com\/tools\/life-path-compatibility/);

  assert.match(page, /Life Path Compatibility Calculator & Number Chart/);
  assert.match(page, /Life Path number compatibility chart/);
  assert.match(page, /Life Path 1 and 4 compatibility/);
  assert.match(page, /useState\('compare'\)/);
  assert.match(page, /What is a life path number/);
  assert.match(page, /Life Path compatibility is a lens/);
  assert.match(page, /Easy match/);
  assert.match(page, /Growth match/);
  assert.match(page, /Challenging match/);
  assert.match(page, /How to calculate your life path number/);
  assert.match(page, /Life path meanings/);
  assert.match(page, /Master numbers/);
  assert.match(page, /Compatibility table/);
  assert.match(page, /Evidence/);
  assert.match(page, /Real-life meaning/);
  assert.match(page, /One useful action/);
  assert.match(page, /Try this/);
  assert.match(page, /source="life_path_compatibility"/);
  assert.doesNotMatch(page, /reduces birth dates to the root number from 1 to 9/);
});

test('homepage links visitors to the life path compatibility page', () => {
  const source = read('apps/web/src/pages/HomePage.jsx');

  assert.match(source, /\/tools\/life-path-compatibility/);
  assert.match(source, /Life path compatibility/);
});
