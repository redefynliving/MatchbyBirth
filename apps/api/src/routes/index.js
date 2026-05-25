import { Router } from 'express';
import healthCheck from './health-check.js';
import ogMetaRouter from './og-meta.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/og-meta', ogMetaRouter);

    return router;
};