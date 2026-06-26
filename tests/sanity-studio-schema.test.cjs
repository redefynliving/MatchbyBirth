'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Sanity Studio defines a structured blog publishing schema', () => {
  const schemaIndex = read('studio-matchbybirth/schemaTypes/index.ts');
  const postSchema = read('studio-matchbybirth/schemaTypes/blogPost.ts');
  const categorySchema = read('studio-matchbybirth/schemaTypes/category.ts');

  assert.match(schemaIndex, /blogPost/);
  assert.match(schemaIndex, /category/);
  assert.match(postSchema, /name: 'blogPost'/);
  assert.match(postSchema, /name: 'title'/);
  assert.match(postSchema, /name: 'slug'/);
  assert.match(postSchema, /name: 'category'/);
  assert.match(postSchema, /name: 'metaDescription'/);
  assert.match(postSchema, /name: 'body'/);
  assert.match(postSchema, /name: 'quickTakeaways'/);
  assert.match(postSchema, /name: 'faq'/);
  assert.match(postSchema, /name: 'relatedPosts'/);
  assert.match(postSchema, /MBB Exact Mode/);
  assert.match(categorySchema, /name: 'category'/);
  assert.match(categorySchema, /name: 'slug'/);
});

test('Sanity Studio README explains how to publish a Match by Birth article', () => {
  const readme = read('studio-matchbybirth/README.md');

  assert.match(readme, /Match by Birth Blog Studio/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /Create a category/);
  assert.match(readme, /Create a blog post/);
  assert.match(readme, /Publish/);
  assert.match(readme, /Vercel Deploy Hook/);
});
