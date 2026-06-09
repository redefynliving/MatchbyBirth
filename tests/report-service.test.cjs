const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createReportAccess,
  fulfillPurchase,
  verifyReportAccess,
} = require('../api/lib/report-service.cjs');

test('report access tokens are deterministic, signed, and reject tampering', () => {
  const first = createReportAccess('purchase-id', 'test-secret');
  const second = createReportAccess('purchase-id', 'test-secret');

  assert.deepEqual(first, second);
  assert.equal(first.token.length > 30, true);
  assert.equal(verifyReportAccess('purchase-id', first.token, 'test-secret'), true);
  assert.equal(verifyReportAccess('purchase-id', `${first.token}x`, 'test-secret'), false);
  assert.equal(first.tokenHash.includes(first.token), false);
});

test('fulfillPurchase stores one structured report, emails it, and marks delivery', async () => {
  const updates = [];
  let insertedReport;
  let sentEmail;
  const purchase = {
    id: 'purchase-id',
    result_id: 'result-id',
    email: 'buyer@example.com',
    status: 'paid',
    delivery_attempts: 0,
    result: {
      id: 'result-id',
      result_payload: {
        mode: 'pair',
        relationshipType: 'love',
        score: 82,
        people: [{ name: 'Alex', sign: 'Aries' }, { name: 'Jordan', sign: 'Libra' }],
        breakdown: {
          chemistry: 85,
          communication: 80,
          stability: 78,
          growth: 84,
          intuition: 81,
          overall: 82,
        },
      },
    },
  };
  const store = {
    findPurchaseWithResult: async () => purchase,
    updatePurchase: async (id, values) => updates.push({ type: 'purchase', id, values }),
    findReportByPurchaseId: async () => null,
    insertReport: async (record) => {
      insertedReport = record;
      return { ...record, id: 'report-id' };
    },
    updateReport: async (id, values) => updates.push({ type: 'report', id, values }),
    updateResult: async (id, values) => updates.push({ type: 'result', id, values }),
  };

  const response = await fulfillPurchase('purchase-id', {
    store,
    appUrl: 'https://matchbybirth.com',
    tokenSecret: 'test-secret',
    generateReport: async () => ({
      title: 'Alex & Jordan',
      overview: 'A thoughtful overview.',
      sections: [{ key: 'strengths', title: 'Strengths', body: 'Shared momentum.' }],
      closing: 'Use this as a reflection.',
    }),
    sendReportEmail: async (input) => {
      sentEmail = input;
      return { id: 'email-id' };
    },
  });

  assert.equal(response.status, 'delivered');
  assert.equal(insertedReport.purchase_id, 'purchase-id');
  assert.equal(insertedReport.access_token_hash.length, 64);
  assert.equal(sentEmail.idempotencyKey, 'report-delivery/purchase-id');
  assert.match(sentEmail.reportUrl, /purchase=purchase-id/);
  assert.equal(
    updates.some((update) => update.type === 'purchase' && update.values.status === 'delivered'),
    true,
  );
  assert.equal(
    updates.some((update) => update.type === 'result' && update.values.expires_at === null),
    true,
  );
});

test('fulfillPurchase records a retryable failure without throwing away the payment', async () => {
  const updates = [];
  const store = {
    findPurchaseWithResult: async () => ({
      id: 'purchase-id',
      result_id: 'result-id',
      email: 'buyer@example.com',
      status: 'paid',
      delivery_attempts: 2,
      result: { result_payload: { mode: 'pair', people: [], breakdown: {} } },
    }),
    updatePurchase: async (id, values) => updates.push({ id, values }),
    findReportByPurchaseId: async () => null,
  };

  await assert.rejects(
    () => fulfillPurchase('purchase-id', {
      store,
      appUrl: 'https://matchbybirth.com',
      tokenSecret: 'test-secret',
      generateReport: async () => {
        throw new Error('provider unavailable');
      },
      sendReportEmail: async () => ({ id: 'unused' }),
    }),
    /provider unavailable/,
  );

  const failure = updates.at(-1);
  assert.equal(failure.values.status, 'failed');
  assert.equal(failure.values.delivery_attempts, 3);
  assert.equal(failure.values.last_error, 'Report fulfillment failed.');
});
