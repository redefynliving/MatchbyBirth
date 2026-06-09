'use strict';

const store = require('./lib/supabase-store.cjs');
const { getSharedResult } = require('./lib/result-service.cjs');

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const shareSlug = req.query?.share || url.searchParams.get('share');
    const shared = await getSharedResult(shareSlug, store);
    const { result } = shared;
    const names = result.mode === 'group'
      ? `${result.people.length} friends`
      : result.people.map((person) => person.name).join(' & ');
    const label = result.mode === 'group'
      ? 'Group compatibility'
      : result.interpretation.label;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#fbf8f3"/>
      <circle cx="600" cy="315" r="245" fill="#f3eef7"/>
      <text x="600" y="118" font-family="Arial,sans-serif" font-size="24" letter-spacing="5" fill="#756b82" text-anchor="middle">MATCH BY BIRTH</text>
      <text x="600" y="245" font-family="Georgia,serif" font-size="58" fill="#26212b" text-anchor="middle">${escapeXml(names)}</text>
      <text x="600" y="405" font-family="Georgia,serif" font-size="132" fill="#6d4ca0" text-anchor="middle">${escapeXml(result.score)}%</text>
      <text x="600" y="482" font-family="Arial,sans-serif" font-size="30" fill="#756b82" text-anchor="middle">${escapeXml(label)}</text>
      <text x="600" y="574" font-family="Arial,sans-serif" font-size="22" fill="#8b8390" text-anchor="middle">matchbybirth.com</text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return res.status(200).end(svg);
  } catch {
    return res.status(404).end('Result not found');
  }
};
