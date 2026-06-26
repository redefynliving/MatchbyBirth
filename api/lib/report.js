'use strict';

const store = require('./supabase-store.cjs');
const { verifyReportAccess } = require('./report-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const purchaseId = String(req.query?.purchase || '');
  const token = String(req.query?.token || '');
  if (
    !verifyReportAccess(
      purchaseId,
      token,
      process.env.REPORT_TOKEN_SECRET,
    )
  ) {
    return res.status(403).json({ ok: false, error: 'Invalid report link.' });
  }

  try {
    const purchase = await store.findPurchaseWithResult(purchaseId);
    const report = await store.findReportByPurchaseId(purchaseId);
    if (!purchase || !report || purchase.status !== 'delivered') {
      return res.status(404).json({ ok: false, error: 'Report not found.' });
    }

    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({
      ok: true,
      report: report.content,
      result: purchase.result.result_payload,
      deliveredAt: purchase.delivered_at,
    });
  } catch (error) {
    console.error('report retrieval failed', { message: error.message });
    return res.status(500).json({ ok: false, error: 'Unable to load report.' });
  }
};
