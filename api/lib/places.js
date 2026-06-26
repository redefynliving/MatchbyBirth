'use strict';

const { searchPlaces } = require('../../shared/exact-astrology.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const query = req.query?.q || '';

  try {
    const results = searchPlaces(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error('places search failed', { message: error.message });
    return res.status(500).json({ ok: false, error: 'Unable to search places.' });
  }
};
