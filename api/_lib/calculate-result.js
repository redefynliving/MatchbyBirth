'use strict';

const store = require('./supabase-store.cjs');
const { createCalculateResultHandler } = require('../../shared/api-handlers.cjs');

const calculateResultHandler = createCalculateResultHandler(store);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  return calculateResultHandler(req, res);
};
