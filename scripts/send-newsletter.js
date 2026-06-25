'use strict';

const store = require('../api/lib/supabase-store.cjs');
const { sendWeeklyUpdates } = require('../api/lib/newsletter-service.cjs');

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
    console.error('Missing required env vars');
    process.exit(1);
  }

  const result = await sendWeeklyUpdates(store);
  console.log(`Newsletter sent: ${result.sent} success, ${result.failed} failed, ${result.total} total`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Newsletter job failed:', err);
    process.exit(1);
  });
}

module.exports = { main };
