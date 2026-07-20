const sampleReport = {
  result: {
    score: 86,
    relationshipType: 'love',
    reportContext: { focus: 'full_compatibility', clarityGoal: 'communication' },
    people: [
      {
        name: 'Alex',
        sign: 'Leo',
        element: 'fire',
        moon: {
          sign: 'Taurus',
          precision: 'date-only',
          need: 'consistency, comfort, and dependable care',
          strength: 'steady emotional presence',
          watch: 'holding on after a pattern needs to change',
        },
        lifePath: {
          number: 5,
          masterNumber: false,
          theme: 'freedom and movement',
          strength: 'curiosity, adaptability, and fresh energy',
          watch: 'resisting routines that would make trust easier',
        },
      },
      {
        name: 'Jordan',
        sign: 'Gemini',
        element: 'air',
        moon: {
          sign: 'Cancer',
          precision: 'date-only',
          need: 'safety, closeness, and thoughtful reassurance',
          strength: 'protective emotional attunement',
          watch: 'withdrawing when care feels uncertain',
        },
        lifePath: {
          number: 6,
          masterNumber: false,
          theme: 'care and responsibility',
          strength: 'protectiveness, repair, and emotional generosity',
          watch: 'taking on too much instead of asking for shared effort',
        },
      },
    ],
    breakdown: {
      chemistry: 90,
      communication: 88,
      stability: 76,
      growth: 84,
      intuition: 82,
      overall: 86,
    },
  },
  report: {
    title: 'Alex & Jordan',
    focus: 'full_compatibility',
    focusLabel: 'Full Compatibility Report',
    clarityGoal: 'communication',
    clarityGoalLabel: 'how to communicate more clearly',
    evidenceSummary: 'Sun signs: Leo and Gemini. Moon signs: Taurus and Cancer. Five scored compatibility dimensions.',
    precisionNote: 'At least one Moon sign uses a noon estimate because a birth time was not supplied. The Moon can change signs during a birth date, so Moon-specific details are approximate.',
    overview: 'Alex and Jordan score 86% for this romantic connection. Chemistry is highest at 90, while Stability is lowest at 76. This Full Compatibility Report is focused on how to communicate more clearly. It uses the score spread, the pair\'s calculated signs, and the edition-specific evidence shown below. Treat the result as a set of questions to test against real behavior, not as a prediction.',
    sections: [
      {
        key: 'core_pattern',
        title: 'The pattern underneath the score',
        body: 'Alex\'s Leo style and Jordan\'s Gemini style produce an overall score of 86 for this romantic connection. The useful part is the spread underneath it: chemistry 90, communication 88, stability 76, growth 84, and emotional reading 82. Do not reduce those numbers to good or bad. Notice which part feels easy in real life and which part repeatedly requires an explanation, reminder, or repair.',
      },
      {
        key: 'strongest_asset',
        title: 'What already works',
        body: 'Chemistry leads at 90. Alex and Jordan should identify one recent moment that shows this strength in behavior, such as an easy plan, an honest answer, or support that arrived without chasing. Each person should describe what the other actually did. Repeat that behavior during the next week. A score becomes useful only when the pair can connect it to something worth keeping.',
      },
      {
        key: 'watch_pattern',
        title: 'The problem most likely to repeat',
        body: 'Stability is lowest at 76. The repeating risk is not the difference itself; it is letting an expectation stay invisible until someone fails it. Watch for silent scorekeeping, indirect tests, and old examples being added to a current disagreement. Name the expectation in one sentence, ask whether the other person understood it the same way, and agree on one change that can be noticed the next time the situation occurs.',
      },
      {
        key: 'conversation_style',
        title: 'How your conversations can cross',
        body: 'Communication scores 88. Alex\'s fire style and Jordan\'s air style may use different speed, tone, or detail, especially when the topic matters. Before replying to a message that feels cold or sharp, ask, "What did you mean by that?" Then answer the actual explanation instead of the first interpretation. If a text exchange keeps getting worse, schedule a short call rather than using more text to repair the text.',
      },
      {
        key: 'emotional_pace',
        title: 'How your emotional pace differs',
        body: 'Emotional reading scores 82. Alex\'s Taurus Moon points to consistency, comfort, and dependable care; Jordan\'s Cancer Moon points to safety, closeness, and thoughtful reassurance. One person may want closeness while the other needs a pause before speaking clearly. Ask about timing directly: "Do you want ten minutes together now, or should we return to this at a specific time?" A named pause is different from unexplained distance.',
      },
      {
        key: 'reliability',
        title: 'What makes this dependable',
        body: 'Stability scores 76, and dependability is measured in ordinary follow-through. Notice whether plans happen, changes are explained, and both people initiate contact or repair. Choose one small agreement that matters this week, such as confirming plans by a certain time or checking in after a hard day. Keep it simple enough to observe. If the agreement fails, discuss the obstacle rather than immediately making a larger promise.',
      },
      {
        key: 'repair',
        title: 'How to repair a rough moment',
        body: 'For how to communicate more clearly, start repair with accuracy. One person can say, "I want to check what you heard before I explain more." The other person repeats the message in their own words and names the part that landed badly. Keep the first conversation on one event. If either person needs a pause, set a return time. A repair is complete only when both can name what will be different next time.',
      },
      {
        key: 'words_to_use',
        title: 'Words you can use',
        body: 'Use a direct line that leaves room for an honest answer: "The part that works for me is chemistry. The part I keep getting stuck on is stability. What do you notice?" Alex and Jordan should answer with one example each. Do not debate the examples immediately. First decide whether both people are describing the same pattern or two separate problems that need different plans.',
      },
      {
        key: 'seven_day_plan',
        title: 'A seven-day plan',
        body: 'For seven days, track one good interaction, one confusing interaction, and one moment of follow-through. Compare the behavior with chemistry 90, communication 88, stability 76, growth 84, and emotional reading 82. At the end of the week, each person should choose one behavior to repeat and one assumption to stop making. Review the result together only if both people are willing to use it as a question, not a verdict.',
      },
    ],
    closing: 'The useful test is what Alex and Jordan do after reading this. Keep the parts that lead to clearer requests, steadier follow-through, and less guessing. Leave behind any interpretation that does not match the relationship you can actually observe.',
    reportType: 'standard',
    model: 'fallback-v3',
    promptVersion: 'structured-v7',
  },
};

export default sampleReport;
