import logger from '../utils/winston.js';

const errorMiddleware = (err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack, request_id: req.requestId });

  if (res.headersSent) {
    return next(err);
  }

  const errorPayload = {
    error_code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Something went wrong',
    request_id: req.requestId || null,
    details: err.details || {},
  };

  const status = err.status || 500;
  res.status(status).json(errorPayload);
};

export default errorMiddleware;
export { errorMiddleware };
