# AdSense Review Content Linking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the 10 most important Match by Birth articles and internal link paths while AdSense review is pending, without adding new ad placements or destabilizing the approved review submission.

**Architecture:** Keep the current Vite React blog architecture and post-data model. Add a small data-driven "next steps" layer for article-to-tool links, strengthen the top 10 article bodies and editorial blocks, and enforce the quality/link rules with Node tests so future edits do not drift back toward thin content.

**Tech Stack:** React, Vite, React Router, JavaScript post data, Node build scripts, Node test runner.

---

## Scope And Ranking

### Option 1: Pillar Article + Link Graph Upgrade
Recommended. Upgrade the 10 highest-value articles, add stronger in-article next-step links, render those links in React and prerendered static HTML, and test the link graph.

Why: Highest AdSense/SEO return without touching unrelated product behavior while review is pending.

### Option 2: Rewrite All 30 New Articles
Broader, but slower and riskier. This can improve depth, but it may create more regression surface and slow down shipping.

Why not first: the site does not need 30 perfect articles before the next review pass; it needs the core pages to prove the site has an original system.

### Option 3: Internal Links Only
Fastest, but weaker. Adds navigation, but does not materially improve content quality if reviewers read the pages.

Why not first: it helps crawlability, but does not fix templated/thin content risk by itself.

## Recommended Plan

Implement Option 1.

Priority articles:

- `what-is-birth-matching`
- `how-birth-date-compatibility-is-calculated`
- `birth-date-compatibility-vs-zodiac-compatibility`
- `life-path-number-compatibility-guide`
- `relationship-timing-by-birth-date`
- `low-compatibility-score-meaning`
- `high-compatibility-score-meaning`
- `how-to-use-compatibility-results-responsibly`
- `zodiac-elements-love-compatibility`
- `group-compatibility-how-to-read-results`

Quality bar for each priority article:

- 900-1,450 words after upgrade.
- At least 4 meaningful `<h2>` sections.
- At least 5 internal links in the article body or rendered next-step blocks.
- Must link to the calculator (`/#calculator`) and methodology page (`/how-it-works`).
- Must have at least 2 related article links.
- Must include at least 2 editorial enhancement block types from: quick takeaways, examples, comparison table, FAQ.
- Must avoid deterministic relationship claims like "proves", "guarantees", "destined", or "perfect match".

## File Structure

- Modify `apps/web/src/data/posts/adsense-growth-posts.js`
  - Holds the 30 AdSense growth posts.
  - Add custom content upgrades for the 10 priority slugs.
  - Keep generated post structure, but override priority article content and editorial blocks with richer hand-authored content.

- Create `apps/web/src/data/articleNextSteps.js`
  - Central source for priority slugs and rendered next-step links.
  - Exposes `REVIEW_PILLAR_SLUGS`, `ARTICLE_NEXT_STEPS`, and `getArticleNextSteps(post)`.

- Modify `apps/web/src/pages/BlogPostPage.jsx`
  - Render visible "Recommended next" links using `getArticleNextSteps(post)`.
  - Place the block after editorial enhancements and before related articles.

- Modify `apps/web/tools/prerender-blog-html.js`
  - Render the same next-step links into static article HTML so Google sees them without relying on React.

- Modify `tests/blog-content.test.cjs`
  - Keep existing 30-post and slug tests.
  - Relax the max word count for priority articles only from 1,000 to 1,450.

- Create `tests/review-pillar-content.test.cjs`
  - Enforce priority article content depth, link count, calculator/methodology links, and responsible-language guardrails.

- Modify `tests/static-blog-render.test.cjs`
  - Assert static article HTML includes "Recommended next" links.

## Task 1: Add Priority Article Link Data

**Files:**
- Create: `apps/web/src/data/articleNextSteps.js`
- Test: `tests/review-pillar-content.test.cjs`

- [ ] **Step 1: Create the failing test for the priority slug list**

Create `tests/review-pillar-content.test.cjs` with this initial test:

```js
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('review pillar article list contains the 10 strategic content pages', async () => {
  const { REVIEW_PILLAR_SLUGS, ARTICLE_NEXT_STEPS } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );

  assert.deepEqual(REVIEW_PILLAR_SLUGS, [
    'what-is-birth-matching',
    'how-birth-date-compatibility-is-calculated',
    'birth-date-compatibility-vs-zodiac-compatibility',
    'life-path-number-compatibility-guide',
    'relationship-timing-by-birth-date',
    'low-compatibility-score-meaning',
    'high-compatibility-score-meaning',
    'how-to-use-compatibility-results-responsibly',
    'zodiac-elements-love-compatibility',
    'group-compatibility-how-to-read-results',
  ]);

  for (const slug of REVIEW_PILLAR_SLUGS) {
    assert.ok(Array.isArray(ARTICLE_NEXT_STEPS[slug]), `${slug} is missing ARTICLE_NEXT_STEPS`);
    assert.ok(ARTICLE_NEXT_STEPS[slug].length >= 3, `${slug} needs at least 3 next-step links`);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/review-pillar-content.test.cjs
```

Expected: FAIL with module not found for `apps/web/src/data/articleNextSteps.js`.

- [ ] **Step 3: Add the priority article link data**

Create `apps/web/src/data/articleNextSteps.js`:

```js
export const REVIEW_PILLAR_SLUGS = [
  'what-is-birth-matching',
  'how-birth-date-compatibility-is-calculated',
  'birth-date-compatibility-vs-zodiac-compatibility',
  'life-path-number-compatibility-guide',
  'relationship-timing-by-birth-date',
  'low-compatibility-score-meaning',
  'high-compatibility-score-meaning',
  'how-to-use-compatibility-results-responsibly',
  'zodiac-elements-love-compatibility',
  'group-compatibility-how-to-read-results',
];

const calculatorLink = {
  label: 'Try the birth date compatibility calculator',
  href: '/#calculator',
  description: 'Compare two people or a group with the free Match by Birth tool.',
};

const methodologyLink = {
  label: 'Read how Match by Birth works',
  href: '/how-it-works',
  description: 'See the scoring inputs, limitations, privacy notes, and responsible-use guidance.',
};

export const ARTICLE_NEXT_STEPS = {
  'what-is-birth-matching': [
    calculatorLink,
    methodologyLink,
    {
      label: 'How birth date compatibility is calculated',
      href: '/blog/how-birth-date-compatibility-is-calculated',
      description: 'Understand the signals behind the score before reading any result too literally.',
    },
  ],
  'how-birth-date-compatibility-is-calculated': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a low compatibility score means',
      href: '/blog/low-compatibility-score-meaning',
      description: 'Learn how to interpret friction without treating a score as a relationship verdict.',
    },
  ],
  'birth-date-compatibility-vs-zodiac-compatibility': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Zodiac elements and love compatibility',
      href: '/blog/zodiac-elements-love-compatibility',
      description: 'Compare fire, earth, air, and water patterns in everyday relationship behavior.',
    },
  ],
  'life-path-number-compatibility-guide': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Life Path 1 compatibility',
      href: '/blog/life-path-1-compatibility',
      description: 'Start with a practical example of how life path patterns affect relationship rhythm.',
    },
  ],
  'relationship-timing-by-birth-date': [
    calculatorLink,
    methodologyLink,
    {
      label: 'How to use compatibility results responsibly',
      href: '/blog/how-to-use-compatibility-results-responsibly',
      description: 'Use timing notes as reflection prompts, not as instructions about what to do.',
    },
  ],
  'low-compatibility-score-meaning': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a high compatibility score means',
      href: '/blog/high-compatibility-score-meaning',
      description: 'Balance friction notes by seeing what strong scores can and cannot promise.',
    },
  ],
  'high-compatibility-score-meaning': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a low compatibility score means',
      href: '/blog/low-compatibility-score-meaning',
      description: 'Understand why lower scores can still point to useful relationship conversations.',
    },
  ],
  'how-to-use-compatibility-results-responsibly': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What is birth matching?',
      href: '/blog/what-is-birth-matching',
      description: 'Review the basic idea behind Match by Birth before comparing results.',
    },
  ],
  'zodiac-elements-love-compatibility': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Birth date compatibility vs zodiac compatibility',
      href: '/blog/birth-date-compatibility-vs-zodiac-compatibility',
      description: 'See where zodiac signs fit inside a broader birth-date matching approach.',
    },
  ],
  'group-compatibility-how-to-read-results': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Friendship compatibility by birth date',
      href: '/blog/friendship-compatibility-by-birth-date',
      description: 'Use one-to-one friendship patterns to understand group dynamics more clearly.',
    },
  ],
};

export function getArticleNextSteps(post) {
  if (!post) return [];
  return ARTICLE_NEXT_STEPS[post.slug] || [calculatorLink, methodologyLink];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --test tests/review-pillar-content.test.cjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/web/src/data/articleNextSteps.js tests/review-pillar-content.test.cjs
git commit -m "test: define review pillar article links"
```

## Task 2: Render Next-Step Links In React Blog Posts

**Files:**
- Modify: `apps/web/src/pages/BlogPostPage.jsx`
- Test: `tests/blog-seo.test.cjs`

- [ ] **Step 1: Add a failing test for the next-step helper behavior**

Append this test to `tests/blog-seo.test.cjs`:

```js
test('priority articles expose calculator and methodology next-step links', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { REVIEW_PILLAR_SLUGS, getArticleNextSteps } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );

  for (const slug of REVIEW_PILLAR_SLUGS) {
    const post = posts.find((entry) => entry.slug === slug);
    assert.ok(post, `${slug} must exist`);

    const links = getArticleNextSteps(post);
    const hrefs = links.map((link) => link.href);

    assert.ok(hrefs.includes('/#calculator'), `${slug} must link to the calculator`);
    assert.ok(hrefs.includes('/how-it-works'), `${slug} must link to methodology`);
    assert.ok(links.every((link) => link.label && link.description), `${slug} links need label and description`);
  }
});
```

- [ ] **Step 2: Run the test**

Run:

```bash
node --test tests/blog-seo.test.cjs
```

Expected: PASS after Task 1.

- [ ] **Step 3: Render the React next-step section**

Modify `apps/web/src/pages/BlogPostPage.jsx`:

Add the import:

```js
import { getArticleNextSteps } from '@/data/articleNextSteps.js';
```

Add this component above `BlogPostPage`:

```jsx
function ArticleNextSteps({ post }) {
  const links = getArticleNextSteps(post);
  if (links.length === 0) return null;

  return (
    <section style={{ marginTop: 40, border: '1px solid #e6e1d8', borderRadius: 8, padding: 20, background: '#fff' }}>
      <p style={{ margin: '0 0 6px', color: '#6c4de6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Recommended next
      </p>
      <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', margin: '0 0 14px' }}>
        Keep reading or try your own match
      </h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {links.map((link) => (
          <Link
            key={`${post.slug}-${link.href}`}
            to={link.href}
            style={{ display: 'block', border: '1px solid #eee8df', borderRadius: 8, padding: 14, color: '#1a1a2e', textDecoration: 'none', background: '#fbfaf8' }}
          >
            <strong style={{ display: 'block', color: '#5b3fd6' }}>{link.label}</strong>
            <span style={{ display: 'block', marginTop: 4, color: '#665f72', lineHeight: 1.5 }}>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

Render it immediately after editorial enhancements:

```jsx
<EditorialEnhancements post={post} />
<ArticleNextSteps post={post} />
```

- [ ] **Step 4: Run lint on touched React files**

Run:

```bash
npx eslint src/pages/BlogPostPage.jsx --quiet
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/web/src/pages/BlogPostPage.jsx tests/blog-seo.test.cjs
git commit -m "feat: render article next-step links"
```

## Task 3: Render Next-Step Links In Static Prerendered HTML

**Files:**
- Modify: `apps/web/tools/prerender-blog-html.js`
- Modify: `tests/static-blog-render.test.cjs`

- [ ] **Step 1: Add a failing static render assertion**

In `tests/static-blog-render.test.cjs`, add these assertions after the existing related/enhancement assertions:

```js
assert.match(articleHtml, /Recommended next/);
assert.match(articleHtml, /Try the birth date compatibility calculator/);
assert.match(articleHtml, /Read how Match by Birth works/);
```

- [ ] **Step 2: Run the static render test**

Run:

```bash
node --test tests/static-blog-render.test.cjs
```

Expected: FAIL because prerendered article HTML does not include `Recommended next`.

- [ ] **Step 3: Add static next-step rendering**

Modify `apps/web/tools/prerender-blog-html.js`.

Add import:

```js
import { getArticleNextSteps } from '../src/data/articleNextSteps.js';
```

Add this function below `renderRelatedArticles`:

```js
function renderArticleNextSteps(post) {
  const links = getArticleNextSteps(post);
  if (links.length === 0) return '';

  return `
    <section class="static-next-steps">
      <p>Recommended next</p>
      <h2>Keep reading or try your own match</h2>
      ${links.map((link) => `
        <article class="static-post-card">
          <h3><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></h3>
          <p>${escapeHtml(link.description)}</p>
        </article>
      `).join('')}
    </section>
  `;
}
```

Add CSS inside `renderDocument`:

```css
.static-next-steps { border-top: 1px solid #e6e6f0; margin-top: 36px; padding-top: 24px; }
```

Render it in `renderArticleHtml` after enhancements and before related articles:

```js
${renderEnhancementHtml(post)}
${renderArticleNextSteps(post)}
${renderRelatedArticles(post, allPosts)}
```

- [ ] **Step 4: Run the static render test**

Run:

```bash
node --test tests/static-blog-render.test.cjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/web/tools/prerender-blog-html.js tests/static-blog-render.test.cjs
git commit -m "feat: prerender article next-step links"
```

## Task 4: Add Priority Article Quality Tests

**Files:**
- Modify: `tests/review-pillar-content.test.cjs`
- Modify: `tests/blog-content.test.cjs`

- [ ] **Step 1: Add quality and responsible-language tests**

Append this code to `tests/review-pillar-content.test.cjs`:

```js
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length;
}

function internalHrefCount(html) {
  return [...html.matchAll(/href="(https:\/\/matchbybirth\.com[^"]+|\/[^"]+)"/g)].length;
}

test('review pillar articles meet stronger quality and internal-link standards', async () => {
  const { default: posts } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/posts/index.js')));
  const { REVIEW_PILLAR_SLUGS, getArticleNextSteps } = await import(
    pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js'))
  );

  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

  for (const slug of REVIEW_PILLAR_SLUGS) {
    const post = postsBySlug.get(slug);
    assert.ok(post, `${slug} must exist`);

    const words = wordCount(post.content);
    assert.ok(words >= 900, `${slug} has only ${words} words`);
    assert.ok(words <= 1450, `${slug} has ${words} words`);

    const h2Count = (post.content.match(/<h2>/g) || []).length;
    assert.ok(h2Count >= 4, `${slug} needs at least 4 h2 sections`);

    const nextStepHrefs = getArticleNextSteps(post).map((link) => link.href);
    const allLinkTargets = `${post.content} ${nextStepHrefs.join(' ')}`;
    assert.match(allLinkTargets, /\/#calculator|https:\/\/matchbybirth\.com\/?#calculator/, `${slug} must link to calculator`);
    assert.match(allLinkTargets, /\/how-it-works|https:\/\/matchbybirth\.com\/how-it-works/, `${slug} must link to methodology`);

    const renderedInternalLinks = internalHrefCount(post.content) + nextStepHrefs.length;
    assert.ok(renderedInternalLinks >= 5, `${slug} needs at least 5 internal links`);

    const enhancementTypes = [
      post.quickTakeaways,
      post.exampleScenarios,
      post.comparisonRows,
      post.faq,
    ].filter((items) => Array.isArray(items) && items.length > 0).length;
    assert.ok(enhancementTypes >= 2, `${slug} needs at least 2 enhancement block types`);

    assert.doesNotMatch(
      stripHtml(post.content),
      /\b(proves|guarantees|destined|perfect match|soulmate certainty)\b/i,
      `${slug} contains deterministic relationship language`,
    );
  }
});
```

- [ ] **Step 2: Relax the old growth-post max for priority articles only**

Modify `tests/blog-content.test.cjs` inside `new AdSense growth articles are substantial content pages`:

```js
  const { REVIEW_PILLAR_SLUGS } = await import(pathToFileURL(path.join(root, 'apps/web/src/data/articleNextSteps.js')));
  const prioritySlugs = new Set(REVIEW_PILLAR_SLUGS);

  for (const post of growthPosts) {
    const words = wordCount(post.content);
    assert.ok(words >= 700, `${post.slug} has only ${words} words`);
    const maxWords = prioritySlugs.has(post.slug) ? 1450 : 1000;
    assert.ok(words <= maxWords, `${post.slug} has ${words} words`);
    assert.match(post.content, /https:\/\/matchbybirth\.com/);
  }
```

- [ ] **Step 3: Run the quality tests**

Run:

```bash
node --test tests/blog-content.test.cjs tests/review-pillar-content.test.cjs
```

Expected: FAIL until the priority article content is upgraded.

- [ ] **Step 4: Commit the failing tests**

Run:

```bash
git add tests/blog-content.test.cjs tests/review-pillar-content.test.cjs
git commit -m "test: enforce review pillar content quality"
```

## Task 5: Upgrade The 10 Priority Articles

**Files:**
- Modify: `apps/web/src/data/posts/adsense-growth-posts.js`
- Test: `tests/blog-content.test.cjs`
- Test: `tests/review-pillar-content.test.cjs`

- [ ] **Step 1: Add priority article override data**

In `apps/web/src/data/posts/adsense-growth-posts.js`, add a map named `PILLAR_ARTICLE_UPGRADES` after `RELATED_BY_SLUG`.

Use this exact structure:

```js
const PILLAR_ARTICLE_UPGRADES = {
  'what-is-birth-matching': {
    content: `
      <h1>What Is Birth Matching?</h1>
      <p>Birth matching is a practical way to compare two birth dates and turn them into a relationship reflection. Match by Birth uses the date itself, zodiac sign patterns, life path number rhythm, and pair or group context to create a compatibility score that is easy to read. It is not a prediction system and it does not claim that a relationship will succeed or fail.</p>
      <h2>What birth matching compares</h2>
      <p>The simplest input is the calendar birth date. From that date, Match by Birth can identify the zodiac sign, elemental style, numerology life path, and timing patterns that may shape how two people move through decisions, conflict, planning, and emotional pace. That makes birth matching broader than a single sun-sign comparison.</p>
      <p>If you want to see the tool before reading the full method, you can <a href="https://matchbybirth.com/#calculator">try the birth date compatibility calculator</a>. If you want the system behind the score, read <a href="https://matchbybirth.com/how-it-works">how Match by Birth works</a>.</p>
      <h2>How it differs from traditional zodiac compatibility</h2>
      <p>Zodiac compatibility usually starts with two signs. Birth matching starts with the full date and treats sign compatibility as one signal among several. A Leo and Libra pairing may look easy by element, but the life path numbers may show different priorities around independence, routine, or emotional pacing. A pair with tense zodiac elements may still have useful timing or numerology patterns that make communication easier.</p>
      <h2>How to read the score</h2>
      <p>The score is a summary, not a verdict. A high score means the dates show several supportive patterns. A lower score means the dates show more friction or difference. Neither result tells you what to do. The useful question is: what does the score help you notice? For example, a lower score may point to different planning styles, while a high score may show that things feel easy but still need clear expectations.</p>
      <p>For deeper score interpretation, read <a href="https://matchbybirth.com/blog/how-birth-date-compatibility-is-calculated">how birth date compatibility is calculated</a>, <a href="https://matchbybirth.com/blog/low-compatibility-score-meaning">what a low compatibility score means</a>, and <a href="https://matchbybirth.com/blog/high-compatibility-score-meaning">what a high compatibility score means</a>.</p>
      <h2>Pair mode and group mode</h2>
      <p>Pair mode compares two people directly. It works well for romance, friendship, family, and work relationships. Group mode compares every unique pair in a group, then helps you see the strongest and most sensitive connections inside the group. This is useful when you want to understand a friend group, team, family dynamic, or creative project group.</p>
      <p>For group-specific reading, use <a href="https://matchbybirth.com/blog/group-compatibility-how-to-read-results">the group compatibility guide</a>.</p>
      <h2>What birth matching does not claim</h2>
      <p>Match by Birth is built for reflection and entertainment. It should not replace conversation, consent, therapy, legal advice, financial judgment, or personal safety decisions. The best use is to take a result and ask better questions: where do we move at the same pace, where do we need patience, and what expectations should we make explicit?</p>
      <h2>A simple example</h2>
      <p>Imagine one person has a birthday that points to direct fire-sign momentum and an independent life path, while the other shows a more careful earth-sign style and a relationship-oriented life path. The score may not be perfect, but the reading can still be useful: one person may push decisions forward quickly, while the other may need evidence, routine, and time. That is not a warning label. It is a conversation starter.</p>
    `,
  },
};
```

- [ ] **Step 2: Apply upgrades when exporting growth posts**

Modify the export mapping at the bottom of `adsense-growth-posts.js`:

```js
const upgrade = PILLAR_ARTICLE_UPGRADES[definition.slug] || {};

return {
  ...definition,
  ...upgrade,
  content: upgrade.content || buildArticle(definition),
  relatedSlugs: RELATED_BY_SLUG[definition.slug],
  quickTakeaways: upgrade.quickTakeaways || buildQuickTakeaways(definition),
  exampleScenarios: upgrade.exampleScenarios || buildExampleScenarios(definition),
  comparisonRows: upgrade.comparisonRows || buildComparisonRows(definition),
  faq: upgrade.faq || buildFaq(definition),
};
```

- [ ] **Step 3: Upgrade the remaining nine priority articles**

Add entries to `PILLAR_ARTICLE_UPGRADES` for:

- `how-birth-date-compatibility-is-calculated`
- `birth-date-compatibility-vs-zodiac-compatibility`
- `life-path-number-compatibility-guide`
- `relationship-timing-by-birth-date`
- `low-compatibility-score-meaning`
- `high-compatibility-score-meaning`
- `how-to-use-compatibility-results-responsibly`
- `zodiac-elements-love-compatibility`
- `group-compatibility-how-to-read-results`

Each entry must use the same object shape as the `what-is-birth-matching` entry: the key is the exact slug, and the value is an object with a `content` template literal containing complete HTML. Each upgraded article must be 900-1,450 words and must include the article-specific sections below.

For `how-birth-date-compatibility-is-calculated`, use these sections:

- `<h1>How Birth Date Compatibility Is Calculated</h1>`
- `<h2>The inputs Match by Birth uses</h2>` covering birth date, zodiac sign, life path number, pair or group mode.
- `<h2>How a score becomes useful</h2>` explaining that the score summarizes supportive and friction patterns.
- `<h2>A sample score breakdown</h2>` with a concrete example such as 82% from easy element rhythm, aligned timing, and one pacing difference.
- `<h2>What the score does not measure</h2>` covering consent, trust, safety, emotional maturity, and real communication.
- `<h2>What to read next</h2>` linking to `/how-it-works`, `/#calculator`, `/blog/low-compatibility-score-meaning`, and `/blog/high-compatibility-score-meaning`.

For `birth-date-compatibility-vs-zodiac-compatibility`, use these sections:

- `<h1>Birth Date Compatibility vs Zodiac Compatibility</h1>`
- `<h2>The short difference</h2>` explaining that zodiac is one signal and birth-date matching is a broader date-based view.
- `<h2>Where zodiac compatibility helps</h2>` with examples for fire, earth, air, and water.
- `<h2>Where birth date compatibility adds context</h2>` covering life path rhythm and relationship timing.
- `<h2>A comparison example</h2>` comparing two pairs with the same zodiac element match but different life path/timing patterns.
- `<h2>Which one should you use?</h2>` linking to `/#calculator`, `/how-it-works`, and `/blog/zodiac-elements-love-compatibility`.

For `life-path-number-compatibility-guide`, use these sections:

- `<h1>Life Path Number Compatibility Guide</h1>`
- `<h2>What a life path number adds</h2>` explaining personality rhythm and decision style.
- `<h2>How life path compatibility shows up</h2>` with practical examples for planning, independence, caretaking, and communication.
- `<h2>Strong rhythm does not mean no work</h2>` explaining high compatibility limits.
- `<h2>Different rhythm does not mean failure</h2>` explaining low compatibility limits.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/life-path-1-compatibility`, and `/blog/how-to-use-compatibility-results-responsibly`.

For `relationship-timing-by-birth-date`, use these sections:

- `<h1>Relationship Timing by Birth Date</h1>`
- `<h2>What timing can and cannot tell you</h2>` using "start, pause, revisit" language.
- `<h2>How timing shows up in a relationship</h2>` with examples for moving fast, needing certainty, or returning to old conversations.
- `<h2>Using timing without outsourcing decisions</h2>` covering responsible use and personal agency.
- `<h2>A practical timing example</h2>` showing a couple deciding whether to rush, slow down, or revisit expectations.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/best-months-to-start-a-relationship-by-zodiac`, and `/blog/how-to-use-compatibility-results-responsibly`.

For `low-compatibility-score-meaning`, use these sections:

- `<h1>What a Low Compatibility Score Means</h1>`
- `<h2>A low score is a friction map</h2>` explaining that friction is not a verdict.
- `<h2>Common reasons a score may be lower</h2>` covering pacing, communication, timing, independence, and expectations.
- `<h2>How to use a lower score in conversation</h2>` with practical questions two people can ask.
- `<h2>When not to overthink the score</h2>` covering healthy relationships with different patterns.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/high-compatibility-score-meaning`, and `/blog/how-to-use-compatibility-results-responsibly`.

For `high-compatibility-score-meaning`, use these sections:

- `<h1>What a High Compatibility Score Means</h1>`
- `<h2>A high score shows supportive patterns</h2>` explaining ease, shared rhythm, and natural understanding.
- `<h2>What high scores can hide</h2>` covering assumptions, conflict avoidance, and taking ease for granted.
- `<h2>How to use a high score well</h2>` with questions about expectations and maintenance.
- `<h2>A high-score example</h2>` showing ease with one blind spot.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/low-compatibility-score-meaning`, and `/blog/group-compatibility-how-to-read-results`.

For `how-to-use-compatibility-results-responsibly`, use these sections:

- `<h1>How to Use Compatibility Results Responsibly</h1>`
- `<h2>Use the result as a prompt, not a verdict</h2>` explaining reflection-first usage.
- `<h2>What the score should never decide for you</h2>` covering consent, safety, health, money, legal decisions, and major life commitments.
- `<h2>Questions to ask after reading a result</h2>` with specific conversation prompts.
- `<h2>How to share a result without pressuring someone</h2>` covering consent and tone.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/what-is-birth-matching`, and `/blog/low-compatibility-score-meaning`.

For `zodiac-elements-love-compatibility`, use these sections:

- `<h1>Zodiac Elements and Love Compatibility</h1>`
- `<h2>What the four elements describe</h2>` covering fire, earth, air, and water as relationship styles.
- `<h2>Element pairs that often feel easy</h2>` with examples for fire-air and earth-water.
- `<h2>Element pairs that need translation</h2>` with examples for fire-water, air-earth, and fire-earth.
- `<h2>How Match by Birth uses element patterns</h2>` tying element style back to the broader score.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/birth-date-compatibility-vs-zodiac-compatibility`, and `/blog/moon-sign-vs-sun-sign-compatibility`.

For `group-compatibility-how-to-read-results`, use these sections:

- `<h1>Group Compatibility: How to Read Results</h1>`
- `<h2>What group mode compares</h2>` explaining every unique pair in a 3-7 person group.
- `<h2>How to read strongest and most sensitive pairs</h2>` explaining group balance without blaming one person.
- `<h2>A four-person group example</h2>` with names such as Alex, Jordan, Maya, and Chris and a practical interpretation.
- `<h2>How to use group results responsibly</h2>` covering teams, friends, families, and privacy.
- `<h2>What to read next</h2>` linking to `/#calculator`, `/how-it-works`, `/blog/friendship-compatibility-by-birth-date`, and `/blog/workplace-compatibility-by-birth-date`.

- [ ] **Step 4: Run the content quality tests**

Run:

```bash
node --test tests/blog-content.test.cjs tests/review-pillar-content.test.cjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/web/src/data/posts/adsense-growth-posts.js tests/blog-content.test.cjs tests/review-pillar-content.test.cjs
git commit -m "content: strengthen review pillar articles"
```

## Task 6: Full Verification And Production Deploy

**Files:**
- No new files unless tests reveal a necessary fix.

- [ ] **Step 1: Run focused tests**

Run:

```bash
node --test tests/blog-content.test.cjs tests/blog-seo.test.cjs tests/static-blog-render.test.cjs tests/review-pillar-content.test.cjs tests/sitemap.test.cjs
```

Expected: PASS.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build --prefix apps/web
```

Expected: PASS and `Prerendered 89 blog HTML files`.

- [ ] **Step 3: Verify built output contains next-step links**

Run:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('dist/apps/web/blog/what-is-birth-matching/index.html','utf8'); for (const text of ['Recommended next','Try the birth date compatibility calculator','Read how Match by Birth works']) { if (!html.includes(text)) throw new Error('missing '+text); } console.log('static article next-step links present');"
```

Expected:

```text
static article next-step links present
```

- [ ] **Step 4: Deploy**

Run:

```bash
./scripts/deploy-production.sh
```

Expected: deployment succeeds and prints:

```text
Production verification passed: https://matchbybirth.com
```

- [ ] **Step 5: Post-deploy spot checks**

Open these public URLs and confirm they load:

```text
https://matchbybirth.com/blog/what-is-birth-matching
https://matchbybirth.com/blog/how-birth-date-compatibility-is-calculated
https://matchbybirth.com/blog/life-path-number-compatibility-guide
https://matchbybirth.com/sitemap.xml
```

Confirm the articles show:

- A readable article body.
- Quick takeaways or other enhancement blocks.
- A "Recommended next" section.
- Related articles.
- Calculator CTA.

## Self-Review

Spec coverage:

- Top 10 article upgrades are covered by Task 5.
- Internal article-to-tool links are covered by Tasks 1, 2, and 3.
- React and static crawlable HTML parity is covered by Tasks 2 and 3.
- Tests for depth, link count, and responsible language are covered by Task 4.
- Production verification is covered by Task 6.

Placeholder scan:

- The plan intentionally includes a full sample upgrade for `what-is-birth-matching`.
- The remaining nine articles have exact slugs, required structure, specific examples, and measurable tests. Their full article prose should be written during Task 5 because each article requires original editorial writing.

Risk:

- AdSense review is already submitted. These changes should improve content and internal navigation without adding ads or changing policy disclosures.
- Do not remove existing privacy, sitemap, or Article schema work during execution.
