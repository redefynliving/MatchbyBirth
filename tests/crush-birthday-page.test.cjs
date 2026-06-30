const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('crush birthday compatibility page is routed, crawlable, and in the sitemap', async () => {
  const app = read('apps/web/src/App.jsx');
  const ssg = read('tools/build-ssg.mjs');
  const page = read('apps/web/src/pages/CrushBirthdayCompatibilityPage.jsx');
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));

  assert.match(app, /const CrushBirthdayCompatibilityPage = lazy/);
  assert.match(app, /path="\/tools\/crush-birthday-compatibility"/);
  assert.match(ssg, /route: 'tools\/crush-birthday-compatibility'/);
  assert.match(generateSitemapXml(), /https:\/\/matchbybirth\.com\/tools\/crush-birthday-compatibility/);

  assert.match(page, /Crush Birthday Compatibility/);
  assert.match(page, /Enter your birthday and theirs/);
  assert.match(page, /source="crush_birthday_compatibility"/);
  assert.match(page, /defaultRelationshipType="love"/);
  assert.match(page, /\/how-it-works/);
});

test('calculator can accept page-specific copy and analytics source without changing defaults', () => {
  const source = read('apps/web/src/components/CalculatorWithPreview.jsx');

  assert.match(source, /source = 'homepage'/);
  assert.match(source, /title = 'Check compatibility'/);
  assert.match(source, /subtitle = 'Start with two people or compare a full group\.'/);
  assert.match(source, /submitLabel = 'Check compatibility'/);
  assert.match(source, /defaultRelationshipType = 'love'/);
  assert.match(source, /source,/);
});
