'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  refreshRetryablePurchase,
} = require('../api/lib/purchase-status-service.cjs');

test('refreshRetryablePurchase retries a failed delivery and returns fresh status', async () => {
  const calls = [];
  const refreshed = { id: 'purchase-1', status: 'delivered', delivery_attempts: 2 };

  const result = await refreshRetryablePurchase(
    {
      id: 'purchase-1',
      status: 'failed',
      delivery_attempts: 1,
    },
    'cs_test_123',
    {
      fulfillPurchase: async (purchaseId) => {
        calls.push(['fulfill', purchaseId]);
      },
      store: {
        findPurchaseBySessionId: async (sessionId) => {
          calls.push(['find', sessionId]);
          return refreshed;
        },
      },
    },
  );

  assert.deepEqual(calls, [
    ['fulfill', 'purchase-1'],
    ['find', 'cs_test_123'],
  ]);
  assert.equal(result, refreshed);
});

test('refreshRetryablePurchase leaves active and exhausted purchases unchanged', async () => {
  let fulfillmentCalls = 0;
  const dependencies = {
    fulfillPurchase: async () => {
      fulfillmentCalls += 1;
    },
    store: {
      findPurchaseBySessionId: async () => {
        throw new Error('should not refetch');
      },
    },
  };

  const generating = { id: 'purchase-1', status: 'generating', delivery_attempts: 1 };
  const exhausted = { id: 'purchase-2', status: 'failed', delivery_attempts: 5 };

  assert.equal(
    await refreshRetryablePurchase(generating, 'cs_one', dependencies),
    generating,
  );
  assert.equal(
    await refreshRetryablePurchase(exhausted, 'cs_two', dependencies),
    exhausted,
  );
  assert.equal(fulfillmentCalls, 0);
});
