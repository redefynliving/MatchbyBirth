import { Router } from 'express';
import healthCheck from './health-check.js';
import ogMetaRouter from './og-meta.js';
import subscribeRouter from './subscribe.js';
import synastryRouter from './synastry.js';
import calculateResultRouter from './calculate-result.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/og-meta', ogMetaRouter);
    router.use('/subscribe', subscribeRouter);
    router.use('/api/synastry', synastryRouter);
    router.use('/api/calculate-result', calculateResultRouter);

    return router;
};
