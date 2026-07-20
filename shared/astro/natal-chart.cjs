'use strict';

const {
  base,
  coord,
  elliptic,
  julian,
  moonposition,
  nutation,
  planetposition,
  pluto,
  solar,
} = require('astronomia');
const { DateTime } = require('luxon');
const { eclipticToSign, isValidTimezone } = require('../exact-astrology.cjs');

const PLANET_DATA = {
  Mercury: require('astronomia/data/vsop87Bmercury').default,
  Venus: require('astronomia/data/vsop87Bvenus').default,
  Mars: require('astronomia/data/vsop87Bmars').default,
  Jupiter: require('astronomia/data/vsop87Bjupiter').default,
  Saturn: require('astronomia/data/vsop87Bsaturn').default,
  Uranus: require('astronomia/data/vsop87Buranus').default,
  Neptune: require('astronomia/data/vsop87Bneptune').default,
};

const EARTH = new planetposition.Planet(require('astronomia/data/vsop87Bearth').default);
const PLANETS = Object.fromEntries(
  Object.entries(PLANET_DATA).map(([name, data]) => [name, new planetposition.Planet(data)]),
);

const CORE_BODIES = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
];

function normalizeLongitude(value) {
  const normalized = ((Number(value) % 360) + 360) % 360;
  return Object.is(normalized, -0) ? 0 : normalized;
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function longitudeToPlacement(longitude) {
  const normalized = normalizeLongitude(longitude);
  const sign = eclipticToSign(normalized);
  return {
    sign,
    degree: round(normalized % 30, 2),
  };
}

function parseBirthDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Enter a valid birth date.');
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new Error('Enter a valid birth date.');
  }
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (date.getTime() > todayUtc) {
    throw new Error('Birth dates cannot be in the future.');
  }
  return { year, month, day };
}

function parseUtcInstant({ birthDate, birthTime, place } = {}) {
  const { year, month, day } = parseBirthDate(birthDate);
  const timezone = place?.timezone;
  if (birthTime && timezone && isValidTimezone(timezone)) {
    const dt = DateTime.fromISO(`${birthDate}T${birthTime}`, { zone: timezone });
    if (dt.isValid && dt.toFormat('yyyy-MM-dd HH:mm') === `${birthDate} ${birthTime}`) {
      return { utc: dt.toUTC().toJSDate(), precision: 'timed' };
    }
  }
  return {
    utc: new Date(Date.UTC(year, month - 1, day, 12, 0, 0)),
    precision: 'date-only',
  };
}

function sunLongitude(jd) {
  const T = base.J2000Century(jd);
  return normalizeLongitude(base.toDeg(solar.apparentLongitude(T)));
}

function moonLongitude(jd) {
  return normalizeLongitude(base.toDeg(moonposition.position(jd).lon));
}

function planetLongitude(name, jd) {
  if (name === 'Pluto') {
    const eq = pluto.astrometric(jd, EARTH);
    const ecl = new coord.Equatorial(eq.ra, eq.dec).toEcliptic(nutation.meanObliquity(jd));
    return normalizeLongitude(base.toDeg(ecl.lon));
  }

  const eq = elliptic.position(PLANETS[name], EARTH, jd);
  const ecl = new coord.Equatorial(eq.ra, eq.dec).toEcliptic(nutation.meanObliquity(jd));
  return normalizeLongitude(base.toDeg(ecl.lon));
}

function buildPlacement(longitude) {
  const normalized = normalizeLongitude(longitude);
  const placement = longitudeToPlacement(normalized);
  return {
    longitude: round(normalized, 4),
    sign: placement.sign,
    degree: placement.degree,
    retrograde: false,
  };
}

function calculateNatalChart(input = {}) {
  const { utc, precision } = parseUtcInstant(input);
  const jd = julian.DateToJD(utc);
  const placements = {
    Sun: buildPlacement(sunLongitude(jd)),
    Moon: buildPlacement(moonLongitude(jd)),
  };

  for (const body of CORE_BODIES.slice(2)) {
    placements[body] = buildPlacement(planetLongitude(body, jd));
  }

  return {
    precision,
    zodiac: 'tropical',
    utc: utc.toISOString(),
    placements,
  };
}

function calculateMoonPlacement(input = {}) {
  const { utc, precision } = parseUtcInstant(input);
  return {
    ...buildPlacement(moonLongitude(julian.DateToJD(utc))),
    precision,
  };
}

module.exports = {
  CORE_BODIES,
  calculateMoonPlacement,
  calculateNatalChart,
  longitudeToPlacement,
  normalizeLongitude,
};
