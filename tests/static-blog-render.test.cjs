'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('static blog renderer writes crawlable blog, category, and article HTML', async () => {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'matchbybirth-static-blog-'));
  const templatePath = path.join(outputRoot, 'index.html');
  fs.writeFileSync(
    templatePath,
    '<!doctype html><html><head><link rel="stylesheet" href="/assets/app.css"><script type="module" src="/assets/app.js"></script></head><body><div id="root"></div></body></html>',
    'utf8',
  );

  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { BLOG_CATEGORIES } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/blogCategories.js')));
  const { prerenderBlogHtml } = await import(pathToFileURL(path.join(root, 'apps/web/tools/prerender-blog-html.js')));
  const post = posts.find((entry) => entry.slug === 'what-is-birth-matching');
  const relatedPosts = post.relatedSlugs.map((slug) => posts.find((entry) => entry.slug === slug)).filter(Boolean);
  const fixturePosts = [post, ...relatedPosts];
  const category = BLOG_CATEGORIES.find((entry) => entry.key === post.category);

  const written = prerenderBlogHtml({
    outputRoot,
    templatePath,
    allPosts: fixturePosts,
    categories: [category],
  });

  assert.equal(written.length, fixturePosts.length + 2);
  assert.ok(fs.existsSync(path.join(outputRoot, 'blog', 'index.html')));
  assert.ok(fs.existsSync(path.join(outputRoot, 'blog', 'category', category.key, 'index.html')));

  const articlePath = path.join(outputRoot, 'blog', post.slug, 'index.html');
  const articleHtml = fs.readFileSync(articlePath, 'utf8');

  assert.ok(articleHtml.includes(`<title>${post.title} | Match by Birth</title>`));
  assert.ok(articleHtml.includes(`<meta name="description" content="${post.description}"`));
  assert.ok(articleHtml.includes(`<link rel="canonical" href="https://matchbybirth.com/blog/${post.slug}"`));
  assert.match(articleHtml, /application\/ld\+json/);
  assert.match(articleHtml, /"@type":"Article"/);
  assert.match(articleHtml, /Related articles/);
  assert.match(articleHtml, /Quick takeaways|Example scenarios|Comparison guide|Common questions/);
  assert.match(articleHtml, /What Information Goes In/);
  assert.match(articleHtml, /Recommended next/);
  assert.match(articleHtml, /Try the birth date compatibility calculator/);
  assert.match(articleHtml, /Read how Match by Birth works/);
  assert.match(articleHtml, /<a href="\/#calculator">Try the Match by Birth compatibility calculator<\/a>/);
});
