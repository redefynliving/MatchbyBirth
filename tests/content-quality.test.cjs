'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const test = require('node:test');
const {pathToFileURL} = require('node:url');

const root = path.resolve(__dirname, '..');

function paragraph(topic, index) {
  return `This ${topic} section ${index} uses a concrete relationship scene to explain the pattern without turning the reading into a verdict. For example, one person may want plans named early while the other waits until the mood feels clear, so the useful move is to name the timeline before either person turns silence into a test.`;
}

function validDraft(overrides = {}) {
  const rawBody = [
    'Some connections feel easy until one small timing difference starts doing more work than either person expects.',
    '## The pattern to notice',
    paragraph('compatibility', 1),
    paragraph('compatibility', 2),
    '## How to use the reading',
    paragraph('reading', 3),
    paragraph('reading', 4),
    '## What to do next',
    paragraph('next step', 5),
    'Use this with the Match by Birth calculator at /#calculator, then read /how-it-works before treating any score as a final answer.',
  ].join('\n\n');

  return {
    title: 'How to Read Compatibility Without Overthinking It',
    slug: 'how-to-read-compatibility-without-overthinking',
    excerpt: 'A grounded guide to reading compatibility patterns without treating a score like a verdict.',
    metaTitle: 'How to Read Compatibility Clearly',
    metaDescription: 'Learn how to read compatibility patterns with examples, internal links, and practical next steps without treating the score as fate.',
    rawBody,
    ...overrides,
  };
}

test('content quality scanner accepts a specific, linked, example-led draft', async () => {
  const {analyzeDraftQuality} = await import(pathToFileURL(
    path.join(root, 'studio-matchbybirth/tools/content-quality.mjs'),
  ).href);

  const result = analyzeDraftQuality(validDraft(), {minWords: 120});

  assert.equal(result.ok, true);
  assert.equal(result.errors.length, 0);
  assert.ok(result.metrics.wordCount >= 120);
});

test('content quality scanner rejects AI filler, weak meta, no examples, no links, and thin body', async () => {
  const {analyzeDraftQuality} = await import(pathToFileURL(
    path.join(root, 'studio-matchbybirth/tools/content-quality.mjs'),
  ).href);

  const result = analyzeDraftQuality({
    title: 'Bad Post',
    excerpt: 'Too short.',
    metaDescription: 'Too short.',
    rawBody: 'When it comes to compatibility, communication is key. Whether you are dating or curious, this ultimate guide will delve into meaningful connection.',
  }, {minWords: 120});

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /Meta description/);
  assert.match(result.errors.join(' '), /internal link/);
  assert.match(result.errors.join(' '), /concrete example/);
  assert.match(result.errors.join(' '), /Intro starts too generic/);
  assert.match(result.errors.join(' '), /generic AI-style phrases/);
});

test('Sanity draft upsert tool blocks a weak draft before network write', () => {
  const tempPath = path.join(os.tmpdir(), `weak-draft-${Date.now()}.json`);
  fs.writeFileSync(tempPath, JSON.stringify({
    title: 'Bad Post',
    slug: 'bad-post',
    excerpt: 'Too short.',
    metaDescription: 'Too short.',
    rawBody: 'When it comes to relationships, communication is key.',
  }), 'utf8');

  assert.throws(
    () => execFileSync('node', ['studio-matchbybirth/tools/upsert-ai-draft.mjs', tempPath], {
      cwd: root,
      env: {...process.env, SANITY_API_TOKEN: 'test-token'},
      encoding: 'utf8',
      stdio: 'pipe',
    }),
    /Draft blocked before Sanity/,
  );
});
