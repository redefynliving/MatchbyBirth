'use strict';

const Stripe = require('stripe');
const store = require('./_lib/supabase-store.cjs');
const checkoutService = require('./_lib/checkout-service.cjs');
const { sendWelcomeEmail } = require('./_lib/email-service.cjs');
const { subscribeEmail } = require('./_lib/subscription-service.cjs');
const { generateStructuredReport } = require('./_lib/report-generator.cjs');
const { fulfillPurchase } = require('./_lib/report-service.cjs');
const { createCalculateResultHandler } = require('../shared/api-handlers.cjs');

let stripeClient;
let stripeClientKey;

function getServerConfig(env = process.env) {
  return {
    appUrl: String(env.APP_URL || '').trim(),
    reportTokenSecret: String(env.REPORT_TOKEN_SECRET || '').trim(),
    stripeSecretKey: String(env.STRIPE_SECRET_KEY || '').trim(),
    stripeWebhookSecret: String(env.STRIPE_WEBHOOK_SECRET || '').trim(),
    reportPriceId: String(env.STRIPE_PRICE_ID || '').trim(),
    subscriptionPriceId: String(env.STRIPE_SUBSCRIPTION_PRICE_ID || '').trim(),
  };
}

function getCheckoutConfig(kind, env = process.env) {
  const config = getServerConfig(env);
  if (kind !== 'report' && kind !== 'subscription') {
    throw new TypeError('Unknown checkout kind.');
  }
  return {
    ...config,
    priceId: kind === 'subscription' ? config.subscriptionPriceId : config.reportPriceId,
  };
}

function getStripeClient(secretKey) {
  if (!stripeClient || stripeClientKey !== secretKey) {
    stripeClient = new Stripe(secretKey);
    stripeClientKey = secretKey;
  }
  return stripeClient;
}

function checkoutErrorCode(error) {
  if (!(error instanceof checkoutService.CheckoutError)) return 'checkout_unavailable';
  const codes = new Map([
    ['Invalid checkout request body.', 'invalid_request'],
    ['Enter a valid email address.', 'invalid_email'],
    ['Result is required.', 'result_required'],
    ['Result not found.', 'result_not_found'],
    ['Paid reports are currently available for pair reports only.', 'unsupported_result_mode'],
  ]);
  return error.statusCode >= 500 ? 'checkout_unavailable' : (codes.get(error.message) || 'invalid_request');
}

function checkoutErrorResponse(error, fallbackMessage, logger = console) {
  const statusCode = error instanceof checkoutService.CheckoutError
    ? error.statusCode
    : 500;
  if (statusCode >= 500) {
    logger.error(fallbackMessage, { name: error.name, message: error.message });
  }
  return {
    statusCode,
    body: {
      ok: false,
      error: checkoutErrorCode(error),
    },
  };
}

function createReportCheckoutHandler(dependencies = {}) {
  const logger = dependencies.logger || console;
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    const config = getCheckoutConfig('report', dependencies.env);
    if (!config.stripeSecretKey || !config.priceId || !config.appUrl) {
      logger.error('Checkout configuration is incomplete.');
      return res.status(500).json({ ok: false, error: 'Checkout is not configured.' });
    }
    try {
      const stripe = dependencies.stripe || getStripeClient(config.stripeSecretKey);
      const response = await checkoutService.createCheckout(req.body, {
        store: dependencies.store || store,
        stripe,
        appUrl: config.appUrl,
        priceId: config.priceId,
      });
      return res.status(200).json({ ok: true, ...response });
    } catch (error) {
      const shaped = checkoutErrorResponse(error, 'Unable to start checkout.', logger);
      return res.status(shaped.statusCode).json(shaped.body);
    }
  };
}

function createSubscriptionCheckoutHandler(dependencies = {}) {
  const logger = dependencies.logger || console;
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    const config = getCheckoutConfig('subscription', dependencies.env);
    if (!config.stripeSecretKey || !config.priceId || !config.appUrl) {
      logger.error('Subscription checkout configuration is incomplete.');
      return res.status(500).json({ ok: false, error: 'Subscription checkout is not configured.' });
    }
    try {
      const stripe = dependencies.stripe || getStripeClient(config.stripeSecretKey);
      const response = await checkoutService.createSubscriptionCheckout(req.body, {
        store: dependencies.store || store,
        stripe,
        appUrl: config.appUrl,
        priceId: config.priceId,
      });
      return res.status(200).json({ ok: true, ...response });
    } catch (error) {
      const shaped = checkoutErrorResponse(error, 'Unable to start subscription checkout.', logger);
      return res.status(shaped.statusCode).json(shaped.body);
    }
  };
}

function subscribePaidReportBuyer(input) {
  const config = getServerConfig();
  return subscribeEmail(input, {
    appUrl: config.appUrl,
    tokenSecret: config.reportTokenSecret,
    store,
    sendWelcomeEmail,
    onEmailError: (error) => console.error('checkout welcome email failed', { message: error.message }),
  });
}

module.exports = {
  ...checkoutService,
  createReportCheckoutHandler,
  createSubscriptionCheckoutHandler,
  createCalculateResultHandler,
  fulfillPurchase,
  generateStructuredReport,
  getCheckoutConfig,
  getServerConfig,
  store,
  subscribePaidReportBuyer,
};