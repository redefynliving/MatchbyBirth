'use strict';

const {
  ResultServiceError,
  calculateResultWithOptionalStorage,
} = require('../api/_lib/result-service.cjs');

function createCalculateResultHandler(store, logger = console) {
  return async (req, res) => {
    try {
      const response = await calculateResultWithOptionalStorage(req.body || {}, store);
      return res.status(response.persisted ? 201 : 200).json({ ok: true, ...response });
    } catch (error) {
      const statusCode = error instanceof ResultServiceError
        ? error.statusCode
        : error.statusCode || 500;

      if (statusCode >= 500) {
        logger.error('calculate-result failed', {
          name: error.name,
          message: error.message,
        });
      }

      return res.status(statusCode).json({
        ok: false,
        error: statusCode >= 500 ? 'Unable to create result.' : error.message,
      });
    }
  };
}

module.exports = {
  createCalculateResultHandler,
};
