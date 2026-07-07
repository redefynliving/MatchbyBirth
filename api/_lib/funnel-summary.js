'use strict';

const store = require('./supabase-store.cjs');
const { summarizeFunnelEvents } = require('./funnel-service.cjs');

function isAuthorized(req) {
  const expected = String(process.env.FUNNEL_DASHBOARD_TOKEN || '').trim();
  if (!expected) return true;

  const headerToken = String(req.headers['x-funnel-token'] || '').trim();
  const queryToken = String(req.query?.token || '').trim();
  return headerToken === expected || queryToken === expected;
}

function getWeekCount(req) {
  const weeks = Number(req.query?.weeks || 4);
  if (!Number.isFinite(weeks)) return 4;
  return Math.max(1, Math.min(12, Math.round(weeks)));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  if (!store.isConfigured()) {
    return res.status(503).json({ ok: false, error: 'Funnel storage is not configured.' });
  }

  try {
    const weeks = getWeekCount(req);
    const sinceDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
    const since = sinceDate.toISOString();
    const rows = await store.listFunnelEventsSince(since);
    const summary = summarizeFunnelEvents(rows, { since });
    return res.status(200).json({ ok: true, weeks, ...summary });
  } catch (error) {
    console.error('funnel-summary failed', {
      name: error.name,
      message: error.message,
    });
    if (error.message === 'Database request failed.') {
      return res.status(503).json({
        ok: false,
        error: 'Funnel storage is not ready. Apply the funnel_events Supabase migration.',
      });
    }
    return res.status(500).json({ ok: false, error: 'Unable to load funnel summary.' });
  }
};
