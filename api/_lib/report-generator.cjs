'use strict';

const MODEL = 'claude-haiku-4-5-20251001';
const PROMPT_VERSION = 'structured-v4';
const REQUIRED_SECTION_KEYS = [
  'strengths',
  'friction',
  'communication',
  'emotional_dynamic',
  'stability',
  'growth',
  'practical_advice',
  'do',
  'avoid',
];

const REJECTED_REPORT_PATTERNS = [
  /\b(meant to be|soulmate|soulmates|fated|destined|guaranteed|guarantee|doomed|will fail|must break up)\b/i,
  /\b(will always|will never)\b/i,
  /\b(diagnose|diagnosis|clinical|therapy|therapist|medical advice|legal advice|financial advice)\b/i,
  /\b(narcissist|trauma response|attachment disorder|personality disorder)\b/i,
  /\b(birthDate|birth date:|email|private token|access token|checkout session|payment intent)\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
  /\b(natural alignment|natural rhythm|growth edge|meaningful connection|go deeper|communication is important|open communication is key)\b/i,
];

function sentenceCount(value) {
  return String(value || '').split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
}

function wordCount(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length;
}

function titleCase(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRelationshipLabel(type) {
  if (type === 'friendship') return 'friendship';
  if (type === 'work') return 'working relationship';
  if (type === 'family') return 'family connection';
  if (type === 'love') return 'romantic connection';
  return 'connection';
}

function buildReportFacts(result) {
  const breakdownEntries = Object.entries(result?.breakdown || {})
    .filter(([key, value]) => key !== 'overall' && Number.isFinite(Number(value)))
    .sort((left, right) => Number(right[1]) - Number(left[1]));
  const strongestKey = breakdownEntries[0]?.[0] || 'communication';
  const watchKey = breakdownEntries[breakdownEntries.length - 1]?.[0] || 'communication';

  return {
    score: Number(result?.score || 0),
    relationship: getRelationshipLabel(result?.relationshipType),
    strongestKey,
    strongestLabel: titleCase(strongestKey),
    watchKey,
    watchLabel: titleCase(watchKey),
  };
}

function buildConversationPrompt(result) {
  const facts = buildReportFacts(result);
  return `Say this first: "I think ${facts.strongestLabel.toLowerCase()} is where this feels easiest, but ${facts.watchLabel.toLowerCase()} is the part we should name early instead of guessing."`;
}

function fallbackReport(result) {
  const [first, second] = result.people;
  const facts = buildReportFacts(result);
  const firstStyle = `${first.name}'s ${first.sign} ${first.element} style`;
  const secondStyle = `${second.name}'s ${second.sign} ${second.element} style`;

  const report = {
    title: `${first.name} & ${second.name}`,
    overview: `${first.name} and ${second.name} have a ${facts.score}% compatibility score for this ${facts.relationship}. The strongest area is ${facts.strongestLabel}; the watch area is ${facts.watchLabel}. The useful question is not whether this is perfect. It is whether both people can name the pattern early enough to work with it.`,
    sections: [
      {
        key: 'strengths',
        title: 'Where You Connect',
        body: `${facts.strongestLabel} is the clearest strength in this reading. ${firstStyle} and ${secondStyle} may make this part of the connection easier to notice, especially when both people let the other person's style count as real effort instead of waiting for it to look identical.`,
      },
      {
        key: 'friction',
        title: 'Where You May Clash',
        body: `${facts.watchLabel} is the watch area. This does not make the connection wrong; it means the pair should avoid testing each other silently when expectations, timing, or reactions do not match at first.`,
      },
      {
        key: 'communication',
        title: 'Communication',
        body: `This pair benefits from saying the practical thing earlier instead of waiting for the other person to read the room perfectly. A useful move is to ask, "What did you mean by that?" before turning a small mismatch into a bigger story.`,
      },
      {
        key: 'emotional_dynamic',
        title: 'Emotional Style',
        body: `The emotional pace may not be identical. One person may want the moment named quickly while the other needs time to sort through the feeling, so this works best when both people treat pace as information instead of rejection.`,
      },
      {
        key: 'stability',
        title: 'Stability',
        body: `Stability comes from small proof, not big declarations. If this connection is going to feel steadier, both people should be clear about plans, follow-through, and what they need when life gets busy or distracted.`,
      },
      {
        key: 'growth',
        title: 'What You Can Learn From Each Other',
        body: `The difference between these two styles can be useful when neither person treats their own reflex as the only correct one. Ask what the other person notices first; that answer usually reveals the part of the connection that needs the most translation.`,
      },
      {
        key: 'practical_advice',
        title: 'What May Help',
        body: `${buildConversationPrompt(result)} Then each person should name one small thing that would make the connection easier this week, before it becomes a test.`,
      },
      {
        key: 'do',
        title: 'Try More Of',
        body: `Try more direct appreciation, specific requests, and repair after a tense moment. The score is most useful when it points to a behavior both people can repeat, not when it becomes a label for the whole connection.`,
      },
      {
        key: 'avoid',
        title: 'Watch For',
        body: `Watch for assumptions, scorekeeping, and treating one difficult pattern as the full truth about the connection. This report should help the pair talk with more precision, not turn the future into a pass/fail result.`,
      },
    ],
    closing: `This report describes patterns from the compatibility result. ${first.name} and ${second.name}'s choices, honesty, and follow-through matter more than any score.`,
    model: 'fallback-v1',
    promptVersion: PROMPT_VERSION,
  };
  validateReportQuality(report, result);
  return report;
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
      (section, index) =>
        typeof section.key !== 'string' ||
        section.key !== REQUIRED_SECTION_KEYS[index] ||
        typeof section.title !== 'string' ||
        typeof section.body !== 'string',
    ) ||
    typeof report.closing !== 'string'
  ) {
    throw new Error('Model returned an invalid report shape.');
  }
  return report;
}

function validateReportQuality(report, result) {
  const facts = buildReportFacts(result);
  const serialized = [
    report?.title,
    report?.overview,
    ...(report?.sections || []).flatMap((section) => [section.title, section.body]),
    report?.closing,
  ].join(' ');

  if (REJECTED_REPORT_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new Error('Report failed safety and privacy validation.');
  }

  if (!serialized.includes(String(facts.score))) {
    throw new Error('Report must include the compatibility score.');
  }

  if (!serialized.toLowerCase().includes(facts.relationship.toLowerCase())) {
    throw new Error('Report must include the relationship context.');
  }

  if (!serialized.toLowerCase().includes(facts.strongestLabel.toLowerCase())) {
    throw new Error('Report must include the strongest score area.');
  }

  if (!serialized.toLowerCase().includes(facts.watchLabel.toLowerCase())) {
    throw new Error('Report must include the watch area.');
  }

  for (const section of report.sections) {
    if (wordCount(section.body) < 28 || sentenceCount(section.body) < 2) {
      throw new Error(`Report section "${section.key}" is too thin.`);
    }
  }

  const practical = report.sections.find((section) => section.key === 'practical_advice')?.body || '';
  if (!/\b(ask|asks|say|name|try|agree|notice|plan|talk|choose|discuss)\b/i.test(practical)) {
    throw new Error('Report must include a practical next step.');
  }

  return true;
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
        'Treat astrology as reflective entertainment and a conversation starter, not a relationship verdict.',
        'Make the report feel paid-worthy by naming specific behaviors, timing mismatches, repair moves, and one line the reader can actually say.',
        'Every section should include a concrete action, warning, or interpretation tied to the supplied facts.',
        'Avoid certainty, predictions, guarantees, soulmate language, diagnosis, therapy language, or medical, legal, financial, or professional advice.',
        'Avoid vague AI-style phrases, including natural alignment, natural rhythm, growth edge, intention, emotional safety, meaningful connection, communication is important, and go deeper.',
        'Use the supplied sanitized names, signs, elements, scores, and relationship context only. Birth dates and email addresses are not provided to you and must not be invented or referenced.',
        'The report must mention the score, the relationship type, the strongest area, the watch area, and one practical next step.',
      ].join(' '),
      messages: [{
        role: 'user',
        content: JSON.stringify({
          task: 'Create a structured compatibility report.',
          requiredFacts: buildReportFacts(result),
          requiredShape: {
            title: 'string',
            overview: 'string',
            sections: REQUIRED_SECTION_KEYS.map((key) => ({ key, title: 'string', body: 'string' })),
            closing: 'string',
          },
          result,
        }),
      }],
    }),
  });

  if (!response.ok) {
    return fallbackReport(result);
  }

  try {
    const data = await response.json();
    const report = {
      ...parseModelReport(data?.content?.[0]?.text),
      model: MODEL,
      promptVersion: PROMPT_VERSION,
    };
    validateReportQuality(report, result);
    return report;
  } catch (_error) {
    return fallbackReport(result);
  }
}

module.exports = {
  buildConversationPrompt,
  buildReportFacts,
  fallbackReport,
  generateStructuredReport,
  parseModelReport,
  validateReportQuality,
};
