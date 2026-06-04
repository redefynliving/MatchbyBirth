const initStripe = async () => {
  // Support both CJS require and ESM dynamic import depending on runtime
  try {
    // Try CommonJS first
    // eslint-disable-next-line global-require
    const stripePkg = require('stripe');
    return stripePkg(process.env.STRIPE_SECRET_KEY);
  } catch (cjsErr) {
    try {
      // Fallback to dynamic import for ESM environments
      const stripeModule = await import('stripe');
      const factory = stripeModule.default || stripeModule;
      return factory(process.env.STRIPE_SECRET_KEY);
    } catch (esmErr) {
      const err = new Error('stripe_module_missing');
      err.cause = { cjsErr: cjsErr.message, esmErr: esmErr.message };
      throw err;
    }
  }
};

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

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      console.error('Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID');
      return res.status(500).json({ ok: false, error: 'Server misconfiguration' });
    }

    let stripe;
    // Allow local testing with a mock Stripe client when STRIPE_MOCK=1
    if (process.env.STRIPE_MOCK === '1') {
      stripe = {
        checkout: {
          sessions: {
            create: async (opts) => ({ id: 'sess_fake_123', url: 'https://checkout.fake/sess_fake_123', ...opts })
          }
        }
      };
    } else {
      try {
        stripe = await initStripe();
      } catch (err) {
        console.error('Stripe initialization failed', err);
        return res.status(500).json({ ok: false, error: 'Stripe client initialization failed' });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'https://matchbybirth.com/report-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://matchbybirth.com',
      metadata: { nameA, nameB, dobA, dobB, scores: JSON.stringify(scores || {}), email }
    });

    // session.url may be undefined in some Stripe versions/environments. Return both for safety.
    return res.status(200).json({ ok: true, url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
