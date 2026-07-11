import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const backend = require('../../../api/backend.cjs');

export const {
  createCalculateResultHandler,
  createSubscriptionCheckoutHandler,
  store,
} = backend;