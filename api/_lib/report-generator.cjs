'use strict';

const MODEL = 'claude-haiku-4-5-20251001';
const PROMPT_VERSION = 'structured-v2';
const REPORT_SECTION_KEYS = [
  'relationship_snapshot',
  'core_strengths',
  'watch_area',
  'communication_pattern',
  'emotional_pattern',
  'timing_and_pace',
  'conflict_repair',
  'conversation_prompts',
  'next_steps',
];

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

  const strongerLabel = stronger.replaceAll('_', ' ');
  const gentlerLabel = gentler.replaceAll('_', ' ');

  return {
    title: `${first.name} & ${second.name}`,
    overview: `${first.name} and ${second.name} share a ${score}% compatibility score. This report turns the free score into a practical reading for their ${relationship}: what may feel easier, where the match may ask for more care, and what to talk about next.`,
    sections: [
      {
        key: 'relationship_snapshot',
        title: 'Relationship Snapshot',
        body: `${first.name}'s ${first.sign} pattern and ${second.name}'s ${second.sign} pattern create a ${score}% match, which points to a connection with real usable strengths and a few places that deserve clearer language. The score is not a verdict on whether this ${relationship} will last. It is a map of where the two styles may cooperate quickly and where each person may need to slow down, ask better questions, or explain their needs before tension builds.`,
      },
      {
        key: 'core_strengths',
        title: 'Core Strengths',
        body: `${strongerLabel} is the strongest part of this reading. ${first.name} may bring a ${first.element} style of response, while ${second.name} may bring a ${second.element} style, so the match can work best when each person lets the other contribute differently instead of competing to handle everything the same way. This is the area to lean on when the connection feels good, because it shows the habit that may help the pair recover after smaller misunderstandings.`,
      },
      {
        key: 'watch_area',
        title: 'Watch Area',
        body: `${gentlerLabel} is the part of the result that may need the most patience. The risk is not that the match is wrong; the risk is that each person may assume their own pace or reaction is obvious. If ${first.name} expects one kind of response and ${second.name} offers another, the gap can feel personal even when it is mostly a difference in style. This is the area to name early instead of waiting for it to become a pattern.`,
      },
      {
        key: 'communication_pattern',
        title: 'Communication Pattern',
        body: `This match works better when both people say the actual concern instead of testing whether the other person will guess it. ${first.name} and ${second.name} may not always use the same tone, timing, or level of detail, so short check-ins can prevent small differences from turning into bigger stories. A useful rule is to repeat the main point before responding. That keeps the conversation focused on what was said, not on what each person feared it meant.`,
      },
      {
        key: 'emotional_pattern',
        title: 'Emotional Pattern',
        body: `${first.name} and ${second.name} may show care in different ways. One person may want quick reassurance, while the other may show steadiness through action, consistency, or space. The report works best when it helps the pair ask what care looks like in real behavior. Instead of asking whether the match is good or bad, ask what each person does when they feel close, uncertain, ignored, or pressured.`,
      },
      {
        key: 'timing_and_pace',
        title: 'Timing and Pace',
        body: `Timing matters because compatibility is often felt through pace: how fast people reply, decide, commit, apologize, or need space. If one person moves quickly and the other needs more time, the slower pace can be misread as distance. If one person wants more certainty and the other wants room to feel things out, the faster pace can feel like pressure. This section is meant to help the pair set expectations before the timing mismatch becomes the problem.`,
      },
      {
        key: 'conflict_repair',
        title: 'Conflict and Repair',
        body: `When conflict shows up, the most useful question is not who is right. The better question is what each person needs in order to come back to the conversation clearly. ${first.name} and ${second.name} may repair faster when the issue is made specific: what happened, what it brought up, what needs to change, and what still feels good between them. Good repair does not erase friction. It gives the connection a way to keep moving without pretending nothing happened.`,
      },
      {
        key: 'conversation_prompts',
        title: 'Conversation Prompts',
        body: `Use the report as a prompt, not a script. Start with: "What feels easy between us that we should protect?" Then ask: "Where do we move at different speeds?" and "What do you usually need when a conversation gets tense?" These questions turn the score into something practical. They also keep the focus on lived behavior instead of labels, which is where the reading becomes more useful.`,
      },
      {
        key: 'next_steps',
        title: 'Next Steps',
        body: `The strongest next step is to choose one part of this report and test it in real life. Notice whether the strongest area does feel easier, and whether the watch area shows up during planning, texting, conflict, or expectations. If it does, use the language from the report to name the pattern early. ${first.name} and ${second.name} do not need a perfect score. They need a clearer way to talk about what the score is pointing toward.`,
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
      max_tokens: 4200,
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
            sections: REPORT_SECTION_KEYS.map((key) => ({ key, title: 'string', body: 'string' })),
            closing: 'string',
          },
          writingRules: [
            'Each section body should be specific to the supplied names, signs, elements, relationship type, score, and breakdown.',
            'Each section body should be 80 to 140 words.',
            'Include at least three concrete conversation prompts across the report.',
            'Do not describe the report as a prediction, diagnosis, soul match, or guaranteed outcome.',
            'Do not claim scientific certainty.',
            'Do not invent Moon signs, houses, birth times, birth dates, or planetary placements not included in the input.',
          ],
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
  REPORT_SECTION_KEYS,
};
