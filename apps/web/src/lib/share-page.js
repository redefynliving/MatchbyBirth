import { getShareScore } from '@/lib/share-copy.js';

const BREAKDOWN_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

export const SHARE_BAND_COPY = {
  strong_natural_rhythm: {
    label: 'Strong natural rhythm',
    shortLine: 'Easy pull, strong flow, fewer rough edges.',
    heroLine: 'There is an easy pull here. The connection tends to feel natural before it feels complicated.',
    ctaTitle: 'See your full private reading',
    ctaBody: 'This shared page is only a preview. Run your own match to explore the full compatibility reading.',
  },
  good_compatibility: {
    label: 'Good compatibility',
    shortLine: 'Real traction, clear interest, a few things to watch.',
    heroLine: 'There is real traction here, with enough depth to keep things interesting.',
    ctaTitle: 'Explore the full connection',
    ctaBody: 'The shared version shows the outline. Your private reading goes further into emotional patterns and relationship dynamics.',
  },
  mixed_rhythm: {
    label: 'Mixed rhythm',
    shortLine: 'Chemistry is there, but not without friction.',
    heroLine: 'There is chemistry here, but some patterns may need more honesty and care.',
    ctaTitle: 'See what is working and what is not',
    ctaBody: 'This preview only shows part of the picture. Run your own match for the deeper reading.',
  },
  different_rhythms: {
    label: 'Different rhythms',
    shortLine: 'Compelling in places, uneven in others.',
    heroLine: 'This connection may feel compelling, but not always easy to move through.',
    ctaTitle: 'Understand the full dynamic',
    ctaBody: 'Shared pages are just the surface. Your private reading explains the deeper tension and compatibility patterns.',
  },
};

export function getShareBandKey(score) {
  if (score >= 85) return 'strong_natural_rhythm';
  if (score >= 70) return 'good_compatibility';
  if (score >= 50) return 'mixed_rhythm';
  return 'different_rhythms';
}

export function getShareBandCopy(scoreOrKey) {
  const key = typeof scoreOrKey === 'string' ? scoreOrKey : getShareBandKey(Number(scoreOrKey) || 0);
  return SHARE_BAND_COPY[key] || SHARE_BAND_COPY.good_compatibility;
}

function getPairArea(result, direction) {
  const entries = Object.entries(result?.breakdown || {})
    .filter(([key, value]) => key !== 'overall' && BREAKDOWN_LABELS[key] && Number.isFinite(Number(value)))
    .map(([key, value]) => ({ key, label: BREAKDOWN_LABELS[key], score: Math.round(Number(value)) }));

  if (!entries.length) return direction === 'strongest' ? 'Natural rhythm' : 'Timing and communication';

  const sorted = entries.sort((left, right) => (
    direction === 'strongest' ? right.score - left.score : left.score - right.score
  ));
  const area = sorted[0];
  return `${area.label} (${area.score}/100)`;
}

function getGroupArea(result, direction) {
  if (direction === 'strongest' && result?.bestPair?.personA && result?.bestPair?.personB) {
    return `${result.bestPair.personA.name} + ${result.bestPair.personB.name}`;
  }

  const pairs = Array.isArray(result?.pairs) ? result.pairs : [];
  const lowestPair = pairs[pairs.length - 1];
  if (lowestPair?.personA && lowestPair?.personB) {
    return `${lowestPair.personA.name} + ${lowestPair.personB.name}`;
  }

  return direction === 'strongest' ? 'Group glue' : 'Uneven pacing';
}

function getDisplayName(result) {
  const people = Array.isArray(result?.people) ? result.people : [];
  if (result?.mode === 'group') return `Group of ${people.length}`;
  const names = people.map((person) => person?.name).filter(Boolean);
  return names.length >= 2 ? `${names[0]} + ${names[1]}` : 'Shared compatibility result';
}

function getTopAspect(result) {
  if (result?.calculationMode !== 'full-synastry') return '';
  const evidence = Array.isArray(result?.synastry?.evidence) ? result.synastry.evidence : [];
  return evidence.find((item) => item?.label)?.label || '';
}

function getPreviewInsight(scoreBand, strongestArea, watchArea) {
  const insights = {
    strong_natural_rhythm: `The strongest signal is ${strongestArea}. The watch area is ${watchArea}, which is more of a tuning point than a warning sign.`,
    good_compatibility: `This result has a clear center of gravity in ${strongestArea}. ${watchArea} is the part to name early so the connection stays easier to read.`,
    mixed_rhythm: `There is enough pull to pay attention to, especially around ${strongestArea}. The real test is ${watchArea}, where assumptions can make things feel louder than they are.`,
    different_rhythms: `The connection is not flat, but it may need more translation. ${strongestArea} can still work if ${watchArea} is handled directly.`,
  };

  return insights[scoreBand] || insights.good_compatibility;
}

export function buildSharePageModel(result) {
  const score = getShareScore(result);
  const scoreBand = getShareBandKey(score);
  const band = getShareBandCopy(scoreBand);
  const isGroup = result?.mode === 'group';
  const strongestArea = isGroup
    ? getGroupArea(result, 'strongest')
    : getPairArea(result, 'strongest');
  const watchArea = isGroup
    ? getGroupArea(result, 'watch')
    : getPairArea(result, 'watch');
  const relationshipType = result?.relationshipType || (isGroup ? 'group' : 'connection');
  const topAspect = getTopAspect(result);

  return {
    displayName: getDisplayName(result),
    relationshipType,
    score,
    scoreBand,
    bandLabel: band.label,
    bandShortLine: band.shortLine,
    heroLine: band.heroLine,
    ctaTitle: band.ctaTitle,
    ctaBody: band.ctaBody,
    strongestArea,
    watchArea,
    readingMode: topAspect ? 'Full timed synastry' : 'Birth-date compatibility',
    topAspect,
    previewInsight: topAspect
      ? `${getPreviewInsight(scoreBand, strongestArea, watchArea)} The leading timed aspect is ${topAspect}.`
      : getPreviewInsight(scoreBand, strongestArea, watchArea),
    previewParagraphOne: `This shared result shows the public outline: score, rhythm, strongest area, and watch area. It is enough to start the conversation without exposing private birth details.`,
    previewParagraphTwo: `The full reading is meant to go deeper into why the connection feels the way it does, what can create friction, and what to talk about before the pattern repeats.`,
  };
}
