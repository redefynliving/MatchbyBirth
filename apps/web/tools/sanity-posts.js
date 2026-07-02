#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_PROJECT_ID = '4qj4p6px';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2025-01-01';
const DEFAULT_AUTHOR = 'AJ FOX';

const CATEGORY_KEYS = new Set([
  'sign-guide',
  'pair-deep-dive',
  'learn-astrology',
  'moon-signs',
  'numerology',
  'seasonal',
  'relationships',
]);

const TOPIC_TO_CATEGORY = {
  'birth-matching': 'learn-astrology',
  zodiac: 'sign-guide',
  numerology: 'numerology',
  'relationship-timing': 'seasonal',
  friendship: 'relationships',
  family: 'relationships',
  workplace: 'relationships',
  'responsible-use': 'relationships',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function slugValue(slug) {
  if (!slug) return '';
  if (typeof slug === 'string') return slug;
  return slug.current || '';
}

function dateOnly(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function textFromChildren(children = []) {
  return children
    .filter((child) => child && child._type === 'span')
    .map((child) => child.text || '')
    .join('');
}

function plainTextFromBlocks(blocks = []) {
  return blocks
    .filter((block) => block && block._type === 'block')
    .map((block) => textFromChildren(block.children))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCategory(document) {
  const rawSlug = slugValue(document.category?.slug).toLowerCase();
  const title = String(document.category?.title || '').toLowerCase();
  const combined = `${rawSlug} ${title}`;

  if (CATEGORY_KEYS.has(rawSlug)) return rawSlug;
  if (combined.includes('moon')) return 'moon-signs';
  return TOPIC_TO_CATEGORY[document.topic] || 'relationships';
}

function marksByKey(markDefs = []) {
  return new Map(markDefs.map((mark) => [mark._key, mark]));
}

function renderMarkedText(text, marks = [], markMap = new Map()) {
  return marks.reduce((html, mark) => {
    if (mark === 'strong') return `<strong>${html}</strong>`;
    if (mark === 'em') return `<em>${html}</em>`;

    const definition = markMap.get(mark);
    if (definition?._type === 'link' && definition.href) {
      const href = escapeAttribute(definition.href);
      return `<a href="${href}">${html}</a>`;
    }

    return html;
  }, escapeHtml(text));
}

function renderInlineChildren(block) {
  const markMap = marksByKey(block.markDefs || []);
  return (block.children || [])
    .filter((child) => child && child._type === 'span')
    .map((child) => renderMarkedText(child.text || '', child.marks || [], markMap))
    .join('');
}

function blockTag(style) {
  if (style === 'h2') return 'h2';
  if (style === 'h3') return 'h3';
  if (style === 'blockquote') return 'blockquote';
  return 'p';
}

export function portableTextToHtml(blocks = []) {
  const html = [];
  let openList = null;

  const closeList = () => {
    if (openList) {
      html.push(`</${openList}>`);
      openList = null;
    }
  };

  for (const block of blocks) {
    if (!block || block._type !== 'block') continue;

    const innerHtml = renderInlineChildren(block).trim();
    if (!innerHtml) continue;

    if (block.listItem) {
      const listTag = block.listItem === 'number' ? 'ol' : 'ul';
      if (openList !== listTag) {
        closeList();
        openList = listTag;
        html.push(`<${listTag}>`);
      }
      html.push(`<li>${innerHtml}</li>`);
      continue;
    }

    closeList();
    const tag = blockTag(block.style);
    html.push(`<${tag}>${innerHtml}</${tag}>`);
  }

  closeList();
  return html.join('\n');
}

function sanitizeArray(items, mapper = (item) => item) {
  if (!Array.isArray(items)) return [];
  return items.map(mapper).filter(Boolean);
}

export function normalizeSanityBlogPost(document) {
  if (!document || document.status !== 'published') return null;

  const slug = slugValue(document.slug);
  const date = dateOnly(document.publishedAt);
  const content = portableTextToHtml(document.body || []);

  if (!slug || !document.title || !date || !content) return null;

  const category = normalizeCategory(document);
  const description = document.metaDescription || document.excerpt || plainTextFromBlocks(document.body).slice(0, 155);
  const topicTag = document.topic || category;
  const heroImage = document.heroImage?.url
    ? {
        url: document.heroImage.url,
        alt: document.heroImage.alt || `${document.title} hero image`,
      }
    : undefined;

  return {
    source: 'sanity',
    slug,
    title: document.title,
    date,
    author: document.author || DEFAULT_AUTHOR,
    authorUrl: 'https://matchbybirth.com/about',
    description,
    tags: [category, topicTag, 'sanity'],
    category,
    content,
    ...(heroImage ? { heroImage, ogImage: heroImage.url } : {}),
    quickTakeaways: sanitizeArray(document.quickTakeaways, (item) => String(item || '').trim()),
    exampleScenarios: sanitizeArray(document.exampleScenarios, (item) => item?.title && item?.body ? {
      title: item.title,
      body: item.body,
    } : null),
    comparisonRows: sanitizeArray(document.comparisonRows, (item) => item?.label ? {
      label: item.label,
      bestUse: item.bestUse || '',
      watchOut: item.watchOut || '',
    } : null),
    faq: sanitizeArray(document.faq, (item) => item?.question && item?.answer ? {
      question: item.question,
      answer: item.answer,
    } : null),
    relatedSlugs: sanitizeArray(document.relatedPosts, (item) => slugValue(item?.slug)),
    calculatorCta: document.calculatorCta !== false,
  };
}

export function buildSanityPostsQuery() {
  return `*[
    _type == "blogPost" &&
    status == "published" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    status,
    publishedAt,
    author,
    topic,
    excerpt,
    metaDescription,
    category->{title, slug, description},
    "heroImage": {
      "url": heroImage.asset->url,
      "alt": heroImage.alt
    },
    quickTakeaways,
    body,
    exampleScenarios,
    comparisonRows,
    faq,
    calculatorCta,
    "relatedPosts": relatedPosts[]->{title, slug}
  }`;
}

export async function fetchSanityBlogPosts({
  projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID,
  dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || DEFAULT_DATASET,
  apiVersion = process.env.SANITY_API_VERSION || DEFAULT_API_VERSION,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!fetchImpl) throw new Error('fetch is not available');

  const query = encodeURIComponent(buildSanityPostsQuery());
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Sanity fetch failed with ${response.status}`);
  }

  const payload = await response.json();
  return (payload.result || [])
    .map(normalizeSanityBlogPost)
    .filter(Boolean);
}

export function generatedModuleSource(posts) {
  return [
    '// Generated from Sanity by apps/web/tools/sync-sanity-posts.js.',
    '// Do not edit this file by hand.',
    `const sanityPosts = ${JSON.stringify(posts, null, 2).replaceAll('<', '\\u003c')};`,
    '',
    'export default sanityPosts;',
    '',
  ].join('\n');
}

export function writeSanityPostsModule({
  posts,
  outputPath = path.resolve(process.cwd(), 'src/data/posts/sanity-posts.generated.js'),
} = {}) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generatedModuleSource(posts || []), 'utf8');
  return outputPath;
}
