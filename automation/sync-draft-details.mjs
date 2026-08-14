// sync-draft-details.mjs — fetch full content/metadata for all PENDING Sanity
// drafts and write a JSON file the MBBDrafts app can read (via the public CDN,
// no token needed on the Mac). Runs inside GitHub Actions where SANITY_API_TOKEN
// can read draft docs. Commits the file so it's available to the app.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const PROJECT_ID = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2025-01-01';
const token = process.env.SANITY_API_TOKEN;

function plainText(body) {
  const blocks = Array.isArray(body) ? body : [];
  return blocks
    .filter((b) => b && b._type === 'block')
    .map((b) => (Array.isArray(b.children) ? b.children.map((c) => c.text || '').join('') : ''))
    .join('\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  if (!token) { console.error('[details] SANITY_API_TOKEN missing'); process.exit(1); }
  const auth = `Bearer ${token}`;

  // All drafts (including drafts.*) that are NOT yet approved+published.
  const query = `*[_type=="blogPost" && (!defined(approvalStatus) || approvalStatus != "approved")]{
    _id, title, slug, topic, metaTitle, metaDescription, excerpt,
    publishedAt, body, quickTakeaways, faq
  }`;
  const q = encodeURIComponent(query);
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${q}`, {
    headers: { Authorization: auth },
  });
  const json = await res.json();
  const docs = json.result || [];

  const details = docs
    .map((d) => {
      const slug = d.slug?.current || (typeof d.slug === 'string' ? d.slug : slugify(d.title));
      if (!slug) return null;
      const bodyText = plainText(d.body || []);
      return {
        slug,
        title: d.title || slug,
        topic: d.topic || 'birth-matching',
        metaTitle: d.metaTitle || (d.title ? d.title.slice(0, 60) : ''),
        metaDescription: d.metaDescription || d.excerpt || '',
        excerpt: d.excerpt || '',
        bodyPreview: bodyText.slice(0, 1200),
        wordCount: bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0,
        faqCount: Array.isArray(d.faq) ? d.faq.length : 0,
        takeawayCount: Array.isArray(d.quickTakeaways) ? d.quickTakeaways.length : 0,
        faq: Array.isArray(d.faq) ? d.faq.filter((f) => f && f.question && f.answer).map((f) => ({ question: f.question, answer: f.answer })) : [],
        quickTakeaways: Array.isArray(d.quickTakeaways) ? d.quickTakeaways.filter(Boolean).map(String) : [],
        updatedAt: new Date().toISOString(),
      };
    })
    .filter(Boolean);

  const outPath = path.join(repoRoot, 'automation/draft-details.json');
  const serialized = JSON.stringify(details, null, 2);
  const prev = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (prev === serialized) {
    console.log(`[details] no change (${details.length} pending drafts).`);
    return;
  }
  fs.writeFileSync(outPath, serialized);
  console.log(`[details] wrote ${details.length} pending-draft details.`);

  const status = execSync(`git status --porcelain ${outPath}`).toString().trim();
  if (!status) return;
  execSync('git config user.email "bot@matchbybirth.com"');
  execSync('git config user.name "Blog Automation"');
  execSync('git pull --rebase --autostash origin main');
  execSync(`git add ${outPath}`);
  execSync(`git commit -m "chore: refresh pending-draft details (${details.length})"`);
  execSync('git push origin main');
  console.log('[details] committed + pushed.');
}

main().catch((e) => { console.error('[details] failed:', e.message); process.exit(1); });
