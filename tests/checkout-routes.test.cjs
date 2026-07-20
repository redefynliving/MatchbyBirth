const test = require('node:test');
const assert = require('node:assert/strict');

const { createReportCheckoutHandler, createSubscriptionCheckoutHandler } = require('../api/backend.cjs');

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('report checkout route rejects an invalid request body safely', async () => {
  const handler = createReportCheckoutHandler({
    env: { APP_URL: 'https://matchbybirth.com', STRIPE_SECRET_KEY: 'sk_test', STRIPE_PRICE_ID: 'price_report' },
    stripe: {}, store: {}, logger: { error() {} },
  });
  const res = responseRecorder();
  await handler({ method: 'POST', body: [] }, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { ok: false, error: 'invalid_request' });
});

test('subscription checkout route never exposes unexpected internal errors', async () => {
  const handler = createSubscriptionCheckoutHandler({
    env: { APP_URL: 'https://matchbybirth.com', STRIPE_SECRET_KEY: 'sk_test', STRIPE_SUBSCRIPTION_PRICE_ID: 'price_subscription' },
    stripe: { checkout: { sessions: { create: async () => { throw new Error('database password leaked'); } } } },
    store: {}, logger: { error() {} },
  });
  const res = responseRecorder();
  await handler({ method: 'POST', body: { email: 'buyer@example.com' } }, res);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.payload, { ok: false, error: 'checkout_unavailable' });
});

test('live checkout is gated until Match by Birth branding is explicitly verified', async () => {
  const handler = createReportCheckoutHandler({
    env: {
      APP_URL: 'https://matchbybirth.com',
      STRIPE_SECRET_KEY: 'sk_live_example',
      STRIPE_PRICE_ID: 'price_report',
      STRIPE_MERCHANT_NAME: 'enset',
      STRIPE_LIVE_CHECKOUT_ENABLED: 'true',
    },
    stripe: {},
    store: {},
    logger: { error() {} },
  });
  const res = responseRecorder();

  await handler({ method: 'POST', body: {} }, res);

  assert.equal(res.statusCode, 503);
  assert.match(res.payload.error, /Match by Birth Stripe branding/i);
});
