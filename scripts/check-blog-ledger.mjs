#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const ledgerPath = path.join(repoRoot, 'docs', 'blog-ledger.json');
const postsPath = path.join(repoRoot, 'apps', 'web', 'src', 'data', 'posts', 'index.js');

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const postsText = fs.readFileSync(postsPath, 'utf8');
const existingSlugs = [...postsText.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const existingSet = new Set(existingSlugs);

const queue = Array.isArray(ledger.queue) ? ledger.queue : [];
const queueSlugs = queue.map((item) => item.slug);
const duplicateQueueSlugs = queueSlugs.filter((slug, idx) => queueSlugs.indexOf(slug) !== idx);
const collisions = queueSlugs.filter((slug) => existingSet.has(slug));
const allowedStatuses = new Set(['planned', 'drafted', 'awaiting_approval', 'approved', 'scheduled', 'published']);
const badStatuses = queue.filter((item) => !allowedStatuses.has(item.status)).map((item) => item.slug);

const nowPlanned = queue.filter((item) => item.status === 'planned').slice(0, 5).map((item) => `${item.publish_date} | ${item.slug} | ${item.title}`);

console.log(JSON.stringify({
  existing_posts: existingSlugs.length,
  ledger_items: queue.length,
  duplicate_queue_slugs: duplicateQueueSlugs,
  colliding_slugs: collisions,
  bad_statuses: badStatuses,
  next_planned: nowPlanned,
}, null, 2));

if (duplicateQueueSlugs.length || collisions.length || badStatuses.length) {
  process.exit(1);
}
