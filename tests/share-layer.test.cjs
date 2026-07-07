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

  assert.equal(getScoreBand(49).label, 'Different rhythms');
  assert.equal(shareCopy.getShareBand(86), 'Strong natural rhythm');
  assert.equal(
    shareCopy.getShareText({ mode: 'pair', p1: 'Alex', p2: 'Jordan', score: 86 }),
    'Alex and Jordan got 86% on Match by Birth: Strong natural rhythm.',
  );
  assert.match(resultPage, /twitter:card/);
  assert.match(resultPage, /getShareTitle/);
  assert.match(resultPage, /getShareDescription/);
  assert.match(shareButtons, /Birth dates are not shown/);
  assert.match(shareButtons, /score_band/);
});
