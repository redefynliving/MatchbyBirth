import express from 'express';
import { cyclecalcsHandler } from '../backend-bridge.js';

const router = express.Router();

router.get('/', cyclecalcsHandler);

export default router;
