'use strict';

const crypto = require('node:crypto');
const { normalizeEmail } = require('./checkout-service.cjs');

class SubscriptionError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'SubscriptionError';
    this.statusCode = statusCode;
  }
}

function createUnsubscribeToken(email, secret) {
  if (!secret) throw new Error('Unsubscribe token secret is not configured.');
  const normalizedEmail = normalizeEmail(email);
  return crypto
    .createHmac('sha256', secret)
    .update(`unsubscribe:${normalizedEmail}`)
    .digest('base64url');
}

function verifyUnsubscribeToken(email, token, secret) {
  if (!email || !token || !secret) return false;

  try {
    const expected = createUnsubscribeToken(email, secret);
    const actualBuffer = Buffer.from(String(token));
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

function createWelcomeIdempotencyKey(email) {
  const subscriberHash = crypto
    .createHash('sha256')
    .update(email)
    .digest('hex')
    .slice(0, 24);
  return `subscriber-welcome/${subscriberHash}`;
}

async function subscribeEmail(input, dependencies) {
  const {
    appUrl,
    tokenSecret,
    store,
    sendWelcomeEmail,
    now = () => new Date().toISOString(),
    onEmailError = () => {},
  } = dependencies;
  const email = normalizeEmail(input?.email);
  const resultId = String(input?.resultId || '').trim() || null;
  const consentSource = String(input?.consentSource || 'website').slice(0, 80);

  await store.upsertSubscriber({
    email,
    result_id: resultId,
    consent_source: consentSource,
    consented_at: now(),
    unsubscribed_at: null,
  });

  try {
    if (!appUrl) throw new Error('Application URL is not configured.');
    const unsubscribeUrl = new URL('/unsubscribe', appUrl);
    unsubscribeUrl.searchParams.set('email', email);
    unsubscribeUrl.searchParams.set(
      'token',
      createUnsubscribeToken(email, tokenSecret),
    );

    await sendWelcomeEmail({
      to: email,
      unsubscribeUrl: unsubscribeUrl.toString(),
      idempotencyKey: createWelcomeIdempotencyKey(email),
    });

    return { email, welcomeEmailSent: true };
  } catch (error) {
    onEmailError(error);
    return { email, welcomeEmailSent: false };
  }
}

async function unsubscribeEmail(input, dependencies) {
  const {
    tokenSecret,
    store,
    now = () => new Date().toISOString(),
  } = dependencies;
  const email = normalizeEmail(input?.email);
  const token = String(input?.token || '');

  if (!verifyUnsubscribeToken(email, token, tokenSecret)) {
    throw new SubscriptionError('Invalid unsubscribe link.');
  }

  await store.updateSubscriberByEmail(email, {
    unsubscribed_at: now(),
  });
  return { email, unsubscribed: true };
}

module.exports = {
  SubscriptionError,
  createUnsubscribeToken,
  subscribeEmail,
  unsubscribeEmail,
  verifyUnsubscribeToken,
};
