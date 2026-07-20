'use strict';

const crypto = require('node:crypto');

const {
  normalizeClarityGoal,
  normalizeReportFocus,
} = require('../../shared/report-evidence.cjs');

class CheckoutError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'CheckoutError';
    this.statusCode = statusCode;
  }
}

function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase().slice(0, 254);
  const atIndex = email.indexOf('@');
  const dotIndex = email.indexOf('.', atIndex + 2);
  const hasWhitespace = [...email].some((character) => character.trim() === '');
  if (
    atIndex <= 0 ||
    atIndex !== email.lastIndexOf('@') ||
    dotIndex <= atIndex + 1 ||
    dotIndex === email.length - 1 ||
    hasWhitespace
  ) {
    throw new CheckoutError('Enter a valid email address.');
  }
  return email;
}

function validateCheckoutInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new CheckoutError('Invalid checkout request body.');
  }
  return input;
}

const REPORT_OFFERS = {
  standard: {
    amountCents: 999,
    name: 'Match by Birth compatibility report',
    description: 'Private compatibility report delivered by email.',
  },
  deep_synastry: {
    amountCents: 999,
    name: 'Match by Birth Deep Synastry report',
    description: 'Private timed synastry report with calculated aspect evidence.',
  },
};

async function buildReportLineItem(stripe, priceId, offer = REPORT_OFFERS.standard) {
  if (priceId.startsWith('price_')) {
    return [{ price: priceId, quantity: 1 }];
  }

  if (!priceId.startsWith('prod_')) {
    throw new CheckoutError('Stripe report pricing must be a price ID or product ID.', 500);
  }

  if (!stripe?.products?.retrieve) {
    throw new CheckoutError('Stripe product lookup is unavailable.', 500);
  }

  const product = await stripe.products.retrieve(priceId);
  if (!product) {
    throw new CheckoutError('Stripe product not found.', 404);
  }

  return [{
    price_data: {
      currency: 'usd',
      unit_amount: offer.amountCents,
      product_data: {
        name: product.name || offer.name,
        description: product.description || offer.description,
      },
    },
    quantity: 1,
  }];
}

async function createCheckout(input, dependencies) {
  validateCheckoutInput(input);
  const {
    store,
    stripe,
    appUrl,
    priceId,
  } = dependencies;
  if (!appUrl || !priceId) {
    throw new CheckoutError('Checkout is not configured.', 500);
  }

  const resultId = String(input?.resultId || '').trim();
  const email = normalizeEmail(input?.email);
  if (!resultId) throw new CheckoutError('Result is required.');

  const result = await store.findResultById(resultId);
  if (!result) throw new CheckoutError('Result not found.', 404);
  if (result.mode !== 'pair') {
    throw new CheckoutError('Paid reports are currently available for pair reports only.');
  }

  const reportType = String(input?.reportType || 'standard').trim();
  if (!Object.hasOwn(REPORT_OFFERS, reportType)) {
    throw new CheckoutError('Unknown report type.');
  }
  if (
    reportType === 'deep_synastry'
    && (
      result.result_payload?.calculationMode !== 'full-synastry'
      || !Array.isArray(result.result_payload?.synastry?.evidence)
      || result.result_payload.synastry.evidence.length === 0
    )
  ) {
    throw new CheckoutError('Deep Synastry requires a full timed synastry result.');
  }
  const offer = REPORT_OFFERS[reportType];
  const existingContext = result.result_payload?.reportContext || {};
  const reportFocus = normalizeReportFocus(existingContext.focus || input?.reportFocus);
  const clarityGoal = normalizeClarityGoal(
    reportFocus,
    input?.clarityGoal || existingContext.clarityGoal,
  );
  const nextPayload = {
    ...(result.result_payload || {}),
    reportContext: {
      ...existingContext,
      focus: reportFocus,
      clarityGoal,
      reportType,
    },
  };

  if (typeof store.insertResult !== 'function') {
    throw new CheckoutError('Purchase storage is unavailable.', 500);
  }

  const purchaseResultRecord = {
    share_slug: `purchase-${crypto.randomUUID()}`,
    mode: result.mode,
    relationship_type: result.relationship_type
      || result.result_payload?.relationshipType
      || 'love',
    result_payload: nextPayload,
  };
  if (result.expires_at) {
    purchaseResultRecord.expires_at = result.expires_at;
  }
  const purchaseResult = await store.insertResult(purchaseResultRecord);
  if (!purchaseResult?.id) {
    throw new CheckoutError('Unable to preserve this report selection.', 500);
  }

  const purchase = await store.insertPurchase({
    result_id: purchaseResult.id,
    email,
    amount_cents: offer.amountCents,
    currency: 'usd',
    status: 'checkout_created',
  });

  let session;
  try {
    const lineItems = await buildReportLineItem(stripe, priceId, offer);

    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      allow_promotion_codes: true,
      success_url: new URL(
        '/report-success?session_id={CHECKOUT_SESSION_ID}',
        appUrl,
      ).toString(),
      cancel_url: new URL(
        `/result?share=${encodeURIComponent(result.share_slug)}`,
        appUrl,
      ).toString(),
      metadata: {
        purchase_id: purchase.id,
        result_id: purchaseResult.id,
        report_type: reportType,
        report_focus: reportFocus,
        clarity_goal: clarityGoal,
        marketing_consent: input?.marketingConsent === true ? 'true' : 'false',
      },
    }, { idempotencyKey: `report-checkout:${purchase.id}` });

    await store.updatePurchase(purchase.id, {
      stripe_checkout_session_id: session.id,
    });
  } catch (error) {
    await store.updatePurchase(purchase.id, {
      last_error: 'Stripe checkout session creation failed.',
      updated_at: new Date().toISOString(),
    });
    throw error;
  }


  return {
    purchaseId: purchase.id,
    sessionId: session.id,
    url: session.url,
  };
}

async function createSubscriptionCheckout(input, dependencies) {
  validateCheckoutInput(input);
  const {
    store,
    stripe,
    appUrl,
    priceId,
  } = dependencies;
  if (!appUrl || !priceId) {
    throw new CheckoutError('Subscription checkout is not configured.', 500);
  }
  if (!priceId.startsWith('price_')) {
    throw new CheckoutError('Subscription checkout requires a Stripe price ID.', 500);
  }

  const email = normalizeEmail(input?.email);
  const resultId = String(input?.resultId || '').trim();

  if (resultId) {
    const result = await store.findResultById(resultId);
    if (!result) throw new CheckoutError('Result not found.', 404);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: new URL('/premium?subscribed=1', appUrl).toString(),
    cancel_url: new URL('/premium?subscribed=0', appUrl).toString(),
    metadata: {
      checkout_type: 'subscription',
      email,
      result_id: resultId || '',
    },
    subscription_data: {
      metadata: {
        checkout_type: 'subscription',
        email,
        result_id: resultId || '',
      },
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

module.exports = {
  REPORT_OFFERS,
  CheckoutError,
  createCheckout,
  createSubscriptionCheckout,
  normalizeEmail,
  validateCheckoutInput,
};
