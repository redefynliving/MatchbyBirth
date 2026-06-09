const test = require('node:test');
const assert = require('node:assert/strict');

const { processStripeEvent } = require('../api/lib/webhook-service.cjs');

test('processStripeEvent fulfills a completed checkout once', async () => {
  const updates = [];
  let fulfilledPurchase;
  const store = {
    claimWebhookEvent: async () => true,
    updatePurchase: async (id, values) => updates.push({ id, values }),
    completeWebhookEvent: async (id, values) => updates.push({ id, values }),
  };
  const event = {
    id: 'evt_1',
    type: 'checkout.session.completed',
    data: {
      object: {
        payment_status: 'paid',
        payment_intent: 'pi_1',
        metadata: { purchase_id: 'purchase-id' },
      },
    },
  };

  const response = await processStripeEvent(event, {
    store,
    fulfillPurchase: async (purchaseId) => {
      fulfilledPurchase = purchaseId;
    },
  });

  assert.equal(response, 'processed');
  assert.equal(fulfilledPurchase, 'purchase-id');
  assert.equal(
    updates.some((update) => update.id === 'purchase-id' && update.values.status === 'paid'),
    true,
  );
});

test('processStripeEvent skips an event already claimed', async () => {
  let fulfilled = false;
  const response = await processStripeEvent(
    {
      id: 'evt_duplicate',
      type: 'checkout.session.completed',
      data: { object: { metadata: { purchase_id: 'purchase-id' } } },
    },
    {
      store: { claimWebhookEvent: async () => false },
      fulfillPurchase: async () => {
        fulfilled = true;
      },
    },
  );

  assert.equal(response, 'duplicate');
  assert.equal(fulfilled, false);
});
