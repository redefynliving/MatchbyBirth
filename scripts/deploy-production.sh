#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PUBLIC_SITE="${PUBLIC_SITE:-https://matchbybirth.com}"

echo "==> Match by Birth production deploy"
echo "Project: $(node -e "const p=require('./.vercel/project.json'); console.log(p.projectName + ' / ' + p.projectId)" 2>/dev/null || echo 'not linked')"
echo

if [[ ! -f ".vercel/project.json" ]]; then
  echo "This folder is not linked to Vercel yet."
  echo "Run: npx vercel@latest login"
  echo "Then: npx vercel@latest link"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required."
  exit 1
fi

echo "==> Building the web app locally"
npm run build --prefix apps/web
echo

echo "==> Deploying to Vercel production"
echo "If Vercel asks you to log in, finish the browser login and run this script again."
npx vercel@latest deploy --prod --yes
echo

echo "==> Checking live production site"
PUBLIC_SITE="$PUBLIC_SITE" node <<'NODE'
const site = process.env.PUBLIC_SITE.replace(/\/$/, '');

async function fetchText(path) {
  const url = path.startsWith('http') ? path : `${site}${path}`;
  const response = await fetch(url, { redirect: 'follow' });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return { url: response.url, text };
}

function assertIncludes(label, text, needle) {
  if (!text.toLowerCase().includes(needle.toLowerCase())) {
    throw new Error(`${label} is missing: ${needle}`);
  }
  console.log(`ok: ${label} includes "${needle}"`);
}

const home = await fetchText('/');
assertIncludes('homepage HTML', home.text, 'Birth Date Compatibility Calculator');

const scripts = [...home.text.matchAll(/src="([^"]*assets\/index-[^"]+\.js)"/g)]
  .map((match) => new URL(match[1], home.url).href);

if (!scripts.length) {
  throw new Error('Could not find homepage JS bundle.');
}

const bundleText = (await Promise.all(scripts.map((script) => fetchText(script))))
  .map((result) => result.text)
  .join('\n');

assertIncludes('homepage bundle', bundleText, 'See how you match');
assertIncludes('homepage bundle', bundleText, 'Weekly compatibility notes');

const sitemap = await fetchText('/sitemap.xml');
assertIncludes('sitemap', sitemap.text, '/blog/what-is-birth-matching');
assertIncludes('sitemap', sitemap.text, '/blog/life-path-number-compatibility-guide');

const article = await fetchText('/blog/what-is-birth-matching');
assertIncludes('article page', article.text, 'What Is Birth Matching?');

console.log(`\nProduction verification passed: ${site}`);
NODE

echo
echo "Done. If the checks passed, you can request AdSense review."
