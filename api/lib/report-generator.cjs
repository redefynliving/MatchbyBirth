'use strict';

const MODEL = 'claude-haiku-4-5-20251001';
const PROMPT_VERSION = 'structured-v2';

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
    overview: `${first.name} and ${second.name} share a ${score}% compatibility score. Their ${first.element} and ${second.element} signs point to several strengths and some differences in this ${relationship}.`,
    sections: [
      {
        key: 'strengths',
        title: 'Where You Connect',
        body: `${stronger} is the highest-scoring part of this result. ${first.name}'s ${first.sign} style and ${second.name}'s ${second.sign} style may make this area easier for them.`,
      },
      {
        key: 'friction',
        title: 'Where You May Clash',
        body: `${gentler} is the lowest-scoring part of this result. This difference may cause confusion when each person expects the other to respond the same way.`,
      },
      {
        key: 'communication',
        title: 'Communication',
        body: `Short, direct conversations may work better than assumptions for this pair. Repeating back the main point before responding can help prevent misunderstandings.`,
      },
      {
        key: 'emotional_dynamic',
        title: 'Emotional Style',
        body: `This pair may respond to feelings at different speeds. Allowing time before expecting an answer may make difficult conversations easier.`,
      },
      {
        key: 'stability',
        title: 'Stability',
        body: `Clear expectations and reliable follow-through may make this connection easier to manage. Small promises matter more when both people keep them.`,
      },
      {
        key: 'growth',
        title: 'What You Can Learn From Each Other',
        body: `Each person may notice options the other overlooks. Asking why the other person prefers a different approach can make those differences more useful.`,
      },
      {
        key: 'practical_advice',
        title: 'What May Help',
        body: `Keep requests specific and discuss problems before they build up. Shared plans are easier when both people know what is flexible and what is not.`,
      },
      {
        key: 'do',
        title: 'Try More Of',
        body: `Say what you appreciate, make requests directly, and notice which conversations go well. Repeat the habits that make those moments easier.`,
      },
      {
        key: 'avoid',
        title: 'Watch For',
        body: `Watch for assumptions, scorekeeping, and treating personality differences as permanent facts. Use the score as a conversation starter, not a verdict.`,
      },
    ],
    closing: `This score describes patterns based on the information provided. ${first.name} and ${second.name}'s choices and communication matter more than any compatibility score.`,
    model: 'fallback-v1',
    promptVersion: PROMPT_VERSION,
  };
}

function parseModelReport(text) {
  let normalized = String(text || '').trim();
  if (normalized.startsWith('```')) {
    const firstLineEnd = normalized.indexOf('\n');
    normalized = firstLineEnd === -1
      ? normalized.slice(3)
      : normalized.slice(firstLineEnd + 1);
  }
  if (normalized.endsWith('```')) {
    normalized = normalized.slice(0, -3);
  }
  normalized = normalized.trim();
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
        'Write a grounded relationship compatibility report in plain, specific language and short sentences.',
        'Return valid JSON only. Do not use markdown or emojis.',
        'Treat astrology as reflective entertainment. Avoid certainty, predictions, diagnosis, or professional advice.',
        'Avoid vague therapy or AI-style phrases, including natural alignment, natural rhythm, growth edge, intention, emotional safety, meaningful connection, and go deeper.',
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
