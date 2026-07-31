'use strict';

const crypto = require('node:crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ ok: false, error: 'Server missing webhook secret' });
  }

  const signature = String(req.headers['x-sanity-webhook-signature'] || '');
  const payload = JSON.stringify(req.body || {});

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ ok: false, error: 'Invalid signature' });
  }

  const doc = req.body || {};
  const trigger = doc._id ? `${doc._type}:${doc._id}` : 'sanity';

  return res.status(200).json({ ok: true, trigger });
};
