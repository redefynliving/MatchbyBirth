'use strict';

const store = require('./lib/supabase-store.cjs');
const { fulfillConfiguredPurchase } = require('./lib/fulfillment.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const authorization = req.headers.authorization;
  if (
    !process.env.CRON_SECRET ||
    authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const purchases = await store.listRetryablePurchases(10);
  const results = [];
  for (const purchase of purchases) {
    try {
      await fulfillConfiguredPurchase(purchase.id);
      results.push({ purchaseId: purchase.id, status: 'delivered' });
    } catch {
      results.push({ purchaseId: purchase.id, status: 'failed' });
    }
  }

  return res.status(200).json({ ok: true, processed: results.length, results });
};
