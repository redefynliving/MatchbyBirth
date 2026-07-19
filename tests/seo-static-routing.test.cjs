const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('Vercel clean URLs can resolve prerendered HTML before the SPA fallback', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

  assert.equal(config.cleanUrls, true);
  assert.deepEqual(config.rewrites.at(-1), {
    source: '/(.*)',
    destination: '/index.html',
  });
});

test('blog prerender writes clean-URL HTML files with route-specific metadata', async (t) => {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mbb-seo-routing-'));
  t.after(() => fs.rmSync(outputRoot, { recursive: true, force: true }));

  const renderer = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/prerender-blog-html.js'),
  ).href);
  const post = {
    slug: 'seo-test-post',
    title: 'SEO Test Post',
    date: '2026-07-17',
    description: 'A route-specific description for the SEO routing regression test.',
    tags: ['test'],
    category: 'relationships',
    content: '<p>Route-specific article content.</p>',
  };

  renderer.prerenderBlogHtml({
    outputRoot,
    allPosts: [post],
    categories: [],
  });

  const articlePath = path.join(outputRoot, 'blog', 'seo-test-post.html');
  const article = fs.readFileSync(articlePath, 'utf8');

  assert.equal(fs.existsSync(path.join(outputRoot, 'blog.html')), true);
  assert.equal(fs.existsSync(path.join(outputRoot, 'blog', 'index.html')), false);
  assert.match(article, /<title>SEO Test Post \| Match by Birth<\/title>/);
  assert.match(article, /rel="canonical" href="https:\/\/matchbybirth\.com\/blog\/seo-test-post"/);
  assert.match(article, /property="og:url" content="https:\/\/matchbybirth\.com\/blog\/seo-test-post"/);
  assert.match(article, /<h1>SEO Test Post<\/h1>/);
});

test('standard and programmatic SSG routes use flat clean-URL files', () => {
  const source = fs.readFileSync(path.join(root, 'tools/build-ssg.mjs'), 'utf8');

  assert.match(source, /routeFilePath\(DIST_DIR, page\.route\)/);
  assert.match(source, /routeFilePath\(DIST_DIR, `blog\/\$\{slug\}`\)/);
  assert.doesNotMatch(source, /path\.join\(pageDir, 'index\.html'\)/);
  assert.doesNotMatch(source, /path\.join\(postDir, 'index\.html'\)/);
});

test('the proven birth-matching search URL stays available and links to the calculator', async () => {
  const postsModule = await import(pathToFileURL(
    path.join(root, 'apps/web/src/data/posts/index.js'),
  ).href);
  const sitemapModule = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ).href);
  const matchingPosts = postsModule.default.filter((post) => post.slug === 'what-is-birth-matching');

  assert.equal(matchingPosts.length, 1);
  assert.match(matchingPosts[0].title, /What Is Birth Matching/);
  assert.match(matchingPosts[0].description, /birth matching/i);
  assert.match(matchingPosts[0].content, /\/tools\/crush-birthday-compatibility/);
  assert.match(matchingPosts[0].content, /<h2>What does birth matching compare\?<\/h2>/);
  assert.doesNotMatch(matchingPosts[0].content, /<h1>/);
  assert.match(
    sitemapModule.generateSitemapXml(),
    /https:\/\/matchbybirth\.com\/blog\/what-is-birth-matching/,
  );
});
