const test = require('node:test');
const assert = require('node:assert/strict');

const { createSubscribeHandler } = require('../api/lib/subscribe.js');
const { createUnsubscribeHandler } = require('../api/lib/unsubscribe.js');

function createResponse() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

test('subscribe API requires explicit consent', async () => {
  let called = false;
  const handler = createSubscribeHandler({
    subscribeEmail: async () => {
      called = true;
    },
  });
  const response = createResponse();

  await handler({
    method: 'POST',
    body: { email: 'person@example.com' },
  }, response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.error, 'Consent is required.');
  assert.equal(called, false);
});

test('subscribe API reports whether the welcome email was sent', async () => {
  let input;
  const handler = createSubscribeHandler({
    subscribeEmail: async (value) => {
      input = value;
      return {
        email: 'person@example.com',
        welcomeEmailSent: false,
      };
    },
  });
  const response = createResponse();

  await handler({
    method: 'POST',
    body: {
      email: 'Person@Example.com',
      resultId: 'result-id',
      consent: true,
      consentSource: 'result_updates',
    },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    success: true,
    welcomeEmailSent: false,
  });
  assert.deepEqual(input, {
    email: 'Person@Example.com',
    resultId: 'result-id',
    consentSource: 'result_updates',
  });
});

test('unsubscribe API rejects an invalid token', async () => {
  const error = new Error('Invalid unsubscribe link.');
  error.statusCode = 400;
  const handler = createUnsubscribeHandler({
    unsubscribeEmail: async () => {
      throw error;
    },
  });
  const response = createResponse();

  await handler({
    method: 'POST',
    body: {
      email: 'person@example.com',
      token: 'invalid',
    },
  }, response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.error, 'Invalid unsubscribe link.');
});

test('unsubscribe API records a valid request', async () => {
  let input;
  const handler = createUnsubscribeHandler({
    unsubscribeEmail: async (value) => {
      input = value;
      return { email: value.email, unsubscribed: true };
    },
  });
  const response = createResponse();

  await handler({
    method: 'POST',
    body: {
      email: 'person@example.com',
      token: 'valid-token',
    },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    success: true,
    unsubscribed: true,
  });
  assert.deepEqual(input, {
    email: 'person@example.com',
    token: 'valid-token',
  });
});
