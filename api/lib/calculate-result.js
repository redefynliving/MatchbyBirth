'use strict';

const store = require('./supabase-store.cjs');
const {
  ResultServiceError,
  calculateResultWithOptionalStorage,
} = require('./result-service.cjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const response = await calculateResultWithOptionalStorage(req.body || {}, store);
    return res.status(response.persisted ? 201 : 200).json({ ok: true, ...response });
  } catch (error) {
    const statusCode = error instanceof ResultServiceError
      ? error.statusCode
      : error.statusCode || 500;
    if (statusCode >= 500) {
      console.error('calculate-result failed', { name: error.name, message: error.message });
    }
    return res.status(statusCode).json({
      ok: false,
      error: statusCode >= 500 ? 'Unable to create result.' : error.message,
    });
  }
};
