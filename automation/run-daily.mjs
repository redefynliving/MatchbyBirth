// Daily orchestrator: pick topic -> draft -> slop gate -> publish to Sanity.
// Runs from GitHub Actions at 0 15 * * * (08:00 PT). Reads secrets at runtime.
import { execSync } from 'node:child_process';
import { nextTopic, markPublished } from './queue.mjs';
import { draftPost } from './editorial.mjs';
import { publishPost, triggerDeploy } from './publish.mjs';
import { analyzeDraftQuality } from '../studio-matchbybirth/tools/content-quality.mjs';

const AUTO_PUBLISH = process.env.BLOG_AUTO_PUBLISH === '1' || process.env.BLOG_AUTO_PUBLISH === 'true';
const today = new Date().toISOString().slice(0, 10);

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
  await publishPost(post, { autoPublish: AUTO_PUBLISH });
  markPublished(topic.slug, today);
  await triggerDeploy();
  // Regenerate the committed generated posts file and push it so the Vercel
  // build (which has no Sanity creds) picks up the new post.
  try {
    execSync('node automation/sync-and-commit.mjs', { stdio: 'inherit' });
  } catch (e) {
    console.error('[daily] sync-and-commit failed (non-fatal):', e.message);
  }
  console.log(`[daily] done. autoPublish=${AUTO_PUBLISH}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
