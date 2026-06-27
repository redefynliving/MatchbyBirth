import express from 'express';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const store = require('../../../../api/_lib/supabase-store.cjs');
const {
  CheckoutError,
  createSubscriptionCheckout,
} = require('../../../../api/_lib/checkout-service.cjs');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const stripe = new (require('stripe'))(process.env.STRIPE_SECRET_KEY);
    const response = await createSubscriptionCheckout(req.body || {}, {
      store,
      stripe,
      appUrl: process.env.APP_URL,
      priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
    });
    return res.status(200).json({ ok: true, ...response });
  } catch (error) {
    const statusCode = error instanceof CheckoutError
      ? error.statusCode
      : error.statusCode || 500;
    if (statusCode >= 500) {
      console.error('create-subscription-checkout failed', { name: error.name, message: error.message });
    }
    return res.status(statusCode).json({
      ok: false,
      error: statusCode >= 500 ? 'Unable to start subscription checkout.' : error.message,
    });
  }
});

export default router;
