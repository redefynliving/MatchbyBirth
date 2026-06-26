const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createUnsubscribeToken,
  subscribeEmail,
  unsubscribeEmail,
  verifyUnsubscribeToken,
} = require('../api/_lib/subscription-service.cjs');

test('unsubscribe tokens are normalized, scoped, and reject tampering', () => {
  const token = createUnsubscribeToken(' Person@Example.com ', 'token-secret');

  assert.equal(
    verifyUnsubscribeToken('person@example.com', token, 'token-secret'),
    true,
  );
  assert.equal(
    verifyUnsubscribeToken('other@example.com', token, 'token-secret'),
    false,
  );
  assert.equal(
    verifyUnsubscribeToken('person@example.com', `${token}x`, 'token-secret'),
    false,
  );
});

test('subscribeEmail stores consent and sends a welcome email with an unsubscribe link', async () => {
  let storedSubscriber;
  let welcomeInput;
  const response = await subscribeEmail(
    {
      email: ' Person@Example.com ',
      resultId: 'result-id',
      consentSource: 'result_updates',
    },
    {
      appUrl: 'https://matchbybirth.com',
      tokenSecret: 'token-secret',
      now: () => '2026-06-12T12:00:00.000Z',
      store: {
        upsertSubscriber: async (record) => {
          storedSubscriber = record;
          return record;
        },
      },
      sendWelcomeEmail: async (input) => {
        welcomeInput = input;
        return { id: 'welcome-email-id' };
      },
    },
  );

  assert.deepEqual(storedSubscriber, {
    email: 'person@example.com',
    result_id: 'result-id',
    consent_source: 'result_updates',
    consented_at: '2026-06-12T12:00:00.000Z',
    unsubscribed_at: null,
  });
  assert.equal(response.email, 'person@example.com');
  assert.equal(response.welcomeEmailSent, true);
  assert.equal(welcomeInput.to, 'person@example.com');
  assert.match(welcomeInput.unsubscribeUrl, /^https:\/\/matchbybirth\.com\/unsubscribe\?/);
  assert.match(welcomeInput.unsubscribeUrl, /email=person%40example\.com/);
  assert.match(welcomeInput.unsubscribeUrl, /token=/);
  assert.match(welcomeInput.idempotencyKey, /^subscriber-welcome\//);
});

test('subscribeEmail keeps the subscription when welcome delivery fails', async () => {
  let stored = false;
  let reportedError;
  const response = await subscribeEmail(
    {
      email: 'person@example.com',
      consentSource: 'website',
    },
    {
      appUrl: 'https://matchbybirth.com',
      tokenSecret: 'token-secret',
      store: {
        upsertSubscriber: async () => {
          stored = true;
        },
      },
      sendWelcomeEmail: async () => {
        throw new Error('Resend unavailable');
      },
      onEmailError: (error) => {
        reportedError = error;
      },
    },
  );

  assert.equal(stored, true);
  assert.equal(response.welcomeEmailSent, false);
  assert.equal(reportedError.message, 'Resend unavailable');
});

test('unsubscribeEmail requires a valid token and records the unsubscribe time', async () => {
  let update;
  const email = 'person@example.com';
  const token = createUnsubscribeToken(email, 'token-secret');

  const response = await unsubscribeEmail(
    { email, token },
    {
      tokenSecret: 'token-secret',
      now: () => '2026-06-12T13:00:00.000Z',
      store: {
        updateSubscriberByEmail: async (subscriberEmail, values) => {
          update = { subscriberEmail, values };
          return { email: subscriberEmail, ...values };
        },
      },
    },
  );

  assert.deepEqual(update, {
    subscriberEmail: email,
    values: { unsubscribed_at: '2026-06-12T13:00:00.000Z' },
  });
  assert.deepEqual(response, { email, unsubscribed: true });

  await assert.rejects(
    () => unsubscribeEmail(
      { email, token: 'invalid-token' },
      {
        tokenSecret: 'token-secret',
        store: { updateSubscriberByEmail: async () => {} },
      },
    ),
    /invalid unsubscribe link/i,
  );
});
