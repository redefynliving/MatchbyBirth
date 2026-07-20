const BREAKDOWN_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

const BREAKDOWN_DESCRIPTIONS = {
  chemistry: 'How quickly interest, warmth, and momentum may build.',
  communication: 'How easily intentions and reactions may be understood.',
  stability: 'How steady the connection may feel when expectations are clear.',
  growth: 'How much the connection may stretch both people in useful ways.',
  intuition: 'How naturally each person may read the other without explanation.',
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

export function getFocusFraming(scoreValue) {
  const score = normalizeScore(scoreValue);
  if (score >= 80) {
    return {
      label: 'Relative growth edge',
      tone: 'strong',
      summary: 'This is the lowest category only by comparison; it is still a strong part of the match.',
    };
  }
  if (score >= 60) {
    return {
      label: 'Area to clarify',
      tone: 'balanced',
      summary: 'This area can work well when expectations are said directly instead of assumed.',
    };
  }
  return {
    label: 'Watch area',
    tone: 'watch',
    summary: 'This difference needs deliberate expectations, examples, and follow-through.',
  };
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
  const focus = getFocusFraming(growthScore);

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
      label: focus.label,
      score: growthScore,
      summary: `${BREAKDOWN_LABELS[growthKey]} is the lowest category at ${growthScore}. ${focus.summary}`,
    },
  ];
}

export function buildPairScoreProfile(breakdown = {}) {
  return Object.keys(BREAKDOWN_LABELS).map((key) => ({
    key,
    label: BREAKDOWN_LABELS[key],
    score: normalizeScore(breakdown[key]),
    description: BREAKDOWN_DESCRIPTIONS[key],
  }));
}

export function buildPairSnapshot(breakdown = {}) {
  const ranked = buildPairScoreProfile(breakdown)
    .sort((left, right) => right.score - left.score);
  const strongest = ranked[0];
  const watch = ranked.at(-1);
  const focus = getFocusFraming(watch.score);

  const nextSteps = {
    chemistry: 'Name what each person expects after the initial spark.',
    communication: 'Ask what helps each person feel heard before giving advice.',
    stability: 'Talk about pace, consistency, and what reliability looks like.',
    growth: 'Name one difference that could become a strength instead of a fight.',
    intuition: 'Check assumptions out loud instead of expecting mind-reading.',
  };

  return {
    strongest: {
      ...strongest,
      summary: `${strongest.label} is the clearest strength in this result.`,
    },
    watch: {
      ...watch,
      eyebrow: focus.label,
      tone: focus.tone,
      summary: `${watch.label} is ${watch.score}. ${focus.summary}`,
    },
    nextStep: nextSteps[watch.key],
  };
}

export function buildGroupInsights(result = {}) {
  const pairs = Array.isArray(result.pairs) ? result.pairs : [];
  const bestPair = result.bestPair || pairs[0] || null;
  const focusPair = result.groupInsights?.focusPair || pairs.at(-1) || null;
  const bridgePerson = result.groupInsights?.bridgePerson || result.groupGlue || null;
  const balanceGap = Number.isFinite(result.groupInsights?.balanceGap)
    ? result.groupInsights.balanceGap
    : Math.max(0, Number(bestPair?.score || 0) - Number(focusPair?.score || 0));
  const focus = getFocusFraming(focusPair?.score || 0);
  const action = result.groupInsights?.action || (
    focusPair && bridgePerson
      ? `Before the next group plan, ask ${focusPair.personA.name} and ${focusPair.personB.name} what would make participation easier, then let ${bridgePerson.name} summarize the shared expectation.`
      : 'Before the next group plan, have each person name one preference and confirm the shared expectation.'
  );

  return { bestPair, focusPair, bridgePerson, balanceGap, focus, action };
}

export function getVisibleGroupPairs(pairs, expanded, limit = 3) {
  if (!Array.isArray(pairs)) return [];
  return expanded ? pairs : pairs.slice(0, limit);
}

export function getResultPrecisionDetails(people = []) {
  const precisions = people
    .map((person) => person?.precision)
    .filter((precision) => precision === 'exact' || precision === 'date-only');

  const hasExact = precisions.includes('exact');
  const hasDateOnly = precisions.includes('date-only');

  if (hasExact && hasDateOnly) {
    return {
      label: 'Mixed precision',
      note: 'Some people used birth time and place; others used birth date only.',
    };
  }

  if (hasExact) {
    return {
      label: 'Exact match',
      note: 'Birth time and place were used.',
    };
  }

  return {
    label: 'Date-only match',
    note: 'Based on birth date only.',
  };
}
