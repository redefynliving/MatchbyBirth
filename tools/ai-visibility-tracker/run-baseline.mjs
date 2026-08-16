#!/usr/bin/env node
// Automated AI-visibility baseline collector — GEMINI ONLY (observation, no fabrication).
//
// Fires the high-value prompts (brand_entity + methodology) at Gemini via its
// REST API, captures the REAL response text, and fills the matching rows in
// tracker-2026-08.csv with honest, extracted signals:
//   appears        -> response mentions "MatchByBirth" / "Match by Birth"
//   cited_or_linked-> response contains a matchbybirth.com URL
//   placement      -> cited-only (has URL) | mentioned (named, no URL) | not-present
//   framework_wording -> for prompts 1 & 4, the sentence describing the framework
//   system_version -> model id used
// Raw responses are saved to responses-YYYY-MM.jsonl for human verification.
//
// Scope is deliberately small (15 prompts x 1 system) — the framework-entity
// signal, not the 200-row commodity chore. ChatGPT/Perplexity excluded: no API
// keys available (OpenAI needs a card; Perplexity key not provisioned).
//
// Key: GEMINI_API_KEY  (free, https://aistudio.google.com/apikey)
// Model override via env: GEMINI_MODEL
//
// Usage:
//   GEMINI_API_KEY=... node run-baseline.mjs
//
// Nothing is deployed, submitted, or committed. This is a measurement tool.

import fs from 'node:fs';

const CSV = 'tracker-2026-08.csv';
const HIGH_VALUE = new Set(['brand_entity', 'methodology']);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

function parseCsv(text) {
  const rows = [];
  let field = '', row = [], inQ = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvCell(v) {
  v = (v ?? '').toString();
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

async function callGemini(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const j = await res.json();
  if (j.error) throw new Error(`API ${j.error.code}: ${j.error.message}`);
  return j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
}

// Extract the sentence that describes the framework, if present.
function extractFrameworkWording(text) {
  const m = text.match(/[^.!?]*(?:MatchByBirth Compatibility Framework|Compatibility Framework|Overall Harmony[^.!?]*Conflict Risk)[^.!?]*[.!?]/i);
  return m ? m[0].trim() : '-';
}

function fillRow(row, { text, model }) {
  const lower = text.toLowerCase();
  const appears = /matchbybirth|match by birth/.test(lower);
  const cited = /matchbybirth\.com/i.test(text);
  row[5] = appears ? 'yes' : 'no';                                   // appears
  row[6] = !appears ? 'not-present' : cited ? 'cited-only' : 'mentioned'; // placement
  row[7] = cited ? 'yes' : 'no';                                      // cited_or_linked
  row[9] = '-';                                                       // competitors (manual)
  row[10] = '-';                                                     // incorrect_claims (manual)
  row[11] = `model:${model}`;                                        // notes
}

async function main() {
  const raw = fs.readFileSync(CSV, 'utf8').trim().split('\n');
  const header = raw[0].split(',');
  const rows = parseCsv(raw.slice(1).join('\n'));
  const responses = [];

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('No GEMINI_API_KEY set. Put it in env and re-run (do NOT paste in chat).');
    process.exit(1);
  }

  const idx = new Map();
  rows.forEach((r, i) => idx.set(`${r[1]}|${r[3]}`, i));

  const targets = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r[1] === 'Gemini' && HIGH_VALUE.has(r[4]));
  console.log(`[Gemini] ${targets.length} high-value prompts...`);

  for (const { r, i } of targets) {
    const prompt = r[3];
    try {
      const text = await callGemini(key, prompt);
      responses.push({ system: 'Gemini', model: GEMINI_MODEL, prompt, text });
      fillRow(r, { text, model: GEMINI_MODEL });
      if (/Compatibility Framework\?/i.test(prompt)) {
        r[8] = extractFrameworkWording(text);
      } else {
        r[8] = '-';
      }
      console.log(`  ${prompt.slice(0, 50)}... -> appears=${r[5]} placement=${r[6]}`);
    } catch (e) {
      r[5] = 'unknown'; r[6] = 'unavailable'; r[7] = 'unknown'; r[11] = `ERROR:${e.message}`;
      console.log(`  ${prompt.slice(0, 50)}... -> ERROR ${e.message}`);
    }
  }

  const out = [header.join(',')].concat(rows.map((r) => r.map(csvCell).join(','))).join('\n') + '\n';
  fs.writeFileSync(CSV, out);
  const month = '2026-08';
  fs.writeFileSync(`responses-${month}.jsonl`, responses.map((x) => JSON.stringify(x)).join('\n') + '\n');
  console.log(`\nWrote ${responses.length} raw responses to responses-${month}.jsonl`);
  console.log(`Updated ${CSV}. Run: node analyze.mjs ${CSV}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
