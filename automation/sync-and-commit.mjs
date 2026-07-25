// Regenerate src/data/posts/sanity-posts.generated.js from Sanity (with the
// write token, which also has read) and commit it so the Vercel build picks up
// new posts without needing Sanity credentials in the Vercel build environment.
// We inject the token into the fetch so the query bypasses the public CDN cache
// and sees freshly-published docs immediately.
import { execSync } from 'node:child_process';

const repoRoot = new URL('../', import.meta.url).pathname;
process.chdir(repoRoot);

const token = process.env.SANITY_API_TOKEN;
const outputPath = 'apps/web/src/data/posts/sanity-posts.generated.js';

// Wrap global fetch to add the Authorization header (bypasses cache) and a
// cache-buster so freshly-published docs are visible immediately.
const origFetch = globalThis.fetch;
globalThis.fetch = (url, opts = {}) => {
  let u = url;
  if (typeof u === 'string' && u.includes('api.sanity.io/v') && u.includes('/data/query/')) {
    u = u + (u.includes('?') ? '&' : '?') + '_cachebust=' + Date.now();
  }
  return origFetch(u, { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } });
};

try {
  const mod = await import(`../apps/web/tools/sync-sanity-posts.js`);
  const posts = await mod.fetchSanityBlogPosts({ fetchImpl: globalThis.fetch });
  console.log(`[sync] fetched ${posts.length} posts:`, posts.map((p) => p.slug).join(', '));
} catch (e) {
  console.error('[sync] failed:', e.message);
  process.exit(1);
}

const status = execSync(`git status --porcelain ${outputPath}`).toString().trim();
if (!status) {
  console.log('[sync] generated file unchanged; nothing to commit.');
  process.exit(0);
}

const ts = new Date().toISOString();
execSync('git config user.email "bot@matchbybirth.com"');
execSync('git config user.name "Blog Automation"');
execSync(`git add ${outputPath}`);
execSync(`git commit -m "chore: regenerate Sanity blog posts (${ts})"`);
execSync('git push origin main');
console.log('[sync] committed + pushed updated generated posts.');
