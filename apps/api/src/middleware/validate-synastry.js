import { z } from 'zod';

export const synastrySchema = z.object({
  chartA: z.record(z.number().min(0).max(360)),
  chartB: z.record(z.number().min(0).max(360)),
  options: z.record(z.unknown()).optional(),
});

export function validateSynastry(req, res, next) {
  const result = synastrySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error_code: 'INVALID_INPUT',
      message: 'Invalid request body',
      request_id: req.requestId || null,
      details: result.error.issues,
    });
  }
  req.body = result.data;
  next();
}
