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
  if (!res.ok) {
    console.error(`[publish] Sanity HTTP ${res.status}: ${body}`);
    throw new Error(`Sanity publish failed ${res.status}`);
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
  return document;
}

// Trigger Vercel deploy hook so the static site rebuilds with the new post.
export async function triggerDeploy() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) { console.log('[publish] no VERCEL_DEPLOY_HOOK set; skipping deploy trigger.'); return; }
  const res = await fetch(hook, { method: 'POST' });
  console.log(`[publish] deploy hook ${res.status}`);
}
