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

function describeScore(score, strong, balanced, intentional) {
  if (score >= 80) return strong;
  if (score >= 60) return balanced;
  return intentional;
}

export function buildPairHighlights(breakdown = {}) {
  const communication = normalizeScore(breakdown.communication);
  const emotionalRhythm = normalizeScore(
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
        'Clear communication grows with a little intention.',
        'Slow down and confirm what each person means.',
      ),
    },
    {
      key: 'emotional-rhythm',
      label: 'Emotional rhythm',
      score: emotionalRhythm,
      summary: describeScore(
        emotionalRhythm,
        'Your emotional pace feels naturally reassuring.',
        'You can find a steady rhythm with mutual care.',
        'Give each other more room to process differently.',
      ),
    },
    {
      key: 'growth-edge',
      label: 'Growth edge',
      score: growthScore,
      summary: `${BREAKDOWN_LABELS[growthKey]} is where this connection benefits from the most intention.`,
    },
  ];
}

export function getVisibleGroupPairs(pairs, expanded, limit = 3) {
  if (!Array.isArray(pairs)) return [];
  return expanded ? pairs : pairs.slice(0, limit);
}

