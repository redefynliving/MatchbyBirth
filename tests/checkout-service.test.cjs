const test = require('node:test');
const assert = require('node:assert/strict');

const { createCheckout, createSubscriptionCheckout } = require('../api/lib/checkout-service.cjs');

test('createCheckout controls price and keeps personal result data out of Stripe metadata', async () => {
  let purchaseRecord;
  let stripePayload;
  let purchaseUpdate;
  let marketingSubscriber;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
      result_payload: {
        mode: 'pair',
        people: [{ name: 'Alex' }, { name: 'Jordan' }],
      },
    }),
    insertPurchase: async (record) => {
      purchaseRecord = record;
      return { ...record, id: 'purchase-id' };
    },
    updatePurchase: async (id, values) => {
      purchaseUpdate = { id, values };
    },
    upsertSubscriber: async () => {},
  };
  const stripe = {
    checkout: {
      sessions: {
        create: async (payload) => {
          stripePayload = payload;
          return { id: 'checkout-id', url: 'https://checkout.stripe.test/session' };
        },
      },
    },
  };

  const response = await createCheckout(
    {
      resultId: 'result-id',
      email: ' Buyer@Example.com ',
      marketingConsent: true,
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',
      subscribeMarketing: async (subscriber) => {
        marketingSubscriber = subscriber;
      },
    },
  );

  assert.equal(response.url, 'https://checkout.stripe.test/session');
  assert.equal(purchaseRecord.email, 'buyer@example.com');
  assert.equal(purchaseRecord.amount_cents, 999);
  assert.deepEqual(stripePayload.line_items, [{ price: 'price_report', quantity: 1 }]);
  assert.deepEqual(stripePayload.metadata, {
    purchase_id: 'purchase-id',
    result_id: 'result-id',
  });
  assert.equal(JSON.stringify(stripePayload.metadata).includes('Alex'), false);
  assert.deepEqual(purchaseUpdate, {
    id: 'purchase-id',
    values: { stripe_checkout_session_id: 'checkout-id' },
  });
  assert.deepEqual(marketingSubscriber, {
    email: 'buyer@example.com',
    resultId: 'result-id',
    consentSource: 'report_checkout',
  });
});

test('createCheckout does not block payment when optional marketing subscription fails', async () => {
  let attemptedSubscription = false;
  let reportedError;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
    }),
    insertPurchase: async (record) => ({ ...record, id: 'purchase-id' }),
    updatePurchase: async () => {},
  };
  const stripe = {
    checkout: {
      sessions: {
        create: async () => ({
          id: 'checkout-id',
          url: 'https://checkout.stripe.test/session',
        }),
      },
    },
  };

  const response = await createCheckout(
    {
      resultId: 'result-id',
      email: 'buyer@example.com',
      marketingConsent: true,
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',
      subscribeMarketing: async () => {
        attemptedSubscription = true;
        throw new Error('Welcome delivery failed');
      },
      onMarketingError: (error) => {
        reportedError = error;
      },
    },
  );

  assert.equal(attemptedSubscription, true);
  assert.equal(reportedError.message, 'Welcome delivery failed');
  assert.equal(response.url, 'https://checkout.stripe.test/session');
});

test('createCheckout accepts a configured Stripe product ID', async () => {
  let stripePayload;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
    }),
    insertPurchase: async (record) => ({ ...record, id: 'purchase-id' }),
    updatePurchase: async () => {},
    upsertSubscriber: async () => {},
  };
  const stripe = {
    products: {
      retrieve: async (id) => ({ id, name: 'Deep Reading', description: 'Private compatibility report.' }),
    },
    checkout: {
      sessions: {
        create: async (payload) => {
          stripePayload = payload;
          return { id: 'checkout-id', url: 'https://checkout.stripe.test/session' };
        },
      },
    },
  };

  await createCheckout(
    { resultId: 'result-id', email: 'buyer@example.com' },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'prod_report',
    },
  );

  assert.deepEqual(stripePayload.line_items, [{
    price_data: {
      currency: 'usd',
      unit_amount: 999,
      product_data: {
        name: 'Deep Reading',
        description: 'Private compatibility report.',
      },
    },
    quantity: 1,
  }]);
});

test('createSubscriptionCheckout requires a Stripe price ID', async () => {
  await assert.rejects(
    () => createSubscriptionCheckout(
      { email: 'buyer@example.com' },
      {
        store: { findResultById: async () => null },
        stripe: {
          checkout: {
            sessions: {
              create: async () => ({ id: 'checkout-id', url: 'https://checkout.stripe.test/session' }),
            },
          },
        },
        appUrl: 'https://matchbybirth.com',
        priceId: 'prod_subscription',
      },
    ),
    /price ID/i,
  );
});

test('createCheckout rejects group reports and invalid email addresses', async () => {
  const groupStore = {
    findResultById: async () => ({ id: 'group-id', mode: 'group' }),
  };

  await assert.rejects(
    () => createCheckout(
      { resultId: 'group-id', email: 'buyer@example.com' },
      {
        store: groupStore,
        stripe: {},
        appUrl: 'https://matchbybirth.com',
        priceId: 'price_report',
      },
    ),
    /pair reports/i,
  );

  await assert.rejects(
    () => createCheckout(
      { resultId: 'result-id', email: 'invalid' },
      {
        store: groupStore,
        stripe: {},
        appUrl: 'https://matchbybirth.com',
        priceId: 'price_report',
      },
    ),
    /valid email/i,
  );
});
