const test = require('node:test');
const assert = require('node:assert/strict');

const { processStripeEvent } = require('../api/_lib/webhook-service.cjs');

test('processStripeEvent fulfills a completed paid checkout once', async () => {
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
    data: { object: { payment_status: 'paid', payment_intent: 'pi_1', metadata: { purchase_id: 'purchase-id' } } },
  };

  const response = await processStripeEvent(event, {
    store,
    fulfillPurchase: async (purchaseId) => { fulfilledPurchase = purchaseId; },
  });

  assert.equal(response, 'processed');
  assert.equal(fulfilledPurchase, 'purchase-id');
  assert.equal(updates.some((update) => update.id === 'purchase-id' && update.values.status === 'paid'), true);
});

test('processStripeEvent skips an event already claimed', async () => {
  let fulfilled = false;
  const response = await processStripeEvent(
    { id: 'evt_duplicate', type: 'checkout.session.completed', data: { object: { metadata: { purchase_id: 'purchase-id' } } } },
    { store: { claimWebhookEvent: async () => false }, fulfillPurchase: async () => { fulfilled = true; } },
  );

  assert.equal(response, 'duplicate');
  assert.equal(fulfilled, false);
});

test('processStripeEvent does not fulfill an unpaid completed checkout', async () => {
  let fulfilled = false;
  const completions = [];
  const response = await processStripeEvent(
    { id: 'evt_unpaid', type: 'checkout.session.completed', data: { object: { payment_status: 'unpaid', metadata: { purchase_id: 'purchase-id' } } } },
    {
      store: {
        claimWebhookEvent: async () => true,
        completeWebhookEvent: async (id, values) => completions.push({ id, values }),
      },
      fulfillPurchase: async () => { fulfilled = true; },
    },
  );

  assert.equal(response, 'payment_pending');
  assert.equal(fulfilled, false);
  assert.equal(completions[0].values.status, 'ignored');
});

test('processStripeEvent performs consented marketing opt-in only after payment', async () => {
  let subscriber;
  await processStripeEvent(
    {
      id: 'evt_paid_consent',
      type: 'checkout.session.completed',
      data: {
        object: {
          payment_status: 'paid',
          customer_email: 'buyer@example.com',
          metadata: { purchase_id: 'purchase-id', result_id: 'result-id', marketing_consent: 'true' },
        },
      },
    },
    {
      store: { claimWebhookEvent: async () => true, updatePurchase: async () => {}, completeWebhookEvent: async () => {} },
      fulfillPurchase: async () => {},
      subscribeMarketing: async (input) => { subscriber = input; },
    },
  );

  assert.deepEqual(subscriber, {
    email: 'buyer@example.com',
    resultId: 'result-id',
    consentSource: 'report_checkout_paid',
  });
});
