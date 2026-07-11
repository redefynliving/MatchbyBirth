#!/usr/bin/env node
/**
 * Manual fulfillment script for stuck purchases
 * Usage: node scripts/fulfill-purchase.js <purchase-id>
 * 
 * This script manually triggers the fulfillment flow for a purchase
 * that didn't get processed automatically (e.g., webhook failure).
 * 
 * Steps:
 * 1. Finds the purchase in Supabase
 * 2. Checks if it's in 'paid' or 'failed' status
 * 3. Calls the report generator (Claude API)
 * 4. Sends the report email
 * 5. Updates the purchase status to 'delivered'
 */

'use strict';

const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');
const { generateStructuredReport, fulfillPurchase } = require('../api/backend.cjs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL;
const REPORT_TOKEN_SECRET = process.env.REPORT_TOKEN_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const purchaseId = process.argv[2];
if (!purchaseId) {
  console.error('Usage: node scripts/fulfill-purchase.js <purchase-id>');
  console.error('Example: node scripts/fulfill-purchase.js abc123-def456');
  process.exit(1);
}

console.log(`\n🔧 Manual Fulfillment for purchase: ${purchaseId}\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Simple store implementation for manual script
const store = {
  async findPurchaseWithResult(id) {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, results:result_id(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (data && data.results) {
      data.result = data.results;
      delete data.results;
    }
    return data;
  },

  async findReportByPurchaseId(id) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('purchase_id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async updatePurchase(id, updates) {
    const { error } = await supabase.from('purchases').update(updates).eq('id', id);
    if (error) throw error;
  },

  async insertReport(report) {
    const { data, error } = await supabase.from('reports').insert(report).select().single();
    if (error) throw error;
    return data;
  },

  async updateReport(id, updates) {
    const { error } = await supabase.from('reports').update(updates).eq('id', id);
    if (error) throw error;
  },

  async updateResult(id, updates) {
    const { error } = await supabase.from('results').update(updates).eq('id', id);
    if (error) throw error;
  },
};

// Email service using Resend
async function sendReportEmail({ to, report, reportUrl, idempotencyKey }) {
  if (!RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY is not set');
    throw new Error('Email service not configured');
  }

  const [first, second] = report.people || [];
  const names = first && second ? `${first.name} & ${second.name}` : 'Your Compatibility';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #6c4de6; font-size: 24px; margin-bottom: 16px;">Your Deep Reading is Ready ✨</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi there,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Your personalized compatibility report for <strong>${names}</strong> is ready.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${reportUrl}" style="background: #6c4de6; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">View Your Full Report →</a>
      </div>
      <p style="color: #888; font-size: 14px; line-height: 1.6;">This link is unique to you. Don't share it publicly.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
      <p style="color: #888; font-size: 12px;">Match by Birth — <a href="${APP_URL}" style="color: #6c4de6;">${APP_URL}</a></p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Match by Birth <reports@matchbybirth.com>',
      to,
      subject: `Your ${names} Compatibility Report ✨`,
      html,
      headers: {
        'X-Entity-Ref-ID': idempotencyKey,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API failed: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return { id: data.id };
}

async function main() {
  try {
    // Step 1: Find the purchase
    console.log('Step 1: Finding purchase...');
    const purchase = await store.findPurchaseWithResult(purchaseId);
    if (!purchase) {
      console.error(`ERROR: Purchase ${purchaseId} not found`);
      process.exit(1);
    }
    console.log(`  Found: ${purchase.id}`);
    console.log(`  Status: ${purchase.status}`);
    console.log(`  Email: ${purchase.email}`);
    console.log(`  Result: ${purchase.result ? 'Yes' : 'No'}`);

    if (purchase.status === 'delivered') {
      console.log('\n✅ Purchase already delivered. Nothing to do.');
      process.exit(0);
    }

    if (purchase.status !== 'paid' && purchase.status !== 'failed') {
      console.error(`\nERROR: Purchase status is '${purchase.status}', expected 'paid' or 'failed'`);
      console.error('This purchase may not have been paid yet.');
      process.exit(1);
    }

    if (!purchase.result?.result_payload) {
      console.error('\nERROR: Purchase has no result data. Cannot generate report.');
      process.exit(1);
    }

    // Step 2: Fulfill
    console.log('\nStep 2: Generating and sending report...');
    const result = await fulfillPurchase(purchaseId, {
      store,
      appUrl: APP_URL,
      tokenSecret: REPORT_TOKEN_SECRET,
      generateReport: generateStructuredReport,
      sendReportEmail,
    });

    console.log('\n✅ SUCCESS!');
    console.log(`  Status: ${result.status}`);
    console.log(`  Report URL: ${result.reportUrl}`);
    console.log(`\nThe customer should receive their report email shortly.`);

  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
