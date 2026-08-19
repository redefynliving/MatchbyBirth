#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ORIGIN = 'https://matchbybirth.com';
const SITE_HOST = 'matchbybirth.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '3ba4a20e333342ba8eea9933dfa9bab2';
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_SITEMAP_PATH = path.resolve(SCRIPT_DIR, '../apps/web/public/sitemap.xml');
const LIVE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;

function usage() {
  console.log(`Usage:
  npm run indexnow -- /blog/changed-page /another-page
  npm run indexnow -- --all
  npm run indexnow -- --dry-run /blog/changed-page
  npm run indexnow -- --allow-missing /deleted-page

Submit only URLs that were added, updated, or deleted. Paths are resolved against
${SITE_ORIGIN}. URLs absent from the sitemap are rejected unless --allow-missing
is supplied for a deleted page. Use --all to submit every URL in the sitemap
(e.g. after a deploy, to notify search engines of all current pages).

In CI the local sitemap is gitignored and absent, so this script falls back to
fetching the live sitemap served at ${LIVE_SITEMAP_URL} for validation.`);
}

function parseSitemap(xml) {
  return new Set(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim()),
  );
}

// Resolves the sitemap URL set.
// Returns { urls: Set<string>, source: 'local' | 'live' | 'none' }.
// CI checkouts do not include the gitignored sitemap.xml, so we fall back to
// the live sitemap the site serves. This lets IndexNow validate + submit
// without a full site build inside the workflow.
async function loadSitemapUrls() {
  if (fs.existsSync(LOCAL_SITEMAP_PATH)) {
    try {
      return {
        urls: parseSitemap(fs.readFileSync(LOCAL_SITEMAP_PATH, 'utf8')),
        source: 'local',
      };
    } catch (e) {
      console.warn(`Local sitemap unreadable (${e.message}); falling back to live sitemap.`);
    }
  }
  try {
    const res = await fetch(LIVE_SITEMAP_URL, { redirect: 'follow' });
    if (res.ok) {
      const urls = parseSitemap(await res.text());
      if (urls.size > 0) {
        console.log(`Loaded ${urls.size} URLs from live sitemap (${LIVE_SITEMAP_URL}).`);
        return { urls, source: 'live' };
      }
      console.warn('Live sitemap returned no <loc> entries; skipping validation.');
    } else {
      console.warn(`Live sitemap fetch returned ${res.status}; skipping validation.`);
    }
  } catch (e) {
    console.warn(`Live sitemap fetch failed (${e.message}); skipping validation.`);
  }
  return { urls: new Set(), source: 'none' };
}

function canonicalUrl(input) {
  const url = input.startsWith('/')
    ? new URL(input, SITE_ORIGIN)
    : new URL(input);

  if (url.protocol !== 'https:' || url.hostname !== SITE_HOST) {
    throw new Error(`URL must use ${SITE_ORIGIN}: ${input}`);
  }

  url.hash = '';
  return url.toString();
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const allowMissing = args.includes('--allow-missing');
  const submitAll = args.includes('--all');
  const inputs = args.filter((arg) => !arg.startsWith('--'));

  if (args.includes('--help') || (inputs.length === 0 && !submitAll)) {
    usage();
    process.exitCode = inputs.length === 0 && !args.includes('--help') && !submitAll ? 1 : 0;
    return;
  }

  let urls;
  if (submitAll) {
    const { urls: sitemapUrls, source } = await loadSitemapUrls();
    if (sitemapUrls.size === 0) {
      throw new Error('No URLs found in sitemap (local or live). Build the site or check connectivity.');
    }
    urls = [...sitemapUrls];
    console.log(`Submitting all ${urls.length} sitemap URLs to IndexNow (source: ${source}).`);
  } else {
    urls = [...new Set(inputs.map(canonicalUrl))];
    const { urls: sitemapUrls, source } = await loadSitemapUrls();
    if (source === 'local' && !allowMissing) {
      // Strict mode only with a trusted local sitemap (dev typo guard).
      const missingUrls = urls.filter((url) => !sitemapUrls.has(url));
      if (missingUrls.length > 0) {
        throw new Error(
          `Not found in the sitemap:\n${missingUrls.join('\n')}\n` +
            'Use --allow-missing only when notifying search engines about deleted URLs.',
        );
      }
    } else if (source === 'live' && !allowMissing) {
      // Live sitemap present but a URL is missing: usually a just-deployed
      // post whose sitemap hasn't rebuilt yet. Submit anyway (best effort).
      const missingUrls = urls.filter((url) => !sitemapUrls.has(url));
      if (missingUrls.length > 0) {
        console.warn(
          `Not yet in the live sitemap (likely a fresh deploy); submitting anyway:\n${missingUrls.join('\n')}`,
        );
      }
    }
    // source === 'none': no sitemap available; submit blind (best effort).
  }

  const body = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  if (dryRun) {
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (response.status !== 200 && response.status !== 202) {
    const responseBody = await response.text();
    throw new Error(
      `IndexNow rejected the submission (${response.status})${responseBody ? `: ${responseBody}` : ''}`,
    );
  }

  console.log(`IndexNow accepted ${urls.length} URL${urls.length === 1 ? '' : 's'} (${response.status}).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
