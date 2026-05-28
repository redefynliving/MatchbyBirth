const { julian } = require('astronomia');
const solar = require('astronomia/lib/solar');
const moonposition = require('astronomia/lib/moonposition');
const ascendant = require('astronomia/lib/ascendant');


module.exports = async (req, res) => {
  try {
    // Hardcoded UTC datetime: 1990-01-15 14:30 UTC
    const year = 1990, month = 1, day = 15;
    const hour = 14 + 30/60; // 14.5 UT

    const jd = julian.calendarGregorianToJD(year, month, day + (hour/24));
    const sunLon = (solar.apparentLongitude(jd) * 180) / Math.PI;

    function signFromLongitude(long) {
      const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
      return signs[Math.floor(((long % 360) + 360) % 360 / 30)];
    }

    const sunSign = signFromLongitude(sunLon);

    return res.status(200).json({ ok: true, sunSign, jd });
  } catch (err) {
    console.error('test-swisseph error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
