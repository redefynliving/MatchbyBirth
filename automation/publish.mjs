// Convert a markdown post to a Sanity blogPost document and publish it.
// Reuses the project's upsert flow by writing the same shape the Studio uses,
// then flips status to published with a real portable-text body.
import fs from 'node:fs';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2025-01-01';

function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

// Minimal markdown -> Sanity portable text (block array).
function markdownToBlocks(md) {
  const blocks = [];
  const lines = String(md || '').split('\n');
  let list = null;
  const flushList = () => { if (list) { blocks.push(list); list = null; } };
  let para = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({
        _type: 'block',
        _key: `p${blocks.length}${Math.random().toString(36).slice(2, 7)}`,
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: `s${blocks.length}`, text: para.join(' '), marks: [] }],
      });
      para = [];
    }
  };
  const inlineToMarks = (text) => {
    // supports **bold** and [text](url)
    const children = [];
    const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g;
    let last = 0; let m; let i = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) children.push({ _type: 'span', _key: `s${i++}`, text: text.slice(last, m.index), marks: [] });
      if (m[2] !== undefined) children.push({ _type: 'span', _key: `s${i++}`, text: m[2], marks: ['strong'] });
      else children.push({ _type: 'span', _key: `s${i++}`, text: m[3], marks: [] });
      last = regex.lastIndex;
    }
    if (last < text.length) children.push({ _type: 'span', _key: `s${i++}`, text: text.slice(last), marks: [] });
    return children.length ? children : [{ _type: 'span', _key: `s${i++}`, text, marks: [] }];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (/^##\s+/.test(line)) { flushPara(); flushList(); blocks.push({ _type: 'block', _key: `h${blocks.length}${Math.random().toString(36).slice(2, 7)}`, style: 'h2', markDefs: [], children: inlineToMarks(line.slice(3)).map((c) => ({ ...c, _key: c._key })) }); continue; }
    if (/^###\s+/.test(line)) { flushPara(); flushList(); blocks.push({ _type: 'block', _key: `h${blocks.length}${Math.random().toString(36).slice(2, 7)}`, style: 'h3', markDefs: [], children: inlineToMarks(line.slice(4)) }); continue; }
    if (/^[-*]\s+/.test(line)) { flushPara(); if (!list) list = { _type: 'block', _key: `l${blocks.length}${Math.random().toString(36).slice(2, 7)}`, style: 'normal', level: 1, listItem: 'bullet', markDefs: [], children: [] }; list.children.push(...inlineToMarks(line.replace(/^[-*]\s+/, ''))); continue; }
    if (line.trim() === '') { flushPara(); flushList(); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return blocks;
}

export async function publishPost(post, { autoPublish = false } = {}) {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) throw new Error('SANITY_API_TOKEN required to publish.');
  const slug = slugify(post.slug || post.title);
  const now = new Date().toISOString();
  // Published docs MUST use a bare _id (no `drafts.` prefix) or the static
  // build's query `!(_id in path("drafts.**"))` filters them out. Drafts keep
  // the prefix so they appear as drafts in the Studio.
  const _id = autoPublish ? `blogPost.${slug}` : `drafts.blogPost.${slug}`;
  const document = {
    _id,
    _type: 'blogPost',
    title: post.title,
    slug: { _type: 'slug', current: slug },
    status: autoPublish ? 'published' : 'draft',
    approvalStatus: autoPublish ? 'approved' : 'raw',
    aiGenerated: true,
    slopFlags: [],
    excerpt: post.excerpt,
    metaTitle: post.metaTitle || post.title.slice(0, 60),
    metaDescription: post.metaDescription,
    rawBody: post.rawBody,
    body: markdownToBlocks(post.rawBody),
    topic: post.topic || 'birth-matching',
    quickTakeaways: post.quickTakeaways && post.quickTakeaways.length ? post.quickTakeaways : undefined,
    faq: post.faq && post.faq.length ? post.faq : undefined,
    calculatorCta: post.calculatorCta !== false,
    publishedAt: autoPublish ? now : undefined,
  };

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ createOrReplace: document }] }),
  });
  const body = await res.text();
  console.log(`[publish] HTTP ${res.status} | tokenlen=${token.length} | body: ${body}`);
  // Re-query immediately with token to confirm persistence
  try {
    const rq = encodeURIComponent('*[_id=="'+_id+'"][0]{_id,status}');
    const rres = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${rq}`, { headers: { Authorization: `Bearer ${token}` } });
    const rjson = await rres.json();
    console.log(`[publish] re-query _id=${_id}: ${JSON.stringify(rjson.result)}`);
  } catch (e) { console.log('[publish] requery err', e.message); }
  if (!res.ok) {
    console.error(`[publish] Sanity HTTP ${res.status}: ${body}`);
    throw new Error(`Sanity publish failed ${res.status}`);
  }
  // Regression guards: these two bugs silently dropped posts from the static
  // build earlier. Fail loud instead of publishing into the void.
  if (!token || token === '***' || token.startsWith('***')) {
    throw new Error('[publish] SANITY_API_TOKEN missing/masked — write would not persist');
  }
  if (autoPublish && _id.startsWith('drafts.')) {
    throw new Error('[publish] autoPublish doc has drafts. _id — static build would exclude it');
  }
  try {
    const json = JSON.parse(body);
    const mutationErrors = (json.results || []).filter((r) => r.error);
    if (mutationErrors.length) {
      console.error('[publish] Sanity mutation errors:', JSON.stringify(mutationErrors));
      throw new Error('Sanity mutation rejected the document');
    }
  } catch (e) {
    if (e.message.includes('mutation')) throw e;
    // non-JSON body on 200 is unexpected but not fatal
  }
  console.log(`[publish] ${autoPublish ? 'published' : 'drafted'}: ${document._id}`);
  if (!autoPublish) appendDraftLedger(post);
  return document;
}

// Local, token-free record of what the cron drafted, committed to the repo so
// the local `npm run blog:drafts` viewer can list drafts (with live SEO data)
// without Sanity draft-read permission. Only written in draft mode.
function appendDraftLedger(post) {
  try {
    const repoRoot = process.env.GITHUB_WORKSPACE || process.cwd();
    const ledgerPath = `${repoRoot}/automation/draft-ledger.json`;
    let ledger = [];
    try { ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8')); } catch { ledger = []; }
    if (!Array.isArray(ledger)) ledger = [];

    const body = post.rawBody || '';
    const text = body
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[[^\]]+\]\(([^)]+)\)/g, ' $1 ')
      .replace(/[#*_>`~|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const metaDescLen = String(post.metaDescription || '').length;
    const hasInternalLink = /https:\/\/matchbybirth\.com\//i.test(body) || /\/blog\/[a-z0-9-]+/i.test(body) || /\/tools\/[a-z0-9-]+/i.test(body);
    const hasExample = /\b(for example|example:|simple example|imagine|if one person|if someone|a pairing like|scenario)\b/i.test(body);
    const headings = [...body.matchAll(/^\s{0,3}#{2,3}\s+.+$/gm)].length;
    const generic = [
      /\bwhen it comes to\b/i, /\bit'?s important to note\b/i, /\bin today'?s (fast[- ]paced )?world\b/i,
      /\bwhether you'?re\b/i, /\blet'?s dive in\b/i, /\bdelve into\b/i, /\bunlock the secrets\b/i,
      /\bjourney of self[- ]discovery\b/i, /\bat the end of the day\b/i, /\bcommunication is key\b/i,
      /\bopen communication\b/i, /\bmeaningful connection\b/i, /\bdeep dive\b/i, /\bcosmic blueprint\b/i, /\bultimate guide\b/i,
    ].filter((re) => re.test(body)).length;
    const intro = (body.split(/\n\s*\n/).map((p) => p.replace(/[#*_>`~|]/g, ' ').trim()).find(Boolean) || '');
    const weakIntro = /^(compatibility|astrology|numerology|relationships)\s+(is|can be|has long been)\b/i.test(intro) || /^in today'?s\b/i.test(intro) || /^when it comes to\b/i.test(intro) || /^have you ever wondered\b/i.test(intro) || /^whether you'?re\b/i.test(intro);

    const checks = [
      ['wordCount>=650', words >= 650],
      ['metaDesc 80-160', metaDescLen >= 80 && metaDescLen <= 160],
      ['internal link', hasInternalLink],
      ['example/scenario', hasExample],
      ['>=3 headings', headings >= 3],
      ['no weak intro', !weakIntro],
      ['<3 generic phrases', generic < 3],
    ];
    const passed = checks.filter(([, ok]) => ok).length;
    const seoScore = Math.round((passed / checks.length) * 100);

    const entry = {
      slug: slugify(post.slug || post.title),
      title: post.title,
      focusKeyword: post.topic || 'birth-matching',
      metaTitle: post.metaTitle || post.title?.slice(0, 60),
      metaDescription: post.metaDescription,
      wordCount: words,
      headingCount: headings,
      faqCount: Array.isArray(post.faq) ? post.faq.length : 0,
      takeawayCount: Array.isArray(post.quickTakeaways) ? post.quickTakeaways.length : 0,
      seoScore,
      seoChecks: checks.map(([name, ok]) => ({ name, ok })),
      draftedAt: new Date().toISOString(),
      approved: false,
    };
    if (!ledger.find((d) => d.slug === entry.slug)) {
      ledger.unshift(entry);
      fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    }
  } catch (e) {
    console.log('[publish] ledger write skipped:', e.message);
  }
}

// Trigger Vercel deploy hook so the static site rebuilds with the new post.
export async function triggerDeploy() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) { console.log('[publish] no VERCEL_DEPLOY_HOOK set; skipping deploy trigger.'); return; }
  const res = await fetch(hook, { method: 'POST' });
  console.log(`[publish] deploy hook ${res.status}`);
}
