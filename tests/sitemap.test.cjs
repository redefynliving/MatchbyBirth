'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const sitemapPath = path.join(root, 'apps/web/public/sitemap.xml');

test('sitemap includes every public blog article and category page', async () => {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { BLOG_CATEGORIES } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/blogCategories.js')));

  for (const post of posts) {
    assert.match(sitemap, new RegExp(`<loc>https://matchbybirth\\.com/blog/${post.slug}</loc>`));
  }

  for (const category of BLOG_CATEGORIES) {
    assert.match(sitemap, new RegExp(`<loc>https://matchbybirth\\.com/blog/category/${category.key}</loc>`));
  }
});

test('sitemap does not index private result routes', () => {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');

  assert.doesNotMatch(sitemap, /<loc>https:\/\/matchbybirth\.com\/result/);
});
