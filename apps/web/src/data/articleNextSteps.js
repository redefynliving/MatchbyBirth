export const REVIEW_PILLAR_SLUGS = [
  'what-is-birth-matching',
  'how-birth-date-compatibility-is-calculated',
  'birth-date-compatibility-vs-zodiac-compatibility',
  'life-path-number-compatibility-guide',
  'relationship-timing-by-birth-date',
  'low-compatibility-score-meaning',
  'high-compatibility-score-meaning',
  'how-to-use-compatibility-results-responsibly',
  'zodiac-elements-love-compatibility',
  'group-compatibility-how-to-read-results',
];

const calculatorLink = {
  label: 'Try the birth date compatibility calculator',
  href: '/#calculator',
  description: 'Compare two people or a group with the free Match by Birth tool.',
};

const methodologyLink = {
  label: 'Read how Match by Birth works',
  href: '/how-it-works',
  description: 'See the scoring inputs, limitations, privacy notes, and responsible-use guidance.',
};

export const ARTICLE_NEXT_STEPS = {
  'what-is-birth-matching': [
    calculatorLink,
    methodologyLink,
    {
      label: 'How birth date compatibility is calculated',
      href: '/blog/how-birth-date-compatibility-is-calculated',
      description: 'Understand the signals behind the score before reading any result too literally.',
    },
  ],
  'how-birth-date-compatibility-is-calculated': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a low compatibility score means',
      href: '/blog/low-compatibility-score-meaning',
      description: 'Learn how to interpret friction without treating a score as a relationship verdict.',
    },
  ],
  'birth-date-compatibility-vs-zodiac-compatibility': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Zodiac elements and love compatibility',
      href: '/blog/zodiac-elements-love-compatibility',
      description: 'Compare fire, earth, air, and water patterns in everyday relationship behavior.',
    },
  ],
  'life-path-number-compatibility-guide': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Life Path 1 compatibility',
      href: '/blog/life-path-1-compatibility',
      description: 'Start with a practical example of how life path patterns affect relationship rhythm.',
    },
  ],
  'relationship-timing-by-birth-date': [
    calculatorLink,
    methodologyLink,
    {
      label: 'How to use compatibility results responsibly',
      href: '/blog/how-to-use-compatibility-results-responsibly',
      description: 'Use timing notes as reflection prompts, not as instructions about what to do.',
    },
  ],
  'low-compatibility-score-meaning': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a high compatibility score means',
      href: '/blog/high-compatibility-score-meaning',
      description: 'Balance friction notes by seeing what strong scores can and cannot promise.',
    },
  ],
  'high-compatibility-score-meaning': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What a low compatibility score means',
      href: '/blog/low-compatibility-score-meaning',
      description: 'Understand why lower scores can still point to useful relationship conversations.',
    },
  ],
  'how-to-use-compatibility-results-responsibly': [
    calculatorLink,
    methodologyLink,
    {
      label: 'What is birth matching?',
      href: '/blog/what-is-birth-matching',
      description: 'Review the basic idea behind Match by Birth before comparing results.',
    },
  ],
  'zodiac-elements-love-compatibility': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Birth date compatibility vs zodiac compatibility',
      href: '/blog/birth-date-compatibility-vs-zodiac-compatibility',
      description: 'See where zodiac signs fit inside a broader birth-date matching approach.',
    },
  ],
  'group-compatibility-how-to-read-results': [
    calculatorLink,
    methodologyLink,
    {
      label: 'Friendship compatibility by birth date',
      href: '/blog/friendship-compatibility-by-birth-date',
      description: 'Use one-to-one friendship patterns to understand group dynamics more clearly.',
    },
  ],
};

export function getArticleNextSteps(post) {
  if (!post) return [];
  return ARTICLE_NEXT_STEPS[post.slug] || [calculatorLink, methodologyLink];
}
