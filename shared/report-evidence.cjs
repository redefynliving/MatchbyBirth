'use strict';

const { calculateMoonPlacement } = require('./astro/natal-chart.cjs');

const MASTER_NUMBERS = new Set([11, 22, 33]);

const MOON_PROFILES = {
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

const LIFE_PATH_PROFILES = {
  1: { theme: 'independent drive', strength: 'clear initiative and confidence', watch: 'turning every decision into a contest' },
  2: { theme: 'emotional attunement', strength: 'patience, care, and partnership instincts', watch: 'avoiding direct conversations to keep the peace' },
  3: { theme: 'creative expression', strength: 'warmth, play, humor, and social ease', watch: 'scattering focus when a connection needs follow-through' },
  4: { theme: 'structure and loyalty', strength: 'consistency, planning, and practical devotion', watch: 'becoming rigid when plans change' },
  5: { theme: 'freedom and movement', strength: 'curiosity, adaptability, and fresh energy', watch: 'resisting routines that would make trust easier' },
  6: { theme: 'care and responsibility', strength: 'protectiveness, repair, and emotional generosity', watch: 'taking on too much instead of asking for shared effort' },
  7: { theme: 'depth and reflection', strength: 'discernment, inner clarity, and meaningful conversation', watch: 'withdrawing instead of naming what is happening' },
  8: { theme: 'focus and ambition', strength: 'direction, standards, and practical follow-through', watch: 'measuring the connection by control or achievement' },
  9: { theme: 'compassion and perspective', strength: 'empathy, forgiveness, and broad perspective', watch: 'giving too much without asking for enough clarity' },
  11: { theme: 'heightened sensitivity', strength: 'intuition, emotional perception, and subtle pattern recognition', watch: 'absorbing too much tension before naming what is needed' },
  22: { theme: 'builder drive', strength: 'turning big plans into practical structure', watch: 'carrying responsibility alone instead of letting support in' },
  33: { theme: 'devoted care', strength: 'compassion, guidance, and a strong instinct to help', watch: 'becoming the caretaker instead of staying in a mutual relationship' },
};

const REPORT_FOCUS_ALIASES = {
  moon: 'moon_sign',
  moon_sign: 'moon_sign',
  moon_sign_compatibility: 'moon_sign',
  crush: 'crush',
  crush_birthday_compatibility: 'crush',
  life_path: 'life_path',
  life_path_compatibility: 'life_path',
  full_compatibility: 'full_compatibility',
  homepage: 'full_compatibility',
};

const CLARITY_GOALS = {
  moon_sign: new Set(['repair_after_conflict', 'reassurance', 'emotional_distance']),
  crush: new Set(['mixed_signals', 'pace', 'next_move']),
  life_path: new Set(['long_term_fit', 'shared_goals', 'responsibility']),
  full_compatibility: new Set(['communication', 'conflict', 'long_term_fit']),
};

const DEFAULT_CLARITY_GOALS = {
  moon_sign: 'repair_after_conflict',
  crush: 'mixed_signals',
  life_path: 'long_term_fit',
  full_compatibility: 'communication',
};

function digitSum(value) {
  return String(value).split('').reduce((total, digit) => total + Number(digit), 0);
}

function reduceToRootNumber(value) {
  let current = Number(value);
  while (current > 9) current = digitSum(current);
  return current;
}

function calculateLifePathNumber(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString))) return null;
  const [year, month, day] = dateString.split('-');
  let current = reduceToRootNumber(month) + reduceToRootNumber(day) + reduceToRootNumber(year);
  while (current > 9 && !MASTER_NUMBERS.has(current)) current = digitSum(current);
  return current;
}

function normalizeReportFocus(value) {
  return REPORT_FOCUS_ALIASES[String(value || '').trim()] || 'full_compatibility';
}

function normalizeClarityGoal(focusValue, goalValue) {
  const focus = normalizeReportFocus(focusValue);
  const goal = String(goalValue || '').trim();
  return CLARITY_GOALS[focus].has(goal) ? goal : DEFAULT_CLARITY_GOALS[focus];
}

function buildPersonReportEvidence(person) {
  const moonPlacement = calculateMoonPlacement(person);
  const moonProfile = MOON_PROFILES[moonPlacement.sign];
  const lifePathNumber = calculateLifePathNumber(person.birthDate);
  const lifePathProfile = LIFE_PATH_PROFILES[lifePathNumber];
  const moonPrecision = moonPlacement.precision === 'timed' ? 'exact' : 'date-only';

  return {
    moon: {
      sign: moonPlacement.sign,
      ...(moonPrecision === 'exact' ? { degree: moonPlacement.degree } : {}),
      precision: moonPrecision,
      ...moonProfile,
    },
    lifePath: {
      number: lifePathNumber,
      masterNumber: MASTER_NUMBERS.has(lifePathNumber),
      ...lifePathProfile,
    },
  };
}

function buildReportContext(input = {}) {
  const focus = normalizeReportFocus(input.reportFocus || input.source);
  return {
    focus,
    clarityGoal: normalizeClarityGoal(focus, input.clarityGoal),
  };
}

module.exports = {
  CLARITY_GOALS,
  DEFAULT_CLARITY_GOALS,
  LIFE_PATH_PROFILES,
  MASTER_NUMBERS,
  MOON_PROFILES,
  buildPersonReportEvidence,
  buildReportContext,
  calculateLifePathNumber,
  normalizeClarityGoal,
  normalizeReportFocus,
};
