'use strict';

const store = require('./supabase-store.cjs');
const { fulfillConfiguredPurchase } = require('./fulfillment.cjs');
const {
  refreshRetryablePurchase,
} = require('./purchase-status-service.cjs');
const { createReportAccess } = require('./report-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const sessionId = String(req.query?.sessionId || '');
  if (!sessionId || sessionId.length > 200) {
    return res.status(400).json({ ok: false, error: 'Invalid checkout session.' });
  }

  try {
    let purchase = await store.findPurchaseBySessionId(sessionId);
    if (!purchase) {
      return res.status(404).json({ ok: false, error: 'Purchase not found.' });
    }
    purchase = await refreshRetryablePurchase(purchase, sessionId, {
      fulfillPurchase: fulfillConfiguredPurchase,
      store,
    });

    const response = { ok: true, status: purchase.status };
    if (purchase.status === 'delivered') {
      const { token } = createReportAccess(
        purchase.id,
        process.env.REPORT_TOKEN_SECRET,
      );
      response.reportUrl = `/report?purchase=${encodeURIComponent(purchase.id)}&token=${encodeURIComponent(token)}`;
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error('purchase status failed', { message: error.message });
    return res.status(500).json({ ok: false, error: 'Unable to check purchase.' });
  }
};
