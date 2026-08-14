// approve-draft.mjs — promote a single Sanity draft to published + deploy.
// Runs INSIDE GitHub Actions (blog-sync workflow) where SANITY_API_TOKEN has
// write scope. Triggered by `repository_dispatch` type `sanity-publish` with
// client_payload { slug }.
//
// Steps:
//   1. Find drafts.blogPost.<slug> (or blogPost.<slug> if already promoted).
//   2. Promote: status=published, approvalStatus=approved, set publishedAt.
//   3. Regenerate sanity-posts.generated.js (sync-and-commit.mjs).
//   4. Commit + push (Vercel auto-deploys).
//
// Note: this file is committed into the repo so the workflow can import it.
// It must be self-contained (no ESM import of local fetch wrappers that assume
// the sync pipeline). We inline the promote mutation.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const PROJECT_ID = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2025-01-01';
const token = process.env.SANITY_API_TOKEN;
const slug = process.env.APPROVE_SLUG;

if (!token) { console.error('[approve] SANITY_API_TOKEN missing'); process.exit(1); }
if (!slug) { console.error('[approve] APPROVE_SLUG missing'); process.exit(1); }

const DRAFT_ID = `drafts.blogPost.${slug}`;
const PUB_ID = `blogPost.${slug}`;
const auth = `Bearer ${token}`;

async function queryById(_id) {
  const q = encodeURIComponent(`*[_id=="${_id}"][0]{_id,title,status,approvalStatus,slug}`);
  const r = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${q}`, {
    headers: { Authorization: auth },
  });
  const j = await r.json();
  return j.result || null;
}

async function promote(doc) {
  const now = new Date().toISOString();
  const published = {
    _id: PUB_ID,
    _type: 'blogPost',
    title: doc.title,
    slug: { _type: 'slug', current: slug },
    status: 'published',
    approvalStatus: 'approved',
    publishedAt: now,
    // Carry over every existing field so we don't drop body/SEO/etc.
    ...doc,
    _id: PUB_ID,
    status: 'published',
    approvalStatus: 'approved',
    publishedAt: now,
  };
  // Strip internal keys we must not resend on createOrReplace.
  delete published._rev;
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ createOrReplace: published }] }),
  });
  const body = await res.text();
  console.log(`[approve] promote HTTP ${res.status}: ${body}`);
  if (!res.ok) throw new Error(`promote failed ${res.status}: ${body}`);
  return PUB_ID;
}

// Fetch the draft (it may already be promoted if re-run).
let doc = await queryById(DRAFT_ID);
if (!doc) {
  const existing = await queryById(PUB_ID);
  if (existing && existing.status === 'published') {
    console.log(`[approve] ${slug} already published; skipping promote.`);
  } else if (existing) {
    doc = existing; // promote in place
  } else {
    console.error(`[approve] no draft found for slug ${slug}`);
    process.exit(1);
  }
}

const promotedId = doc ? await promote(doc) : PUB_ID;
console.log(`[approve] promoted ${slug} -> ${promotedId}`);

// Mark local ledger approved so the app stops showing it as pending.
const ledgerPath = path.join(repoRoot, 'automation/draft-ledger.json');
try {
  let ledger = [];
  try { ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8')); } catch { ledger = []; }
  let changed = false;
  for (const d of ledger) { if (d.slug === slug && !d.approved) { d.approved = true; changed = true; } }
  if (changed) fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
} catch (e) { console.log('[approve] ledger update skipped:', e.message); }

// Regenerate the generated posts module + commit/push (reuses existing sync).
console.log('[approve] regenerating generated posts...');
execSync('node automation/sync-and-commit.mjs', { stdio: 'inherit', cwd: repoRoot });

console.log(`[approve] done. Live at https://matchbybirth.com/blog/${slug}`);
