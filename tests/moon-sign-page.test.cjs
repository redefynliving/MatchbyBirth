const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('moon sign helper calculates single signs and pair compatibility', async () => {
  const helper = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/moonSign.js'),
  ).href);

  const dateOnly = helper.calculateMoonSign({ birthDate: '2000-01-01' });
  const timed = helper.calculateMoonSign({
    birthDate: '2000-01-01',
    birthTime: '12:00',
    place: { label: 'London, UK', timezone: 'Europe/London' },
  });

  assert.equal(dateOnly.sign, 'Scorpio');
  assert.equal(dateOnly.precision, 'date-only');
  assert.equal(timed.sign, 'Scorpio');
  assert.equal(timed.precision, 'exact');
  assert.equal(helper.calculateMoonSign({ birthDate: 'not-a-date' }), null);

  const comparison = helper.compareMoonSigns(
    { birthDate: '2000-01-01' },
    { birthDate: '2000-01-02' },
  );
  assert.ok(comparison.score >= 0 && comparison.score <= 100);
  assert.match(comparison.pattern, /need|emotional|styles/i);
  assert.match(comparison.nextStep, /ask/i);
});

test('moon sign compatibility page is routed, crawlable, and linked beside the other tools', async () => {
  const app = read('apps/web/src/App.jsx');
  const page = read('apps/web/src/pages/MoonSignCompatibilityPage.jsx');
  const home = read('apps/web/src/pages/HomePage.jsx');
  const ssg = read('tools/build-ssg.mjs');
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ).href);

  assert.match(app, /const MoonSignCompatibilityPage = lazy/);
  assert.match(app, /path="\/tools\/moon-sign-compatibility"/);
  assert.match(home, /\/tools\/moon-sign-compatibility/);
  assert.match(home, /Moon sign compatibility/);
  assert.match(ssg, /route: 'tools\/moon-sign-compatibility'/);
  assert.match(generateSitemapXml(), /https:\/\/matchbybirth\.com\/tools\/moon-sign-compatibility/);

  assert.match(page, /Moon Sign Calculator & Compatibility/);
  assert.match(page, /Your Moon sign shows what care feels like/);
  assert.match(page, /href="#calculator"/);
  assert.match(page, /Find my Moon sign/);
  assert.match(page, /Compare two people/);
  assert.match(page, /calculateMoonSign/);
  assert.match(page, /compareMoonSigns/);
  assert.match(page, /source="moon_sign_compatibility"/);
  assert.match(page, /Birth time and birthplace make the result more precise/);
  assert.match(page, /Birth details are not stored/);
  assert.match(page, /result\.person\.precision === 'exact'/);
  assert.match(page, /Evidence/);
  assert.match(page, /Real-life meaning/);
  assert.match(page, /One useful action/);
  assert.match(page, /Try this/);
  assert.match(page, /<details key=\{item\.question\}/);
  assert.match(page, /\{profile\.element\}/);
});
