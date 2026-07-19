const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const productionApiModules = [
  'api/index.js',
  'api/backend.cjs',
  'api/_lib/calculate-result.js',
  'api/_lib/create-checkout-session.js',
  'api/_lib/create-subscription-checkout.js',
  'api/_lib/funnel-summary.js',
  'api/_lib/purchase-status.js',
  'api/_lib/report.js',
  'api/_lib/result.js',
  'api/_lib/retry-failed-reports.js',
  'api/_lib/subscribe.js',
  'api/_lib/track-event.js',
  'api/_lib/unsubscribe.js',
  'api/_lib/webhook.js',
  'api/_lib/places.js',
];

test('production API modules load before deployment', () => {
  for (const modulePath of productionApiModules) {
    assert.doesNotThrow(() => require(path.join(root, modulePath)), `${modulePath} should load without syntax or module initialization errors`);
  }
});

test('apps API declares dependencies required by its production bridge', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'apps/api/package.json'), 'utf8'));
  assert.match(packageJson.dependencies.stripe, /^\^22\./);
});

test('production API router uses static handler imports for Vercel bundling', () => {
  const source = fs.readFileSync(path.join(root, 'api/index.js'), 'utf8');
  assert.match(source, /\(\) => require\('.*_lib\/subscribe\.js'\)/);
  assert.match(source, /\(\) => require\('.*_lib\/unsubscribe\.js'\)/);
  assert.doesNotMatch(source, /'\/api\/subscribe': require\(/);
  assert.doesNotMatch(source, /require\(targetModule\)/);
});

test('backend bridge normalizes env without conflating report and subscription prices', () => {
  const { getCheckoutConfig } = require('../api/backend.cjs');
  const env = { APP_URL: ' https://matchbybirth.com ', STRIPE_PRICE_ID: 'price_report', STRIPE_SUBSCRIPTION_PRICE_ID: 'price_subscription' };
  assert.equal(getCheckoutConfig('report', env).priceId, 'price_report');
  assert.equal(getCheckoutConfig('subscription', env).priceId, 'price_subscription');
  assert.equal(getCheckoutConfig('report', env).appUrl, 'https://matchbybirth.com');
});

test('apps API uses one CommonJS bridge instead of route-level createRequire calls', () => {
  const calculateRoute = fs.readFileSync(path.join(root, 'apps/api/src/routes/calculate-result.js'), 'utf8');
  const checkoutRoute = fs.readFileSync(path.join(root, 'apps/api/src/routes/create-subscription-checkout.js'), 'utf8');
  const bridge = fs.readFileSync(path.join(root, 'apps/api/src/backend-bridge.js'), 'utf8');
  assert.doesNotMatch(calculateRoute, /createRequire/);
  assert.doesNotMatch(checkoutRoute, /createRequire/);
  assert.match(bridge, /createRequire/);
});
