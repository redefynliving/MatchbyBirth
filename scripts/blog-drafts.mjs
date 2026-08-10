#!/usr/bin/env node
// Quick view of the drafts the daily cron has generated — with live SEO status.
// Run: npm run blog:drafts   (or: node scripts/blog-drafts.mjs)
//
// PRIMARY: reads automation/draft-ledger.json — a token-free record the cron
//   commits to the repo on every draft run (with computed SEO metrics). `git
//   pull` first so it's fresh.
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

const seoBar = (score) => {
  const filled = Math.round(score / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${score}%`;
};

function render(drafts) {
  if (!drafts || drafts.length === 0) {
    console.log('\n  No drafts yet. The cron drafts one each morning (08:00 PT / 15:00 UTC).');
    console.log(`  Approve existing ones in the Studio: ${STUDIO_URL}\n`);
    return;
  }
  const when = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16).replace('T', ' ') : '?');
  console.log(`\n  CRON DRAFTS — ${drafts.length} waiting for your review\n`);

  drafts.forEach((d, i) => {
    const score = typeof d.seoScore === 'number' ? d.seoScore : null;
    console.log(`  ${String(i + 1).padStart(2)}. ${d.title || d.slug}`);
    console.log(`      slug:     ${d.slug}`);
    console.log(`      keyword:  ${d.focusKeyword || '-'}`);
    console.log(`      drafted:  ${when(d.draftedAt)}`);
    if (score !== null) {
      console.log(`      SEO:      ${seoBar(score)}`);
      console.log(`      words:    ${d.wordCount || '?'}   headings: ${d.headingCount ?? '?'}   faq: ${d.faqCount ?? '?'}   takeaways: ${d.takeawayCount ?? '?'}`);
      if (Array.isArray(d.seoChecks)) {
        const fails = d.seoChecks.filter((c) => !c.ok).map((c) => c.name);
        console.log(`      meta:     ${(d.metaTitle || '').slice(0, 64) || '-'}`);
        console.log(`      desc:     ${(d.metaDescription || '').slice(0, 64) || '-'}`);
        console.log(`      flags:    ${fails.length ? fails.join(', ') : 'none — clean'}`);
      }
    }
    console.log('');
  });

  console.log('  To publish: open the Studio, find the draft, set status -> published,');
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
render((result || []).map((d) => ({ title: d.title, slug: d.slug?.current, focusKeyword: d.topic, draftedAt: d._createdAt })));
