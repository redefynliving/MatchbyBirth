'use strict';

const store = require('./lib/supabase-store.cjs');
const {
  ResultServiceError,
  getSharedResult,
} = require('./lib/result-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const response = await getSharedResult(req.query?.share, store);
    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json({ ok: true, ...response });
  } catch (error) {
    const statusCode = error instanceof ResultServiceError
      ? error.statusCode
      : error.statusCode || 500;
    if (statusCode >= 500) {
      console.error('result lookup failed', { name: error.name, message: error.message });
    }
    return res.status(statusCode).json({
      ok: false,
      error: statusCode >= 500 ? 'Unable to load result.' : error.message,
    });
  }
};
