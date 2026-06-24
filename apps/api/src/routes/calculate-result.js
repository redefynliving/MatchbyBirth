import express from 'express';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const store = require('../../../../api/lib/supabase-store.cjs');
const {
  ResultServiceError,
  calculateResultWithOptionalStorage,
} = require('../../../../api/lib/result-service.cjs');

const router = express.Router();

router.post('/', async (req, res) => {
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
});

export default router;