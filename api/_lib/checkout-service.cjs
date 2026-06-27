'use strict';

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

async function buildReportLineItem(stripe, priceId) {
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
      unit_amount: 999,
      product_data: {
        name: product.name || 'Match by Birth report',
        description: product.description || 'Private compatibility report delivered by email.',
      },
    },
    quantity: 1,
  }];
}

async function createCheckout(input, dependencies) {
  const {
    store,
    stripe,
    appUrl,
    priceId,
    subscribeMarketing,
    onMarketingError = () => {},
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

  const purchase = await store.insertPurchase({
    result_id: result.id,
    email,
    amount_cents: 999,
    currency: 'usd',
    status: 'checkout_created',
  });

  let session;
  try {
    const lineItems = await buildReportLineItem(stripe, priceId);

    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
        result_id: result.id,
      },
    });

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

  if (input?.marketingConsent === true && subscribeMarketing) {
    try {
      await subscribeMarketing({
        email,
        resultId: result.id,
        consentSource: 'report_checkout',
      });
    } catch (error) {
      onMarketingError(error);
    }
  }

  return {
    purchaseId: purchase.id,
    sessionId: session.id,
    url: session.url,
  };
}

async function createSubscriptionCheckout(input, dependencies) {
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
  CheckoutError,
  createCheckout,
  createSubscriptionCheckout,
  normalizeEmail,
};
