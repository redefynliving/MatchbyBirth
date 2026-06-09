'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildResultNavigation,
} = require('../shared/result-navigation.cjs');

const result = {
  mode: 'pair',
  people: [{ name: 'Alijah' }, { name: 'Eddie' }],
  score: 72,
};

test('buildResultNavigation uses an opaque URL for persisted results', () => {
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

test('buildResultNavigation keeps an unpersisted result in navigation state only', () => {
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
