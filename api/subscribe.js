'use strict';

const store = require('./lib/supabase-store.cjs');
const { normalizeEmail } = require('./lib/checkout-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    if (req.body?.consent !== true) {
      return res.status(400).json({ success: false, error: 'Consent is required.' });
    }
    const email = normalizeEmail(req.body?.email);
    const resultId = String(req.body?.resultId || '').trim() || null;
    const consentSource = String(req.body?.consentSource || 'website').slice(0, 80);

    await store.upsertSubscriber({
      email,
      result_id: resultId,
      consent_source: consentSource,
      consented_at: new Date().toISOString(),
      unsubscribed_at: null,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode >= 500) {
      console.error('subscribe failed', { message: error.message });
    }
    return res.status(statusCode).json({
      success: false,
      error: statusCode >= 500 ? 'Unable to subscribe.' : error.message,
    });
  }
};
