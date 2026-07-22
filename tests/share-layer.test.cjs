'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const {
  buildShareCardMeta,
  buildShareCardSvg,
  getScoreBand,
} = require('../api/_lib/share-card.cjs');

const root = path.resolve(__dirname, '..');

test('share card meta uses score bands and the weakest watch area', () => {
  const meta = buildShareCardMeta({
    mode: 'pair',
    people: [{ name: 'Alex' }, { name: 'Jordan' }],
    score: 86,
    breakdown: {
      chemistry: 91,
      communication: 84,
      stability: 66,
      growth: 78,
      intuition: 81,
      overall: 86,
    },
  });

  assert.equal(meta.score, 86);
  assert.equal(meta.band.label, 'Strong natural rhythm');
  assert.equal(meta.watchArea, 'Stability');
  assert.equal(meta.title, 'Alex & Jordan: 86% compatibility');
});

test('share card svg is private-safe and supports group scores', () => {
  const svg = buildShareCardSvg({
    mode: 'group',
    people: [{ name: 'Alex' }, { name: 'Jordan' }, { name: 'Morgan' }],
    groupScore: 72,
    bestPair: {
      personA: { name: 'Alex' },
      personB: { name: 'Morgan' },
    },
  });

  assert.match(svg, /Group of 3/);
  assert.match(svg, /72%/);
  assert.match(svg, /Good compatibility/);
  assert.doesNotMatch(svg, /undefined%/);
  assert.doesNotMatch(svg, /\d{4}-\d{2}-\d{2}/);
});

test('full synastry share cards expose calculated evidence without birth details', () => {
  const result = {
    mode: 'pair',
    calculationMode: 'full-synastry',
    people: [{ name: 'Alex' }, { name: 'Jordan' }],
    score: 82,
    breakdown: { chemistry: 88, communication: 76, stability: 72, growth: 84, intuition: 80 },
    synastry: {
      evidence: [{ label: 'Moon trine Venus (0.5° orb)', polarity: 'supportive' }],
    },
  };
  const meta = buildShareCardMeta(result);
  const svg = buildShareCardSvg(result);

  assert.equal(meta.readingLabel, 'Full timed synastry');
  assert.equal(meta.topAspect, 'Moon trine Venus (0.5° orb)');
  assert.match(meta.description, /Top synastry aspect/);
  assert.match(svg, /FULL TIMED SYNASTRY/);
  assert.match(svg, /Moon trine Venus/);
  assert.doesNotMatch(svg, /birthDate|birthTime|timezone/);
});

test('share copy and result metadata use the branded share layer', async () => {
  const shareCopy = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/share-copy.js'),
  ));
  const resultPage = fs.readFileSync(
    path.join(root, 'apps/web/src/pages/ResultPage.jsx'),
    'utf8',
  );
  const shareButtons = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ShareButtons.jsx'),
    'utf8',
  );
  const sharePage = fs.readFileSync(
    path.join(root, 'apps/web/src/components/share/SharedResultConversion.jsx'),
    'utf8',
  );
  const sharePageModel = fs.readFileSync(
    path.join(root, 'apps/web/src/lib/share-page.js'),
    'utf8',
  );

  assert.equal(getScoreBand(49).label, 'Different rhythms');
  assert.equal(shareCopy.getShareBand(86), 'Strong natural rhythm');
  assert.equal(
    shareCopy.getShareText({ mode: 'pair', p1: 'Alex', p2: 'Jordan', score: 86 }),
    'Alex and Jordan got 86% on Match by Birth: Strong natural rhythm.',
  );
  assert.equal(
    shareCopy.getShareText({
      mode: 'pair',
      p1: 'Alex',
      p2: 'Jordan',
      score: 82,
      calculationMode: 'full-synastry',
      topAspectLabel: 'Moon trine Venus (0.5° orb)',
    }),
    'Alex and Jordan got 82% in a full Match by Birth synastry reading. Top aspect: Moon trine Venus (0.5° orb).',
  );
  assert.match(resultPage, /twitter:card/);
  assert.match(resultPage, /getShareTitle/);
  assert.match(resultPage, /getShareDescription/);
  assert.match(resultPage, /share_page_view/);
  assert.match(resultPage, /SharedResultConversion/);
  assert.match(shareButtons, /Birth dates are not shown/);
  assert.match(shareButtons, /score_band/);
  assert.match(shareButtons, /share_page_copy_link_click/);
  assert.match(shareButtons, /share_page_x_share_click/);
  assert.match(sharePage, /Try your own match/);
  assert.match(sharePage, /\/#calculator/);
  assert.match(sharePage, /\/sample-report/);
  assert.match(sharePage, /share_page_cta_click/);
  assert.match(sharePage, /share_page_sample_report_click/);
  assert.match(sharePage, /placement="shared_result"/);
  assert.doesNotMatch(sharePage, /placement="top"/);
  assert.doesNotMatch(sharePage, /placement="middle"/);
  assert.doesNotMatch(sharePage, /placement="bottom"/);
  assert.match(sharePage, /Birth dates are not shown on shared pages/);
  assert.match(sharePageModel, /strong_natural_rhythm/);
  assert.match(sharePageModel, /good_compatibility/);
  assert.match(sharePageModel, /mixed_rhythm/);
  assert.match(sharePageModel, /different_rhythms/);
  assert.match(sharePageModel, /strongestArea/);
  assert.match(sharePageModel, /watchArea/);
  assert.match(sharePageModel, /topAspect/);
  assert.match(sharePage, /Leading timed aspect/);
});
