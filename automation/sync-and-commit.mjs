// Regenerate apps/web/src/data/posts/sanity-posts.generated.js from Sanity and
// commit it so the Vercel build (which has no Sanity creds) picks up new posts.
// Runs in-process so the patched global fetch (auth + cache-bust) applies.
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../..');
const token = process.env.SANITY_API_TOKEN;
const outputPath = path.join(repoRoot, 'apps/web/src/data/posts/sanity-posts.generated.js');

// Patch global fetch: add Authorization so the query bypasses the public CDN
// cache and sees freshly-published docs immediately.
const origFetch = globalThis.fetch;
globalThis.fetch = (url, opts = {}) =>
  origFetch(url, { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } });

try {
  const { fetchSanityBlogPosts, writeSanityPostsModule, writeChangeManifest } = await import(
    path.join(repoRoot, 'apps/web/tools/sanity-posts.js')
  );
  const posts = await fetchSanityBlogPosts({ fetchImpl: globalThis.fetch });
  console.log(`[sync] normalized ${posts.length} posts:`, posts.map((p) => p.slug).join(', '));
  writeChangeManifest({ posts, outputPath });
  writeSanityPostsModule({ posts, outputPath });
} catch (e) {
  console.error('[sync] failed:', e.message);
  process.exit(1);
}

const manifestPath = `${outputPath}.changes.json`;
// Only the generated posts file ships to the site. The .changes.json manifest
// is a transient artifact consumed by the IndexNow step in the same run; its
// regeneration every run would make `git status` look dirty even when no post
// changed, which caused "nothing to commit" crashes on draft-only runs.
const status = execSync(`git status --porcelain ${outputPath}`).toString().trim();
if (!status) {
  console.log('[sync] generated file unchanged; nothing to commit.');
  process.exit(0);
}

const ts = new Date().toISOString();
execSync('git config user.email "bot@matchbybirth.com"');
execSync('git config user.name "Blog Automation"');
execSync('git pull --rebase origin main');
execSync(`git add ${outputPath}`);
execSync(`git commit -m "chore: regenerate Sanity blog posts (${ts})"`);
execSync('git push origin main');
console.log('[sync] committed + pushed updated generated posts.');
