'use strict';

const store = require('./supabase-store.cjs');
const { recordFunnelEvent } = require('./funnel-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const result = await recordFunnelEvent(req.body || {}, store);
    return res.status(202).json({ ok: true, ...result });
  } catch (error) {
    console.error('track-event failed', {
      name: error.name,
      message: error.message,
    });
    return res.status(202).json({ ok: true, stored: false });
  }
};
