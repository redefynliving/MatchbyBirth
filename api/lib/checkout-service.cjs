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

async function createCheckout(input, dependencies) {
  const { store, stripe, appUrl, priceId } = dependencies;
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

  if (input?.marketingConsent === true) {
    await store.upsertSubscriber({
      email,
      result_id: result.id,
      consent_source: 'report_checkout',
      consented_at: new Date().toISOString(),
      unsubscribed_at: null,
    });
  }

  try {
    const lineItems = priceId.startsWith('prod_')
      ? [{
        price_data: {
          currency: 'usd',
          product: priceId,
          unit_amount: 999,
        },
        quantity: 1,
      }]
      : [{ price: priceId, quantity: 1 }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
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

    return {
      purchaseId: purchase.id,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    await store.updatePurchase(purchase.id, {
      last_error: 'Stripe checkout session creation failed.',
      updated_at: new Date().toISOString(),
    });
    throw error;
  }
}

module.exports = {
  CheckoutError,
  createCheckout,
  normalizeEmail,
};
