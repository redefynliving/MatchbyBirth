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
const SITEMAP_PATH = path.resolve(SCRIPT_DIR, '../apps/web/public/sitemap.xml');

function usage() {
  console.log(`Usage:
  npm run indexnow -- /blog/changed-page /another-page
  npm run indexnow -- --dry-run /blog/changed-page
  npm run indexnow -- --allow-missing /deleted-page

Submit only URLs that were added, updated, or deleted. Paths are resolved against
${SITE_ORIGIN}. URLs absent from the sitemap are rejected unless --allow-missing
is supplied for a deleted page.`);
}

function readSitemapUrls() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  return new Set(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim()),
  );
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
  const inputs = args.filter((arg) => !arg.startsWith('--'));

  if (args.includes('--help') || inputs.length === 0) {
    usage();
    process.exitCode = inputs.length === 0 && !args.includes('--help') ? 1 : 0;
    return;
  }

  const urls = [...new Set(inputs.map(canonicalUrl))];
  const sitemapUrls = readSitemapUrls();
  const missingUrls = urls.filter((url) => !sitemapUrls.has(url));

  if (missingUrls.length > 0 && !allowMissing) {
    throw new Error(
      `Not found in the sitemap:\n${missingUrls.join('\n')}\n` +
      'Use --allow-missing only when notifying search engines about deleted URLs.',
    );
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
