'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

const fixtureDocument = {
  _id: 'blogPost.cancer-moon',
  title: 'Cancer Moon Compatibility: Love, Friends, and Groups',
  slug: { current: 'cancer-moon-compatibility' },
  status: 'published',
  publishedAt: '2026-06-27T02:30:00.000Z',
  author: 'AJ Fox',
  category: {
    title: 'Moon Sign Compatibility',
    slug: { current: 'moon-signs' },
  },
  topic: 'zodiac',
  excerpt: 'Cancer Moon compatibility is about emotional safety, care, and trust in real relationships.',
  metaDescription: 'Learn how Cancer Moon affects love, friendship, emotional needs, and group compatibility.',
  heroImage: {
    url: 'https://cdn.sanity.io/images/4qj4p6px/production/example.png',
    alt: 'Birth-date cards arranged for a Cancer Moon compatibility reading.',
  },
  quickTakeaways: ['Cancer Moon needs consistency.', 'Birth time can improve Moon sign accuracy.'],
  body: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Cancer Moon compatibility starts with ', marks: [] },
        { _type: 'span', text: 'emotional safety', marks: ['strong'] },
        { _type: 'span', text: '.', marks: [] },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'How it shows up', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{ _type: 'span', text: 'Warmth matters.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Try the calculator', marks: ['link-1'] }],
      markDefs: [{ _key: 'link-1', _type: 'link', href: 'https://matchbybirth.com/#calculator' }],
    },
  ],
  exampleScenarios: [{ title: 'A careful first date', body: 'One person wants reassurance before moving quickly.' }],
  comparisonRows: [{ label: 'Birth time', bestUse: 'Confirming Moon sign on transition days.', watchOut: 'Do not overstate certainty.' }],
  faq: [{ question: 'Do I need a birth time?', answer: 'It helps most when the Moon changed signs near your birth.' }],
  relatedPosts: [
    { slug: { current: 'moon-sign-vs-sun-sign-compatibility' } },
    { slug: { current: 'birth-date-compatibility-without-birth-time' } },
  ],
  calculatorCta: true,
};

test('normalizes a published Sanity post into the Match by Birth blog shape', async () => {
  const { normalizeSanityBlogPost } = await import(pathToFileURL(path.join(root, 'apps/web/tools/sanity-posts.js')));

  const post = normalizeSanityBlogPost(fixtureDocument);

  assert.equal(post.source, 'sanity');
  assert.equal(post.slug, 'cancer-moon-compatibility');
  assert.equal(post.title, 'Cancer Moon Compatibility: Love, Friends, and Groups');
  assert.equal(post.date, '2026-06-27');
  assert.equal(post.author, 'AJ Fox');
  assert.equal(post.authorUrl, 'https://matchbybirth.com/about');
  assert.equal(post.category, 'moon-signs');
  assert.deepEqual(post.tags, ['moon-signs', 'zodiac', 'sanity']);
  assert.equal(post.description, fixtureDocument.metaDescription);
  assert.equal(post.heroImage.url, fixtureDocument.heroImage.url);
  assert.equal(post.ogImage, fixtureDocument.heroImage.url);
  assert.match(post.content, /<p>Cancer Moon compatibility starts with <strong>emotional safety<\/strong>\.<\/p>/);
  assert.match(post.content, /<h2>How it shows up<\/h2>/);
  assert.match(post.content, /<ul>\s*<li>Warmth matters\.<\/li>\s*<\/ul>/);
  assert.match(post.content, /<a href="https:\/\/matchbybirth\.com\/#calculator">Try the calculator<\/a>/);
  assert.deepEqual(post.relatedSlugs, [
    'moon-sign-vs-sun-sign-compatibility',
    'birth-date-compatibility-without-birth-time',
  ]);
  assert.equal(post.calculatorCta, true);
});

test('normalizes invalid or draft Sanity posts to null', async () => {
  const { normalizeSanityBlogPost } = await import(pathToFileURL(path.join(root, 'apps/web/tools/sanity-posts.js')));

  assert.equal(normalizeSanityBlogPost({ ...fixtureDocument, status: 'draft' }), null);
  assert.equal(normalizeSanityBlogPost({ ...fixtureDocument, slug: null }), null);
  assert.equal(normalizeSanityBlogPost({ ...fixtureDocument, body: [] }), null);
});
