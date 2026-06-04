export const config = { api: { bodyParser: false } }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    // Read raw body for signature verification
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).end('Missing stripe-signature header');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return res.status(500).end('Server misconfiguration');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed', err.message);
      return res.status(400).end('Webhook signature verification failed');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      // Acknowledge quickly, process asynchronously
      res.status(200).end('ok');

      // Asynchronously generate the report and send email
      (async () => {
        try {
          // Do not pull raw DOBs into logs or downstream requests. Replace DOBs with a hash for internal correlation if needed.
          const { nameA, nameB, scores, email } = metadata;
          const dobA = metadata.dobA ? hashPII(metadata.dobA) : undefined;
          const dobB = metadata.dobB ? hashPII(metadata.dobB) : undefined;
          const parsedScores = scores ? JSON.parse(scores) : null;

          // Call Anthropic to generate the report (reuse existing function)

          function hashPII(value) {
            try {
              const h = crypto.createHash('sha256');
              h.update(String(value));
              return h.digest('hex').slice(0, 32); // short hash
            } catch (e) {
              return undefined;
            }
          }

          const generateReport = require('./generate-report');
          // generate-report expects (req,res) signature; call its inner logic by emulating a request

          const fakeReq = { method: 'POST', body: { nameA, nameB, dobA, dobB, scores: parsedScores, email } };
          const fakeRes = {
            status: (code) => ({ json: (obj) => ({ code, obj }) }),
          };

          // Call generate-report to perform generation and sending
          await generateReport(fakeReq, fakeRes);
        } catch (err) {
          console.error('Error processing checkout.session.completed:', err);
        }
      })();

      return;
    }

    res.status(200).end('ignored');
  } catch (err) {
    console.error('stripe-webhook error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
