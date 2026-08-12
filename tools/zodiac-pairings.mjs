export const ZODIAC_SIGNS = [
  { name: 'aries', label: 'Aries', element: 'Fire', quality: 'Cardinal', planet: 'Mars', strength: 'direct action', watch: 'impatience' },
  { name: 'taurus', label: 'Taurus', element: 'Earth', quality: 'Fixed', planet: 'Venus', strength: 'steady commitment', watch: 'resistance to change' },
  { name: 'gemini', label: 'Gemini', element: 'Air', quality: 'Mutable', planet: 'Mercury', strength: 'curious conversation', watch: 'inconsistency' },
  { name: 'cancer', label: 'Cancer', element: 'Water', quality: 'Cardinal', planet: 'Moon', strength: 'emotional care', watch: 'defensiveness' },
  { name: 'leo', label: 'Leo', element: 'Fire', quality: 'Fixed', planet: 'Sun', strength: 'warm encouragement', watch: 'pride' },
  { name: 'virgo', label: 'Virgo', element: 'Earth', quality: 'Mutable', planet: 'Mercury', strength: 'practical support', watch: 'over-analysis' },
  { name: 'libra', label: 'Libra', element: 'Air', quality: 'Cardinal', planet: 'Venus', strength: 'fair-minded partnership', watch: 'indecision' },
  { name: 'scorpio', label: 'Scorpio', element: 'Water', quality: 'Fixed', planet: 'Pluto & Mars', strength: 'focused loyalty', watch: 'control' },
  { name: 'sagittarius', label: 'Sagittarius', element: 'Fire', quality: 'Mutable', planet: 'Jupiter', strength: 'optimistic exploration', watch: 'restlessness' },
  { name: 'capricorn', label: 'Capricorn', element: 'Earth', quality: 'Cardinal', planet: 'Saturn', strength: 'long-term planning', watch: 'emotional reserve' },
  { name: 'aquarius', label: 'Aquarius', element: 'Air', quality: 'Fixed', planet: 'Uranus & Saturn', strength: 'independent thinking', watch: 'detachment' },
  { name: 'pisces', label: 'Pisces', element: 'Water', quality: 'Mutable', planet: 'Neptune & Jupiter', strength: 'empathetic imagination', watch: 'unclear boundaries' },
];

const PUBLISHED_DATE = '2026-07-12';
const CANONICAL_BLOG_SLUG_OVERRIDES = {
  'aries-and-leo-compatibility': 'aries-leo-compatibility',
  'aries-and-sagittarius-compatibility': 'aries-sagittarius-compatibility',
  'aries-and-scorpio-compatibility': 'aries-scorpio-compatibility',
  'taurus-and-cancer-compatibility': 'taurus-cancer-nurturing-pair',
  'taurus-and-virgo-compatibility': 'taurus-virgo-compatibility',
  'taurus-and-capricorn-compatibility': 'capricorn-taurus-compatibility',
  'gemini-and-libra-compatibility': 'libra-gemini-air-sign-romance',
  'gemini-and-sagittarius-compatibility': 'gemini-sagittarius-opposites-that-work',
  'gemini-and-aquarius-compatibility': 'aquarius-gemini-compatibility',
  'cancer-and-scorpio-compatibility': 'cancer-scorpio-compatibility',
  'cancer-and-pisces-compatibility': 'pisces-cancer-compatibility',
  'leo-and-sagittarius-compatibility': 'leo-sagittarius-compatibility',
  'leo-and-aquarius-compatibility': 'leo-aquarius-fixed-signs-big-sparks',
  'virgo-and-pisces-compatibility': 'virgo-pisces-logic-intuition-love',
  'scorpio-and-capricorn-compatibility': 'scorpio-capricorn-compatibility',
  'gemini-libra-compatibility': 'libra-gemini-air-sign-romance',
};

export function getCanonicalBlogPostSlug(slug) {
  return CANONICAL_BLOG_SLUG_OVERRIDES[slug] || slug;
}

function canonicalizeSigns(firstSign, secondSign) {
  const firstIndex = ZODIAC_SIGNS.findIndex((sign) => sign.name === firstSign.name);
  const secondIndex = ZODIAC_SIGNS.findIndex((sign) => sign.name === secondSign.name);
  return firstIndex <= secondIndex
    ? [firstSign, secondSign]
    : [secondSign, firstSign];
}

function getElementHarmony(first, second) {
  const pair = [first.element, second.element].sort().join(' + ');
  const descriptions = {
    'Air + Air': 'Both signs lead with ideas, language, and social awareness. Conversation can come easily, while emotional follow-through needs to stay intentional.',
    'Air + Earth': 'Earth favors proof and routine while Air favors options and discussion. This works best when ideas are paired with a clear next step.',
    'Air + Fire': 'Air gives Fire ideas room to grow, and Fire gives Air momentum. The connection can feel lively as long as neither person treats speed as agreement.',
    'Air + Water': 'Air tends to explain while Water tends to feel. Curiosity and patient listening help this pair translate rather than dismiss those different instincts.',
    'Earth + Earth': 'Both signs tend to value reliability, useful effort, and tangible progress. The bond can be durable, though too much routine may make it feel closed off.',
    'Earth + Fire': 'Fire supplies initiative and Earth supplies structure. Friction appears when urgency meets caution, so roles and timing are worth naming early.',
    'Earth + Water': 'Earth can give shape to Water’s feelings, while Water can soften Earth’s practical focus. This pairing often grows through consistent care.',
    'Fire + Fire': 'Both signs bring initiative, candor, and visible energy. Shared excitement is a strength, but competition can replace collaboration if neither slows down.',
    'Fire + Water': 'Fire is direct and activating while Water is receptive and emotionally layered. Strong chemistry is possible when directness does not become pressure.',
    'Water + Water': 'Both signs notice emotional undercurrents quickly. Mutual empathy is a strength, while boundaries keep one person’s mood from becoming the whole relationship.',
  };
  return descriptions[pair];
}

function getQualityHarmony(first, second) {
  if (first.quality === second.quality) {
    const sharedPace = {
      Cardinal: 'Both tend to initiate, so leadership comes naturally and competing agendas need an explicit decision-maker.',
      Fixed: 'Both tend to sustain what they start, creating loyalty and follow-through alongside a risk of prolonged standoffs.',
      Mutable: 'Both tend to adapt quickly, making change easier while consistency may require a shared routine.',
    };
    return sharedPace[first.quality];
  }

  return `${first.label} brings a ${first.quality.toLowerCase()} pace and ${second.label} brings a ${second.quality.toLowerCase()} pace. The relationship works better when they agree on who starts, who steadies, and who adjusts the plan.`;
}

export function getZodiacPairingPost(page) {
  if (!page) return null;
  const { slug } = page;
  const [first, second] = canonicalizeSigns(page.firstSign, page.secondSign);
  const canonicalSlug = getCanonicalBlogPostSlug(getZodiacPairingSlug(first, second));
  const sameSign = first.name === second.name;
  const title = `${first.label} and ${second.label} Compatibility: Love, Friendship & Chemistry`;

  return {
    slug,
    canonicalSlug,
    firstSign: first,
    secondSign: second,
    title,
    date: PUBLISHED_DATE,
    updatedAt: PUBLISHED_DATE,
    author: 'AJ Fox',
    category: 'pair-deep-dive',
    description: `Are ${first.label} and ${second.label} compatible? Explore their elemental rhythm, communication style, strengths, pressure points, and practical ways to connect.`,
    tags: [first.name, second.name, 'compatibility', 'relationships'],
    quickTakeaways: [
      `${first.label} contributes ${first.strength}; ${second.label} contributes ${second.strength}.`,
      `The clearest pressure points are ${first.watch} and ${second.watch}.`,
      'Sun signs are a starting point, not a relationship verdict.',
    ],
    comparisonRows: [
      {
        label: 'Natural strength',
        bestUse: `${first.strength} paired with ${second.strength}`,
        watchOut: `Letting ${first.watch} or ${second.watch} set the tone`,
      },
      {
        label: 'Communication',
        bestUse: 'Name the decision, feeling, or request directly',
        watchOut: 'Assuming a different pace means a lack of care',
      },
      {
        label: 'Repair',
        bestUse: 'Return to one concrete issue at a time',
        watchOut: 'Using astrology as proof that conflict is inevitable',
      },
    ],
    faq: [
      {
        question: `Are ${first.label} and ${second.label} a good match?`,
        answer: `They can be. Their Sun signs highlight a likely rhythm, but communication, values, timing, and the rest of both birth charts matter more than a label by itself.`,
      },
      {
        question: `What is the biggest strength of a ${first.label}-${second.label} pairing?`,
        answer: `${first.label} can bring ${first.strength}, while ${second.label} can bring ${second.strength}. Used together, those qualities give the pair a practical place to build from.`,
      },
    ],
    content: `
      <p>${sameSign ? `A ${first.label}-${second.label} match doubles the same core style, so recognition can be immediate.` : `${first.label} and ${second.label} bring different instincts into the same relationship.`} Sun-sign compatibility is most useful when it identifies a pattern to discuss, not when it is treated as a fixed prediction.</p>

      <h2>Elemental rhythm: ${first.element} and ${second.element}</h2>
      <p>${getElementHarmony(first, second)}</p>
      <p>In daily life, ${first.label} may show care through ${first.strength}, while ${second.label} may rely on ${second.strength}. Neither approach is automatically better. The useful question is whether each person can recognize the other’s effort without requiring it to look identical to their own.</p>

      <h2>How their pace fits</h2>
      <p>${getQualityHarmony(first, second)}</p>
      <p>When plans change or tension rises, ${first.label} may need to watch for ${first.watch}. ${second.label} may need to notice ${second.watch}. Naming those tendencies early is more productive than waiting until both people are defending their default style.</p>

      <h2>Love and attraction</h2>
      <p>Attraction often grows when ${first.label} feels that their ${first.strength} is appreciated and ${second.label} feels room for their ${second.strength}. Chemistry alone does not resolve different expectations, so this pair benefits from being direct about attention, independence, reassurance, and pace.</p>

      <h2>Friendship and teamwork</h2>
      <p>As friends or collaborators, the pairing is strongest when each person owns a clear contribution. ${first.label} can take the lead where ${first.strength} matters; ${second.label} can shape the parts that need ${second.strength}. A specific division of responsibility prevents stylistic differences from turning into a judgment about competence.</p>

      <h2>What to talk about when it gets difficult</h2>
      <p>Start with the observable issue rather than the zodiac label. Ask what happened, what each person needed, and what a useful repair would look like. For this pairing, the most helpful prompt is: “What would make this feel clear and workable for both of us?”</p>

      <h2>Use the full birth-date picture</h2>
      <p>A Sun-sign comparison cannot account for the full chart, relationship history, or present circumstances. Use the Match by Birth calculator to compare actual birth dates, then treat the result as a conversation starter rather than a promise.</p>
    `,
  };
}

export function getZodiacPairingSlug(firstSign, secondSign) {
  return `${firstSign.name}-and-${secondSign.name}-compatibility`;
}

export function getZodiacPairingPages() {
  return ZODIAC_SIGNS.flatMap((firstSign) => (
    ZODIAC_SIGNS.map((secondSign) => ({
      firstSign,
      secondSign,
      slug: getZodiacPairingSlug(firstSign, secondSign),
      path: `/blog/${getZodiacPairingSlug(firstSign, secondSign)}`,
    }))
  ));
}

export function getCanonicalZodiacPairingPages() {
  return ZODIAC_SIGNS.flatMap((firstSign, firstIndex) => (
    ZODIAC_SIGNS.slice(firstIndex).map((secondSign) => {
      const slug = getZodiacPairingSlug(firstSign, secondSign);
      const canonicalSlug = getCanonicalBlogPostSlug(slug);
      return {
        firstSign,
        secondSign,
        slug,
        canonicalSlug,
        path: `/blog/${canonicalSlug}`,
      };
    })
  ));
}

export function getCanonicalZodiacPairingPosts() {
  return getCanonicalZodiacPairingPages().map(getZodiacPairingPost);
}

export function getZodiacPairingPosts() {
  return getZodiacPairingPages().map(getZodiacPairingPost);
}

export function getRelatedPairings(post, limit = 8) {
  if (!post?.firstSign || !post?.secondSign) return [];
  const target = post.firstSign.name;
  const partner = post.secondSign.name;
  const pages = getCanonicalZodiacPairingPages();
  const scored = pages
    .filter((page) => page.canonicalSlug !== post.canonicalSlug)
    .map((page) => {
      const sharesFirst = page.firstSign.name === target;
      const sharesSecond = page.secondSign.name === partner;
      const sharesElement = [page.firstSign.element, page.secondSign.element]
        .some((el) => [post.firstSign.element, post.secondSign.element].includes(el));
      const score = (sharesFirst ? 3 : 0) + (sharesSecond ? 3 : 0) + (sharesElement ? 1 : 0);
      return { page, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const seen = new Set();
  const out = [];
  for (const { page } of scored) {
    if (seen.has(page.path)) continue;
    seen.add(page.path);
    out.push(page);
    if (out.length >= limit) break;
  }
  return out;
}

export function getZodiacPairingPostBySlug(slug) {
  if (!slug) return null;
  const match = /^([a-z]+)-and-([a-z]+)-compatibility$/.exec(slug);
  if (!match) return null;
  const firstSign = ZODIAC_SIGNS.find((sign) => sign.name === match[1]);
  const secondSign = ZODIAC_SIGNS.find((sign) => sign.name === match[2]);
  if (!firstSign || !secondSign) return null;
  return getZodiacPairingPost({ firstSign, secondSign, slug });
}
