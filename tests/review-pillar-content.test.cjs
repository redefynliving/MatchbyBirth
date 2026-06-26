'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

function internalHrefCount(html) {
  return [...html.matchAll(/href="(https:\/\/matchbybirth\.com[^"]+|\/[^"]+)"/g)].length;
}

function renderedArticleText(post) {
  return [
    post.content,
    ...(post.quickTakeaways || []),
    ...(post.exampleScenarios || []).flatMap((item) => [item.title, item.body]),
    ...(post.comparisonRows || []).flatMap((row) => [row.label, row.bestUse, row.watchOut]),
    ...(post.faq || []).flatMap((item) => [item.question, item.answer]),
  ].join(' ');
}

test('review pillar article list contains the 10 strategic content pages', async () => {
  const { REVIEW_PILLAR_SLUGS, ARTICLE_NEXT_STEPS } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );

  assert.deepEqual(REVIEW_PILLAR_SLUGS, [
    'what-is-birth-matching',
    'how-birth-date-compatibility-is-calculated',
    'birth-date-compatibility-vs-zodiac-compatibility',
    'life-path-number-compatibility-guide',
    'relationship-timing-by-birth-date',
    'low-compatibility-score-meaning',
    'high-compatibility-score-meaning',
    'how-to-use-compatibility-results-responsibly',
    'zodiac-elements-love-compatibility',
    'group-compatibility-how-to-read-results',
  ]);

  for (const slug of REVIEW_PILLAR_SLUGS) {
    assert.ok(Array.isArray(ARTICLE_NEXT_STEPS[slug]), `${slug} is missing ARTICLE_NEXT_STEPS`);
    assert.ok(ARTICLE_NEXT_STEPS[slug].length >= 3, `${slug} needs at least 3 next-step links`);
  }
});

test('review pillar articles meet depth, links, and responsible-language standards', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { REVIEW_PILLAR_SLUGS, getArticleNextSteps } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

  for (const slug of REVIEW_PILLAR_SLUGS) {
    const post = postsBySlug.get(slug);
    assert.ok(post, `${slug} is missing from posts`);

    const words = wordCount(renderedArticleText(post));
    assert.ok(words >= 900, `${slug} has only ${words} words`);
    assert.ok(words <= 1450, `${slug} has ${words} words`);

    const h2Count = [...post.content.matchAll(/<h2\b/gi)].length;
    assert.ok(h2Count >= 4, `${slug} has only ${h2Count} h2 headings`);

    const nextSteps = getArticleNextSteps(post);
    assert.ok(
      post.content.includes('/#calculator') || nextSteps.some((step) => step.href === '/#calculator'),
      `${slug} needs a calculator link`,
    );
    assert.ok(
      post.content.includes('/how-it-works') || nextSteps.some((step) => step.href === '/how-it-works'),
      `${slug} needs a methodology link`,
    );

    assert.ok(Array.isArray(post.relatedSlugs), `${slug} is missing relatedSlugs`);
    const renderedInternalLinks = internalHrefCount(post.content) + nextSteps.length + post.relatedSlugs.length;
    assert.ok(renderedInternalLinks >= 5, `${slug} has only ${renderedInternalLinks} rendered internal links`);

    const enhancementTypes = [
      post.quickTakeaways,
      post.exampleScenarios,
      post.comparisonRows,
      post.faq,
    ].filter((items) => Array.isArray(items) && items.length > 0).length;
    assert.ok(enhancementTypes >= 2, `${slug} has only ${enhancementTypes} enhancement block types`);

    assert.doesNotMatch(
      post.content,
      /\b(proves|guarantees|destined|perfect match|soulmate certainty)\b/i,
      `${slug} contains deterministic compatibility language`,
    );
  }
});
