import rateLimit from 'express-rate-limit';

export const synastryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { error_code: 'RATE_LIMIT', message: 'Too many requests' } },
});
