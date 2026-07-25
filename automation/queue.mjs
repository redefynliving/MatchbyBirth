import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const topics = require('./topics-2026.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, '.published.json');

const LEAD_DAYS = 10;
const PROJECT_ID = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2025-01-01';

function daysBetween(a, b) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); }
  catch { return { published: [] }; }
}
function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// Query Sanity for slugs already used (published or draft). Prevents repeats
// against the live blog — pair pages, seasonal posts, life-path posts, etc.
async function existingSlugs() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) return new Set(); // no token: rely on local state only
  const query = encodeURIComponent('*[_type == "blogPost" && defined(slug.current)].slug.current');
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { console.warn(`[queue] Sanity slug query failed ${res.status}; using local state.`); return new Set(); }
    const data = await res.json();
    return new Set((data.result || []).map(String));
  } catch (e) {
    console.warn(`[queue] Sanity slug query error: ${e.message}; using local state.`);
    return new Set();
  }
}

function buildSchedule() {
  const seasonal = topics.seasonal.map((e) => {
    const target = new Date(e.date);
    target.setDate(target.getDate() - LEAD_DAYS);
    return { ...e, target: target.toISOString().slice(0, 10), kind: 'seasonal' };
  }).sort((a, b) => a.target.localeCompare(b.target));
  const evergreen = topics.evergreen.map((e) => ({ ...e, target: '', kind: 'evergreen' }));
  const master = [...seasonal];
  const step = Math.max(1, Math.floor(seasonal.length / (evergreen.length + 1)));
  evergreen.forEach((e, i) => master.splice(Math.min(master.length, i * step + i + 1), 0, e));
  return master;
}

export async function nextTopic(today = new Date().toISOString().slice(0, 10)) {
  const state = loadState();
  const recent = new Set(
    state.published.filter((p) => daysBetween(p.date, today) < 60).map((p) => p.slug),
  );
  const taken = await existingSlugs();
  const schedule = buildSchedule();
  const eligible = schedule.filter((t) => !recent.has(t.slug) && !taken.has(t.slug));
  const todays = eligible.find((t) => t.kind === 'seasonal' && t.target === today);
  if (todays) return { topic: todays, state };
  const next = eligible[0];
  if (next) return { topic: next, state };
  return { topic: null, state, exhausted: eligible.length === 0 };
}

export function markPublished(slug, today) {
  const state = loadState();
  if (!state.published.find((p) => p.slug === slug)) {
    state.published.push({ slug, date: today });
    saveState(state);
  }
}

export function publishedCount() {
  return loadState().published.length;
}
