const test = require('node:test');
const assert = require('node:assert/strict');

const { sendReportEmail } = require('../api/lib/email-service.cjs');

test('sendReportEmail escapes report content and sends an idempotency key', async () => {
  let request;
  const fakeFetch = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => ({ id: 'email-id' }),
    };
  };

  const response = await sendReportEmail(
    {
      to: 'buyer@example.com',
      reportUrl: 'https://matchbybirth.com/report?purchase=1&token=secret',
      idempotencyKey: 'report-delivery/purchase-id',
      report: {
        title: '<Alex> & Jordan',
        overview: 'Overview',
        sections: [{ title: 'Strengths', body: '<script>alert(1)</script>' }],
        closing: 'Closing',
      },
    },
    { apiKey: 'resend-key', fetchImpl: fakeFetch },
  );

  assert.equal(response.id, 'email-id');
  assert.equal(request.options.headers['Idempotency-Key'], 'report-delivery/purchase-id');
  assert.equal(request.options.body.includes('<script>'), false);
  assert.equal(request.options.body.includes('&lt;script&gt;'), true);
});
