// Keep the daily blog queue ahead of the generator.
// Runs weekly in GitHub Actions and only adds evergreen topics after:
// 1) checking the live Sanity slug set, and 2) validating the LLM response.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { eligibleTopics } from './queue.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPIC_PATH = path.join(__dirname, 'topics-2026.json');
const PROJECT_ID = process.env.SANITY_PROJECT_ID || '4qj4p6px';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2025-01-01';
const MIN_RUNWAY = Number(process.env.TOPIC_MIN_RUNWAY || 12);
const TARGET_RUNWAY = Number(process.env.TOPIC_TARGET_RUNWAY || 24);
const MAX_NEW = Number(process.env.TOPIC_MAX_NEW || 18);

const SIGN_NAMES = new Set([
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
]);

function loadTopics() {
  return JSON.parse(fs.readFileSync(TOPIC_PATH, 'utf8'));
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function isPairComparison(slug) {
  const signHits = slug.split('-').filter((part) => SIGN_NAMES.has(part));
  return new Set(signHits).size >= 2;
}

function extractTopics(raw) {
  const text = String(raw || '').trim();
  const candidates = [text];
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidates.push(fenced[1].trim());

  const arrayStart = text.indexOf('[');
  const arrayEnd = text.lastIndexOf(']');
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    candidates.push(text.slice(arrayStart, arrayEnd + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.topics)) return parsed.topics;
    } catch {
      // Try the next extraction shape.
    }
  }
  throw new Error('[replenish] LLM did not return a JSON topic array.');
}

async function fetchSanityPosts() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) throw new Error('[replenish] SANITY_API_TOKEN is required.');
  const query = encodeURIComponent(
    '*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current, title }',
  );
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`[replenish] Sanity query failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.result) ? data.result : [];
}

async function callLLM(prompt) {
  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
  if (!url || !key) throw new Error('[replenish] LLM_API_URL and LLM_API_KEY are required.');

  const res = await fetch(`${url.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: [
            'You are the Match by Birth editorial strategist.',
            'Generate original evergreen SEO topic ideas for an astrology and compatibility SaaS.',
            'Prioritize search intent and a clear path to the free compatibility calculator.',
            'Do not invent dates, planetary positions, statistics, or sources.',
            'Do not generate pair-comparison topics such as Aries and Scorpio compatibility.',
            'Return ONLY a JSON array. No markdown, commentary, or code fences.',
          ].join(' '),
        },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`[replenish] LLM request failed: ${res.status}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('[replenish] LLM returned no content.');
  return content;
}

function validateCandidates(rawCandidates, config, occupied) {
  const allowed = new Set(Object.keys(config.categories));
  const categoryAliases = new Map(
    Object.entries(config.categories).flatMap(([key, label]) => [
      [key, key],
      [String(label).trim().toLowerCase(), key],
    ]),
  );
  const seen = new Set();
  const accepted = [];
  const rejected = [];

  for (const raw of rawCandidates) {
    const slug = slugify(raw?.slug || raw?.title);
    const keyword = String(raw?.keyword || '').trim();
    const angle = String(raw?.angle || '').trim();
    const rawCategory = String(raw?.category || '').trim().toLowerCase();
    const category = categoryAliases.get(rawCategory) || rawCategory;
    const title = String(raw?.title || '').trim();

    let reason = '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(slug)) reason = 'invalid slug';
    else if (occupied.has(slug) || seen.has(slug)) reason = 'duplicate slug';
    else if (isPairComparison(slug)) reason = 'pair-comparison slug';
    else if (!allowed.has(category)) reason = `invalid category: ${category}`;
    else if (keyword.length < 8 || keyword.length > 120) reason = 'keyword length';
    else if (angle.length < 30 || angle.length > 240) reason = 'angle length';
    else if (title.length < 12 || title.length > 90) reason = 'title length';

    if (reason) {
      rejected.push(`${slug || '(missing slug)'}: ${reason}`);
      continue;
    }

    seen.add(slug);
    accepted.push({ slug, keyword, angle, category, title });
  }

  return { accepted, rejected };
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const config = loadTopics();
  const { eligible } = await eligibleTopics(today, { strict: true });
  const livePosts = await fetchSanityPosts();
  const occupied = new Set([
    ...config.seasonal.map((topic) => topic.slug),
    ...config.evergreen.map((topic) => topic.slug),
    ...livePosts.map((post) => post.slug).filter(Boolean),
  ]);
  const futureSeasonal = config.seasonal.filter((topic) => topic.date >= today).length;

  console.log(`[replenish] ${eligible.length} eligible topics remain; ${futureSeasonal} future seasonal topics are scheduled.`);
  if (futureSeasonal < 2) {
    console.warn(`::warning::Only ${futureSeasonal} future seasonal topics remain. Refresh the seasonal calendar with verified dates.`);
  }
  if (eligible.length >= MIN_RUNWAY) {
    console.log(`[replenish] runway is healthy (minimum ${MIN_RUNWAY}); no changes needed.`);
    return;
  }

  const needed = Math.min(MAX_NEW, Math.max(6, TARGET_RUNWAY - eligible.length));
  const existingTopicSummary = [...config.seasonal, ...config.evergreen]
    .slice(-40)
    .map((topic) => `- ${topic.slug} | ${topic.title}`)
    .join('\n');
  const occupiedSummary = [...occupied].slice(-260).join(', ');
  const categories = Object.entries(config.categories).map(([key, label]) => `${key} (${label})`).join(', ');
  const prompt = [
    `Generate ${needed + 6} candidate evergreen topics; the validator will keep the best ${needed}.`,
    `Today is ${today}. These are evergreen only: do not include an event date or time-sensitive claim.`,
    `Allowed categories: ${categories}.`,
    'Use product-relevant themes including compatibility reports, exact birth matching, communication, friendship, family, workplace, numerology, and responsible use.',
    'Each object must contain exactly these useful fields: slug, keyword, angle, category, title.',
    'Slug must be lowercase kebab-case and must not compare two zodiac signs.',
    'Avoid generic variations of existing topics; choose a distinct search question or scenario.',
    `Recent topic examples to avoid repeating:\n${existingTopicSummary}`,
    `Occupied slugs to avoid exactly:\n${occupiedSummary}`,
  ].join('\n\n');

  const raw = await callLLM(prompt);
  const candidates = extractTopics(raw);
  const { accepted, rejected } = validateCandidates(candidates, config, occupied);
  if (accepted.length < needed) {
    throw new Error(`[replenish] only ${accepted.length}/${needed} candidates passed validation. Rejected: ${rejected.join('; ')}`);
  }

  const additions = accepted.slice(0, needed);
  config.evergreen.push(...additions);
  fs.writeFileSync(TOPIC_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log(`::notice::Added ${additions.length} evergreen topics to ${TOPIC_PATH}.`);
  for (const topic of additions) console.log(`[replenish] added ${topic.slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
