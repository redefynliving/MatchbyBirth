'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function wordCount(html) {
  return html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

test('blog library includes 30 net-new AdSense growth articles', async () => {
  const postsModule = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const growthModule = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/adsense-growth-posts.js')));
  const categoriesModule = await import(pathToFileURL(path.join(root, 'apps/web/src/data/blogCategories.js')));
  const posts = postsModule.default;
  const growthPosts = growthModule.default;
  const categoryKeys = new Set(categoriesModule.BLOG_CATEGORIES.map((category) => category.key));

  assert.equal(growthPosts.length, 30);
  assert.equal(posts.length, 82);

  for (const post of posts) {
    assert.equal(typeof post.slug, 'string', `missing slug for ${post.title}`);
    assert.equal(typeof post.title, 'string', `missing title for ${post.slug}`);
    assert.equal(typeof post.date, 'string', `missing date for ${post.slug}`);
    assert.equal(typeof post.description, 'string', `missing description for ${post.slug}`);
    assert.equal(typeof post.category, 'string', `missing category for ${post.slug}`);
    assert.equal(typeof post.content, 'string', `missing content for ${post.slug}`);
    assert.ok(categoryKeys.has(post.category), `unknown category "${post.category}" for ${post.slug}`);
  }
});

test('blog post slugs are unique', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const slugs = posts.map((post) => post.slug);
  const uniqueSlugs = new Set(slugs);

  assert.equal(uniqueSlugs.size, slugs.length);
});

test('new AdSense growth articles are substantial content pages', async () => {
  const { default: growthPosts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/adsense-growth-posts.js')));
  const { REVIEW_PILLAR_SLUGS } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js')));
  const reviewPillarSlugs = new Set(REVIEW_PILLAR_SLUGS);

  for (const post of growthPosts) {
    const words = wordCount(post.content);
    const maxWords = reviewPillarSlugs.has(post.slug) ? 1450 : 1000;
    assert.ok(words >= 700, `${post.slug} has only ${words} words`);
    assert.ok(words <= maxWords, `${post.slug} has ${words} words`);
    assert.match(post.content, /https:\/\/matchbybirth\.com/);
  }
});

test('new AdSense growth articles include non-templated editorial enhancements and related links', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { default: growthPosts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/adsense-growth-posts.js')));
  const slugs = new Set(posts.map((post) => post.slug));

  for (const post of growthPosts) {
    assert.ok(Array.isArray(post.relatedSlugs), `${post.slug} is missing relatedSlugs`);
    assert.ok(post.relatedSlugs.length >= 2, `${post.slug} needs at least two related article links`);

    for (const relatedSlug of post.relatedSlugs) {
      assert.notEqual(relatedSlug, post.slug, `${post.slug} links to itself`);
      assert.ok(slugs.has(relatedSlug), `${post.slug} links to missing article ${relatedSlug}`);
    }

    const hasEnhancement = [
      post.quickTakeaways,
      post.exampleScenarios,
      post.comparisonRows,
      post.faq,
    ].some((items) => Array.isArray(items) && items.length > 0);

    assert.ok(hasEnhancement, `${post.slug} needs a unique editorial enhancement block`);
    assert.doesNotMatch(
      post.content,
      /For readers using Match by Birth, this part of/,
      `${post.slug} still contains the repeated generated bridge copy`,
    );
  }
});
