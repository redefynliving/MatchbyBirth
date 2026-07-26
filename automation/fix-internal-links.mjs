// One-off fixer: ensure published blog posts contain a MatchByBirth internal
// link (authority + conversion). Patches only docs whose body lacks one.
// Run via GitHub Actions with SANITY_API_TOKEN (or locally if token present).
import { execSync } from 'node:child_process';

const TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API = `https://${PROJECT}.api.sanity.io/v2025-01-01/data`;

const SLUGS = [
  'leo-libra-friendship-compatibility',
  'moon-affects-emotions-human-connection',
  'cancer-moon-compatibility',
];

if (!TOKEN) {
  console.error('[fix-links] SANITY_API_TOKEN missing — abort.');
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function fetchDoc(slug) {
  const query = encodeURIComponent(`*[_type=="blogPost" && slug.current==$slug][0]{_id, body}`,);
  const url = `${API}/query/${DATASET}?query=${query}&$slug="${slug}"`;
  const res = await fetch(url, { headers: auth });
  const json = await res.json();
  return json.result || null;
}

async function patchBody(_id, body) {
  const link = '\n\nCurious how your own chart lines up? [Try the Match by Birth calculator](https://matchbybirth.com/) to see your real compatibility score.';
  const newBody = body + link;
  const mutations = [{ patch: { id: _id, set: { body: newBody } } }];
  const res = await fetch(`${API}/mutate/${DATASET}`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  return res.ok;
}

async function main() {
  let patched = 0;
  for (const slug of SLUGS) {
    const doc = await fetchDoc(slug);
    if (!doc) { console.log(`[fix-links] ${slug}: not found, skip`); continue; }
    const hasLink = /https:\/\/matchbybirth\.com\//.test(doc.body || '');
    if (hasLink) { console.log(`[fix-links] ${slug}: already has link, skip`); continue; }
    const ok = await patchBody(doc._id, doc.body || '');
    console.log(`[fix-links] ${slug}: ${ok ? 'PATCHED' : 'FAILED'}`);
    if (ok) patched++;
  }
  // Regenerate + deploy the blog file so the fix goes live.
  if (patched > 0) {
    console.log(`[fix-links] ${patched} patched — regenerating generated file.`);
    execSync('node automation/sync-and-commit.mjs', { stdio: 'inherit' });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
