'use strict';

const {
  normalizeClarityGoal,
  normalizeReportFocus,
} = require('../../shared/report-evidence.cjs');

const MODEL = 'claude-haiku-4-5-20251001';
const PROMPT_VERSION = 'structured-v7';

const REPORT_BLUEPRINTS = {
  moon_sign: {
    label: 'Moon Sign Match Report',
    task: 'Explain the pair\'s emotional needs, common misreads, and a usable repair plan.',
    clarityGoals: {
      repair_after_conflict: 'repair after conflict',
      reassurance: 'how to give and receive reassurance',
      emotional_distance: 'what emotional distance may mean',
    },
    sections: [
      ['emotional_snapshot', 'Your emotional pattern'],
      ['care_language', 'What care looks like to each of you'],
      ['emotional_ease', 'Where feelings are easier to read'],
      ['misread_pattern', 'The misunderstanding to catch early'],
      ['conflict_pattern', 'What happens when tension rises'],
      ['repair', 'How to repair without chasing'],
      ['emotional_load', 'How to keep one person from carrying it all'],
      ['words_to_use', 'Words you can use'],
      ['seven_day_check', 'A seven-day reality check'],
    ],
  },
  crush: {
    label: 'Crush Compatibility Report',
    task: 'Separate chemistry from consistency and give the reader a low-pressure next move.',
    clarityGoals: {
      mixed_signals: 'how to read mixed signals',
      pace: 'what pace gives this the best chance',
      next_move: 'what to do next',
    },
    sections: [
      ['attraction_snapshot', 'What creates the pull'],
      ['interest_signals', 'What interest may look like here'],
      ['easy_connection', 'Where conversation or chemistry flows'],
      ['mixed_signals', 'Where signals can get crossed'],
      ['consistency', 'Chemistry compared with consistency'],
      ['next_move', 'The next move with the least pressure'],
      ['investment_watch', 'What not to over-invest in'],
      ['words_to_use', 'A message you can actually send'],
      ['seven_day_check', 'A seven-day evidence check'],
    ],
  },
  life_path: {
    label: 'Life Path Compatibility Report',
    task: 'Explain how the pair handles effort, direction, responsibility, and long-term decisions.',
    clarityGoals: {
      long_term_fit: 'long-term fit',
      shared_goals: 'how to build shared goals',
      responsibility: 'how to divide responsibility',
    },
    sections: [
      ['drive_snapshot', 'How each of you moves through life'],
      ['effort_style', 'How effort and support can differ'],
      ['shared_direction', 'Where your direction lines up'],
      ['decision_pattern', 'How decisions can become a struggle'],
      ['responsibility', 'How to divide the real work'],
      ['repair', 'How to reset after a disagreement'],
      ['long_term_watch', 'What long-term fit requires'],
      ['words_to_use', 'A planning conversation to use'],
      ['thirty_day_plan', 'A thirty-day compatibility test'],
    ],
  },
  full_compatibility: {
    label: 'Full Compatibility Report',
    task: 'Combine the pair\'s strongest area, watch area, emotional pace, and practical next steps.',
    clarityGoals: {
      communication: 'how to communicate more clearly',
      conflict: 'how to handle conflict',
      long_term_fit: 'long-term fit',
    },
    sections: [
      ['core_pattern', 'The pattern underneath the score'],
      ['strongest_asset', 'What already works'],
      ['watch_pattern', 'The problem most likely to repeat'],
      ['conversation_style', 'How your conversations can cross'],
      ['emotional_pace', 'How your emotional pace differs'],
      ['reliability', 'What makes this dependable'],
      ['repair', 'How to repair a rough moment'],
      ['words_to_use', 'Words you can use'],
      ['seven_day_plan', 'A seven-day plan'],
    ],
  },
};

const REJECTED_REPORT_PATTERNS = [
  /\b(meant to be|soulmate|soulmates|fated|destined|guaranteed|guarantee|doomed|will fail|must break up)\b/i,
  /\b(will always|will never)\b/i,
  /\b(diagnose|diagnosis|clinical|therapy|therapist|medical advice|legal advice|financial advice)\b/i,
  /\b(narcissist|trauma response|attachment disorder|personality disorder)\b/i,
  /\b(birthDate|birth date:|email|private token|access token|checkout session|payment intent)\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
  /\b(natural alignment|natural rhythm|growth edge|meaningful connection|go deeper|communication is important|open communication is key)\b/i,
  /\b(this pair benefits from|this connection has the potential|at the end of the day|when it comes to)\b/i,
  /\b(delves? into|tapestry|unlock(?:s|ing)?|transformative journey|profoundly)\b/i,
  /[—–]/,
];

const ACTION_PATTERN = /\b(ask|say|name|write|choose|plan|notice|compare|agree|send|watch|try|check|pause|set|answer|share|schedule|decide|repeat|keep|stop|track|review)\b/i;

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

function getBlueprint(focusValue) {
  return REPORT_BLUEPRINTS[normalizeReportFocus(focusValue)];
}

function normalizeMoon(person) {
  return {
    sign: person?.moon?.sign || person?.sign || 'Unknown',
    precision: person?.moon?.precision || 'date-only',
    need: person?.moon?.need || 'clear, consistent care',
    strength: person?.moon?.strength || `${String(person?.element || 'balanced')} emotional expression`,
    watch: person?.moon?.watch || 'assuming the other person already knows what is needed',
  };
}

function normalizeLifePath(person) {
  return {
    number: person?.lifePath?.number || null,
    masterNumber: person?.lifePath?.masterNumber === true,
    theme: person?.lifePath?.theme || 'personal direction',
    strength: person?.lifePath?.strength || 'showing up with a clear sense of purpose',
    watch: person?.lifePath?.watch || 'letting different priorities turn into silent resentment',
  };
}

function buildPersonFacts(person = {}) {
  return {
    name: String(person.name || 'Person'),
    sunSign: String(person.sign || 'Unknown'),
    element: String(person.element || 'unknown'),
    moon: normalizeMoon(person),
    lifePath: normalizeLifePath(person),
  };
}

function buildEvidenceSummary(focus, people, scores) {
  const [first, second] = people;
  if (focus === 'moon_sign') {
    return `Moon signs: ${first.name} in ${first.moon.sign}; ${second.name} in ${second.moon.sign}. Emotional score: ${scores.intuition}.`;
  }
  if (focus === 'crush') {
    return `Sun signs: ${first.sunSign} and ${second.sunSign}. Chemistry: ${scores.chemistry}; communication: ${scores.communication}; stability: ${scores.stability}.`;
  }
  if (focus === 'life_path') {
    return `Life Paths: ${first.name} ${first.lifePath.number || 'not calculated'}; ${second.name} ${second.lifePath.number || 'not calculated'}. Growth: ${scores.growth}; stability: ${scores.stability}.`;
  }
  return `Sun signs: ${first.sunSign} and ${second.sunSign}. Moon signs: ${first.moon.sign} and ${second.moon.sign}. Five scored compatibility dimensions.`;
}

function buildPrecisionNote(people) {
  const isDateOnly = people.some((person) => person.moon.precision !== 'exact');
  return isDateOnly
    ? 'At least one Moon sign uses a noon estimate because a birth time was not supplied. The Moon can change signs during a birth date, so Moon-specific details are approximate.'
    : 'Both Moon signs use the supplied birth times and time zones.';
}

function buildReportFacts(result, options = {}) {
  const breakdownEntries = Object.entries(result?.breakdown || {})
    .filter(([key, value]) => key !== 'overall' && Number.isFinite(Number(value)))
    .sort((left, right) => Number(right[1]) - Number(left[1]));
  const strongestKey = breakdownEntries[0]?.[0] || 'communication';
  const watchKey = breakdownEntries[breakdownEntries.length - 1]?.[0] || 'communication';
  const scores = Object.fromEntries(
    breakdownEntries.map(([key, value]) => [key, Math.round(Number(value))]),
  );
  const focus = normalizeReportFocus(options.reportFocus || result?.reportContext?.focus);
  const clarityGoal = normalizeClarityGoal(
    focus,
    options.clarityGoal || result?.reportContext?.clarityGoal,
  );
  const blueprint = getBlueprint(focus);
  const people = (result?.people || []).slice(0, 2).map(buildPersonFacts);

  const facts = {
    score: Math.round(Number(result?.score || 0)),
    relationship: getRelationshipLabel(result?.relationshipType),
    strongestKey,
    strongestLabel: titleCase(strongestKey),
    watchKey,
    watchLabel: titleCase(watchKey),
    scores,
    focus,
    focusLabel: blueprint.label,
    clarityGoal,
    clarityGoalLabel: blueprint.clarityGoals[clarityGoal],
    people,
    evidenceSummary: buildEvidenceSummary(focus, people, scores),
    precisionNote: buildPrecisionNote(people),
  };

  if (result?.calculationMode === 'full-synastry' && result?.synastry) {
    const synastryEvidence = (result.synastry.evidence || [])
      .filter((item) => item?.label)
      .slice(0, 5)
      .map((item) => ({
        label: item.label,
        polarity: item.polarity,
        categories: Array.isArray(item.categories) ? item.categories : [],
      }));
    return {
      ...facts,
      calculationMode: 'full-synastry',
      ...(options.reportType === 'deep_synastry' ? { reportType: 'deep_synastry' } : {}),
      topAspectLabels: synastryEvidence.map((item) => item.label),
      synastryEvidence,
    };
  }

  return facts;
}

function buildConversationPrompt(result, options = {}) {
  const facts = buildReportFacts(result, options);
  return `Say this first: "I think ${facts.strongestLabel.toLowerCase()} is where this feels easiest, but ${facts.watchLabel.toLowerCase()} is the part we should name early instead of guessing."`;
}

function scoreFor(facts, key) {
  return facts.scores[key] ?? facts.score;
}

function moonSections(facts) {
  const [first, second] = facts.people;
  const intuition = scoreFor(facts, 'intuition');
  const communication = scoreFor(facts, 'communication');
  const stability = scoreFor(facts, 'stability');
  return [
    `${first.name}'s ${first.moon.sign} Moon points to ${first.moon.need}. ${second.name}'s ${second.moon.sign} Moon points to ${second.moon.need}. In ordinary life, that difference may show up after a delayed reply or a changed plan, when one person wants an immediate response and the other wants time to settle. Neither response proves a lack of care. At the next tense moment, each person should name what happened, what they assumed, and what they need before arguing about intent.`,
    `${first.name} is most likely to recognize care through ${first.moon.need}, while ${second.name} is more likely to notice ${second.moon.need}. A kind gesture can miss if it is delivered in the form the giver prefers instead of the form the receiver notices. Each person should choose one small, repeatable action for the next week, such as a check-in after work or advance notice when plans change, then ask whether it actually felt supportive.`,
    `The emotional and intuitive score is ${intuition}. ${first.name}'s ${first.moon.strength} can work well beside ${second.name}'s ${second.moon.strength}, especially when both people say what they noticed instead of assuming they read the moment correctly. Look for a recent interaction where the mood felt easy. Each person should write down the exact behavior that helped, compare answers, and repeat the behavior rather than trying to recreate a vague feeling.`,
    `Communication scores ${communication}, and the Moon-sign watch is specific: ${first.name} may need to watch ${first.moon.watch}, while ${second.name} may need to watch ${second.moon.watch}. The common misread is treating a coping style as a message about the relationship. If one person goes quiet or becomes blunt, pause and ask, "Are you asking for space, reassurance, or a solution?" That question gives the behavior a real meaning before either person reacts to a guess.`,
    `${facts.watchLabel} is the lowest measured area at ${scoreFor(facts, facts.watchKey)}. Under pressure, ${first.name}'s ${first.moon.sign} Moon may lean toward ${first.moon.watch}, while ${second.name}'s ${second.moon.sign} Moon may lean toward ${second.moon.watch}. Watch for the moment the disagreement changes from the actual issue to proving who cares more. Name that shift, stop adding old examples, and agree on one issue to finish before either person widens the argument.`,
    `For ${facts.clarityGoalLabel}, the most useful repair is short and observable. ${first.name} can say, "I am not asking you to agree yet. I want to know what you heard me say." ${second.name} can answer in their own words, then share what landed badly. Keep the first repair attempt under ten minutes. If either person is too activated to listen, choose a specific time to return instead of leaving the pause open-ended.`,
    `Stability scores ${stability}, so emotional work should not quietly become one person's permanent job. ${first.name}'s ${first.moon.sign} Moon brings ${first.moon.strength}; ${second.name}'s ${second.moon.sign} Moon brings ${second.moon.strength}. Those strengths are useful only if both people initiate check-ins, admit misses, and follow through. Track who starts the last three repairs. If the pattern is one-sided, ask for one concrete responsibility to be shared this week.`,
    `Use language that separates feeling from accusation. ${first.name} or ${second.name} can say, "When that happened, I told myself a story about what it meant. Can I check the story with you?" Then name the story in one sentence and ask one direct question. This fits a ${first.moon.sign} Moon and ${second.moon.sign} Moon better than hints or tests because it leaves room for both emotional needs without pretending either person can read minds.`,
    `For seven days, check the report against real behavior. Notice one moment of reassurance, one moment of distance, and one repair attempt. Write down what each person did, not what you think they secretly meant. At the end of the week, compare those moments with the ${intuition} emotional score and the ${communication} communication score. Keep the one action that made the next interaction clearer, and stop the one habit that produced more guessing.`,
  ];
}

function crushSections(facts) {
  const [first, second] = facts.people;
  const chemistry = scoreFor(facts, 'chemistry');
  const communication = scoreFor(facts, 'communication');
  const stability = scoreFor(facts, 'stability');
  const growth = scoreFor(facts, 'growth');
  return [
    `Chemistry scores ${chemistry} for ${first.name}'s ${first.sunSign} style and ${second.name}'s ${second.sunSign} style. That number describes the pull in the result, not proof of mutual interest. In real life, attraction matters only when it is paired with attention and follow-through. Notice whether conversations build on something said earlier, whether plans become specific, and whether both people initiate. Keep those observations separate from how exciting a single exchange felt.`,
    `${first.name}'s ${first.sunSign} sign may show interest through a ${first.element} style, while ${second.name}'s ${second.sunSign} sign may use a ${second.element} style. Those expressions can look different enough that a warm person seems flirtier than intended or a reserved person seems less interested than they are. Do not grade one text in isolation. Watch a full week for repeated effort: questions that invite an answer, remembered details, and a clear attempt to spend time together.`,
    `${facts.strongestLabel} is the highest area at ${scoreFor(facts, facts.strongestKey)}. That is the easiest part of this ${facts.relationship}, and it can make the rest feel further along than it is. Enjoy the part that flows, but ask one slightly more revealing question and notice whether the answer has substance. A strong exchange should create more clarity about each person, not only more momentum in the moment.`,
    `Communication scores ${communication}, while the emotional-reading score is ${scoreFor(facts, 'intuition')}. Mixed signals often come from the gap between what happened and what one person hoped it meant. If a reply is vague, do not fill in the missing plan. Ask once: "Would you like to pick a day, or should we leave it here?" A direct answer, a counteroffer, or no follow-through gives more useful information than another round of decoding.`,
    `Stability scores ${stability}, compared with chemistry at ${chemistry}. That difference is the paid report's most practical reality check. Chemistry can be immediate; consistency has to be observed across time. Track whether plans are kept, changes are explained, and interest survives ordinary days without drama. If effort only appears after distance, jealousy, or a late-night message, stop treating intensity as progress and wait for a calm, specific action.`,
    `For ${facts.clarityGoalLabel}, use one move that creates an answer without creating pressure. ${first.name} can send: "I have liked talking with you. Want to get coffee this week? I can do Thursday or Saturday." It states interest, offers two real options, and leaves room for an honest no. Send it once. If ${second.name} is interested but unavailable, the next useful signal is a specific alternative, not a vague promise.`,
    `${facts.watchLabel} is lowest at ${scoreFor(facts, facts.watchKey)}, so do not invest ahead of the evidence. Avoid rearranging a week, sharing more than feels comfortable, or excusing repeated cancellations because the ${chemistry} chemistry score is high. Match the other person's level of effort for the next two interactions. If you ask a clear question, wait for the answer instead of sending a second message to soften the first one.`,
    `A message should sound like a person, not a test. Try: "I am interested, but I am not great at guessing. Are you open to seeing where this goes?" For a lighter next step, say: "I had fun talking. Want to do that again this week?" Choose the line that matches what has actually happened between ${first.name} and ${second.name}. Do not send a relationship-level question after only a few casual exchanges.`,
    `Use the next seven days as an evidence check. Record who initiates, whether a plan becomes specific, and whether the tone stays respectful when timing is inconvenient. Compare that behavior with chemistry ${chemistry}, communication ${communication}, stability ${stability}, and growth ${growth}. At the end of the week, choose one of three honest actions: make a plan, ask one clarifying question, or step back. The right choice comes from behavior, not the score alone.`,
  ];
}

function lifePathSections(facts) {
  const [first, second] = facts.people;
  const firstNumber = first.lifePath.number || '?';
  const secondNumber = second.lifePath.number || '?';
  const stability = scoreFor(facts, 'stability');
  const growth = scoreFor(facts, 'growth');
  return [
    `${first.name}'s Life Path ${firstNumber} centers on ${first.lifePath.theme}. ${second.name}'s Life Path ${secondNumber} centers on ${second.lifePath.theme}. These themes describe different default priorities, not fixed personalities. The difference may show up when one person wants movement and the other wants proof that a plan can hold. Each person should name the goal taking most of their attention this month and explain what support would look like in observable terms.`,
    `Life Path ${firstNumber} brings ${first.lifePath.strength}, while Life Path ${secondNumber} brings ${second.lifePath.strength}. Support can miss when one person offers advice, structure, or motivation but the other wanted time, help, or a clear commitment. Before helping, ask, "Do you want ideas, practical help, or company while you handle it?" Then accept the answer. That small choice keeps effort from becoming control or unspoken debt.`,
    `Growth scores ${growth}, the clearest measure of how well different priorities can create forward movement. ${first.name}'s ${first.lifePath.theme} and ${second.name}'s ${second.lifePath.theme} can point toward the same outcome through different routes. Choose one shared goal small enough to finish within thirty days. Write down why it matters to each person, who owns the next step, and the date when both people will review the result.`,
    `The decision risk for Life Path ${firstNumber} is ${first.lifePath.watch}. For Life Path ${secondNumber}, it is ${second.lifePath.watch}. A practical disagreement can become personal if either person treats their preferred method as proof of maturity or commitment. When a decision stalls, each person should name one non-negotiable, one preference, and one point they can release. Compare those answers before arguing for a final plan.`,
    `Stability scores ${stability}, so long-term fit depends on how responsibility works on ordinary days. ${first.name} and ${second.name} should not rely on good intentions or one person's memory. Pick one repeated task, such as planning time together, managing a shared expense, or following up after a change. Agree on who owns it, what done means, and when the other person should step in without being asked.`,
    `For ${facts.clarityGoalLabel}, the reset needs to return to the real decision. One person can say, "We are arguing about how to do this, but I want to check whether we still want the same result." Each person answers before defending a method. Life Path ${firstNumber} and Life Path ${secondNumber} do not need identical work styles. They do need a way to stop, restate the shared outcome, and assign the next action.`,
    `${facts.watchLabel} is the lowest measured area at ${scoreFor(facts, facts.watchKey)}. Over time, ${first.lifePath.watch} or ${second.lifePath.watch} can turn a solvable difference into resentment. Watch how the pair handles inconvenience, boring follow-through, and a goal that belongs more to one person than the other. Ask whether support is mutual across a month, not perfectly equal in every day, and name any imbalance before it becomes the normal arrangement.`,
    `Use this planning question: "What are we trying to make easier in the next month, and what would each of us need to do for that to happen?" ${first.name} should answer from the priorities of Life Path ${firstNumber}; ${second.name} should answer from Life Path ${secondNumber}. Write the answers separately, then compare them. Choose one promise each person can keep without needing reminders or hidden sacrifice.`,
    `Run a thirty-day test instead of making a permanent judgment. Pick one shared goal, one repeated responsibility, and one weekly check-in. Track whether Life Path ${firstNumber}'s ${first.lifePath.strength} and Life Path ${secondNumber}'s ${second.lifePath.strength} both have room to contribute. At day thirty, review what was completed, what required chasing, and what felt fair. Keep the structure only if both people can name a real benefit.`,
  ];
}

function fullSections(facts) {
  const [first, second] = facts.people;
  const chemistry = scoreFor(facts, 'chemistry');
  const communication = scoreFor(facts, 'communication');
  const stability = scoreFor(facts, 'stability');
  const growth = scoreFor(facts, 'growth');
  const intuition = scoreFor(facts, 'intuition');
  return [
    `${first.name}'s ${first.sunSign} style and ${second.name}'s ${second.sunSign} style produce an overall score of ${facts.score} for this ${facts.relationship}. The useful part is the spread underneath it: chemistry ${chemistry}, communication ${communication}, stability ${stability}, growth ${growth}, and emotional reading ${intuition}. Do not reduce those numbers to good or bad. Notice which part feels easy in real life and which part repeatedly requires an explanation, reminder, or repair.`,
    `${facts.strongestLabel} leads at ${scoreFor(facts, facts.strongestKey)}. ${first.name} and ${second.name} should identify one recent moment that shows this strength in behavior, such as an easy plan, an honest answer, or support that arrived without chasing. Each person should describe what the other actually did. Repeat that behavior during the next week. A score becomes useful only when the pair can connect it to something worth keeping.`,
    `${facts.watchLabel} is lowest at ${scoreFor(facts, facts.watchKey)}. The repeating risk is not the difference itself; it is letting an expectation stay invisible until someone fails it. Watch for silent scorekeeping, indirect tests, and old examples being added to a current disagreement. Name the expectation in one sentence, ask whether the other person understood it the same way, and agree on one change that can be noticed the next time the situation occurs.`,
    `Communication scores ${communication}. ${first.name}'s ${first.element} style and ${second.name}'s ${second.element} style may use different speed, tone, or detail, especially when the topic matters. Before replying to a message that feels cold or sharp, ask, "What did you mean by that?" Then answer the actual explanation instead of the first interpretation. If a text exchange keeps getting worse, schedule a short call rather than using more text to repair the text.`,
    `Emotional reading scores ${intuition}. ${first.name}'s ${first.moon.sign} Moon points to ${first.moon.need}; ${second.name}'s ${second.moon.sign} Moon points to ${second.moon.need}. One person may want closeness while the other needs a pause before speaking clearly. Ask about timing directly: "Do you want ten minutes together now, or should we return to this at a specific time?" A named pause is different from unexplained distance.`,
    `Stability scores ${stability}, and dependability is measured in ordinary follow-through. Notice whether plans happen, changes are explained, and both people initiate contact or repair. Choose one small agreement that matters this week, such as confirming plans by a certain time or checking in after a hard day. Keep it simple enough to observe. If the agreement fails, discuss the obstacle rather than immediately making a larger promise.`,
    `For ${facts.clarityGoalLabel}, start repair with accuracy. One person can say, "I want to check what you heard before I explain more." The other person repeats the message in their own words and names the part that landed badly. Keep the first conversation on one event. If either person needs a pause, set a return time. A repair is complete only when both can name what will be different next time.`,
    `Use a direct line that leaves room for an honest answer: "The part that works for me is ${facts.strongestLabel.toLowerCase()}. The part I keep getting stuck on is ${facts.watchLabel.toLowerCase()}. What do you notice?" ${first.name} and ${second.name} should answer with one example each. Do not debate the examples immediately. First decide whether both people are describing the same pattern or two separate problems that need different plans.`,
    `For seven days, track one good interaction, one confusing interaction, and one moment of follow-through. Compare the behavior with chemistry ${chemistry}, communication ${communication}, stability ${stability}, growth ${growth}, and emotional reading ${intuition}. At the end of the week, each person should choose one behavior to repeat and one assumption to stop making. Review the result together only if both people are willing to use it as a question, not a verdict.`,
  ];
}

function buildFallbackBodies(facts) {
  if (facts.focus === 'moon_sign') return moonSections(facts);
  if (facts.focus === 'crush') return crushSections(facts);
  if (facts.focus === 'life_path') return lifePathSections(facts);
  return fullSections(facts);
}

function addSynastryEvidence(sections, facts) {
  if (!facts.synastryEvidence?.length) return sections;
  return sections.map((section, index) => {
    const evidence = facts.synastryEvidence[index];
    if (!evidence) return section;
    const category = evidence.categories.length > 0
      ? evidence.categories.join(' and ')
      : 'the wider comparison';
    return {
      ...section,
      body: `${section.body} Timed evidence: ${evidence.label} is a supplied ${evidence.polarity || 'measured'} contact tied to ${category}.`,
    };
  });
}

function fallbackReport(result, options = {}) {
  const facts = buildReportFacts(result, options);
  const blueprint = getBlueprint(facts.focus);
  const [first, second] = facts.people;
  const reportType = options.reportType === 'deep_synastry' && facts.calculationMode === 'full-synastry'
    ? 'deep_synastry'
    : 'standard';
  const bodies = buildFallbackBodies(facts);
  const baseSections = blueprint.sections.map(([key, title], index) => ({
    key,
    title,
    body: bodies[index],
  }));

  const report = {
    title: `${first.name} & ${second.name}`,
    focus: facts.focus,
    focusLabel: facts.focusLabel,
    clarityGoal: facts.clarityGoal,
    clarityGoalLabel: facts.clarityGoalLabel,
    evidenceSummary: facts.evidenceSummary,
    precisionNote: facts.precisionNote,
    overview: `${first.name} and ${second.name} score ${facts.score}% for this ${facts.relationship}. ${facts.strongestLabel} is highest at ${scoreFor(facts, facts.strongestKey)}, while ${facts.watchLabel} is lowest at ${scoreFor(facts, facts.watchKey)}. This ${facts.focusLabel} is focused on ${facts.clarityGoalLabel}. It uses the score spread, the pair's calculated signs, and the edition-specific evidence shown below. Treat the result as a set of questions to test against real behavior, not as a prediction.`,
    sections: addSynastryEvidence(baseSections, facts),
    closing: `The useful test is what ${first.name} and ${second.name} do after reading this. Keep the parts that lead to clearer requests, steadier follow-through, and less guessing. Leave behind any interpretation that does not match the relationship you can actually observe.`,
    reportType,
    model: 'fallback-v3',
    promptVersion: PROMPT_VERSION,
  };
  validateReportQuality(report, result, { ...options, reportType });
  return report;
}

function parseModelReport(text, requiredKeys) {
  let normalized = String(text || '').trim();
  if (normalized.startsWith('```')) {
    const firstLineEnd = normalized.indexOf('\n');
    normalized = firstLineEnd === -1
      ? normalized.slice(3)
      : normalized.slice(firstLineEnd + 1);
  }
  if (normalized.endsWith('```')) normalized = normalized.slice(0, -3);
  const report = JSON.parse(normalized.trim());
  if (
    !report
    || typeof report.title !== 'string'
    || typeof report.overview !== 'string'
    || !Array.isArray(report.sections)
    || report.sections.length !== requiredKeys.length
    || report.sections.some((section, index) => (
      typeof section.key !== 'string'
      || section.key !== requiredKeys[index]
      || typeof section.title !== 'string'
      || typeof section.body !== 'string'
    ))
    || typeof report.closing !== 'string'
  ) {
    throw new Error('Model returned an invalid report shape.');
  }
  return report;
}

function evidenceTokens(facts) {
  const tokens = new Set([
    String(facts.score),
    ...Object.values(facts.scores).map(String),
    facts.strongestLabel,
    facts.watchLabel,
  ]);
  for (const person of facts.people) {
    tokens.add(person.sunSign);
    tokens.add(person.moon.sign);
    if (person.lifePath.number) tokens.add(`Life Path ${person.lifePath.number}`);
  }
  for (const label of facts.topAspectLabels || []) tokens.add(label);
  return [...tokens].filter((token) => token && token !== 'Unknown');
}

function sectionUsesEvidence(body, tokens) {
  return tokens.some((token) => String(body).toLowerCase().includes(String(token).toLowerCase()));
}

function validateFocusEvidence(serialized, facts) {
  if (facts.focus === 'moon_sign') {
    for (const person of facts.people) {
      if (!serialized.includes(person.moon.sign)) {
        throw new Error('Moon Sign report must include both calculated Moon signs.');
      }
    }
  }
  if (facts.focus === 'life_path') {
    for (const person of facts.people) {
      if (person.lifePath.number && !serialized.includes(`Life Path ${person.lifePath.number}`)) {
        throw new Error('Life Path report must include both calculated Life Path numbers.');
      }
    }
  }
  if (facts.focus === 'crush') {
    for (const key of ['chemistry', 'communication', 'stability']) {
      if (!serialized.toLowerCase().includes(key) || !serialized.includes(String(scoreFor(facts, key)))) {
        throw new Error('Crush report must compare chemistry, communication, and stability.');
      }
    }
  }
}

function validateReportQuality(report, result, options = {}) {
  const facts = buildReportFacts(result, options);
  const blueprint = getBlueprint(facts.focus);
  const expectedKeys = blueprint.sections.map(([key]) => key);
  if (!Array.isArray(report?.sections) || report.sections.length !== expectedKeys.length) {
    throw new Error('Report must include all required sections.');
  }
  if (report.sections.some((section, index) => section.key !== expectedKeys[index])) {
    throw new Error('Report sections do not match the selected edition.');
  }

  const serialized = [
    report?.title,
    report?.overview,
    ...(report?.sections || []).flatMap((section) => [section.title, section.body]),
    report?.closing,
  ].join(' ');

  if (REJECTED_REPORT_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new Error('Report failed safety, privacy, or writing-quality validation.');
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
  validateFocusEvidence(serialized, facts);

  if (
    options.reportType === 'deep_synastry'
    && facts.topAspectLabels?.[0]
    && !serialized.includes(facts.topAspectLabels[0])
  ) {
    throw new Error('Deep Synastry report must cite the supplied aspect evidence.');
  }

  const uniqueDimensionScores = [...new Set(Object.values(facts.scores))];
  const distinctScoreMentions = uniqueDimensionScores
    .filter((score) => serialized.includes(String(score))).length;
  if (distinctScoreMentions < Math.min(3, uniqueDimensionScores.length)) {
    throw new Error('Report must use the supplied dimension scores as evidence.');
  }

  const normalizedBodies = report.sections.map((section) => section.body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
  if (new Set(normalizedBodies).size !== normalizedBodies.length) {
    throw new Error('Report sections must not repeat the same copy.');
  }
  const openingCounts = new Map();
  for (const body of normalizedBodies) {
    const opening = body.split(' ').slice(0, 4).join(' ');
    openingCounts.set(opening, (openingCounts.get(opening) || 0) + 1);
  }
  if ([...openingCounts.values()].some((count) => count > 2)) {
    throw new Error('Report sections must not reuse the same sentence opening.');
  }

  const tokens = evidenceTokens(facts);
  let evidenceSectionCount = 0;
  for (const section of report.sections) {
    if (wordCount(section.body) < 55 || sentenceCount(section.body) < 3) {
      throw new Error(`Report section "${section.key}" is too thin.`);
    }
    if (!ACTION_PATTERN.test(section.body)) {
      throw new Error(`Report section "${section.key}" needs an observable action.`);
    }
    if (sectionUsesEvidence(section.body, tokens)) evidenceSectionCount += 1;
  }
  if (evidenceSectionCount < 7) {
    throw new Error('At least seven report sections must use supplied evidence.');
  }
  if (wordCount(serialized) < 650 || wordCount(serialized) > 1500) {
    throw new Error('Paid report must contain 650 to 1500 words.');
  }

  return true;
}

async function generateStructuredReport(result, options = {}) {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  const fetchImpl = options.fetchImpl || fetch;
  const reportType = options.reportType === 'deep_synastry' ? 'deep_synastry' : 'standard';
  const facts = buildReportFacts(result, { ...options, reportType });
  const blueprint = getBlueprint(facts.focus);
  const requiredKeys = blueprint.sections.map(([key]) => key);
  if (!apiKey) return fallbackReport(result, { ...options, reportType });

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
        'Write a grounded relationship report in plain, specific language. Return valid JSON only, with no markdown or emojis.',
        'Treat astrology and numerology as reflective entertainment and a conversation starter, not a relationship verdict.',
        'Write 800 to 1100 words. Each section needs at least 55 words, three sentences, one supplied fact, and one action the reader can observe or try.',
        'Use real-life situations such as delayed replies, changed plans, uneven follow-through, repair after tension, or sharing responsibility.',
        'Use at least three supplied dimension scores as evidence. Put the number next to the behavior it helps the reader examine.',
        'Each section has a different job. Do not reuse openings, advice, examples, or sentence structures.',
        'Include at least one line the reader can actually say or send. Keep it direct and believable.',
        'Do not use em dashes, canned transitions, promotional language, mystical certainty, predictions, guarantees, soulmate language, diagnosis, or professional advice.',
        'Avoid phrases such as natural alignment, natural rhythm, growth edge, meaningful connection, go deeper, communication is important, unlock, tapestry, or at the end of the day.',
        'Use only the supplied sanitized names, signs, Moon needs, Life Path themes, scores, and relationship context. Never invent a birth detail, placement, behavior, aspect, degree, or orb.',
        'Describe behaviors as possibilities to check, not facts about what either person has done.',
        'When Moon precision is date-only, state that the Moon detail is approximate. Do not present it as exact.',
        'When synastry aspects are supplied, cite only those exact aspect labels and orbs. Distinguish supplied supportive contacts from tension contacts.',
        'The report must mention the overall score, relationship type, strongest area, watch area, selected clarity goal, and a practical next step.',
      ].join(' '),
      messages: [{
        role: 'user',
        content: JSON.stringify({
          task: blueprint.task,
          edition: facts.focusLabel,
          reportType,
          selectedClarityGoal: facts.clarityGoalLabel,
          requiredFacts: facts,
          requiredShape: {
            title: 'string',
            overview: 'string',
            sections: blueprint.sections.map(([key, title]) => ({ key, title, body: 'string' })),
            closing: 'string',
          },
        }),
      }],
    }),
  });

  if (!response.ok) return fallbackReport(result, { ...options, reportType });

  try {
    const data = await response.json();
    const report = {
      ...parseModelReport(data?.content?.[0]?.text, requiredKeys),
      focus: facts.focus,
      focusLabel: facts.focusLabel,
      clarityGoal: facts.clarityGoal,
      clarityGoalLabel: facts.clarityGoalLabel,
      evidenceSummary: facts.evidenceSummary,
      precisionNote: facts.precisionNote,
      reportType,
      model: MODEL,
      promptVersion: PROMPT_VERSION,
    };
    validateReportQuality(report, result, { ...options, reportType });
    return report;
  } catch (_error) {
    return fallbackReport(result, { ...options, reportType });
  }
}

module.exports = {
  REPORT_BLUEPRINTS,
  buildConversationPrompt,
  buildReportFacts,
  fallbackReport,
  generateStructuredReport,
  getBlueprint,
  parseModelReport,
  validateReportQuality,
  wordCount,
};
