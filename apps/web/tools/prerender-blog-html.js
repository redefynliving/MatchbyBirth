#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import posts from '../src/data/posts/index.js';
import { BLOG_CATEGORIES, getPostCategory } from '../src/data/blogCategories.js';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  canonicalUrl,
  DEFAULT_AUTHOR,
  getRelatedPosts,
} from '../src/lib/blogSeo.js';

const SITE_URL = 'https://matchbybirth.com';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function normalizeRoute(route) {
  if (route === '/') return '/';
  return `/${route.replace(/^\/+|\/+$/g, '')}`;
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractAssetTags(template) {
  const styleTags = template.match(/<link[^>]+rel="stylesheet"[^>]*>/g) || [];
  const moduleTags = template.match(/<script[^>]+type="module"[^>]*><\/script>/g) || [];
  return [...styleTags, ...moduleTags].join('\n    ');
}

function renderJsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
}

function renderDocument({ template, title, description, route, body, head = '' }) {
  const assetTags = extractAssetTags(template);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl(route));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeCanonical}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:image" content="${SITE_URL}/og-image.png" />
    <style>
      .static-blog-shell { max-width: 760px; margin: 0 auto; padding: 48px 20px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1a1a2e; line-height: 1.7; }
      .static-blog-shell h1 { font-size: clamp(2rem, 6vw, 3rem); line-height: 1.05; margin: 0 0 16px; }
      .static-blog-shell h2 { font-size: 1.45rem; line-height: 1.25; margin: 36px 0 10px; color: #5b3fd6; }
      .static-blog-shell h3 { font-size: 1.1rem; margin: 24px 0 8px; }
      .static-blog-shell p { margin: 0 0 18px; }
      .static-blog-shell a { color: #5b3fd6; font-weight: 700; }
      .static-post-card { border: 1px solid #e6e6f0; border-radius: 14px; padding: 18px; margin: 0 0 16px; background: #fff; }
      .static-post-card h2 { color: #1a1a2e; font-size: 1.1rem; margin-top: 0; }
      .static-hero-image { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border: 1px solid #e6e1d8; border-radius: 8px; margin: 0 0 28px; background: #fbfaf8; }
      .static-article-body ul, .static-article-body ol { padding-left: 24px; }
      .static-enhancement { border: 1px solid #e6e6f0; border-radius: 8px; padding: 20px; margin: 24px 0; background: #fbfbff; }
      .static-enhancement table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
      .static-enhancement th, .static-enhancement td { border-top: 1px solid #e6e6f0; padding: 10px; text-align: left; vertical-align: top; }
      .static-related { border-top: 1px solid #e6e6f0; margin-top: 36px; padding-top: 24px; }
      .static-related a { display: block; border: 1px solid #e6e6f0; border-radius: 8px; padding: 14px; margin: 0 0 12px; text-decoration: none; }
      .static-related strong { color: #1a1a2e; display: block; }
      .static-related span { color: #6f6780; display: block; font-weight: 400; margin-top: 4px; }
    </style>
    ${head}
    ${assetTags}
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
</html>
`;
}

function articleCard(post) {
  return `
    <article class="static-post-card">
      <h2><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></h2>
      <p>By ${escapeHtml(post.author || DEFAULT_AUTHOR.name)}</p>
      <p>${escapeHtml(post.description)}</p>
    </article>
  `;
}

function renderEnhancementHtml(post) {
  const sections = [];

  if (Array.isArray(post.quickTakeaways) && post.quickTakeaways.length > 0) {
    sections.push(`
      <section class="static-enhancement">
        <h2>Quick takeaways</h2>
        <ul>${post.quickTakeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
    `);
  }

  if (Array.isArray(post.comparisonRows) && post.comparisonRows.length > 0) {
    sections.push(`
      <section class="static-enhancement">
        <h2>Comparison guide</h2>
        <table>
          <thead><tr><th>Signal</th><th>Best use</th><th>Watch out</th></tr></thead>
          <tbody>
            ${post.comparisonRows.map((row) => `
              <tr>
                <td>${escapeHtml(row.label)}</td>
                <td>${escapeHtml(row.bestUse)}</td>
                <td>${escapeHtml(row.watchOut)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `);
  }

  if (Array.isArray(post.exampleScenarios) && post.exampleScenarios.length > 0) {
    sections.push(`
      <section class="static-enhancement">
        <h2>Example scenarios</h2>
        ${post.exampleScenarios.map((example) => `
          <article>
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.body)}</p>
          </article>
        `).join('')}
      </section>
    `);
  }

  if (Array.isArray(post.faq) && post.faq.length > 0) {
    sections.push(`
      <section class="static-enhancement">
        <h2>Common questions</h2>
        ${post.faq.map((item) => `
          <article>
            <h3>${escapeHtml(item.question)}</h3>
            <p>${escapeHtml(item.answer)}</p>
          </article>
        `).join('')}
      </section>
    `);
  }

  return sections.join('');
}

export function renderBlogIndexHtml({ template, allPosts = posts } = {}) {
  const body = `
    <main class="static-blog-shell">
      <header>
        <p>Match by Birth Guides</p>
        <h1>Birth Matching, Zodiac Compatibility, and Relationship Guides</h1>
        <p>Browse practical articles about birth date compatibility, zodiac signs, life path numbers, relationship timing, and group dynamics.</p>
      </header>
      <section>${allPosts.map(articleCard).join('')}</section>
    </main>
  `;

  return renderDocument({
    template,
    title: 'Astrology Blog and Guides | Match by Birth',
    description: 'Read Match by Birth guides about birth date compatibility, zodiac pairings, life path numbers, relationship timing, and responsible score interpretation.',
    route: '/blog',
    body,
  });
}

export function renderCategoryHtml({ template, category, allPosts = posts } = {}) {
  const categoryPosts = allPosts.filter((post) => getPostCategory(post) === category.key);
  const body = `
    <main class="static-blog-shell">
      <header>
        <p>Match by Birth Guides</p>
        <h1>${escapeHtml(category.label)}</h1>
        <p>${escapeHtml(category.description)}</p>
      </header>
      <section>${categoryPosts.map(articleCard).join('')}</section>
    </main>
  `;

  return renderDocument({
    template,
    title: category.seoTitle,
    description: category.seoDescription,
    route: `/blog/category/${category.key}`,
    body,
  });
}

export function renderArticleHtml({ template, post } = {}) {
  const description = post.description || stripHtml(post.content).slice(0, 155);
  const relatedPosts = getRelatedPosts(post, posts);
  const authorName = post.author || DEFAULT_AUTHOR.name;
  const body = `
    <main class="static-blog-shell">
      <article>
        <p>Match by Birth Guide</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(new Date(post.date).toLocaleDateString('en-US'))}</p>
        <p>By <a href="/about">${escapeHtml(authorName)}</a></p>
        <p>${escapeHtml(description)}</p>
        ${post.heroImage?.url ? `<img class="static-hero-image" src="${escapeHtml(post.heroImage.url)}" alt="${escapeHtml(post.heroImage.alt || '')}" />` : ''}
        <div class="static-article-body">${post.content}</div>
        ${renderEnhancementHtml(post)}
        <p><a href="/#calculator">Try the Match by Birth compatibility calculator</a></p>
        <p><a href="/how-it-works">Read how Match by Birth works</a></p>
        ${relatedPosts.length > 0 ? `
          <section class="static-related">
            <h2>Keep reading</h2>
            ${relatedPosts.map((related) => `
              <a href="/blog/${escapeHtml(related.slug)}">
                <strong>${escapeHtml(related.title)}</strong>
                <span>${escapeHtml(related.description)}</span>
              </a>
            `).join('')}
          </section>
        ` : ''}
      </article>
    </main>
  `;

  return renderDocument({
    template,
    title: `${post.title} | Match by Birth`,
    description,
    route: `/blog/${post.slug}`,
    body,
    head: `${renderJsonLd(buildArticleSchema(post))}
    ${renderJsonLd(buildBreadcrumbSchema(post))}`,
  });
}

function writeHtmlFile(outputRoot, route, html) {
  const normalizedRoute = normalizeRoute(route);
  const directory = normalizedRoute === '/'
    ? outputRoot
    : path.join(outputRoot, normalizedRoute.replace(/^\//, ''));
  const filePath = path.join(directory, 'index.html');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
  return filePath;
}

export function prerenderBlogHtml({
  outputRoot = path.resolve(process.cwd(), '../../dist/apps/web'),
  templatePath = path.join(outputRoot, 'index.html'),
  allPosts = posts,
  categories = BLOG_CATEGORIES,
} = {}) {
  const template = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, 'utf8')
    : '<!doctype html><html><head></head><body><div id="root"></div></body></html>';

  const written = [
    writeHtmlFile(outputRoot, '/blog', renderBlogIndexHtml({ template, allPosts })),
  ];

  for (const category of categories) {
    written.push(writeHtmlFile(
      outputRoot,
      `/blog/category/${category.key}`,
      renderCategoryHtml({ template, category, allPosts }),
    ));
  }

  for (const post of allPosts) {
    written.push(writeHtmlFile(
      outputRoot,
      `/blog/${post.slug}`,
      renderArticleHtml({ template, post }),
    ));
  }

  return written;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputRoot = process.argv[2] || path.resolve(process.cwd(), '../../dist/apps/web');
  const written = prerenderBlogHtml({ outputRoot });
  console.log(`Prerendered ${written.length} blog HTML files into ${outputRoot}`);
}
