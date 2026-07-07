'use strict';

const store = require('./supabase-store.cjs');
const { getSharedResult } = require('./result-service.cjs');
const { buildShareCardSvg } = require('./share-card.cjs');

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const shareSlug = req.query?.share || url.searchParams.get('share');
    const shared = await getSharedResult(shareSlug, store);
    const svg = buildShareCardSvg(shared.result);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return res.status(200).end(svg);
  } catch {
    return res.status(404).end('Result not found');
  }
};
