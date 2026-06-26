const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const productionApiModules = [
  'api/index.js',
  'api/lib/calculate-result.js',
  'api/lib/create-checkout-session.js',
  'api/lib/purchase-status.js',
  'api/lib/report.js',
  'api/lib/result.js',
  'api/lib/retry-failed-reports.js',
  'api/lib/subscribe.js',
  'api/lib/unsubscribe.js',
  'api/lib/webhook.js',
  'api/lib/places.js',
];

test('production API modules load before deployment', () => {
  for (const modulePath of productionApiModules) {
    assert.doesNotThrow(
      () => require(path.join(root, modulePath)),
      `${modulePath} should load without syntax or module initialization errors`,
    );
  }
});
