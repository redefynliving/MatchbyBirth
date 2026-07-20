#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import posts from '../src/data/posts/index.js';
import { BLOG_CATEGORIES, getPostCategory } from '../src/data/blogCategories.js';
import { getZodiacPairingPages } from '../../../tools/zodiac-pairings.mjs';

const SITE_URL = 'https://matchbybirth.com';
const BUILD_DATE = new Date().toISOString().slice(0, 10);
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
  '/refund-policy',
  '/report-delivery',
  '/sample-report',
  '/premium',
  '/tools/crush-birthday-compatibility',
  '/tools/life-path-compatibility',
  '/tools/moon-sign-compatibility',
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

function entry({ pagePath, lastmod = BUILD_DATE }) {
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
    lastmod: latestPostDateForCategory(category.key),
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const postEntries = posts.map((post) => entry({
    pagePath: `/blog/${post.slug}`,
    lastmod: post.updatedAt || post.modifiedAt || post.date || BUILD_DATE,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const pairingEntries = getZodiacPairingPages().map((page) => entry({
    pagePath: page.path,
    lastmod: BUILD_DATE,
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

function latestPostDateForCategory(categoryKey) {
  const dates = posts
    .filter((post) => getPostCategory(post) === categoryKey)
    .map((post) => post.updatedAt || post.modifiedAt || post.date)
    .filter(Boolean)
    .sort((left, right) => right.localeCompare(left));

  return dates[0] || BUILD_DATE;
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
