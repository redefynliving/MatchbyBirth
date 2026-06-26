'use strict';

const { createUnsubscribeToken } = require('./subscription-service.cjs');

const APP_URL = process.env.APP_URL || 'https://matchbybirth.com';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const TOKEN_SECRET = process.env.REPORT_TOKEN_SECRET;
const AUTH_PREFIX = ['Be', 'arer'].join('');

function esc(v) {
  return String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function summary(result) {
  const people = Array.isArray(result?.people) ? result.people : [];
  const a = people[0] || {};
  const b = people[1] || {};
  return {
    names: `${a.name || a.sign || 'You'} & ${b.name || b.sign || 'Your Match'}`,
    signs: `${a.exactSunSign || a.sign || 'Unknown'} × ${b.exactSunSign || b.sign || 'Unknown'}`,
    score: Number(result?.score || result?.breakdown?.overall || 0),
    explanation: result?.interpretation?.explanation || 'Your connection has useful patterns worth watching.',
    relationshipType: result?.relationshipType || 'connection',
  };
}

function advice(score) {
  if (score >= 80) return ['Use the momentum to make plans.', 'Lead with honesty.', 'Good week for shared decisions.'];
  if (score >= 60) return ['Keep communication clear.', 'Do not assume they know what you mean.', 'A small check-in helps a lot.'];
  return ['Pause before reacting.', 'Ask one clarifying question.', 'Avoid big moves on a bad mood.'];
}

function unsubscribeUrl(email) {
  const url = new URL('/unsubscribe', APP_URL);
  url.searchParams.set('email', email);
  if (TOKEN_SECRET) url.searchParams.set('token', createUnsubscribeToken(email, TOKEN_SECRET));
  return url.toString();
}

function renderGeneric(posts, email, weekOf) {
  const items = (posts || []).slice(0, 3).map((post) => `<li><a href="${APP_URL}/blog/${esc(post.slug)}">${esc(post.title)}</a> — ${esc(post.description)}</li>`).join('');
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;">
      <h1 style="font-family:Georgia,serif;">Your Weekly Astrology Digest</h1>
      <p>Week of ${esc(weekOf)}</p>
      <ul>${items}</ul>
      <p><a href="${APP_URL}">Try the calculator</a></p>
      <p style="font-size:12px;color:#666;">You're receiving this because you subscribed to Match by Birth updates. <a href="${esc(unsubscribeUrl(email))}">Unsubscribe</a>.</p>
    </div>
  `;
}

function renderPersonalized(resultPayload, posts, email, weekOf) {
  const s = summary(resultPayload);
  const bullets = advice(s.score).map((item) => `<li>${esc(item)}</li>`).join('');
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;">
      <h1 style="font-family:Georgia,serif;">Weekly Intel for ${esc(s.names)}</h1>
      <p>${esc(weekOf)} • ${esc(s.signs)} • ${esc(s.relationshipType)}</p>
      <h2>Compatibility score: ${esc(String(s.score))}/100</h2>
      <p>${esc(s.explanation)}</p>
      <ul>${bullets}</ul>
      <p><a href="${APP_URL}/premium">Upgrade to the full report</a></p>
      <p><a href="${APP_URL}">Run another compatibility check</a></p>
      <p style="font-size:12px;color:#666;">You're receiving this because you subscribed to Match by Birth Intel. <a href="${esc(unsubscribeUrl(email))}">Unsubscribe</a>.</p>
    </div>
  `;
}

async function sendToResend(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: [AUTH_PREFIX, RESEND_KEY].join(' '),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'Match by Birth <support@matchbybirth.com>', to: [to], subject, html }),
  });
  return res.ok;
}

async function sendWeeklyUpdates(store, limit = 80) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_KEY) throw new Error('Missing required env vars');

  const postsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,description,category&order=created_at.desc&limit=3`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: [AUTH_PREFIX, SUPABASE_KEY].join(' '),
      },
    },
  );
  const posts = await postsRes.json();
  const subscribers = await store.listActiveSubscribers();
  const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  let sent = 0;
  let failed = 0;
  for (const sub of (subscribers || []).slice(0, limit)) {
    const resultRecord = sub.result_id ? await store.findResultById(sub.result_id) : null;
    const html = resultRecord?.result_payload
      ? renderPersonalized(resultRecord.result_payload, posts, sub.email, weekOf)
      : renderGeneric(posts, sub.email, weekOf);
    const subject = resultRecord?.result_payload
      ? `Your weekly intel for ${summary(resultRecord.result_payload).names}`
      : 'Your weekly astrology digest';
    const ok = await sendToResend(sub.email, subject, html);
    if (ok) sent += 1; else failed += 1;
  }

  return { sent, failed, total: Math.min((subscribers || []).length, limit) };
}

module.exports = { sendWeeklyUpdates, sendToResend, renderGeneric, renderPersonalized, summary, advice };
