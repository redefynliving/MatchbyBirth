'use strict';

const MODEL = 'claude-haiku-4-5-20251001';
const PROMPT_VERSION = 'structured-v1';

function fallbackReport(result) {
  const [first, second] = result.people;
  const relationship = result.relationshipType === 'friendship'
    ? 'friendship'
    : result.relationshipType === 'work'
      ? 'working relationship'
      : 'connection';
  const score = result.score;
  const stronger = Object.entries(result.breakdown)
    .filter(([key]) => key !== 'overall')
    .sort((left, right) => right[1] - left[1])[0]?.[0] || 'connection';
  const gentler = Object.entries(result.breakdown)
    .filter(([key]) => key !== 'overall')
    .sort((left, right) => left[1] - right[1])[0]?.[0] || 'communication';

  return {
    title: `${first.name} & ${second.name}`,
    overview: `${first.name} and ${second.name} share a ${score}% compatibility score. Their ${first.element} and ${second.element} styles create a ${relationship} with clear natural strengths and a few areas that benefit from intention.`,
    sections: [
      {
        key: 'strengths',
        title: 'Natural Strengths',
        body: `The clearest strength is ${stronger}. ${first.name}'s ${first.sign} directness and ${second.name}'s ${second.sign} perspective can help this connection feel active, responsive, and mutually encouraging.`,
      },
      {
        key: 'friction',
        title: 'Likely Friction',
        body: `${gentler} may need the most care. Differences are more useful when they are named early instead of treated as proof that one person is right and the other is wrong.`,
      },
      {
        key: 'communication',
        title: 'Communication',
        body: `Short, direct conversations will serve this pair better than assumptions. Reflecting back what was heard before responding can prevent small differences in style from becoming larger misunderstandings.`,
      },
      {
        key: 'emotional_dynamic',
        title: 'Emotional Dynamic',
        body: `This pair may process feelings at different speeds. Giving each other room to respond honestly, without forcing immediate agreement, can create more emotional safety.`,
      },
      {
        key: 'stability',
        title: 'Stability',
        body: `Consistency matters more than intensity here. Reliable follow-through, simple rituals, and clear expectations will make the connection feel steadier over time.`,
      },
      {
        key: 'growth',
        title: 'Growth Potential',
        body: `Each person can expand the other's usual point of view. The best growth comes from curiosity: ask what the other person's approach protects or makes possible before trying to change it.`,
      },
      {
        key: 'practical_advice',
        title: 'Practical Advice',
        body: `Choose one recurring check-in, keep expectations specific, and address tension while it is still small. Shared plans work best when both people can see where they have flexibility and where they need dependability.`,
      },
      {
        key: 'do',
        title: 'Do More Of',
        body: `Name appreciation out loud, make requests directly, and create space for both spontaneity and structure. Notice successful moments and repeat what made them work.`,
      },
      {
        key: 'avoid',
        title: 'Avoid',
        body: `Avoid mind-reading, scorekeeping, and using personality differences as fixed labels. A compatibility score is most helpful as a prompt for conversation, not a verdict.`,
      },
    ],
    closing: `The strongest version of this connection is built through attention, honesty, and repeated choices. The score describes a pattern; ${first.name} and ${second.name} still decide what they create from it.`,
    model: 'fallback-v1',
    promptVersion: PROMPT_VERSION,
  };
}

function parseModelReport(text) {
  const normalized = String(text || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  const report = JSON.parse(normalized);
  if (
    !report ||
    typeof report.title !== 'string' ||
    typeof report.overview !== 'string' ||
    !Array.isArray(report.sections) ||
    report.sections.length !== 9 ||
    report.sections.some(
      (section) =>
        typeof section.key !== 'string' ||
        typeof section.title !== 'string' ||
        typeof section.body !== 'string',
    ) ||
    typeof report.closing !== 'string'
  ) {
    throw new Error('Model returned an invalid report shape.');
  }
  return report;
}

async function generateStructuredReport(result, options = {}) {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  const fetchImpl = options.fetchImpl || fetch;
  if (!apiKey) return fallbackReport(result);

  const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2600,
      system: [
        'Write a premium, grounded relationship compatibility report.',
        'Return valid JSON only. Do not use markdown or emojis.',
        'Treat astrology as reflective entertainment, never certainty or professional advice.',
        'Use the supplied sanitized signs and scores only. Do not invent birth dates or chart placements.',
      ].join(' '),
      messages: [{
        role: 'user',
        content: JSON.stringify({
          task: 'Create a structured compatibility report.',
          requiredShape: {
            title: 'string',
            overview: 'string',
            sections: [
              'strengths',
              'friction',
              'communication',
              'emotional_dynamic',
              'stability',
              'growth',
              'practical_advice',
              'do',
              'avoid',
            ].map((key) => ({ key, title: 'string', body: 'string' })),
            closing: 'string',
          },
          result,
        }),
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Report provider failed with status ${response.status}.`);
  }

  const data = await response.json();
  const report = parseModelReport(data?.content?.[0]?.text);
  return {
    ...report,
    model: MODEL,
    promptVersion: PROMPT_VERSION,
  };
}

module.exports = {
  fallbackReport,
  generateStructuredReport,
  parseModelReport,
};
