#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import posts from '../src/data/posts/index.js';
import { BLOG_CATEGORIES } from '../src/data/blogCategories.js';

const SITE_URL = 'https://matchbybirth.com';
const PUBLIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.4' },
  { path: '/terms', changefreq: 'yearly', priority: '0.4' },
  { path: '/disclaimers', changefreq: 'yearly', priority: '0.4' },
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

function buildUrlEntry({ path: pagePath, lastmod, changefreq, priority }) {
  const normalizedPath = normalizePath(pagePath);
  const loc = normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;

  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    `    <lastmod>${xmlEscape(lastmod)}</lastmod>`,
    `    <changefreq>${xmlEscape(changefreq)}</changefreq>`,
    `    <priority>${xmlEscape(priority)}</priority>`,
    '  </url>',
  ].join('\n');
}

export function getSitemapEntries({ today = '2026-06-18' } = {}) {
  const pageEntries = PUBLIC_PAGES.map((page) => ({
    ...page,
    lastmod: today,
  }));

  const categoryEntries = BLOG_CATEGORIES.map((category) => ({
    path: `/blog/category/${category.key}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const postEntries = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  return [...pageEntries, ...categoryEntries, ...postEntries];
}

export function generateSitemapXml(options = {}) {
  const entries = getSitemapEntries(options);
  const urlEntries = entries.map(buildUrlEntry).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

export function writeSitemap({
  outputPath = path.join(process.cwd(), 'public', 'sitemap.xml'),
  today,
} = {}) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateSitemapXml({ today }), 'utf8');
  return outputPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || path.join(process.cwd(), 'public', 'sitemap.xml');
  writeSitemap({ outputPath });
  console.log(`Generated sitemap at ${outputPath}`);
}
