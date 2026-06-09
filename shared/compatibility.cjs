'use strict';

const ELEMENTS = {
  fire: ['Aries', 'Leo', 'Sagittarius'],
  earth: ['Taurus', 'Virgo', 'Capricorn'],
  air: ['Gemini', 'Libra', 'Aquarius'],
  water: ['Cancer', 'Scorpio', 'Pisces'],
};

const BREAKDOWN_WEIGHTS = {
  chemistry: 0.25,
  communication: 0.2,
  stability: 0.2,
  growth: 0.2,
  intuition: 0.15,
};

function parseBirthDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Enter a valid birth date.');
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    throw new Error('Enter a valid birth date.');
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );

  if (date.getTime() > todayUtc) {
    throw new Error('Birth dates cannot be in the future.');
  }

  return { year, month, day };
}

function getZodiacSign(value) {
  const { month, day } = parseBirthDate(value);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

function getElement(sign) {
  return Object.entries(ELEMENTS).find(([, signs]) => signs.includes(sign))?.[0] || 'water';
}

function stableHash(...values) {
  const input = values.map(String).sort().join('|');
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function offset(range, ...values) {
  return range > 0 ? stableHash(...values) % (range + 1) : 0;
}

function calculateBaseCompatibility(signA, signB) {
  const elementA = getElement(signA);
  const elementB = getElement(signB);

  if (elementA === elementB) return 88 + offset(7, signA, signB);
  if (
    (elementA === 'fire' && elementB === 'air') ||
    (elementA === 'air' && elementB === 'fire')
  ) {
    return 76 + offset(9, signA, signB);
  }
  if (
    (elementA === 'earth' && elementB === 'water') ||
    (elementA === 'water' && elementB === 'earth')
  ) {
    return 74 + offset(9, signA, signB);
  }
  if (
    (elementA === 'fire' && elementB === 'earth') ||
    (elementA === 'earth' && elementB === 'fire')
  ) {
    return 52 + offset(11, signA, signB);
  }
  if (
    (elementA === 'air' && elementB === 'water') ||
    (elementA === 'water' && elementB === 'air')
  ) {
    return 48 + offset(11, signA, signB);
  }
  return 42 + offset(13, signA, signB);
}

function scoreInterpretation(score, relationshipType = 'love') {
  const type = relationshipType === 'friendship'
    ? 'friendship'
    : relationshipType === 'work'
      ? 'work'
      : 'love';

  const labels = {
    love: [
      ['High Romantic Harmony', 'This connection has an unusually natural rhythm.'],
      ['Strong Romantic Potential', 'This connection has a promising foundation.'],
      ['Mixed Romantic Match', 'This connection can grow with intention and understanding.'],
    ],
    friendship: [
      ['High Friendship Harmony', 'This friendship has an easy, supportive rhythm.'],
      ['Strong Friendship Match', 'This friendship has a solid natural foundation.'],
      ['Developing Friendship Match', 'This friendship can strengthen through mutual effort.'],
    ],
    work: [
      ['High Working Harmony', 'Your working styles naturally reinforce each other.'],
      ['Strong Professional Match', 'You have a productive foundation for collaboration.'],
      ['Developing Professional Match', 'Clear expectations can make this collaboration stronger.'],
    ],
  };

  const index = score >= 80 ? 0 : score >= 60 ? 1 : 2;
  const [label, explanation] = labels[type][index];
  return { label, explanation };
}

function validatePeople(people, minimum, maximum) {
  if (!Array.isArray(people)) {
    throw new Error('People must be provided as a list.');
  }
  if (people.length < minimum) {
    throw new Error(`Add at least ${minimum} people.`);
  }
  if (people.length > maximum) {
    throw new Error(`Add no more than ${maximum} people.`);
  }

  return people.map((person, index) => {
    const id = String(person?.id || `person-${index + 1}`).slice(0, 100);
    const name = String(person?.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const birthDate = String(person?.birthDate || '');

    if (!name) {
      throw new Error(`Person ${index + 1} needs a name.`);
    }

    parseBirthDate(birthDate);
    return { id, name, birthDate };
  });
}

function calculateBreakdown(personA, personB, baseScore) {
  const pairSeed = [personA.birthDate, personB.birthDate].sort();
  const nudge = (key) => offset(18, ...pairSeed, key) - 9;
  const clamp = (value) => Math.max(20, Math.min(98, Math.round(value)));

  const scores = {
    chemistry: clamp(baseScore + nudge('chemistry')),
    communication: clamp(baseScore + nudge('communication')),
    stability: clamp(baseScore + nudge('stability')),
    growth: clamp(baseScore + nudge('growth')),
    intuition: clamp(baseScore + nudge('intuition')),
  };

  scores.overall = Math.round(
    Object.entries(BREAKDOWN_WEIGHTS).reduce(
      (total, [key, weight]) => total + scores[key] * weight,
      0,
    ),
  );

  return scores;
}

function sanitizePerson(person) {
  return {
    id: person.id,
    name: person.name,
    sign: getZodiacSign(person.birthDate),
    element: getElement(getZodiacSign(person.birthDate)),
  };
}

function calculatePairResult(people, relationshipType = 'love') {
  const [personA, personB] = validatePeople(people, 2, 2);
  const sanitizedPeople = [sanitizePerson(personA), sanitizePerson(personB)];
  const baseScore = calculateBaseCompatibility(
    sanitizedPeople[0].sign,
    sanitizedPeople[1].sign,
  );
  const breakdown = calculateBreakdown(personA, personB, baseScore);
  const interpretation = scoreInterpretation(breakdown.overall, relationshipType);

  return {
    mode: 'pair',
    relationshipType,
    people: sanitizedPeople,
    score: breakdown.overall,
    breakdown,
    interpretation,
  };
}

function calculateGroupResult(people) {
  const validated = validatePeople(people, 3, 7);
  const sanitizedPeople = validated.map(sanitizePerson);
  const totals = new Map(validated.map((person) => [person.id, { total: 0, count: 0 }]));
  const pairs = [];

  for (let firstIndex = 0; firstIndex < validated.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < validated.length; secondIndex += 1) {
      const personA = validated[firstIndex];
      const personB = validated[secondIndex];
      const publicA = sanitizedPeople[firstIndex];
      const publicB = sanitizedPeople[secondIndex];
      const score = calculatePairResult([personA, personB], 'friendship').score;

      pairs.push({
        personA: publicA,
        personB: publicB,
        score,
      });
      totals.get(personA.id).total += score;
      totals.get(personA.id).count += 1;
      totals.get(personB.id).total += score;
      totals.get(personB.id).count += 1;
    }
  }

  pairs.sort((left, right) => right.score - left.score);
  const memberAverages = sanitizedPeople
    .map((person) => {
      const value = totals.get(person.id);
      return {
        id: person.id,
        name: person.name,
        sign: person.sign,
        average: Math.round(value.total / value.count),
      };
    })
    .sort((left, right) => right.average - left.average);
  const groupScore = Math.round(
    pairs.reduce((total, pair) => total + pair.score, 0) / pairs.length,
  );

  return {
    mode: 'group',
    relationshipType: 'friendship',
    people: sanitizedPeople,
    score: groupScore,
    groupScore,
    interpretation: scoreInterpretation(groupScore, 'friendship'),
    bestPair: pairs[0],
    groupGlue: memberAverages[0],
    memberAverages,
    pairs,
  };
}

module.exports = {
  calculateBaseCompatibility,
  calculateGroupResult,
  calculatePairResult,
  getElement,
  getZodiacSign,
  scoreInterpretation,
  validatePeople,
};
