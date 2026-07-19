'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('CI jobs use least-privilege repository permissions', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
  assert.match(workflow, /^permissions:\n  contents: read$/m);
});

test('Sonar duplication exclusions are limited to generated and static data artifacts', () => {
  const config = fs.readFileSync(path.join(root, '.sonarcloud.properties'), 'utf8');
  const exclusions = config
    .split('\n')
    .find((line) => line.startsWith('sonar.cpd.exclusions='))
    .split('=')[1]
    .split(',');

  assert.deepEqual(exclusions, [
    'apps/web/src/data/posts/index.js',
    'tools/build-ssg.mjs',
    'scripts/generate-og-images.js',
    'apps/web/src/data/blogCategories.js',
    'apps/web/src/data/sampleReport.js',
    'tools/optimize_aspect_weights.py',
    'tools/tune_weights.py',
  ]);
  assert.ok(exclusions.every((file) => fs.existsSync(path.join(root, file))));
});
