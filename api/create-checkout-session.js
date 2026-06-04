'use strict';

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { email, nameA, nameB, dobA, dobB, scores } = req.body || {};
    if (!email || !nameA || !nameB) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: email, nameA, nameB' });
    }

    const price = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.APP_URL;
    if (!process.env.STRIPE_SECRET_KEY || !price || !appUrl) {
      console.error('Missing STRIPE_SECRET_KEY, STRIPE_PRICE_ID, or APP_URL');
      return res.status(500).json({ ok: false, error: 'Server misconfiguration' });
    }

    let scoresMeta = '';
    try {
      const raw = JSON.stringify(scores || {});
      scoresMeta = raw.length > 480 ? raw.slice(0, 480) : raw;
    } catch (_) {
      scoresMeta = '';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: String(email).slice(0, 200),
      line_items: [{ price, quantity: 1 }],
      success_url: new URL('/report-success?session_id={CHECKOUT_SESSION_ID}', appUrl).toString(),
      cancel_url: new URL('/', appUrl).toString(),
      metadata: {
        nameA: String(nameA || '').slice(0, 200),
        nameB: String(nameB || '').slice(0, 200),
        dobA: String(dobA || '').slice(0, 100),
        dobB: String(dobB || '').slice(0, 100),
        scores: scoresMeta
      }
    });

    return res.status(200).json({ ok: true, url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout-session error:', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
