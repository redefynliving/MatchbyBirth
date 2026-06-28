#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import posts from '../src/data/posts/index.js';
import { BLOG_CATEGORIES } from '../src/data/blogCategories.js';
import { getZodiacPairingPages } from '../../../tools/zodiac-pairings.mjs';

const SITE_URL = 'https://matchbybirth.com';
const PUBLIC_PAGES = [
  '/',
  '/about',
  '/faq',
  '/how-it-works',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimers',
  '/premium',
];

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function normalizePath(pagePath) {
  if (pagePath === '/') return '/';
  return `/${pagePath.replace(/^\/+|\/+$/g, '')}`;
}

function urlForPath(pagePath) {
  const normalized = normalizePath(pagePath);
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

function entry({ pagePath, lastmod = '2026-05-24' }) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(urlForPath(pagePath))}</loc>`,
    `    <lastmod>${xmlEscape(lastmod)}</lastmod>`,
    '  </url>',
  ].join('\n');
}

export function generateSitemapXml() {
  const pageEntries = PUBLIC_PAGES.map((pagePath) => entry({
    pagePath,
    changefreq: pagePath === '/' ? 'daily' : 'monthly',
    priority: pagePath === '/' ? '1.0' : '0.7',
  }));

  const categoryEntries = BLOG_CATEGORIES.map((category) => entry({
    pagePath: `/blog/category/${category.key}`,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const postEntries = posts.map((post) => entry({
    pagePath: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const pairingEntries = getZodiacPairingPages().map((page) => entry({
    pagePath: page.path,
    lastmod: '2026-06-28',
    changefreq: 'monthly',
    priority: '0.7',
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pageEntries,
    ...categoryEntries,
    ...postEntries,
    ...pairingEntries,
    '</urlset>',
    '',
  ].join('\n');
}

export function writeSitemap(outputPath = path.join(process.cwd(), 'public', 'sitemap.xml')) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateSitemapXml(), 'utf8');
  return outputPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || path.join(process.cwd(), 'public', 'sitemap.xml');
  writeSitemap(outputPath);
  console.log(`Generated sitemap at ${outputPath}`);
}
