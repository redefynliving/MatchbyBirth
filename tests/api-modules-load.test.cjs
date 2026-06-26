const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const productionApiModules = [
  'api/index.js',
  'api/_lib/calculate-result.js',
  'api/_lib/create-checkout-session.js',
  'api/_lib/purchase-status.js',
  'api/_lib/report.js',
  'api/_lib/result.js',
  'api/_lib/retry-failed-reports.js',
  'api/_lib/subscribe.js',
  'api/_lib/unsubscribe.js',
  'api/_lib/webhook.js',
  'api/_lib/places.js',
];

test('production API modules load before deployment', () => {
  for (const modulePath of productionApiModules) {
    assert.doesNotThrow(
      () => require(path.join(root, modulePath)),
      `${modulePath} should load without syntax or module initialization errors`,
    );
  }
});
