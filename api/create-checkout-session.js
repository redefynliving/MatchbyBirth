'use strict';

const Stripe = require('stripe');
const store = require('./lib/supabase-store.cjs');
const { sendWelcomeEmail } = require('./lib/email-service.cjs');
const { subscribeEmail } = require('./lib/subscription-service.cjs');
const {
  CheckoutError,
  createCheckout,
} = require('./lib/checkout-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_PRICE_ID ||
    !process.env.APP_URL
  ) {
    console.error('Checkout configuration is incomplete.');
    return res.status(500).json({ ok: false, error: 'Checkout is not configured.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const response = await createCheckout(req.body || {}, {
      store,
      stripe,
      appUrl: process.env.APP_URL,
      priceId: process.env.STRIPE_PRICE_ID,
      subscribeMarketing: (input) => subscribeEmail(input, {
        appUrl: process.env.APP_URL,
        tokenSecret: process.env.REPORT_TOKEN_SECRET,
        store,
        sendWelcomeEmail,
        onEmailError: (emailError) => {
          console.error('checkout welcome email failed', {
            message: emailError.message,
          });
        },
      }),
      onMarketingError: (marketingError) => {
        console.error('checkout marketing opt-in failed', {
          message: marketingError.message,
        });
      },
    });
    return res.status(200).json({ ok: true, ...response });
  } catch (error) {
    const statusCode = error instanceof CheckoutError
      ? error.statusCode
      : error.statusCode || 500;
    if (statusCode >= 500) {
      console.error('create-checkout-session failed', {
        name: error.name,
        message: error.message,
      });
    }
    return res.status(statusCode).json({
      ok: false,
      error: statusCode >= 500 ? 'Unable to start checkout.' : error.message,
    });
  }
};
