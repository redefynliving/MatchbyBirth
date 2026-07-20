import { base, julian, moonposition } from 'astronomia';
import { DateTime } from 'luxon';

const signs = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const profiles = {
  Aries: { element: 'fire', need: 'honesty, momentum, and room to react', strength: 'direct emotional courage', watch: 'responding before feelings settle' },
  Taurus: { element: 'earth', need: 'consistency, comfort, and dependable care', strength: 'steady emotional presence', watch: 'holding on after a pattern needs to change' },
  Gemini: { element: 'air', need: 'conversation, curiosity, and mental movement', strength: 'putting feelings into words', watch: 'thinking around a feeling instead of staying with it' },
  Cancer: { element: 'water', need: 'safety, closeness, and thoughtful reassurance', strength: 'protective emotional attunement', watch: 'withdrawing when care feels uncertain' },
  Leo: { element: 'fire', need: 'warmth, loyalty, and visible appreciation', strength: 'generous emotional expression', watch: 'treating a missed signal as rejection' },
  Virgo: { element: 'earth', need: 'clarity, usefulness, and care shown in details', strength: 'practical emotional support', watch: 'trying to fix what first needs empathy' },
  Libra: { element: 'air', need: 'fairness, calm, and mutual consideration', strength: 'creating emotional balance', watch: 'avoiding a hard truth to preserve peace' },
  Scorpio: { element: 'water', need: 'trust, depth, and emotional honesty', strength: 'loyal emotional intensity', watch: 'testing trust instead of asking for reassurance' },
  Sagittarius: { element: 'fire', need: 'freedom, candor, and a sense of possibility', strength: 'restoring perspective and hope', watch: 'moving on before the other person feels heard' },
  Capricorn: { element: 'earth', need: 'reliability, respect, and calm follow-through', strength: 'staying grounded under pressure', watch: 'hiding vulnerability behind competence' },
  Aquarius: { element: 'air', need: 'space, understanding, and emotional autonomy', strength: 'seeing feelings with perspective', watch: 'creating distance when closeness feels demanding' },
  Pisces: { element: 'water', need: 'gentleness, imagination, and compassionate presence', strength: 'deep emotional empathy', watch: 'absorbing feelings without naming a boundary' },
};

const compatibleElements = new Set(['air:fire', 'earth:water', 'fire:air', 'water:earth']);

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    && date.getTime() <= Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
}

function isValidTimezone(value) {
  if (!value) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function utcInstant({ birthDate, birthTime, place }) {
  if (!validDate(birthDate)) return null;

  if (birthTime && isValidTimezone(place?.timezone)) {
    const local = DateTime.fromISO(`${birthDate}T${birthTime}`, { zone: place.timezone });
    if (local.isValid && local.toFormat('yyyy-MM-dd HH:mm') === `${birthDate} ${birthTime}`) {
      return { date: local.toUTC().toJSDate(), precision: 'exact' };
    }
  }

  const [year, month, day] = birthDate.split('-').map(Number);
  return {
    date: new Date(Date.UTC(year, month - 1, day, 12)),
    precision: 'date-only',
  };
}

export function calculateMoonSign(input = {}) {
  const instant = utcInstant(input);
  if (!instant) return null;

  const longitude = ((base.toDeg(moonposition.position(julian.DateToJD(instant.date)).lon) % 360) + 360) % 360;
  const sign = signs[Math.floor(longitude / 30)];

  return {
    sign,
    degree: Math.round((longitude % 30) * 100) / 100,
    precision: instant.precision,
    ...profiles[sign],
  };
}

export function compareMoonSigns(firstInput, secondInput) {
  const personA = calculateMoonSign(firstInput);
  const personB = calculateMoonSign(secondInput);
  if (!personA || !personB) return null;

  const sameSign = personA.sign === personB.sign;
  const sameElement = personA.element === personB.element;
  const complementary = compatibleElements.has(`${personA.element}:${personB.element}`);
  const score = sameSign ? 92 : sameElement ? 86 : complementary ? 79 : 64;
  const label = score >= 88 ? 'Natural emotional rhythm' : score >= 76 ? 'Supportive emotional match' : 'Growth-oriented match';

  return {
    personA,
    personB,
    score,
    label,
    pattern: sameSign
      ? `Both people tend to need ${personA.need}. The emotional language is familiar, which can make comfort easier to recognize.`
      : `${personA.sign} Moon needs ${personA.need}; ${personB.sign} Moon needs ${personB.need}. ${sameElement || complementary ? 'Those styles can support each other with relatively little translation.' : 'The match can work, but care may look different to each person.'}`,
    watchArea: `${personA.sign} Moon may lean toward ${personA.watch}. ${personB.sign} Moon may lean toward ${personB.watch}.`,
    nextStep: `Ask: “When you are stressed, what feels more supportive—space, reassurance, practical help, or talking it through?”`,
  };
}

export const moonSignProfiles = profiles;
