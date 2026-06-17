const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const productionApiModules = [
  'api/calculate-result.js',
  'api/create-checkout-session.js',
  'api/purchase-status.js',
  'api/report.js',
  'api/result.js',
  'api/retry-failed-reports.js',
  'api/subscribe.js',
  'api/unsubscribe.js',
  'api/webhook.js',
];

test('production API modules load before deployment', () => {
  for (const modulePath of productionApiModules) {
    assert.doesNotThrow(
      () => require(path.join(root, modulePath)),
      `${modulePath} should load without syntax or module initialization errors`,
    );
  }
});
