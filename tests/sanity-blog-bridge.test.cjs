'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('blog data imports generated Sanity posts and keeps coded posts first', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/src/data/posts/index.js'), 'utf8');

  assert.match(source, /import sanityPosts from '\.\/sanity-posts\.generated\.js';/);
  assert.match(source, /export default \[\.\.\.posts, \.\.\.sanityPosts\];/);
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
