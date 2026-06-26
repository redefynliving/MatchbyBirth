'use strict';

const Stripe = require('stripe');
const { processStripeEvent } = require('./webhook-service.cjs');
const { fulfillConfiguredPurchase } = require('./fulfillment.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('WEBHOOK ERROR: STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ ok: false, error: 'Webhook not configured.' });
  }

  if (!sig) {
    console.error('WEBHOOK ERROR: No stripe-signature header');
    return res.status(400).json({ ok: false, error: 'Missing signature.' });
  }

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
    console.log(`WEBHOOK RECEIVED: ${event.type} (${event.id})`);
  } catch (err) {
    console.error(`WEBHOOK SIGNATURE ERROR: ${err.message}`);
    return res.status(400).json({ ok: false, error: 'Invalid signature.' });
  }

  try {
    const result = await processStripeEvent(event, {
      store: require('./supabase-store.cjs'),
      fulfillPurchase: fulfillConfiguredPurchase,
    });
    console.log(`WEBHOOK PROCESSED: ${event.type} (${event.id}) → ${result}`);
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    console.error(`WEBHOOK PROCESSING ERROR: ${event.type} (${event.id})`, {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ ok: false, error: 'Webhook processing failed.' });
  }
};
