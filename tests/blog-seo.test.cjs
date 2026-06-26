'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const helperPath = path.join(root, 'apps/web/src/lib/blog-seo.js');

test('blog SEO helper builds Article and BreadcrumbList schema', async () => {
  assert.equal(fs.existsSync(helperPath), true, 'apps/web/src/lib/blog-seo.js must exist');

  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { buildArticleSchema, buildBreadcrumbSchema } = await import(pathToFileURL(helperPath));

  for (const post of posts) {
    const schema = buildArticleSchema(post);

    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.headline, post.title);
    assert.equal(schema.description, post.description);
    assert.equal(schema.datePublished, post.date);
    assert.equal(schema.author.name, 'Match by Birth');
    assert.equal(schema.publisher.name, 'Match by Birth');
    assert.equal(schema.articleSection, post.category);
    assert.equal(schema.mainEntityOfPage['@id'], `https://matchbybirth.com/blog/${post.slug}`);
  }

  const breadcrumb = buildBreadcrumbSchema(posts[0]);
  assert.equal(breadcrumb['@type'], 'BreadcrumbList');
  assert.equal(breadcrumb.itemListElement[0].name, 'Home');
  assert.equal(breadcrumb.itemListElement[1].name, 'Blog');
  assert.equal(breadcrumb.itemListElement[2].name, posts[0].title);
});

test('blog SEO helper returns explicit related posts before category fallback', async () => {
  assert.equal(fs.existsSync(helperPath), true, 'apps/web/src/lib/blog-seo.js must exist');

  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { getRelatedPosts } = await import(pathToFileURL(helperPath));
  const post = posts.find((entry) => entry.slug === 'what-is-birth-matching');

  const related = getRelatedPosts(post, posts, 3);

  assert.ok(related.length >= 2);
  assert.deepEqual(
    related.slice(0, post.relatedSlugs.length).map((entry) => entry.slug),
    post.relatedSlugs,
  );
  assert.equal(related.some((entry) => entry.slug === post.slug), false);
});

test('priority articles expose calculator and methodology next-step links', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { REVIEW_PILLAR_SLUGS, getArticleNextSteps } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );

  for (const slug of REVIEW_PILLAR_SLUGS) {
    const post = posts.find((entry) => entry.slug === slug);
    assert.ok(post, `${slug} must exist`);

    const links = getArticleNextSteps(post);
    const hrefs = links.map((link) => link.href);

    assert.ok(hrefs.includes('/#calculator'), `${slug} must link to the calculator`);
    assert.ok(hrefs.includes('/how-it-works'), `${slug} must link to methodology`);
    assert.ok(links.every((link) => link.label && link.description), `${slug} links need label and description`);
  }
});
