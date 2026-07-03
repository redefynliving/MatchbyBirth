export const PRIVATE_REPORT_PRICE = '$9.99';

export const privateReportSections = [
  {
    label: 'Opening read',
    title: 'Why this connection feels familiar',
    body: 'A plain-language overview of the rhythm between the two people: what may feel easy quickly, what may create tension, and why the connection can be hard to shake.',
  },
  {
    label: 'Pull',
    title: 'What pulls you together',
    body: 'The strongest signals in the match, written as useful patterns instead of vague compliments.',
  },
  {
    label: 'Friction',
    title: 'Where the rhythm catches',
    body: 'The part of the connection most likely to create misreads, mixed signals, or repeated arguments if nobody names it.',
  },
  {
    label: 'Misread',
    title: 'What each person may misunderstand',
    body: 'A sharper look at how one person may read the other wrong: silence as distance, directness as pressure, intensity as certainty, or space as disinterest.',
  },
  {
    label: 'Green flags',
    title: 'What is worth trusting',
    body: 'The signals that suggest the connection has real ease, not just novelty or chemistry.',
  },
  {
    label: 'Yellow flags',
    title: 'What to watch before getting attached',
    body: 'Soft warnings to notice early: timing gaps, expectation mismatches, emotional pacing, communication habits, or control patterns.',
  },
  {
    label: 'Conversation',
    title: 'What to ask next',
    body: 'Specific questions that make the next honest conversation easier to start.',
  },
  {
    label: 'Message',
    title: 'A line you could send',
    body: 'One grounded message prompt written for the actual relationship pattern, not a generic pickup line.',
  },
  {
    label: 'Final read',
    title: 'Chemistry, comfort, or chaos',
    body: 'A closing read on what the match appears to be leaning toward and how to use the result without treating it like a verdict.',
  },
];

export const privateReportProofPoints = [
  'Built from your actual Match by Birth result',
  'Written for pair dynamics, not generic sign descriptions',
  'Focused on what to notice and what to say next',
  'Private delivery after secure Stripe checkout',
];

export const privateReportFaq = [
  {
    question: 'Do I need both birth times?',
    answer: 'No. You can start with names and birth dates only. Birth time and place are optional when you want a more precise sign check for cusp birthdays.',
  },
  {
    question: 'Can I buy the report before using the calculator?',
    answer: 'No. Run the free comparison first. The paid report uses that result so the read is tied to your actual connection instead of a generic template.',
  },
  {
    question: 'Is this relationship advice?',
    answer: 'No. Match by Birth is for reflection and conversation. It does not predict outcomes, diagnose people, or replace professional relationship support.',
  },
  {
    question: 'Is the report private?',
    answer: 'The report is delivered through a private access link after checkout. Birth details are used for the calculation and are not shown in public share links.',
  },
];

export const sampleReport = {
  people: 'Mara & Eli',
  score: 86,
  headline: 'Strong natural rhythm with a planning pace mismatch.',
  summary: 'This sample shows the kind of read a private report gives: specific enough to start a real conversation, but careful enough not to pretend a score can decide the relationship.',
  sections: [
    {
      title: 'Why this feels easy',
      body: 'Mara and Eli read each other quickly because both patterns respond to consistency. The connection can feel calm without becoming flat, especially when both people know where they stand.',
    },
    {
      title: 'Where it may catch',
      body: 'The watch area is pace. One person may want a clear plan earlier, while the other needs a little room before naming the direction. If they do not say that out loud, the same connection can start feeling confusing.',
    },
    {
      title: 'What to ask next',
      body: 'A useful next question is: "Do we move closer when things feel certain, or do we need space before we trust the timing?"',
    },
    {
      title: 'A line you could send',
      body: 'I like the way this feels, and I do not want to rush it or leave it vague. Can we talk about what pace feels good for both of us?',
    },
  ],
};
