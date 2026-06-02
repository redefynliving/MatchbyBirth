const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'https://matchbybirth.com/report-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://matchbybirth.com',
      metadata: { nameA, nameB, dobA, dobB, scores: JSON.stringify(scores), email }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
