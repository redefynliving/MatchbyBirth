// SEO audit + ranking-opportunity engine for MatchByBirth.
// Mission: climb MBB's Google rankings as fast as is honestly achievable.
// Report-only: reads Search Console + live site, writes a ranked opportunities
// report. No writes to Sanity, no deploys. Runs weekly from GitHub Actions.
//
// Env:
//   SC_SERVICE_ACCOUNT_JSON  Google service-account key (SC + indexing scopes)
//   SITE_URL                 default https://matchbybirth.com
//   OPPORTUNITIES_PATH       optional Obsidian markdown file to append report to
//   GEN_PATH                 generated blog posts file (default repo path)

import crypto from 'node:crypto';
import fs from 'node:fs';

const SITE = process.env.SITE_URL || 'https://matchbybirth.com';
const GEN_PATH = process.env.GEN_PATH || 'apps/web/src/data/posts/sanity-posts.generated.js';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/indexing';

// ---------- Search Console auth (service account, no external deps) ----------
async function getAccessToken() {
  const raw = process.env.SC_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  const sa = JSON.parse(raw);
  const iat = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    exp: iat + 3600,
    iat,
  })).toString('base64url');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  sign.end();
  const jwt = `${header}.${payload}.${sign.sign(sa.private_key, 'base64url')}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`SC token failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function scQuery(token, path, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ---------- On-page audit (parse generated posts, no import) ----------
function publishedPosts() {
  if (!fs.existsSync(GEN_PATH)) return [];
  const src = fs.readFileSync(GEN_PATH, 'utf8');
  const titles = [...src.matchAll(/"title":\s*"([^"]*)"/g)].map((m) => m[1]);
  const metas = [...src.matchAll(/"description":\s*"([^"]*)"/g)].map((m) => m[1]);
  const bodies = [...src.matchAll(/"content":\s*"([^"]*)"/g)].map((m) => m[1]);
  const slugs = [...src.matchAll(/"slug":\s*"([^"]*)"/g)].map((m) => m[1]);
  const n = Math.min(titles.length, bodies.length);
  const posts = [];
  for (let i = 0; i < n; i++) {
    const body = bodies[i] || '';
    const text = body.replace(/<[^>]+>/g, ' ').replace(/[#*_>`~|]/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasLink = /https:\/\/matchbybirth\.com\//.test(body);
    posts.push({
      slug: slugs[i] || `post-${i}`,
      title: titles[i] || '',
      meta: metas[i] || '',
      words,
      hasLink,
    });
  }
  return posts;
}

// ---------- Live technical check ----------
async function checkPage(path) {
  try {
    const res = await fetch(`${SITE}${path}`, { redirect: 'manual' });
    const html = res.ok ? await res.text() : '';
    return {
      status: res.status,
      hasJsonLd: /application\/ld\+json/.test(html),
      hasCanonical: /rel=["']canonical["']/.test(html),
      hasRobots: /name=["']robots["']/i.test(html),
      bytes: html.length,
    };
  } catch {
    return { status: 0, error: true };
  }
}

// ---------- Report assembly ----------
function rank(opps) {
  const weight = { high: 3, med: 2, low: 1 };
  return opps.sort((a, b) => (weight[b.pri] - weight[a.pri]) || (b.impact - a.impact));
}

async function main() {
  const opps = [];
  const lines = [];
  const log = (s) => { lines.push(s); console.log(s); };

  log(`# MBB SEO Audit — ${new Date().toISOString().slice(0, 10)}`);
  log(`Site: ${SITE}\n`);

  // 1. Search Console data
  let token = null;
  try { token = await getAccessToken(); } catch (e) { log(`⚠️ SC not connected: ${e.message}\n`); }
  if (token) {
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 28 * 864e5).toISOString().slice(0, 10);
    const q = await scQuery(token, '/searchanalytics/query', {
      startDate: start, endDate: end, dimensions: ['query'], rowLimit: 50,
    });
    const rows = q.rows || [];
    log(`## Search Console (last 28d): ${rows.length} queries`);
    const page2 = rows.filter((r) => r.position > 10 && r.position <= 30)
      .sort((a, b) => b.impressions - a.impressions).slice(0, 10);
    const nearPage1 = rows.filter((r) => r.position >= 4 && r.position <= 10)
      .sort((a, b) => b.impressions - a.impressions).slice(0, 10);
    if (page2.length) {
      log(`\n### High-impression, page-2/3 queries (push to page 1):`);
      for (const r of page2) {
        log(`- "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp, CTR ${(r.ctr * 100).toFixed(1)}%`);
        opps.push({ pri: 'high', impact: r.impressions, text: `Boost "${r.keys[0]}" (pos ${r.position.toFixed(1)}): internal-link from related posts, tighten title/meta, add FAQ.` });
      }
    }
    if (nearPage1.length) {
      log(`\n### Page-1-adjacent (pos 4-10, almost there):`);
      for (const r of nearPage1) {
        log(`- "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp`);
        opps.push({ pri: 'med', impact: r.impressions, text: `Nudge "${r.keys[0]}" (pos ${r.position.toFixed(1)}) onto page 1: add 1-2 internal links + refresh content.` });
      }
    }
    // Index coverage via sitemaps
    const sm = await scQuery(token, '/sitemaps');
    const maps = (sm.sitemap || []);
    if (maps.length) {
      const m = maps[0];
      log(`\n### Sitemap coverage: ${m.contents?.[0]?.submitted || '?'} submitted / ${m.contents?.[0]?.indexed || '?'} indexed`);
      const gap = (m.contents?.[0]?.submitted || 0) - (m.contents?.[0]?.indexed || 0);
      if (gap > 0) opps.push({ pri: 'med', impact: gap, text: `${gap} URLs in sitemap not yet indexed — request indexing / check quality.` });
    }
    log('');
  }

  // 2. On-page audit of generated posts
  const posts = publishedPosts();
  log(`## On-page audit: ${posts.length} published posts`);
  const thin = posts.filter((p) => p.words < 650);
  const noLink = posts.filter((p) => !p.hasLink);
  const badMeta = posts.filter((p) => p.meta.length < 80 || p.meta.length > 160);
  if (thin.length) { log(`- ${thin.length} thin posts (<650w): ${thin.map((p) => p.slug).join(', ')}`); opps.push({ pri: 'med', impact: thin.length * 50, text: `Expand ${thin.length} thin posts to 700+ words.` }); }
  if (noLink.length) { log(`- ${noLink.length} posts missing internal link: ${noLink.map((p) => p.slug).join(', ')}`); opps.push({ pri: 'high', impact: noLink.length * 80, text: `Add MatchByBirth internal link to ${noLink.length} posts (authority + conversion).` }); }
  if (badMeta.length) { log(`- ${badMeta.length} posts with off-length meta description`); opps.push({ pri: 'low', impact: badMeta.length * 20, text: `Fix meta descriptions (80-160 chars) on ${badMeta.length} posts.` }); }
  log('');

  // 3. Technical check on key URLs (hit a real pre-rendered article + key pages)
  log(`## Technical check:`);
  for (const p of ['/', '/blog', '/blog/uranus-retrograde-2026']) {
    const c = await checkPage(p);
    const flags = [];
    if (!c.hasJsonLd && p !== '/blog') flags.push('no JSON-LD');
    if (!c.hasCanonical && p === '/blog/uranus-retrograde-2026') flags.push('no canonical');
    log(`- ${p} → ${c.status}${flags.length ? ' ⚠️ ' + flags.join(', ') : ' ✓'}`);
    if (flags.length) opps.push({ pri: 'low', impact: 30, text: `Fix on ${p}: ${flags.join(', ')}.` });
  }
  log('');

  // 5. Ranked opportunities
  log(`## RANKED OPPORTUNITIES (do top-first)`);
  for (const o of rank(opps)) {
    const tag = o.pri === 'high' ? '🔴' : o.pri === 'med' ? '🟡' : '🟢';
    log(`${tag} [${o.pri}] ${o.text}`);
  }

  // 6. Append to Obsidian if path given
  const obPath = process.env.OPPORTUNITIES_PATH;
  if (obPath && fs.existsSync(obPath)) {
    fs.appendFileSync(obPath, '\n\n' + lines.join('\n'));
    log(`\n✅ Appended report to ${obPath}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
