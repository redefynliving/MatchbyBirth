import express from 'express';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const store = require('../../../../api/_lib/supabase-store.cjs');
const { createCalculateResultHandler } = require('../../../../shared/api-handlers.cjs');

const router = express.Router();
const calculateResultHandler = createCalculateResultHandler(store);

router.post('/', calculateResultHandler);

export default router;
