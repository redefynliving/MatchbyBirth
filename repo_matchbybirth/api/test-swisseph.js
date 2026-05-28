const swisseph = require('swisseph');

module.exports = async (req, res) => {
  try {
    // Hardcoded UTC datetime: 1990-01-15 14:30 UTC
    const year = 1990, month = 1, day = 15;
    const hour = 14 + 30/60; // 14.5 UT

    const jd = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
    const sun = swisseph.swe_calc_ut(jd, swisseph.SE_SUN);

    function signFromLongitude(long) {
      const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
      return signs[Math.floor(((long % 360) + 360) % 360 / 30)];
    }

    const sunSign = sun && sun.longitude ? signFromLongitude(sun.longitude) : null;

    return res.status(200).json({ ok: true, sunSign, jd });
  } catch (err) {
    console.error('test-swisseph error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
