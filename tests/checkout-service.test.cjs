const test = require('node:test');
const assert = require('node:assert/strict');

const { createCheckout, createSubscriptionCheckout } = require('../api/_lib/checkout-service.cjs');

test('createCheckout controls price and keeps personal result data out of Stripe metadata', async () => {
  let purchaseRecord;
  let purchaseResultRecord;
  let stripePayload;
  let purchaseUpdate;

  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
      result_payload: {
        mode: 'pair',
        people: [{ name: 'Alex' }, { name: 'Jordan' }],
        reportContext: { focus: 'crush', clarityGoal: 'mixed_signals' },
      },
    }),
    insertResult: async (record) => {
      purchaseResultRecord = record;
      return { ...record, id: 'purchase-result-id' };
    },
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
      clarityGoal: 'next_move',
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',

    },
  );

  assert.equal(response.url, 'https://checkout.stripe.test/session');
  assert.equal(purchaseRecord.email, 'buyer@example.com');
  assert.equal(purchaseRecord.result_id, 'purchase-result-id');
  assert.equal(purchaseRecord.report_type, undefined);
  assert.equal(purchaseRecord.report_focus, undefined);
  assert.equal(purchaseRecord.clarity_goal, undefined);
  assert.equal(purchaseRecord.amount_cents, 999);
  assert.match(purchaseResultRecord.share_slug, /^purchase-/);
  assert.equal(purchaseResultRecord.mode, 'pair');
  assert.equal(purchaseResultRecord.relationship_type, 'love');
  assert.deepEqual(purchaseResultRecord.result_payload.reportContext, {
    focus: 'crush',
    clarityGoal: 'next_move',
    reportType: 'standard',
  });
  assert.deepEqual(stripePayload.line_items, [{ price: 'price_report', quantity: 1 }]);
  assert.deepEqual(stripePayload.metadata, {
    purchase_id: 'purchase-id',
    result_id: 'purchase-result-id',
    report_type: 'standard',
    report_focus: 'crush',
    clarity_goal: 'next_move',
    marketing_consent: 'true',
  });
  assert.equal(JSON.stringify(stripePayload.metadata).includes('Alex'), false);
  assert.deepEqual(purchaseUpdate, {
    id: 'purchase-id',
    values: { stripe_checkout_session_id: 'checkout-id' },
  });
});

test('createCheckout preserves the stored calculator edition and normalizes its clarity goal', async () => {
  let stripePayload;
  let purchaseResultRecord;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
      result_payload: {
        mode: 'pair',
        reportContext: { focus: 'moon_sign', clarityGoal: 'reassurance' },
      },
    }),
    insertResult: async (record) => {
      purchaseResultRecord = record;
      return { ...record, id: 'purchase-result-id' };
    },
    insertPurchase: async (record) => ({ ...record, id: 'purchase-id' }),
    updatePurchase: async () => {},
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

  await createCheckout(
    {
      resultId: 'result-id',
      email: 'buyer@example.com',
      reportFocus: 'life_path',
      clarityGoal: 'shared_goals',
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',
    },
  );

  assert.equal(stripePayload.metadata.report_focus, 'moon_sign');
  assert.equal(stripePayload.metadata.clarity_goal, 'repair_after_conflict');
  assert.deepEqual(purchaseResultRecord.result_payload.reportContext, {
    focus: 'moon_sign',
    clarityGoal: 'repair_after_conflict',
    reportType: 'standard',
  });
});

test('createCheckout records marketing consent without checkout-time side effects', async () => {
  let stripePayload;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
    }),
    insertResult: async (record) => ({ ...record, id: 'purchase-result-id' }),
    insertPurchase: async (record) => ({ ...record, id: 'purchase-id' }),
    updatePurchase: async () => {},
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
      email: 'buyer@example.com',
      marketingConsent: true,
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',

    },
  );

  assert.equal(stripePayload.metadata.marketing_consent, 'true');
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
    insertResult: async (record) => ({ ...record, id: 'purchase-result-id' }),
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

test('createCheckout creates a distinct Deep Synastry purchase from a full timed result', async () => {
  let purchaseRecord;
  let stripePayload;
  const store = {
    findResultById: async () => ({
      id: 'result-id',
      share_slug: 'share-slug',
      mode: 'pair',
      result_payload: {
        mode: 'pair',
        calculationMode: 'full-synastry',
        synastry: { evidence: [{ label: 'Moon trine Venus (0.5° orb)' }] },
      },
    }),
    insertResult: async (record) => ({ ...record, id: 'purchase-result-id' }),
    insertPurchase: async (record) => {
      purchaseRecord = record;
      return { ...record, id: 'purchase-id' };
    },
    updatePurchase: async () => {},
  };
  const stripe = {
    checkout: {
      sessions: {
        create: async (payload) => {
          stripePayload = payload;
          return { id: 'checkout-id', url: 'https://checkout.stripe.test/deep' };
        },
      },
    },
  };

  const response = await createCheckout(
    {
      resultId: 'result-id',
      email: 'buyer@example.com',
      reportType: 'deep_synastry',
    },
    {
      store,
      stripe,
      appUrl: 'https://matchbybirth.com',
      priceId: 'price_report',
    },
  );

  assert.equal(response.url, 'https://checkout.stripe.test/deep');
  assert.equal(purchaseRecord.result_id, 'purchase-result-id');
  assert.equal(purchaseRecord.amount_cents, 999);
  assert.deepEqual(stripePayload.line_items, [{ price: 'price_report', quantity: 1 }]);
  assert.equal(stripePayload.metadata.report_type, 'deep_synastry');
  assert.equal(stripePayload.payment_method_types, undefined);
});

test('createCheckout rejects Deep Synastry for a date-only result', async () => {
  await assert.rejects(
    () => createCheckout(
      {
        resultId: 'result-id',
        email: 'buyer@example.com',
        reportType: 'deep_synastry',
      },
      {
        store: {
          findResultById: async () => ({
            id: 'result-id',
            share_slug: 'share-slug',
            mode: 'pair',
            result_payload: { mode: 'pair', calculationMode: 'basic-sun' },
          }),
        },
        stripe: {},
        appUrl: 'https://matchbybirth.com',
        priceId: 'price_report',
      },
    ),
    /requires a full timed synastry result/i,
  );
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

test('checkout services reject non-object request bodies', async () => {
  await assert.rejects(
    () => createCheckout('invalid', { store: {}, stripe: {}, appUrl: 'https://matchbybirth.com', priceId: 'price_report' }),
    /request body/i,
  );
  await assert.rejects(
    () => createSubscriptionCheckout([], { store: {}, stripe: {}, appUrl: 'https://matchbybirth.com', priceId: 'price_subscription' }),
    /request body/i,
  );
});

test('createCheckout gives Stripe a stable idempotency key for the purchase', async () => {
  let stripeOptions;
  const store = {
    findResultById: async () => ({ id: 'result-id', share_slug: 'share-slug', mode: 'pair' }),
    insertResult: async (record) => ({ ...record, id: 'purchase-result-id' }),
    insertPurchase: async (record) => ({ ...record, id: 'purchase-id' }),
    updatePurchase: async () => {},
  };
  const stripe = {
    checkout: { sessions: { create: async (_payload, options) => {
      stripeOptions = options;
      return { id: 'checkout-id', url: 'https://checkout.stripe.test/session' };
    } } },
  };

  await createCheckout(
    { resultId: 'result-id', email: 'buyer@example.com' },
    { store, stripe, appUrl: 'https://matchbybirth.com', priceId: 'price_report' },
  );
  assert.deepEqual(stripeOptions, { idempotencyKey: 'report-checkout:purchase-id' });
});
