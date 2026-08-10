#!/usr/bin/env node
// Quick view of the drafts the daily cron has generated.
// Run: npm run blog:drafts   (or: node scripts/blog-drafts.mjs)
//
// PRIMARY: reads automation/draft-ledger.json — a token-free record the cron
//   commits to the repo on every draft run. `git pull` first so it's fresh.
// FALLBACK: if the ledger is missing, tries Sanity directly (needs a token in
//   .env.local that can READ drafts — a published-only token will show nothing).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const LEDGER = path.join(repoRoot, 'automation/draft-ledger.json');
const STUDIO_URL = 'https://matchbybirth.sanity.studio/structure/blogPost';

function pull() {
  try { execSync('git pull --rebase --quiet origin main', { stdio: 'ignore' }); }
  catch { /* offline or dirty — viewer still works on last-known state */ }
}

function readLedger() {
  try { return JSON.parse(fs.readFileSync(LEDGER, 'utf8')); }
  catch { return null; }
}

function render(drafts) {
  if (!drafts || drafts.length === 0) {
    console.log('\n  No drafts yet. The cron drafts one each morning (08:00 PT / 15:00 UTC).');
    console.log(`  Approve existing ones in the Studio: ${STUDIO_URL}\n`);
    return;
  }
  const when = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16).replace('T', ' ') : '?');
  console.log(`\n  CRON DRAFTS — ${drafts.length} waiting for your review\n`);
  console.log('  #  ' + 'TITLE'.padEnd(48) + 'SLUG'.padEnd(36) + 'DRAFTED');
  console.log('  ' + '-'.repeat(104));
  drafts.forEach((d, i) => {
    const title = String(d.title || d.slug || '(untitled)').slice(0, 44).padEnd(46);
    const slug = String(d.slug || '').slice(0, 32).padEnd(34);
    console.log(`  ${String(i + 1).padStart(2)} ${title}${slug}${when(d.draftedAt)}`);
  });
  console.log('\n  To publish: open the Studio, find the draft, set status -> published,');
  console.log(`  then the next cron sync run (08:00 PT) builds + ships it. ${STUDIO_URL}\n`);
}

// --- Token-free path (preferred) ---
pull();
const ledger = readLedger();
if (ledger) {
  render(ledger);
  process.exit(0);
}

// --- Sanity fallback (needs a draft-reading token) ---
const token = (() => {
  const p = path.join(repoRoot, '.env.local');
  if (!fs.existsSync(p)) return null;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*(SANITY_API_TOKEN)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && m[2] && m[2] !== '***') return m[2];
  }
  return null;
})();

if (!token || token.length < 20) {
  console.log('\n  No draft ledger found and no Sanity token available locally.');
  console.log(`  View drafts in the Studio: ${STUDIO_URL}\n`);
  process.exit(0);
}

const PROJECT_ID = '4qj4p6px', DATASET = 'production', API_VERSION = '2025-01-01';
const query = `*[_type == "blogPost" && status == "draft"]{ title, slug, topic, _createdAt }`;
const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) { console.error(`Sanity query failed: ${res.status}`); process.exit(1); }
const { result } = await res.json();
render((result || []).map((d) => ({ title: d.title, slug: d.slug?.current, draftedAt: d._createdAt })));
