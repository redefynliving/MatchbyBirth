const BREAKDOWN_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

function normalizeScore(value) {
  const score = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function describeScore(score, strong, balanced, lower) {
  if (score >= 80) return strong;
  if (score >= 60) return balanced;
  return lower;
}

export function buildPairHighlights(breakdown = {}) {
  const communication = normalizeScore(breakdown.communication);
  const emotionalStyle = normalizeScore(
    (
      normalizeScore(breakdown.chemistry)
      + normalizeScore(breakdown.stability)
      + normalizeScore(breakdown.intuition)
    ) / 3,
  );
  const growthEntry = Object.keys(BREAKDOWN_LABELS)
    .map((key) => [key, normalizeScore(breakdown[key])])
    .sort((left, right) => left[1] - right[1])[0];
  const [growthKey, growthScore] = growthEntry;

  return [
    {
      key: 'communication',
      label: 'Communication',
      score: communication,
      summary: describeScore(
        communication,
        'You tend to understand each other quickly.',
        'You can communicate well when both people are direct.',
        'Slow down and confirm what each person means.',
      ),
    },
    {
      key: 'emotional-style',
      label: 'Emotional style',
      score: emotionalStyle,
      summary: describeScore(
        emotionalStyle,
        'You may respond to feelings in similar ways.',
        'Your emotional styles have both similarities and differences.',
        'You may need more time to understand each other’s reactions.',
      ),
    },
    {
      key: 'differences',
      label: 'Where you differ',
      score: growthScore,
      summary: `${BREAKDOWN_LABELS[growthKey]} has the lowest score in this result.`,
    },
  ];
}

export function getVisibleGroupPairs(pairs, expanded, limit = 3) {
  if (!Array.isArray(pairs)) return [];
  return expanded ? pairs : pairs.slice(0, limit);
}
