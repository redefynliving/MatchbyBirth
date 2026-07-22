'use strict';

const crypto = require('node:crypto');

function createReportAccess(purchaseId, secret) {
  if (!secret) throw new Error('Report token secret is not configured.');
  const token = crypto
    .createHmac('sha256', secret)
    .update(String(purchaseId))
    .digest('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

function verifyReportAccess(purchaseId, token, secret) {
  if (!purchaseId || !token || !secret) return false;
  const expected = createReportAccess(purchaseId, secret).token;
  const actualBuffer = Buffer.from(String(token));
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

async function fulfillPurchase(purchaseId, dependencies) {
  const {
    store,
    appUrl,
    tokenSecret,
    generateReport,
    sendReportEmail,
  } = dependencies;
  const purchase = await store.findPurchaseWithResult(purchaseId);
  if (!purchase) throw new Error('Purchase not found.');
  if (!purchase.result?.result_payload) throw new Error('Purchase result not found.');

  if (purchase.status === 'delivered') {
    console.log(`FULFILL SKIP: purchase ${purchaseId} already delivered`);
    return { purchaseId, status: 'delivered' };
  }

  const nextAttempt = Number(purchase.delivery_attempts || 0) + 1;
  console.log(`FULFILL START: purchase ${purchaseId} (attempt ${nextAttempt})`);
  
  await store.updatePurchase(purchaseId, {
    status: 'generating',
    delivery_attempts: nextAttempt,
    last_error: null,
  });

  try {
    const access = createReportAccess(purchaseId, tokenSecret);
    let report = await store.findReportByPurchaseId(purchaseId);

    if (!report) {
      console.log(`FULFILL GENERATING: purchase ${purchaseId} — calling report generator`);
      const reportContext = purchase.result.result_payload?.reportContext || {};
      const content = await generateReport(purchase.result.result_payload, {
        reportType: purchase.report_type || reportContext.reportType || 'standard',
        reportFocus: purchase.report_focus || reportContext.focus,
        clarityGoal: purchase.clarity_goal || reportContext.clarityGoal,
      });
      console.log(`FULFILL GENERATED: purchase ${purchaseId} — model: ${content.model || 'unknown'}`);
      
      report = await store.insertReport({
        purchase_id: purchaseId,
        access_token_hash: access.tokenHash,
        content,
        model: content.model || 'fallback-v3',
        promptVersion: content.promptVersion || 'structured-v1',
      });
    }

    const reportUrl = new URL('/report', appUrl);
    reportUrl.searchParams.set('purchase', purchaseId);
    reportUrl.searchParams.set('token', access.token);

    console.log(`FULFILL EMAILING: purchase ${purchaseId} → ${purchase.email}`);
    const emailResponse = await sendReportEmail({
      to: purchase.email,
      report: report.content,
      reportUrl: reportUrl.toString(),
      idempotencyKey: `report-delivery/${purchaseId}`,
    });
    console.log(`FULFILL EMAILED: purchase ${purchaseId} — email id: ${emailResponse.id || 'unknown'}`);
    
    const deliveredAt = new Date().toISOString();

    await store.updateReport(report.id, {
      provider_email_id: emailResponse.id || null,
      emailed_at: deliveredAt,
    });
    await store.updatePurchase(purchaseId, {
      status: 'delivered',
      delivered_at: deliveredAt,
      last_error: null,
    });
    await store.updateResult(purchase.result_id, { expires_at: null });

    console.log(`FULFILL COMPLETE: purchase ${purchaseId} delivered at ${deliveredAt}`);

    return {
      purchaseId,
      status: 'delivered',
      reportUrl: reportUrl.toString(),
    };
  } catch (error) {
    console.error(`FULFILL ERROR: purchase ${purchaseId}`, {
      message: error.message,
      stack: error.stack,
    });
    await store.updatePurchase(purchaseId, {
      status: 'failed',
      delivery_attempts: nextAttempt,
      last_error: 'Report fulfillment failed.',
    });
    throw error;
  }
}

module.exports = {
  createReportAccess,
  fulfillPurchase,
  verifyReportAccess,
};
