'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const navigationPath = path.join(
  root,
  'apps/web/src/lib/result-navigation.js',
);
const navigationModuleUrl = pathToFileURL(navigationPath).href;

const result = {
  mode: 'pair',
  people: [{ name: 'Alijah' }, { name: 'Eddie' }],
  score: 72,
};

test('frontend result navigation is a native ES module', () => {
  const source = fs.readFileSync(navigationPath, 'utf8');

  assert.doesNotMatch(source, /\.cjs|module\.exports|require\(/);
  assert.match(source, /export function buildResultNavigation/);
});

test('buildResultNavigation uses an opaque URL for persisted results', async () => {
  const { buildResultNavigation } = await import(navigationModuleUrl);
  const navigation = buildResultNavigation({
    persisted: true,
    resultId: 'result-id',
    shareSlug: 'opaque-token',
    result,
  });

  assert.equal(navigation.path, '/result?share=opaque-token');
  assert.equal(navigation.state.canShare, true);
  assert.equal(navigation.state.canPurchase, true);
});

test('buildResultNavigation keeps an unpersisted result in navigation state only', async () => {
  const { buildResultNavigation } = await import(navigationModuleUrl);
  const navigation = buildResultNavigation({
    persisted: false,
    resultId: null,
    shareSlug: null,
    result,
  });

  assert.equal(navigation.path, '/result');
  assert.equal(navigation.state.canShare, false);
  assert.equal(navigation.state.canPurchase, false);
  assert.equal(navigation.state.result, result);
  assert.equal(JSON.stringify(navigation).includes('birthDate'), false);
});
