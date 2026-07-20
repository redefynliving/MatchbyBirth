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

  assert.match(source, /MBB methodology/);
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

  assert.match(source, /Who it is for/);
  assert.match(source, /What the tool does/);
  assert.match(source, /What it does not claim/);
  assert.match(source, /How privacy works/);
  assert.match(source, /support@matchbybirth\.com/);
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
  assert.match(source, /const RefundPolicyPage = lazy/);
  assert.match(source, /const ReportDeliveryPage = lazy/);
  assert.match(source, /path="\/refund-policy"/);
  assert.match(source, /path="\/report-delivery"/);
  assert.match(source, /<Suspense fallback=\{<RouteFallback \/>}/);
});

test('refund and report delivery pages explain paid report trust details', () => {
  const refund = read('apps/web/src/pages/RefundPolicyPage.jsx');
  const delivery = read('apps/web/src/pages/ReportDeliveryPage.jsx');
  const footer = read('apps/web/src/components/Footer.jsx');

  assert.match(refund, /support@matchbybirth\.com/);
  assert.match(refund, /Refund Policy/);
  assert.match(refund, /digital compatibility report/);
  assert.match(refund, /reflection and conversation/);
  assert.match(refund, /not certainty, prediction, or a relationship verdict/);
  assert.match(refund, /1-2 business days/);

  assert.match(delivery, /How report delivery works/);
  assert.match(delivery, /private report link/);
  assert.match(delivery, /sanitized compatibility data/);
  assert.match(delivery, /Raw birth dates, birth times, birthplaces, and the checkout email are not sent to the text provider/);
  assert.match(delivery, /Moon reports focus on emotional needs and repair/);
  assert.match(delivery, /support@matchbybirth\.com/);

  assert.match(footer, /\/refund-policy/);
  assert.match(footer, /Refund Policy/);
  assert.match(footer, /\/report-delivery/);
  assert.match(footer, /Report Delivery/);
});

test('blog SEO helper builds Article schema, breadcrumbs, and related posts', async () => {
  const helper = await import(pathToFileURL(path.join(root, 'apps/web/src/lib/blogSeo.js')).href);
  const postsModule = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')).href);
  const posts = postsModule.default;
  const post = posts.find((candidate) => candidate.slug === 'what-compatibility-score-means');
  const sparsePost = posts.find((candidate) => candidate.slug === 'cancer-moon-compatibility');

  const article = helper.buildArticleSchema(post);
  const seo = helper.getBlogPostSeo(post);
  const breadcrumbs = helper.buildBreadcrumbSchema(post);
  const related = helper.getRelatedPosts(post, posts);
  const sparseRelated = helper.getRelatedPosts(sparsePost, posts);

  assert.equal(article['@type'], 'BlogPosting');
  assert.equal(article.headline, post.title);
  assert.equal(article.description, post.description);
  assert.equal(article.mainEntityOfPage['@id'], `https://matchbybirth.com/blog/${post.slug}`);
  assert.equal(article.author['@type'], 'Person');
  assert.equal(article.author.name, 'AJ Fox');
  assert.equal(article.publisher.name, 'Match by Birth');
  assert.equal(seo.authorName, 'AJ Fox');
  assert.equal(seo.url, `https://matchbybirth.com/blog/${post.slug}`);
  assert.ok(seo.image.startsWith('https://matchbybirth.com/') || seo.image.startsWith('https://cdn.sanity.io/'));
  assert.equal(breadcrumbs['@type'], 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.length, 3);
  assert.ok(related.length > 0);
  assert.equal(related.some((candidate) => candidate.slug === post.slug), false);
  assert.ok(sparseRelated.length > 0);
  assert.equal(sparseRelated.some((candidate) => candidate.slug === sparsePost.slug), false);
});

test('React and static article output include enhanced blocks and related links', () => {
  const reactPage = read('apps/web/src/pages/BlogPostPage.jsx');
  const staticRenderer = read('apps/web/tools/prerender-blog-html.js');
  const ssg = read('tools/build-ssg.mjs');

  assert.match(reactPage, /buildArticleSchema/);
  assert.match(reactPage, /buildBreadcrumbSchema/);
  assert.match(reactPage, /meta name="author"/);
  assert.match(reactPage, /twitter:card/);
  assert.match(reactPage, /article:published_time/);
  assert.match(reactPage, /article:modified_time/);
  assert.match(reactPage, /article:section/);
  assert.match(reactPage, /Quick takeaways/);
  assert.match(reactPage, /Comparison guide/);
  assert.match(reactPage, /Example scenarios/);
  assert.match(reactPage, /Common questions/);
  assert.match(reactPage, /Keep reading/);
  assert.doesNotMatch(reactPage, /Professional Consultant Astrologer|Sarah Miller/);

  assert.match(staticRenderer, /buildArticleSchema/);
  assert.match(staticRenderer, /buildBreadcrumbSchema/);
  assert.match(staticRenderer, /meta name="author"/);
  assert.match(staticRenderer, /twitter:card/);
  assert.match(staticRenderer, /article:published_time/);
  assert.match(staticRenderer, /article:modified_time/);
  assert.match(staticRenderer, /article:section/);
  assert.match(staticRenderer, /static-related/);
  assert.match(staticRenderer, /Keep reading/);

  const llmsGenerator = read('apps/web/tools/generate-llms.js');
  assert.match(llmsGenerator, /url\.includes\(':'\)/);

  assert.match(ssg, /prerenderBlogHtml/);
  assert.match(ssg, /MBB methodology/);
  assert.match(ssg, /Date-only results still work/);
  assert.match(ssg, /How the reading is assembled/);
  assert.match(ssg, /What the score is looking at/);
  assert.match(ssg, /Example reading/);
  assert.match(ssg, /Alex and Jordan/);
  assert.match(ssg, /not a soulmate detector/i);
  assert.match(ssg, /What it does not claim/);
  assert.doesNotMatch(ssg, /Astrology meets science|oldest compatibility system|Professional Astrologer|Sarah Miller|expert astrological breakdown/i);
});
