'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const presentationModuleUrl = pathToFileURL(
  path.join(
    __dirname,
    '../apps/web/src/lib/result-presentation.js',
  ),
).href;
const interpretationModuleUrl = pathToFileURL(
  path.join(
    __dirname,
    '../apps/web/src/lib/scoreInterpretation.js',
  ),
).href;

test('buildPairHighlights reduces the detailed breakdown to three readable insights', async () => {
  const { buildPairHighlights } = await import(presentationModuleUrl);
  const highlights = buildPairHighlights({
    chemistry: 82,
    communication: 91,
    stability: 74,
    growth: 68,
    intuition: 79,
    overall: 80,
  });

  assert.deepEqual(highlights.map((highlight) => highlight.label), [
    'Communication',
    'Emotional style',
    'Where you differ',
  ]);
  assert.equal(highlights[0].score, 91);
  assert.equal(highlights[1].score, 78);
  assert.equal(highlights[2].score, 68);
  assert.match(highlights[2].summary, /lowest score/i);
});

test('score interpretations use plain, qualified language', async () => {
  const { getScoreInterpretation } = await import(interpretationModuleUrl);
  const interpretations = [
    getScoreInterpretation(85, 'love'),
    getScoreInterpretation(70, 'friendship'),
    getScoreInterpretation(50, 'between'),
    getScoreInterpretation(25, 'love'),
  ];
  const copy = JSON.stringify(interpretations);

  assert.deepEqual(interpretations.map(({ label }) => label), [
    'Very compatible',
    'Good compatibility',
    'Mixed compatibility',
    'More differences than similarities',
  ]);
  assert.doesNotMatch(copy, /exceptional|effortless|meaningful connection|intention|natural alignment/i);
});

test('getVisibleGroupPairs keeps the strongest three visible until expanded', async () => {
  const { getVisibleGroupPairs } = await import(presentationModuleUrl);
  const pairs = Array.from({ length: 6 }, (_, index) => ({
    score: 90 - index,
  }));

  assert.deepEqual(getVisibleGroupPairs(pairs, false), pairs.slice(0, 3));
  assert.deepEqual(getVisibleGroupPairs(pairs, true), pairs);
  assert.deepEqual(getVisibleGroupPairs(null, false), []);
});

test('homepage and navigation use the approved simplified content hierarchy', () => {
  const homePage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/HomePage.jsx'),
    'utf8',
  );
  const homePreview = fs.readFileSync(
    path.join(root, 'apps/web/src/components/HomeResultPreview.jsx'),
    'utf8',
  );
  const calculator = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CompatibilityCalculator.jsx'),
    'utf8',
  );
  const calculatorWithPreview = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CalculatorWithPreview.jsx'),
    'utf8',
  );
  const header = fs.readFileSync(
    path.join(root, 'apps/web/src/components/Header.jsx'),
    'utf8',
  );
  const app = fs.readFileSync(
    path.join(root, 'apps/web/src/App.jsx'),
    'utf8',
  );

  assert.match(homePage, /Discover your birth date compatibility\./);
  assert.match(homePage, /CalculatorWithPreview/);
  assert.match(homePreview, /Good compatibility/);
  assert.match(homePreview, /aria-label="Example compatibility score"/);
  assert.doesNotMatch(homePreview, /conic-gradient|inset_0_0_0/);
  assert.doesNotMatch(homePreview, />82% compatible</);
  assert.match(calculator, /Check your connection/);
  assert.match(calculator, /Private, with no signup required\./);
  assert.match(calculatorWithPreview, /Secure & private/);
  assert.match(calculatorWithPreview, /Instant results/);
  assert.match(calculatorWithPreview, /No signup required/);
  assert.match(header, /\/how-it-works/);
  assert.match(app, /path="\/how-it-works"/);
});

test('pair and group results progressively reveal detail instead of showing everything at once', () => {
  const pairResult = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ResultCard.jsx'),
    'utf8',
  );
  const groupResult = fs.readFileSync(
    path.join(root, 'apps/web/src/components/GroupCompatibilityResults.jsx'),
    'utf8',
  );
  const shareButtons = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ShareButtons.jsx'),
    'utf8',
  );

  assert.match(pairResult, /buildPairHighlights/);
  assert.match(pairResult, /Want a more detailed breakdown\?/);
  assert.match(pairResult, /Get the detailed report · \$9\.99/);
  assert.match(groupResult, /getVisibleGroupPairs/);
  assert.match(groupResult, /View all .* connections/);
  assert.match(shareButtons, /Share by link/);
  assert.match(shareButtons, /Birth dates are not shown/);
  assert.doesNotMatch(shareButtons, /birthDate|p1_dob|p2_dob/);
});

test('marketing subscription UI confirms delivery and requires an unsubscribe action', () => {
  const app = fs.readFileSync(
    path.join(root, 'apps/web/src/App.jsx'),
    'utf8',
  );
  const emailCapture = fs.readFileSync(
    path.join(root, 'apps/web/src/components/EmailCaptureSection.jsx'),
    'utf8',
  );
  const unsubscribePage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/UnsubscribePage.jsx'),
    'utf8',
  );

  assert.match(app, /path="\/unsubscribe"/);
  assert.match(emailCapture, /on the list/);
  assert.match(emailCapture, /Check your inbox/);
  assert.match(emailCapture, /Unsubscribe anytime/);
  assert.match(unsubscribePage, /Confirm unsubscribe/);
  assert.match(unsubscribePage, /fetch\('\/api\/unsubscribe'/);
  assert.match(unsubscribePage, /name="robots" content="noindex, nofollow"/);
});

test('newsletter capture uses a readable editorial treatment instead of a purple promo block', () => {
  const newsletterCapture = fs.readFileSync(
    path.join(root, 'apps/web/src/components/NewsletterCapture.jsx'),
    'utf8',
  );
  const blogPostPage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/BlogPostPage.jsx'),
    'utf8',
  );

  assert.match(newsletterCapture, /Get better compatibility notes in your inbox/);
  assert.match(newsletterCapture, /One useful email with timing notes/);
  assert.match(newsletterCapture, /bg-card/);
  assert.match(newsletterCapture, /text-muted-foreground/);
  assert.match(newsletterCapture, /border-border/);
  assert.doesNotMatch(newsletterCapture, /linear-gradient\(135deg, #6c4de6 0%, #8b5cf6 100%\)/);
  assert.doesNotMatch(newsletterCapture, /Join thousands/i);
  assert.match(blogPostPage, /NewsletterCapture/);
  assert.doesNotMatch(blogPostPage, /Get weekly astrology insights/);
});

test('mobile Pair and Group selector is compact and centered', () => {
  const calculator = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CompatibilityCalculator.jsx'),
    'utf8',
  );
  const modeToggle = fs.readFileSync(
    path.join(root, 'apps/web/src/components/GroupModeToggle.jsx'),
    'utf8',
  );

  assert.match(calculator, /flex justify-center sm:justify-end/);
  assert.match(modeToggle, /w-fit/);
});

test('report checkout explains its value while retaining payment and privacy assurances', () => {
  const checkout = fs.readFileSync(
    path.join(root, 'apps/web/src/components/SaveResultModal.jsx'),
    'utf8',
  );

  assert.match(checkout, /9-section report/);
  assert.match(checkout, /How you communicate/);
  assert.match(checkout, /Where you connect naturally/);
  assert.match(checkout, /Where misunderstandings may happen/);
  assert.match(checkout, /Practical ways to handle differences/);
  assert.match(checkout, /Private link and PDF delivered by email/);
  assert.match(checkout, /Birth dates and your email are not sent to the AI provider/);
  assert.match(checkout, /One-time digital report/);
  assert.match(checkout, /Refund support available/);
  assert.match(checkout, /Secure Stripe checkout/);
  assert.match(checkout, /Instant email delivery/);
  assert.match(checkout, /Buy report for \$9\.99/);
  assert.match(checkout, /Payment is handled by Stripe/);
  assert.match(checkout, /reflection and conversation, not professional advice/i);
  assert.doesNotMatch(checkout, /Urgency Discount|COSMIC30|Claim Offer/i);
  assert.doesNotMatch(checkout, /friction patterns|go beyond the score|repair misunderstandings/i);
});

test('SEO metadata is truthful and result pages are excluded from indexing', () => {
  const index = fs.readFileSync(
    path.join(root, 'apps/web/index.html'),
    'utf8',
  );
  const sitemap = fs.readFileSync(
    path.join(root, 'apps/web/public/sitemap.xml'),
    'utf8',
  );
  const llms = fs.readFileSync(
    path.join(root, 'apps/web/public/llms.txt'),
    'utf8',
  );
  const resultPage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/ResultPage.jsx'),
    'utf8',
  );
  const vercelConfig = JSON.parse(fs.readFileSync(
    path.join(root, 'vercel.json'),
    'utf8',
  ));

  assert.match(index, /Birth Date Compatibility Calculator \| Match by Birth/);
  assert.match(index, /href="\/favicon\.svg"/);
  assert.equal(fs.existsSync(path.join(root, 'apps/web/public/favicon.svg')), true);
  assert.match(index, /Birth dates are processed for the calculation and are not stored/);
  assert.doesNotMatch(index, /highly accurate|happens instantly in your browser|Hostinger Horizons|vite\.svg/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/matchbybirth\.com\/result<\/loc>/);
  assert.doesNotMatch(sitemap, /<lastmod>2026-05-24<\/lastmod>/);
  assert.doesNotMatch(llms, /\]\(\/result\)|\]\(\/report\)/);
  assert.match(resultPage, /noindex,nofollow,noarchive/);
  assert.deepEqual(vercelConfig.redirects[0], {
    source: '/',
    has: [
      {
        type: 'host',
        value: 'www.matchbybirth.com',
      },
    ],
    destination: 'https://matchbybirth.com/',
    permanent: true,
  });
  assert.deepEqual(vercelConfig.headers, [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/result',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow, noarchive',
        },
      ],
    },
    {
      source: '/admin/funnel',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow, noarchive',
        },
      ],
    },
  ]);
});
