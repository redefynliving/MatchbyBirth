const swisseph = require('swisseph');

// Location: Indianapolis, IN
const lat = 39.7684;
const lon = -86.1581;

// Birth: 1990-01-15 14:30 local (assume EST/UTC-5 for simplicity)
const year = 1990, month = 1, day = 15;
const hour = 14 + 30/60; // 14.5

// Convert to Julian Day UT (very rough: subtract 5 hours)
const utcHour = hour - 5;
const jd = swisseph.swe_julday(year, month, day, utcHour, swisseph.SE_GREG_CAL);

// Get Sun, Moon, Ascendant
const sun = swisseph.swe_calc_ut(jd, swisseph.SE_SUN);
const moon = swisseph.swe_calc_ut(jd, swisseph.SE_MOON);
const houses = swisseph.swe_houses(jd, lat, lon);

function signFromLongitude(long) {
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  return signs[Math.floor(((long % 360) + 360) % 360 / 30)];
}

console.log('JD:', jd);
console.log('Sun lon:', sun.longitude, '=>', signFromLongitude(sun.longitude));
console.log('Moon lon:', moon.longitude, '=>', signFromLongitude(moon.longitude));
console.log('HOUSES raw:', JSON.stringify(houses, null, 2));

let ascendant = undefined;
if (houses && typeof houses === 'object') {
  // try common shapes
  if (houses.ascendant) ascendant = houses.ascendant;
  else if (houses.asc) ascendant = houses.asc;
  else if (Array.isArray(houses) && houses.length>0) {
    // some bindings return [cusps, ascmc]
    const maybe = houses[1];
    if (maybe && maybe.ascendant) ascendant = maybe.ascendant;
    if (maybe && maybe.asc) ascendant = maybe.asc;
  }
}

if (ascendant !== undefined) {
  console.log('Ascendant lon:', ascendant, '=>', signFromLongitude(ascendant));
} else {
  console.log('Ascendant not available from swe_houses result');
}
