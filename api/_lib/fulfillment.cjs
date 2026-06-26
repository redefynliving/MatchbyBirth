'use strict';

const store = require('./supabase-store.cjs');
const { sendReportEmail } = require('./email-service.cjs');
const { generateStructuredReport } = require('./report-generator.cjs');
const { fulfillPurchase } = require('./report-service.cjs');

function fulfillConfiguredPurchase(purchaseId) {
  return fulfillPurchase(purchaseId, {
    store,
    appUrl: process.env.APP_URL,
    tokenSecret: process.env.REPORT_TOKEN_SECRET,
    generateReport: generateStructuredReport,
    sendReportEmail,
  });
}

module.exports = { fulfillConfiguredPurchase };
