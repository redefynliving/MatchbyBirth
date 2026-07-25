// Regenerate src/data/posts/sanity-posts.generated.js from Sanity (with the
// write token, which also has read) and commit it so the Vercel build picks up
// new posts without needing Sanity credentials in the Vercel build environment.
import { execSync } from 'node:child_process';

const repoRoot = new URL('../', import.meta.url).pathname;
process.chdir(repoRoot);

const outputPath = 'apps/web/src/data/posts/sanity-posts.generated.js';

try {
  await import(`../apps/web/tools/sync-sanity-posts.js`);
} catch (e) {
  console.error('[sync] failed:', e.message);
  process.exit(1);
}

const status = execSync('git status --porcelain ' + outputPath).toString().trim();
if (!status) {
  console.log('[sync] generated file unchanged; nothing to commit.');
  process.exit(0);
}

const ts = new Date().toISOString();
execSync(`git config user.email "bot@matchbybirth.com"`);
execSync(`git config user.name "Blog Automation"`);
execSync(`git add ${outputPath}`);
execSync(`git commit -m "chore: regenerate Sanity blog posts (${ts})"`);
execSync(`git push origin main`);
console.log('[sync] committed + pushed updated generated posts.');
