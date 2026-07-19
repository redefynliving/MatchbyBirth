'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('blog data keeps coded posts first and de-duplicates Sanity slugs', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/src/data/posts/index.js'), 'utf8');

  assert.match(source, /import sanityPosts from '\.\/sanity-posts\.generated\.js';/);
  assert.match(source, /import searchOpportunityPosts from '\.\/search-opportunity-posts\.js';/);
  assert.match(source, /const codedPosts = \[\.\.\.posts, \.\.\.searchOpportunityPosts\];/);
  assert.match(source, /sanityPosts\.filter\(\(post\) => !codedPosts\.some/);
});

test('web build syncs Sanity posts before generating SEO files', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'apps/web/package.json'), 'utf8'));

  assert.match(packageJson.scripts.build, /node tools\/sync-sanity-posts\.js/);
  assert.ok(
    packageJson.scripts.build.indexOf('node tools/sync-sanity-posts.js') <
      packageJson.scripts.build.indexOf('node tools/generate-sitemap.js'),
    'Sanity sync must happen before sitemap generation',
  );
});

test('writes a generated Sanity posts module that can be imported by the blog', async () => {
  const { writeSanityPostsModule } = await import(pathToFileURL(path.join(root, 'apps/web/tools/sanity-posts.js')));
  const outputPath = path.join(os.tmpdir(), `sanity-posts-${Date.now()}.generated.js`);

  writeSanityPostsModule({
    posts: [{
      slug: 'cancer-moon-compatibility',
      title: 'Cancer Moon Compatibility',
      date: '2026-06-27',
      description: 'A practical Cancer Moon compatibility guide.',
      tags: ['moon-signs', 'sanity'],
      category: 'moon-signs',
      content: '<p>Original Sanity article.</p>',
    }],
    outputPath,
  });

  const moduleSource = fs.readFileSync(outputPath, 'utf8');
  assert.match(moduleSource, /Generated from Sanity/);

  const { default: generatedPosts } = await import(pathToFileURL(outputPath));
  assert.equal(generatedPosts.length, 1);
  assert.equal(generatedPosts[0].slug, 'cancer-moon-compatibility');
});

test('Sanity sync only exposes published and approved workflow posts', async () => {
  const {
    buildSanityPostsQuery,
    normalizeSanityBlogPost,
  } = await import(pathToFileURL(path.join(root, 'apps/web/tools/sanity-posts.js')));

  const query = buildSanityPostsQuery();
  assert.match(query, /status == "published"/);
  assert.match(query, /approvalStatus == "approved"/);
  assert.match(query, /!\(_id in path\("drafts\.\*\*"\)\)/);

  const baseDocument = {
    title: 'Cancer Moon Compatibility',
    slug: { current: 'cancer-moon-compatibility' },
    status: 'published',
    publishedAt: '2026-06-27T12:00:00.000Z',
    topic: 'zodiac',
    category: { title: 'Moon Signs', slug: { current: 'moon-signs' } },
    metaDescription: 'A practical Cancer Moon compatibility guide.',
    body: [{
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Original Sanity article.' }],
    }],
  };

  assert.equal(normalizeSanityBlogPost({ ...baseDocument, approvalStatus: 'ready' }), null);
  assert.equal(normalizeSanityBlogPost({ ...baseDocument, approvalStatus: 'raw' }), null);
  assert.equal(
    normalizeSanityBlogPost({ ...baseDocument, approvalStatus: 'approved' }).slug,
    'cancer-moon-compatibility',
  );
  assert.equal(
    normalizeSanityBlogPost(baseDocument).slug,
    'cancer-moon-compatibility',
    'legacy published posts without approvalStatus stay live',
  );
});

test('Sanity Studio has one-click approval fields and publish action', () => {
  const schema = fs.readFileSync(path.join(root, 'studio-matchbybirth/schemaTypes/blogPost.ts'), 'utf8');
  const config = fs.readFileSync(path.join(root, 'studio-matchbybirth/sanity.config.ts'), 'utf8');
  const action = fs.readFileSync(
    path.join(root, 'studio-matchbybirth/actions/ApproveAndPublishAction.tsx'),
    'utf8',
  );

  for (const field of ['approvalStatus', 'aiGenerated', 'slopFlags', 'rawBody', 'metaTitle']) {
    assert.match(schema, new RegExp(`name: '${field}'`));
  }

  assert.match(config, /ApproveAndPublishAction/);
  assert.match(config, /schemaType === 'blogPost'/);
  assert.match(action, /approvalStatus === 'ready'/);
  assert.match(action, /approvalStatus: 'approved'/);
  assert.match(action, /status: 'published'/);
});
