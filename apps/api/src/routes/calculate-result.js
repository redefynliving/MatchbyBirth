import express from 'express';
import { createCalculateResultHandler, store } from '../backend-bridge.js';

const router = express.Router();
const calculateResultHandler = createCalculateResultHandler(store);

router.post('/', calculateResultHandler);

export default router;
