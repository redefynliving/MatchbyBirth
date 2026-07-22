const SCORE_BANDS = [
  [85, 'Strong natural rhythm'],
  [70, 'Good compatibility'],
  [50, 'Mixed rhythm'],
  [0, 'Different rhythms'],
];

export function getShareScore(result) {
  const score = Number(result?.mode === 'group' ? result?.groupScore : result?.score);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;
}

export function getShareBand(score) {
  return SCORE_BANDS.find(([minimum]) => score >= minimum)?.[1] || 'Compatibility result';
}

export function getShareTitle(result) {
  const score = getShareScore(result);
  if (result?.mode === 'group') {
    return `Group compatibility: ${score}% overall fit | Match by Birth`;
  }

  const names = Array.isArray(result?.people)
    ? result.people.map((person) => person?.name).filter(Boolean)
    : [];
  const label = names.length >= 2 ? `${names[0]} & ${names[1]}` : 'Compatibility result';
  return `${label}: ${score}% compatibility | Match by Birth`;
}

export function getShareDescription(result) {
  const score = getShareScore(result);
  const band = getShareBand(score);
  const topAspect = result?.calculationMode === 'full-synastry'
    ? result?.synastry?.evidence?.find((item) => item?.label)?.label
    : '';
  if (topAspect) {
    return `${band}. Full timed synastry with ${topAspect} as a leading aspect. Birth details stay private.`;
  }
  return `${band}. A private-safe Match by Birth result with strengths, watch area, and one useful next conversation.`;
}

export function getShareText({
  mode = 'pair',
  p1,
  p2,
  score,
  groupVibeScore,
  calculationMode,
  topAspectLabel,
}) {
  const shareScore = Number(mode === 'group' ? groupVibeScore : score) || 0;
  const band = getShareBand(shareScore);

  if (mode === 'group') {
    return `Our Match by Birth group result is ${shareScore}%: ${band}.`;
  }

  if (calculationMode === 'full-synastry' && topAspectLabel) {
    return `${p1} and ${p2} got ${shareScore}% in a full Match by Birth synastry reading. Top aspect: ${topAspectLabel}.`;
  }

  return `${p1} and ${p2} got ${shareScore}% on Match by Birth: ${band}.`;
}
