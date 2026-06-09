const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateAndStoreResult,
  getSharedResult,
} = require('../api/lib/result-service.cjs');

test('calculateAndStoreResult persists a sanitized pair result behind an opaque slug', async () => {
  let inserted;
  const store = {
    insertResult: async (record) => {
      inserted = record;
      return { ...record, id: 'result-id' };
    },
  };

  const response = await calculateAndStoreResult(
    {
      mode: 'pair',
      relationshipType: 'love',
      people: [
        { id: 'one', name: 'Alex', birthDate: '1990-03-21' },
        { id: 'two', name: 'Jordan', birthDate: '1992-09-23' },
      ],
    },
    store,
    () => 'private-share-token',
  );

  assert.equal(response.resultId, 'result-id');
  assert.equal(response.shareSlug, 'private-share-token');
  assert.equal(inserted.mode, 'pair');
  assert.equal(inserted.result_payload.people[0].birthDate, undefined);
  assert.equal(JSON.stringify(inserted).includes('1990-03-21'), false);
});

test('calculateAndStoreResult makes group mode friendship-only', async () => {
  const store = {
    insertResult: async (record) => ({ ...record, id: 'group-result' }),
  };

  const response = await calculateAndStoreResult(
    {
      mode: 'group',
      relationshipType: 'love',
      people: [
        { id: 'one', name: 'Alex', birthDate: '1990-03-21' },
        { id: 'two', name: 'Jordan', birthDate: '1992-09-23' },
        { id: 'three', name: 'Morgan', birthDate: '1993-12-22' },
      ],
    },
    store,
    () => 'group-share-token',
  );

  assert.equal(response.result.relationshipType, 'friendship');
  assert.equal(response.result.pairs.length, 3);
});

test('getSharedResult rejects missing and expired records', async () => {
  await assert.rejects(
    () => getSharedResult('missing', { findResultBySlug: async () => null }),
    /not found/i,
  );

  await assert.rejects(
    () => getSharedResult('expired', {
      findResultBySlug: async () => ({
        result_payload: { mode: 'pair' },
        expires_at: '2000-01-01T00:00:00.000Z',
      }),
    }),
    /expired/i,
  );
});
