import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/winston.js';

export function requestIdMiddleware(req, res, next) {
  req.requestId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  logger.info('req', req.method, req.url, req.requestId);
  next();
}
