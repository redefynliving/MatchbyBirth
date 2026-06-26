'use strict';

const {
  findBirthPlaceMatches,
} = require('../shared/exact-astrology.cjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const query = String(req.query?.q || '').trim();
  if (query.length < 2) {
    return res.status(400).json({
      error: 'Enter at least 2 characters to search birth places.',
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(200).json({
    places: findBirthPlaceMatches(query),
  });
};
