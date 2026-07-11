import express from 'express';
import { createSubscriptionCheckoutHandler } from '../backend-bridge.js';

const router = express.Router();
router.post('/', createSubscriptionCheckoutHandler());

export default router;
