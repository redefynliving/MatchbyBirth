'use strict';

const store = require('./supabase-store.cjs');
const { sendWeeklyUpdates } = require('./newsletter-service.cjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const cronHeader = req.headers['x-vercel-cron'];
  const secret = req.query?.secret || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const expectedSecret = process.env.REPORT_TOKEN_SECRET;

  if (!cronHeader && expectedSecret && secret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await sendWeeklyUpdates(store);
    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error('weekly updates failed', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
