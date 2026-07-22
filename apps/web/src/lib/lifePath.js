const lifePathProfiles = {
  1: {
    theme: 'independent drive',
    strength: 'clear initiative and confidence',
    watch: 'turning every decision into a contest',
  },
  2: {
    theme: 'emotional attunement',
    strength: 'patience, care, and partnership instincts',
    watch: 'avoiding direct conversations to keep the peace',
  },
  3: {
    theme: 'creative expression',
    strength: 'warmth, play, humor, and social ease',
    watch: 'scattering focus when a connection needs follow-through',
  },
  4: {
    theme: 'structure and loyalty',
    strength: 'consistency, planning, and practical devotion',
    watch: 'becoming rigid when plans change',
  },
  5: {
    theme: 'freedom and movement',
    strength: 'curiosity, adaptability, and fresh energy',
    watch: 'resisting routines that would make trust easier',
  },
  6: {
    theme: 'care and responsibility',
    strength: 'protectiveness, repair, and emotional generosity',
    watch: 'over-functioning or taking on too much',
  },
  7: {
    theme: 'depth and reflection',
    strength: 'discernment, inner clarity, and meaningful conversation',
    watch: 'withdrawing instead of naming what is happening',
  },
  8: {
    theme: 'focus and ambition',
    strength: 'direction, standards, and real-world follow-through',
    watch: 'measuring the connection by control or achievement',
  },
  9: {
    theme: 'compassion and perspective',
    strength: 'empathy, forgiveness, and big-picture thinking',
    watch: 'giving too much without asking for enough clarity',
  },
  11: {
    theme: 'heightened sensitivity',
    strength: 'intuition, emotional perception, and subtle pattern recognition',
    watch: 'absorbing too much tension before naming what is needed',
  },
  22: {
    theme: 'builder energy',
    strength: 'turning big ideas into practical structure',
    watch: 'carrying responsibility alone instead of letting support in',
  },
  33: {
    theme: 'devoted care',
    strength: 'compassion, guidance, and a strong instinct to help others grow',
    watch: 'becoming the caretaker instead of staying in mutual relationship',
  },
};

const masterNumbers = new Set([11, 22, 33]);

const lifePathActions = {
  1: 'Choose one decision to make directly, then ask where collaboration would improve it.',
  2: 'Name one need directly instead of waiting for someone else to notice it.',
  3: 'Finish one small promise before starting the next interesting idea.',
  4: 'Leave one part of this week flexible and notice how you respond when the plan changes.',
  5: 'Choose one routine that protects freedom by making expectations easier to trust.',
  6: 'Ask someone to share one responsibility you usually carry alone.',
  7: 'Tell someone what you are processing before taking space to think.',
  8: 'Define one goal by the experience you want, not only the result you can measure.',
  9: 'Set one kind boundary before offering more time, energy, or forgiveness.',
  11: 'Write down what you sensed, then check it with a direct question before treating it as fact.',
  22: 'Break one large plan into a first step that another person can help complete.',
  33: 'Offer care once, then ask what support would make the relationship feel mutual.',
};

const compatibilityPairs = {
  '1-2': { score: 78, pattern: 'initiative meeting emotional attunement' },
  '1-3': { score: 84, pattern: 'bold energy with creative expression' },
  '1-4': { score: 70, pattern: 'drive meeting structure' },
  '1-5': { score: 82, pattern: 'independence with movement' },
  '1-6': { score: 68, pattern: 'ambition meeting responsibility' },
  '1-7': { score: 64, pattern: 'direct action meeting reflection' },
  '1-8': { score: 86, pattern: 'two strong wills with real focus' },
  '1-9': { score: 72, pattern: 'personal drive meeting compassion' },
  '2-3': { score: 82, pattern: 'emotional warmth with creative ease' },
  '2-4': { score: 86, pattern: 'care meeting consistency' },
  '2-5': { score: 66, pattern: 'security needs meeting freedom needs' },
  '2-6': { score: 90, pattern: 'mutual care and partnership' },
  '2-7': { score: 76, pattern: 'sensitivity meeting depth' },
  '2-8': { score: 69, pattern: 'soft connection meeting strong focus' },
  '2-9': { score: 84, pattern: 'empathy meeting compassion' },
  '3-4': { score: 67, pattern: 'creative expression meeting practical structure' },
  '3-5': { score: 88, pattern: 'play, variety, and social movement' },
  '3-6': { score: 80, pattern: 'joy meeting care' },
  '3-7': { score: 65, pattern: 'expression meeting privacy' },
  '3-8': { score: 70, pattern: 'creative energy meeting focus and different tempo' },
  '3-9': { score: 86, pattern: 'creative expression meeting big-hearted perspective' },
  '4-5': { score: 62, pattern: 'stability meeting change' },
  '4-6': { score: 88, pattern: 'loyalty, care, and practical repair' },
  '4-7': { score: 82, pattern: 'structure meeting depth' },
  '4-8': { score: 90, pattern: 'discipline, standards, and building power' },
  '4-9': { score: 70, pattern: 'practical devotion meeting broad compassion' },
  '5-6': { score: 66, pattern: 'freedom meeting responsibility' },
  '5-7': { score: 72, pattern: 'movement meeting reflection' },
  '5-8': { score: 74, pattern: 'risk meeting ambition' },
  '5-9': { score: 80, pattern: 'adventure meeting openness' },
  '6-7': { score: 78, pattern: 'care meeting solitude and depth' },
  '6-8': { score: 84, pattern: 'responsibility meeting focus' },
  '6-9': { score: 88, pattern: 'care meeting compassion' },
  '7-8': { score: 73, pattern: 'private depth meeting external drive' },
  '7-9': { score: 82, pattern: 'reflection meeting wisdom' },
  '8-9': { score: 76, pattern: 'achievement meeting perspective' },
};

function isValidDateString(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString))) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function digitSum(value) {
  return String(value)
    .split('')
    .reduce((total, digit) => total + Number(digit), 0);
}

function reduceToRootNumber(value) {
  let current = Number(value);

  while (current > 9) {
    current = digitSum(current);
  }

  return current;
}

export function reduceLifePathTotal(value) {
  let current = Number(value);

  while (current > 9 && !masterNumbers.has(current)) {
    current = digitSum(current);
  }

  return current;
}

function rootForCompatibility(lifePath) {
  if (lifePath === 11) return 2;
  if (lifePath === 22) return 4;
  if (lifePath === 33) return 6;
  return lifePath;
}

export function calculateLifePathNumber(dateString) {
  if (!isValidDateString(dateString)) return null;

  const [year, month, day] = dateString.split('-');
  const total = reduceToRootNumber(month)
    + reduceToRootNumber(day)
    + reduceToRootNumber(year);

  return reduceLifePathTotal(total);
}

export function getLifePathProfile(lifePath) {
  const profile = lifePathProfiles[lifePath];
  return profile ? { ...profile, action: lifePathActions[lifePath] } : null;
}

export function getLifePathCompatibility(first, second) {
  if (!lifePathProfiles[first] || !lifePathProfiles[second]) return null;

  const firstRoot = rootForCompatibility(first);
  const secondRoot = rootForCompatibility(second);
  const hasMasterNumber = first !== firstRoot || second !== secondRoot;

  if (first === second) {
    return {
      score: hasMasterNumber ? 86 : 84,
      pattern: `shared ${lifePathProfiles[first].theme}`,
    };
  }

  const key = [firstRoot, secondRoot].sort((a, b) => a - b).join('-');
  const base = compatibilityPairs[key] || {
    score: 72,
    pattern: `${lifePathProfiles[first].theme} meeting ${lifePathProfiles[second].theme}`,
  };

  if (!hasMasterNumber) return base;

  return {
    score: Math.min(base.score + 2, 95),
    pattern: `${lifePathProfiles[first].theme} meeting ${lifePathProfiles[second].theme}`,
  };
}

export function compareLifePaths(firstDate, secondDate) {
  const first = calculateLifePathNumber(firstDate);
  const second = calculateLifePathNumber(secondDate);

  if (!first || !second) return null;

  const compatibility = getLifePathCompatibility(first, second);
  const firstProfile = getLifePathProfile(first);
  const secondProfile = getLifePathProfile(second);

  return {
    personA: {
      lifePath: first,
      ...firstProfile,
    },
    personB: {
      lifePath: second,
      ...secondProfile,
    },
    score: compatibility.score,
    pattern: compatibility.pattern,
    sharedTranslation: `In a shared plan, ${firstProfile.theme} may prioritize a different pace or proof point than ${secondProfile.theme}. The useful question is which expectation each person thought was already understood.`,
    watchArea: `${firstProfile.watch} can meet ${secondProfile.watch}. Treat that as a pattern to check in real behavior, not a fixed trait.`,
    nextStep: `Ask: “What would steady support look like this week when ${firstProfile.theme} and ${secondProfile.theme} pull us toward different priorities?”`,
  };
}

export const lifePathMeanings = lifePathProfiles;
