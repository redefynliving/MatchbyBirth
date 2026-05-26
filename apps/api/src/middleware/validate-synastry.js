import Joi from 'joi';

export const synastrySchema = Joi.object({
  chartA: Joi.object().pattern(Joi.string(), Joi.number().min(0).max(360)).required(),
  chartB: Joi.object().pattern(Joi.string(), Joi.number().min(0).max(360)).required(),
  options: Joi.object().optional(),
});

export function validateSynastry(req, res, next) {
  const { error } = synastrySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error_code: 'INVALID_INPUT',
      message: 'Invalid request body',
      request_id: req.requestId || null,
      details: error.details,
    });
  }
  next();
}
