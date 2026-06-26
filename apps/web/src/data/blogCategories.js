export const BLOG_CATEGORIES = [
  {
    key: 'sign-guide',
    label: 'By Zodiac Sign',
    description: 'Compatibility guides for each sign',
    seoTitle: 'Zodiac Sign Compatibility Guides | Match by Birth',
    seoDescription: 'Explore compatibility guides for every zodiac sign, including love, friendship, work, and long-term relationship patterns.',
  },
  {
    key: 'pair-deep-dive',
    label: 'Pair Deep Dives',
    description: 'In-depth analysis of specific pairings',
    seoTitle: 'Zodiac Pair Compatibility Deep Dives | Match by Birth',
    seoDescription: 'Detailed compatibility analysis for specific zodiac pairings, including strengths, challenges, and practical relationship patterns.',
  },
  {
    key: 'learn-astrology',
    label: 'Learn Astrology',
    description: 'Elements, planets, timing, and chart basics',
    seoTitle: 'Learn Astrology and Birth Matching | Match by Birth',
    seoDescription: 'Learn how birth dates, zodiac signs, elements, timing, and compatibility scores can help you reflect on relationships.',
  },
  {
    key: 'numerology',
    label: 'Numerology',
    description: 'Life path number compatibility guides',
    seoTitle: 'Life Path Number Compatibility Guides | Match by Birth',
    seoDescription: 'Understand life path number compatibility, relationship strengths, and practical reflection prompts for every life path number.',
  },
  {
    key: 'seasonal',
    label: 'Seasonal',
    description: 'Retrogrades, transits, and timely guides',
    seoTitle: 'Seasonal Astrology and Relationship Timing | Match by Birth',
    seoDescription: 'Read seasonal astrology guides for dating, relationship timing, retrogrades, and compatibility patterns throughout the year.',
  },
  {
    key: 'relationships',
    label: 'Relationships',
    description: 'Love, friendship, work, family, and groups',
    seoTitle: 'Relationship Compatibility Guides | Match by Birth',
    seoDescription: 'Use birth date compatibility for love, friendship, family, work, groups, and responsible relationship reflection.',
  },
];

export const ALL_POSTS_CATEGORY = {
  key: 'all',
  label: 'All Posts',
  description: 'All Match by Birth articles and guides',
};

export function getCategoryMeta(categoryKey) {
  return BLOG_CATEGORIES.find((category) => category.key === categoryKey);
}

export function getPostCategory(post) {
  if (post.category) return post.category;
  if (post.slug.endsWith('-compatibility') && !post.slug.includes('-compatibility-')) return 'sign-guide';
  if (post.tags?.some((tag) => ['life-path', 'numerology'].includes(tag))) return 'numerology';
  if (post.tags?.some((tag) => ['elements', 'fire', 'earth', 'air', 'water', 'synastry', 'natal-chart', 'birth-date', 'houses', 'planets'].includes(tag))) return 'learn-astrology';
  if (post.tags?.some((tag) => ['retrograde', 'full-moon', 'new-moon', 'valentine', '2026', 'seasonal', 'timing'].includes(tag))) return 'seasonal';
  if (post.tags?.includes('compatibility')) return 'pair-deep-dive';
  return 'relationships';
}
