#!/usr/bin/env node
// AI-visibility tracker analyzer (schema matches AI Visibility Baseline 2026.csv).
//
// Usage:
//   node analyze.mjs tracker-2026-08.csv [tracker-2026-09.csv ...]
//
// Reads one or more monthly tracker CSVs (long format, one row per
// day x prompt x AI system) and reports:
//   - completion rate (how many result fields are filled) overall and by system
//   - citation / appearance rate per AI system (ONLY when results are populated)
//   - brand/entity "framework" mention rate (framework_wording captured)
//   - competitor frequency
//   - any incorrect claims flagged for follow-up
//   - month-over-month delta when 2+ months are supplied AND both have results
//
// IMPORTANT (control-month behavior):
//   Blank result fields are treated as INCOMPLETE, not "no".
//   Performance rates (appearances, citations, framework capture) are NOT
//   calculated until result fields are populated. The tool reports completion
//   and explicitly labels months as incomplete baselines.
//
// Schema columns:
//   date, ai_system, system_version, prompt, intent_group,
//   appears, placement, cited_or_linked, framework_wording,
//   competitors, incorrect_claims, notes
//
// The month bucket is derived from `date` (YYYY-MM-DD -> YYYY-MM).

import fs from 'node:fs';

function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function load(file) {
  const text = fs.readFileSync(file, 'utf8').trim();
  const rows = parseCsv(text);
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length >= header.length && r[0])
    .map((r) => {
      const obj = {};
      header.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
      return obj;
    });
}

function monthOf(date) { return (date || '').slice(0, 7) || 'unknown'; }
function pct(n, d) { return d ? `${Math.round((n / d) * 100)}%` : 'n/a'; }

// A row's result is "complete" only when these required fields are populated.
const REQUIRED_RESULT_FIELDS = ['appears', 'placement', 'cited_or_linked'];

function isYes(v) { return /^(y|yes|true|1)$/i.test(v || ''); }
function isNo(v) { return /^(n|no|false|0)$/i.test(v || ''); }

function summarize(rows, label) {
  const systems = [...new Set(rows.map((r) => r.ai_system).filter(Boolean))];
  console.log(`\n=== ${label} (${rows.length} checks) ===`);

  // Completion rate (overall + per system)
  const totalRequired = rows.length * REQUIRED_RESULT_FIELDS.length;
  let filledRequired = 0;
  const sysComplete = {};
  for (const sys of systems) {
    const s = rows.filter((r) => r.ai_system === sys);
    let filled = 0;
    s.forEach((r) => REQUIRED_RESULT_FIELDS.forEach((f) => { if (r[f]) filled += 1; }));
    sysComplete[sys] = { filled, total: s.length * REQUIRED_RESULT_FIELDS.length };
    filledRequired += filled;
  }
  console.log(`  Baseline completion: ${pct(filledRequired, totalRequired)} (${filledRequired}/${totalRequired} required fields filled)`);
  for (const sys of systems) {
    const c = sysComplete[sys];
    console.log(`    ${sys.padEnd(22)} ${pct(c.filled, c.total)} (${c.filled}/${c.total})`);
  }

  const anyFilled = filledRequired > 0;
  if (!anyFilled) {
    console.log('  STATUS: INCOMPLETE BASELINE — result fields blank. Performance rates suppressed.');
    console.log('  Data-entry required before this month can be scored. Fill appears/placement/cited_or_linked.');
    return;
  }

  // If SOME rows are filled but not all, warn but still show partial rates.
  if (filledRequired < totalRequired) {
    console.log('  STATUS: PARTIAL — some rows still blank. Rates below computed on populated rows only.');
  }

  // Performance rates (only over rows that have a populated appears field)
  for (const sys of systems) {
    const s = rows.filter((r) => r.ai_system === sys && r.appears !== '');
    const appears = s.filter((r) => isYes(r.appears)).length;
    const cited = s.filter((r) => isYes(r.cited_or_linked)).length;
    console.log(`  ${sys.padEnd(22)} appears ${pct(appears, s.length)} (${appears}/${s.length})  cited/linked ${pct(cited, s.length)} (${cited}/${s.length})`);
  }

  const entity = rows.filter((r) => r.intent_group === 'brand_entity' && r.appears !== '');
  const fw = entity.filter((r) => r.framework_wording && r.framework_wording !== '-').length;
  if (entity.length) {
    console.log(`  Brand/entity framework wording captured: ${pct(fw, entity.length)} (${fw}/${entity.length})`);
  }

  const comp = {};
  rows.forEach((r) => {
    (r.competitors || '').split(/[;|]/).map((c) => c.trim()).filter(Boolean).forEach((c) => { comp[c] = (comp[c] || 0) + 1; });
  });
  const compEntries = Object.entries(comp).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (compEntries.length) {
    console.log('  Top competitors surfaced:');
    compEntries.forEach(([c, n]) => console.log(`    ${n}x  ${c}`));
  }

  const claims = rows.filter((r) => r.incorrect_claims && r.incorrect_claims !== '-');
  if (claims.length) {
    console.log('  Incorrect claims to fix:');
    claims.forEach((r) => console.log(`    [${r.ai_system}] "${r.prompt}" -> ${r.incorrect_claims}`));
  }
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node analyze.mjs tracker-YYYY-MM.csv [another.csv ...]');
  process.exit(1);
}

const byMonth = {};
for (const f of files) {
  const rows = load(f);
  const m = monthOf([...new Set(rows.map((r) => r.date))][0] || f);
  byMonth[m] = (byMonth[m] || []).concat(rows);
}

const months = Object.keys(byMonth).sort();
months.forEach((m) => summarize(byMonth[m], `Month: ${m}`));

if (months.length >= 2) {
  const a = byMonth[months[0]];
  const b = byMonth[months[1]];
  const aFilled = a.some((r) => r.appears !== '');
  const bFilled = b.some((r) => r.appears !== '');
  if (aFilled && bFilled) {
    console.log('\n=== Month-over-month (citation rate by system) ===');
    const systems = [...new Set(a.map((r) => r.ai_system))];
    console.log(`  ${'system'.padEnd(22)} ${months[0]} -> ${months[1]}  delta`);
    for (const sys of systems) {
      const sa = a.filter((r) => r.ai_system === sys && r.appears !== '');
      const sb = b.filter((r) => r.ai_system === sys && r.appears !== '');
      const ca = sa.filter((r) => isYes(r.cited_or_linked)).length;
      const cb = sb.filter((r) => isYes(r.cited_or_linked)).length;
      const ra = sa.length ? Math.round((ca / sa.length) * 100) : 0;
      const rb = sb.length ? Math.round((cb / sb.length) * 100) : 0;
      console.log(`  ${sys.padEnd(22)} ${String(ra).padStart(3)}% -> ${String(rb).padStart(3)}%  ${rb - ra >= 0 ? '+' : ''}${rb - ra}pts`);
    }
  } else {
    console.log('\n=== Month-over-month skipped ===');
    console.log('  At least one compared month has no populated results yet. Fill result fields in both months first.');
  }
}
