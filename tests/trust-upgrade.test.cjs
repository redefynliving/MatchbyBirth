const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('how it works page explains methodology, limits, privacy, and core links', () => {
  const source = read('apps/web/src/pages/HowItWorksPage.jsx');

  assert.match(source, /Match by Birth methodology/);
  assert.match(source, /birth date/i);
  assert.match(source, /Optional time and place/);
  assert.match(source, /life path number/i);
  assert.match(source, /Pair mode/);
  assert.match(source, /Group mode/);
  assert.match(source, /Date-only results still work/);
  assert.match(source, /How the reading is assembled/);
  assert.match(source, /What the score is looking at/);
  assert.match(source, /Example reading/);
  assert.match(source, /Alex and Jordan/);
  assert.match(source, /natural rhythm/i);
  assert.match(source, /emotional support/i);
  assert.match(source, /communication pace/i);
  assert.match(source, /watch area/i);
  assert.match(source, /Date-only vs\. Exact Mode/);
  assert.match(source, /not a soulmate detector/i);
  assert.match(source, /stronger conversation starter/i);
  assert.match(source, /not a prediction system/i);
  assert.match(source, /not a relationship verdict/i);
  assert.match(source, /Birth dates are processed/);
  assert.match(source, /\/#calculator/);
  assert.match(source, /\/blog\/what-compatibility-score-means/);
  assert.doesNotMatch(source, /<Footer/);
});

test('about page uses grounded trust language and removes overclaims', () => {
  const source = read('apps/web/src/pages/AboutPage.jsx');
  const header = read('apps/web/src/components/Header.jsx');
  const footer = read('apps/web/src/components/Footer.jsx');

  assert.match(source, /Some people feel familiar right away/);
  assert.match(source, /why do some people feel familiar before you know much about them/);
  assert.match(source, /For the connection you keep thinking about/);
  assert.match(source, /AJ FOX/);
  assert.match(source, /I kept guessing birthdays before people said them out loud/);
  assert.match(source, /Leo Sun, Cancer Moon, Libra Rising/);
  assert.match(source, /I'd bet on a May birthday/);
  assert.match(source, /No logic, just a gut feeling/);
  assert.match(source, /It still feels strange when the feeling is right/);
  assert.match(source, /Make of that what you will/);
  assert.match(source, /What it reads/);
  assert.match(source, /What it refuses to do/);
  assert.match(source, /How privacy works/);
  assert.match(source, /support@matchbybirth\.com/);
  assert.match(header, /\{ path: '\/about', label: 'About' \}/);
  assert.match(footer, /to="\/about"[^>]*>About<\/Link>/);
  assert.doesNotMatch(source, /Astrology meets science/i);
  assert.doesNotMatch(source, /oldest compatibility system/i);
  assert.doesNotMatch(source, /certified experts|international astrological registries|Sarah Miller/i);
});

test('non-home routes are lazy loaded while homepage stays eager', () => {
  const source = read('apps/web/src/App.jsx');

  assert.match(source, /import React, \{ Suspense, lazy \}/);
  assert.match(source, /import HomePage from '@\/pages\/HomePage\.jsx'/);
  assert.match(source, /const BlogPostPage = lazy/);
  assert.match(source, /const ResultPage = lazy/);
  assert.match(source, /const ReportPage = lazy/);
  assert.match(source, /const PrivacyPolicyPage = lazy/);
  assert.match(source, /<Suspense fallback=\{<RouteFallback \/>}/);
});

test('blog SEO helper builds Article schema, breadcrumbs, and related posts', async () => {
  const helper = await import(pathToFileURL(path.join(root, 'apps/web/src/lib/blogSeo.js')).href);
  const postsModule = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')).href);
  const posts = postsModule.default;
  const post = posts.find((candidate) => candidate.slug === 'what-compatibility-score-means');
  const sparsePost = posts.find((candidate) => candidate.slug === 'cancer-moon-compatibility');

  const article = helper.buildArticleSchema(post);
  const breadcrumbs = helper.buildBreadcrumbSchema(post);
  const related = helper.getRelatedPosts(post, posts);
  const sparseRelated = helper.getRelatedPosts(sparsePost, posts);

  assert.equal(article['@type'], 'Article');
  assert.equal(article.headline, post.title);
  assert.equal(article.description, post.description);
  assert.equal(article.mainEntityOfPage['@id'], `https://matchbybirth.com/blog/${post.slug}`);
  assert.equal(article.author['@type'], 'Person');
  assert.equal(article.author.name, 'AJ FOX');
  assert.equal(article.author.url, 'https://matchbybirth.com/about');
  assert.equal(article.publisher.name, 'Match by Birth');
  assert.equal(breadcrumbs['@type'], 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.length, 3);
  assert.ok(related.length > 0);
  assert.equal(related.some((candidate) => candidate.slug === post.slug), false);
  assert.ok(sparseRelated.length > 0);
  assert.equal(sparseRelated.some((candidate) => candidate.slug === sparsePost.slug), false);
});

test('React and static article output include enhanced blocks and related links', () => {
  const reactPage = read('apps/web/src/pages/BlogPostPage.jsx');
  const blogPage = read('apps/web/src/pages/BlogPage.jsx');
  const staticRenderer = read('apps/web/tools/prerender-blog-html.js');
  const ssg = read('tools/build-ssg.mjs');

  assert.match(blogPage, /DEFAULT_AUTHOR/);
  assert.match(blogPage, /By \{post\.author \|\| DEFAULT_AUTHOR\.name\}/);
  assert.match(reactPage, /buildArticleSchema/);
  assert.match(reactPage, /buildBreadcrumbSchema/);
  assert.match(reactPage, /Written by \{authorName\}/);
  assert.match(reactPage, /Creator of Match by Birth/);
  assert.match(reactPage, /Quick takeaways/);
  assert.match(reactPage, /Comparison guide/);
  assert.match(reactPage, /Example scenarios/);
  assert.match(reactPage, /Common questions/);
  assert.match(reactPage, /Keep reading/);
  assert.doesNotMatch(reactPage, /Professional Consultant Astrologer|Sarah Miller/);

  assert.match(staticRenderer, /buildArticleSchema/);
  assert.match(staticRenderer, /buildBreadcrumbSchema/);
  assert.match(staticRenderer, /By \$\{escapeHtml\(post\.author \|\| DEFAULT_AUTHOR\.name\)\}/);
  assert.match(staticRenderer, /static-related/);
  assert.match(staticRenderer, /Keep reading/);

  assert.match(ssg, /prerenderBlogHtml/);
  assert.match(ssg, /Match by Birth methodology/);
  assert.match(ssg, /Date-only results still work/);
  assert.match(ssg, /How the reading is assembled/);
  assert.match(ssg, /What the score is looking at/);
  assert.match(ssg, /Example reading/);
  assert.match(ssg, /Alex and Jordan/);
  assert.match(ssg, /not a soulmate detector/i);
  assert.match(ssg, /What it does not claim/);
  assert.match(ssg, /AJ FOX/);
  assert.doesNotMatch(ssg, /Astrology meets science|oldest compatibility system|Professional Astrologer|Sarah Miller|expert astrological breakdown/i);
});

test('blog homepage works as a scan-friendly content hub', () => {
  const blogPage = read('apps/web/src/pages/BlogPage.jsx');
  const staticRenderer = read('apps/web/tools/prerender-blog-html.js');

  assert.match(blogPage, /Start with the question you actually have/);
  assert.match(blogPage, /startHereLinks/);
  assert.match(blogPage, /featuredCategoryKeys/);
  assert.match(blogPage, /popularPostSlugs/);
  assert.match(blogPage, /Search guides/);
  assert.match(blogPage, /Topic index/);
  assert.match(blogPage, /Recent guides/);
  assert.match(blogPage, /Beginner resources/);
  assert.match(blogPage, /type="search"/);
  assert.doesNotMatch(blogPage, /rounded-full opacity-\[0\.06\] blur-3xl/);

  assert.match(staticRenderer, /Start here/);
  assert.match(staticRenderer, /Featured topics/);
  assert.match(staticRenderer, /Popular posts/);
  assert.match(staticRenderer, /Recent guides/);
  assert.match(staticRenderer, /Topic index/);
});
