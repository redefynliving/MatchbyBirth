'use strict';

const ASPECTS = [
  { name: 'conjunction', angle: 0, orb: 8, polarity: 'neutral' },
  { name: 'sextile', angle: 60, orb: 5, polarity: 'supportive' },
  { name: 'square', angle: 90, orb: 7, polarity: 'tension' },
  { name: 'trine', angle: 120, orb: 7, polarity: 'supportive' },
  { name: 'quincunx', angle: 150, orb: 3, polarity: 'tension' },
  { name: 'opposition', angle: 180, orb: 8, polarity: 'tension' },
];

const LUMINARIES = new Set(['Sun', 'Moon']);
const OUTER_PLANETS = new Set(['Uranus', 'Neptune', 'Pluto']);
const ANGLES_AND_NODES = new Set(['Ascendant', 'Midheaven', 'NorthNode', 'SouthNode']);

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function angularDistance(first, second) {
  const difference = Math.abs(Number(first) - Number(second)) % 360;
  return round(Math.min(difference, 360 - difference), 6);
}

function orbAdjustment(firstBody, secondBody) {
  if (ANGLES_AND_NODES.has(firstBody) || ANGLES_AND_NODES.has(secondBody)) return -2;
  if (LUMINARIES.has(firstBody) || LUMINARIES.has(secondBody)) return 1;
  if (OUTER_PLANETS.has(firstBody) || OUTER_PLANETS.has(secondBody)) return -1;
  return 0;
}

function categoryHintsFor(firstBody, secondBody) {
  const pair = new Set([firstBody, secondBody]);
  const hints = [];
  const includesAny = (...bodies) => bodies.some((body) => pair.has(body));

  if (
    (pair.has('Moon') && includesAny('Moon', 'Sun', 'Venus', 'Saturn', 'Pluto'))
    || (pair.has('Sun') && pair.has('Moon'))
  ) {
    hints.push('emotional');
  }
  if (pair.has('Mercury') && includesAny('Mercury', 'Moon', 'Sun', 'Saturn', 'Uranus', 'Neptune')) {
    hints.push('communication');
  }
  if (
    (pair.has('Venus') && includesAny('Moon', 'Mars', 'Pluto', 'Ascendant'))
    || (pair.has('Mars') && includesAny('Venus', 'Pluto', 'Ascendant'))
  ) {
    hints.push('chemistry');
  }
  if (pair.has('Saturn') && includesAny('Sun', 'Moon', 'Venus', 'Mars', 'Ascendant')) {
    hints.push('stability');
  }
  if (pair.has('Jupiter') && includesAny('Sun', 'Moon', 'Venus', 'Ascendant')) {
    hints.push('growth');
  }

  return hints.length > 0 ? hints : ['growth'];
}

function bodyImportance(body) {
  if (LUMINARIES.has(body)) return 1;
  if (['Mercury', 'Venus', 'Mars'].includes(body)) return 0.95;
  if (['Jupiter', 'Saturn'].includes(body)) return 0.85;
  return 0.72;
}

function validLongitude(placement) {
  return placement && Number.isFinite(Number(placement.longitude));
}

function detectSynastryAspects(chartA, chartB) {
  const placementsA = Object.entries(chartA?.placements || {}).filter(([, placement]) => validLongitude(placement));
  const placementsB = Object.entries(chartB?.placements || {}).filter(([, placement]) => validLongitude(placement));
  const aspects = [];

  for (const [bodyA, placementA] of placementsA) {
    for (const [bodyB, placementB] of placementsB) {
      const distance = angularDistance(placementA.longitude, placementB.longitude);
      let bestMatch = null;

      for (const definition of ASPECTS) {
        const maxOrb = Math.max(1, definition.orb + orbAdjustment(bodyA, bodyB));
        const orb = Math.abs(distance - definition.angle);
        if (orb <= maxOrb && (!bestMatch || orb / maxOrb < bestMatch.orb / bestMatch.maxOrb)) {
          bestMatch = { definition, maxOrb, orb };
        }
      }

      if (!bestMatch) continue;

      const { definition, maxOrb } = bestMatch;
      const orb = round(bestMatch.orb);
      const strength = round(
        Math.max(0, 1 - orb / maxOrb)
          * Math.sqrt(bodyImportance(bodyA) * bodyImportance(bodyB)),
      );
      aspects.push({
        id: `A-${bodyA}__${definition.name}__B-${bodyB}`,
        from: { chart: 'A', body: bodyA },
        to: { chart: 'B', body: bodyB },
        aspect: definition.name,
        exactAngle: definition.angle,
        orb,
        maxOrb,
        strength,
        polarity: definition.polarity,
        categoryHints: categoryHintsFor(bodyA, bodyB),
      });
    }
  }

  return aspects.sort((left, right) => (
    right.strength - left.strength
    || left.orb - right.orb
    || left.id.localeCompare(right.id)
  ));
}

module.exports = {
  ASPECTS,
  angularDistance,
  detectSynastryAspects,
};
