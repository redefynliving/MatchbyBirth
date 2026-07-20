const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateAndStoreResult,
  calculateResultWithOptionalStorage,
  getSharedResult,
  ResultServiceError,
} = require('../api/_lib/result-service.cjs');

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
  assert.equal(inserted.result_payload.people[0].moon.precision, 'date-only');
  assert.equal(typeof inserted.result_payload.people[0].lifePath.number, 'number');
  assert.equal(JSON.stringify(inserted).includes('1990-03-21'), false);
});

test('calculateAndStoreResult persists the calculator report focus and clarity goal', async () => {
  let inserted;
  const store = {
    insertResult: async (record) => {
      inserted = record;
      return { ...record, id: 'moon-result-id' };
    },
  };

  await calculateAndStoreResult(
    {
      mode: 'pair',
      relationshipType: 'love',
      reportFocus: 'moon_sign',
      clarityGoal: 'emotional_distance',
      people: [
        { id: 'one', name: 'Alex', birthDate: '1990-03-21' },
        { id: 'two', name: 'Jordan', birthDate: '1992-09-23' },
      ],
    },
    store,
    () => 'moon-share-token',
  );

  assert.deepEqual(inserted.result_payload.reportContext, {
    focus: 'moon_sign',
    clarityGoal: 'emotional_distance',
  });
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

test('calculateResultWithOptionalStorage returns a usable result without database configuration', async () => {
  const response = await calculateResultWithOptionalStorage(
    {
      mode: 'pair',
      relationshipType: 'love',
      people: [
        { id: 'one', name: 'Alijah', birthDate: '2001-08-15' },
        { id: 'two', name: 'Eddie', birthDate: '1980-01-18' },
      ],
    },
    {
      isConfigured: () => false,
      insertResult: async () => {
        throw new Error('storage should not be called');
      },
    },
  );

  assert.equal(response.persisted, false);
  assert.equal(response.resultId, null);
  assert.equal(response.shareSlug, null);
  assert.equal(response.result.mode, 'pair');
  assert.equal(JSON.stringify(response).includes('2001-08-15'), false);
});

test('calculateResultWithOptionalStorage reports invalid calculator input as a 400', async () => {
  await assert.rejects(
    () => calculateResultWithOptionalStorage(
      {
        mode: 'pair',
        relationshipType: 'love',
        people: [
          { id: 'one', name: 'Alex', birthDate: '' },
          { id: 'two', name: 'Jordan', birthDate: '1992-09-23' },
        ],
      },
      {
        isConfigured: () => false,
        insertResult: async () => {
          throw new Error('storage should not be called');
        },
      },
    ),
    (error) => (
      error instanceof ResultServiceError
      && error.statusCode === 400
      && /valid birth date/i.test(error.message)
    ),
  );
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
