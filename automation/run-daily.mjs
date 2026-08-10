// Daily orchestrator: pick topic -> draft -> slop gate -> publish to Sanity.
// Runs from GitHub Actions at 0 15 * * * (08:00 PT). Reads secrets at runtime.
import { execSync } from 'node:child_process';
import { nextTopic, markPublished } from './queue.mjs';
import { draftPost } from './editorial.mjs';
import { publishPost } from './publish.mjs';
import { analyzeDraftQuality, maxSimilarityToCorpus } from '../studio-matchbybirth/tools/content-quality.mjs';
import fs from 'node:fs';

const AUTO_PUBLISH = process.env.BLOG_AUTO_PUBLISH === '1' || process.env.BLOG_AUTO_PUBLISH === 'true';
const today = new Date().toISOString().slice(0, 10);
const GEN_PATH = 'apps/web/src/data/posts/sanity-posts.generated.js';

// Pull the raw bodies of already-published posts so we can reject near-duplicates.
function publishedBodies() {
  if (!fs.existsSync(GEN_PATH)) return [];
  const src = fs.readFileSync(GEN_PATH, 'utf8');
  return [
    ...[...src.matchAll(/rawBody:\s*"([^"]*)"/g)].map((m) => m[1]),
    ...[...src.matchAll(/body:\s*'([^']*)'/g)].map((m) => m[1]),
  ];
}

async function main() {
  const { topic, exhausted } = await nextTopic(today);
  if (!topic) {
    console.log(exhausted ? '[daily] no eligible topics remain (all slugs taken in Sanity).' : '[daily] no eligible topic today.');
    return;
  }
  console.log(`[daily] topic: ${topic.slug} (${topic.keyword})`);
  const post = await draftPost(topic);
  const q = analyzeDraftQuality(post);
  if (!q.ok) {
    console.error('[daily] draft failed slop gate; skipping.');
    for (const e of q.errors) console.error(' - ' + e);
    process.exit(1);
  }
  // Cross-post uniqueness: reject near-duplicates of already-published posts
  // (e.g. the life-path-N series repeating the same boilerplate). Google
  // penalizes sites with many repetitive AI pages.
  const sim = maxSimilarityToCorpus(post, publishedBodies());
  if (sim > 0.6) {
    console.error(`[daily] draft too similar to existing posts (${Math.round(sim * 100)}% overlap); skipping to avoid duplicate-content penalty.`);
    process.exit(1);
  }
  await publishPost(post, { autoPublish: AUTO_PUBLISH });
  markPublished(topic.slug, today);
  // Regenerate sanity-posts.generated.js and commit+push it. This single push
  // to main is the ONLY deploy trigger: Vercel's Git auto-deploy builds this
  // commit (which includes the new post) after the commit exists, so ordering
  // is always correct. No separate deploy hook — a second trigger would race
  // and risk aliasing a stale build.
  try {
    execSync('node automation/sync-and-commit.mjs', { stdio: 'inherit' });
  } catch (e) {
    console.error('[daily] sync-and-commit failed (non-fatal):', e.message);
  }
  // In draft mode the post is intentionally a Sanity draft, so it is excluded
  // from the generated file until you approve it in the Studio. Don't fail the
  // job on a verify that only makes sense for auto-published posts.
  if (!AUTO_PUBLISH) {
    console.log(`[daily] draft '${topic.slug}' written to Sanity (status: draft). Approve it in the Studio; the next sync run builds + ships it. autoPublish=${AUTO_PUBLISH}`);
    return;
  }
  // Verification (auto-publish only): confirm the just-published slug landed in
  // the generated file (the build input). If normalizeSanityBlogPost dropped it
  // (e.g. missing publishedAt/body), the post is in Sanity but not on the
  // site. Fail loud so the gap is visible; the slug stays queued and the next
  // cron run republishes it correctly.
  if (fs.existsSync(GEN_PATH) && !fs.readFileSync(GEN_PATH, 'utf8').includes(topic.slug)) {
    console.error(`[daily] VERIFY FAIL: ${topic.slug} published to Sanity but missing from generated file — not on site. Will retry next run.`);
    process.exit(1);
  }
  console.log(`[daily] verified ${topic.slug} in generated file. done. autoPublish=${AUTO_PUBLISH}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
