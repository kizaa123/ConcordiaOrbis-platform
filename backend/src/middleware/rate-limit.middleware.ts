import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

const isDev = process.env.NODE_ENV !== 'production';
const rateLimitEnabled = process.env.RATE_LIMIT === 'true';

function skipPublicOAuth(req: Request) {
  const path = (req.originalUrl || req.path || '').split('?')[0];
  return (
    path === '/api/auth/google' ||
    path === '/api/auth/google/callback' ||
    path === '/auth/google' ||
    path === '/auth/google/callback' ||
    path === '/api/payments/paystack/webhook'
  );
}

/** General API limit - disabled in local dev unless RATE_LIMIT=true */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10_000 : 500,
  skip: (req) => skipPublicOAuth(req) || (isDev && !rateLimitEnabled),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

/** Stricter limit for login/register - brute-force protection in production */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1_000 : 30,
  skip: () => isDev && !rateLimitEnabled,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please try again later.' },
});
