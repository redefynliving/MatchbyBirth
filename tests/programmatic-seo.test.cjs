const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('zodiac pairing helper creates 144 non-colliding and-style URLs', async () => {
  const { getCanonicalZodiacPairingPages, getZodiacPairingPages } = await import(pathToFileURL(
    path.join(root, 'tools/zodiac-pairings.mjs'),
  ));

  const pages = getZodiacPairingPages();
  const slugs = pages.map((page) => page.slug);

  assert.equal(pages.length, 144);
  assert.equal(new Set(slugs).size, 144);
  assert.ok(slugs.includes('aries-and-scorpio-compatibility'));
  assert.ok(slugs.includes('scorpio-and-aries-compatibility'));
  assert.equal(slugs.includes('aries-scorpio-compatibility'), false);
  assert.equal(getCanonicalZodiacPairingPages().length, 78);
});

test('SSG pairing generator does not skip stale dist directories', () => {
  const source = fs.readFileSync(path.join(root, 'tools/build-ssg.mjs'), 'utf8');

  assert.match(source, /getZodiacPairingPosts\(\)/);
  assert.doesNotMatch(source, /fs\.existsSync\(postDir\)/);
});

test('sitemap includes one canonical URL per zodiac pairing with stable dates', async () => {
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));

  const sitemap = generateSitemapXml();

  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/aries-scorpio-compatibility/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/aries-and-taurus-compatibility/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/pisces-and-pisces-compatibility/);
  assert.doesNotMatch(sitemap, /https:\/\/matchbybirth\.com\/blog\/aries-and-scorpio-compatibility/);
  assert.doesNotMatch(sitemap, /https:\/\/matchbybirth\.com\/blog\/scorpio-and-aries-compatibility/);
  assert.doesNotMatch(sitemap, /https:\/\/matchbybirth\.com\/blog\/gemini-libra-compatibility/);
  assert.match(sitemap, /https:\/\/matchbybirth\.com\/blog\/libra-gemini-air-sign-romance/);
  assert.equal((sitemap.match(/-and-[a-z]+-compatibility/g) || []).length, 63);
  assert.equal(new Set(locations).size, locations.length);
  assert.match(sitemap, /<lastmod>2026-07-12<\/lastmod>/);
});

test('generated zodiac pairing routes resolve to substantive runtime posts', async () => {
  const { getZodiacPairingPostBySlug } = await import(pathToFileURL(
    path.join(root, 'tools/zodiac-pairings.mjs'),
  ));

  const post = getZodiacPairingPostBySlug('aries-and-scorpio-compatibility');

  assert.equal(post.slug, 'aries-and-scorpio-compatibility');
  assert.equal(post.category, 'pair-deep-dive');
  assert.match(post.title, /Aries and Scorpio Compatibility/);
  assert.match(post.content, /Elemental rhythm: Fire and Water/);
  assert.ok(post.content.replace(/<[^>]+>/g, ' ').length > 1500);
  assert.equal(getZodiacPairingPostBySlug('not-a-real-pairing'), null);
});

test('inverse pairing routes share one canonical URL and article identity', async () => {
  const { getZodiacPairingPostBySlug } = await import(pathToFileURL(
    path.join(root, 'tools/zodiac-pairings.mjs'),
  ));
  const { getBlogPostSeo } = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/blogSeo.js'),
  ));
  const { renderArticleHtml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/prerender-blog-html.js'),
  ));

  const canonical = getZodiacPairingPostBySlug('aries-and-scorpio-compatibility');
  const inverse = getZodiacPairingPostBySlug('scorpio-and-aries-compatibility');

  assert.equal(canonical.canonicalSlug, 'aries-scorpio-compatibility');
  assert.equal(inverse.canonicalSlug, canonical.canonicalSlug);
  assert.equal(inverse.title, canonical.title);
  assert.equal(inverse.content, canonical.content);
  assert.equal(getBlogPostSeo(inverse).url, 'https://matchbybirth.com/blog/aries-scorpio-compatibility');
  assert.match(
    renderArticleHtml({ template: '<html><body><div id="root"></div></body></html>', post: inverse }),
    /<link rel="canonical" href="https:\/\/matchbybirth\.com\/blog\/aries-scorpio-compatibility"/,
  );
  assert.match(
    renderArticleHtml({ template: '<html><body><div id="root"></div></body></html>', post: inverse }),
    /<link rel="canonical"[^>]+data-react-helmet="true"/,
  );
});

test('blog index exposes crawlable links to every canonical pairing', () => {
  const staticRenderer = fs.readFileSync(
    path.join(root, 'apps/web/tools/prerender-blog-html.js'),
    'utf8',
  );
  const blogPage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/BlogPage.jsx'),
    'utf8',
  );

  assert.match(staticRenderer, /getCanonicalZodiacPairingPages/);
  assert.match(staticRenderer, /Find your zodiac pairing/);
  assert.match(blogPage, /getCanonicalZodiacPairingPages/);
  assert.match(blogPage, /Find your zodiac pairing/);
});

test('editorial duplicates resolve to the strongest existing article', async () => {
  const { getCanonicalBlogPostSlug } = await import(pathToFileURL(
    path.join(root, 'tools/zodiac-pairings.mjs'),
  ));
  const { getBlogPostPath } = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/blogSeo.js'),
  ));

  assert.equal(
    getCanonicalBlogPostSlug('gemini-libra-compatibility'),
    'libra-gemini-air-sign-romance',
  );
  assert.equal(
    getBlogPostPath({ slug: 'gemini-libra-compatibility' }),
    '/blog/libra-gemini-air-sign-romance',
  );
});

test('runtime blog route falls back to generated pairing data', () => {
  const source = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/BlogPostPage.jsx'),
    'utf8',
  );

  assert.match(source, /getZodiacPairingPostBySlug\(slug\)/);
  assert.match(source, /noindex,nofollow/);
});
