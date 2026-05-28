const { julian } = require('astronomia');
const solar = require('astronomia/lib/solar');
const moonposition = require('astronomia/lib/moonposition');
const ascendant = require('astronomia/lib/ascendant');

// Location: Indianapolis, IN
const lat = 39.7684;
const lon = -86.1581;

// Birth: 1990-01-15 14:30 UTC
const year = 1990, month = 1, day = 15;
const hour = 14 + 30/60; // 14.5

// Convert to Julian Day UT
const jd = julian.calendarGregorianToJD(year, month, day + (hour/24));

function deg(rad) { return (rad * 180) / Math.PI; }
function signFromLongitude(long) {
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  return signs[Math.floor(((long % 360) + 360) % 360 / 30)];
}

(async () => {
  try {
    const sunLon = deg(solar.apparentLongitude(jd));
    const moonLon = deg(moonposition.position(jd).lon);

    console.log('JD:', jd);
    console.log('Sun lon:', sunLon, '=>', signFromLongitude(sunLon));
    console.log('Moon lon:', moonLon, '=>', signFromLongitude(moonLon));

    const ascData = ascendant.ascendant(jd, lon, lat);
    if (ascData && ascData.ascendant) {
      console.log('Ascendant lon:', ascData.ascendant, '=>', signFromLongitude(ascData.ascendant));
    } else {
      console.log('Ascendant not available');
    }
  } catch (err) {
    console.error('astronomia test error', err);
  }
})();
