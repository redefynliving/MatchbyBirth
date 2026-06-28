const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('zodiac pairing helper creates 144 non-colliding and-style URLs', async () => {
  const { getZodiacPairingPages } = await import(pathToFileURL(
    path.join(root, 'tools/zodiac-pairings.mjs'),
  ));

  const pages = getZodiacPairingPages();
  const slugs = pages.map((page) => page.slug);

  assert.equal(pages.length, 144);
  assert.equal(new Set(slugs).size, 144);
  assert.ok(slugs.includes('aries-and-scorpio-compatibility'));
  assert.ok(slugs.includes('scorpio-and-aries-compatibility'));
  assert.equal(slugs.includes('aries-scorpio-compatibility'), false);
});

test('SSG pairing generator does not skip stale dist directories', () => {
  const source = fs.readFileSync(path.join(root, 'tools/build-ssg.mjs'), 'utf8');

  assert.match(source, /getZodiacPairingPages\(\)/);
  assert.doesNotMatch(source, /fs\.existsSync\(postDir\)/);
});

test('sitemap includes generated zodiac pairing pages', async () => {
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));

  const sitemap = generateSitemapXml();

  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/aries-and-scorpio-compatibility/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/pisces-and-pisces-compatibility/);
  assert.equal((sitemap.match(/-and-[a-z]+-compatibility/g) || []).length, 144);
});
