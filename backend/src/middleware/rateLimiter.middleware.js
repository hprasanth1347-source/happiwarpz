import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/**
 * Custom handler to return standardized JSON error when rate limited
 */
const rateLimitHandler = (message, errorCode = "RATE_LIMITED") => (req, res) => {
  return res.status(429).json({
    success: false,
    error: errorCode,
    message: message || "Too many requests. Please try again later.",
    retryAfter: res.getHeader("Retry-After") || 60,
  });
};

/**
 * 1. Strict Authentication Rate Limiter (Login, Register, OTP, Password Reset)
 * Protects against brute-force attacks and credential stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: env.rateLimit.authWindowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    // Combine IP + optional account identifier (email/phone) for fine-grained per-account tracking
    const identifier = req.body?.email || req.body?.phone || "";
    const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    return `${ip}_${identifier}`.toLowerCase();
  },
  handler: rateLimitHandler(
    "Too many authentication attempts for this account/IP. Please wait before trying again.",
    "AUTH_RATE_LIMITED"
  ),
});

/**
 * 2. Password Reset Rate Limiter
 * Stricter threshold specifically for password reset / forgot password requests.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // max 5 reset requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many password reset requests. Please wait an hour before attempting again.",
    "PASSWORD_RESET_RATE_LIMITED"
  ),
});

/**
 * 3. Public Endpoints Rate Limiter (Product catalog, reviews list, categories)
 * Prevents automated scraping and denial-of-service on unauthenticated endpoints.
 */
export const publicApiLimiter = rateLimit({
  windowMs: env.rateLimit.publicWindowMs,
  max: env.rateLimit.publicMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many requests to public endpoints. Please slow down.",
    "PUBLIC_RATE_LIMITED"
  ),
});

/**
 * 4. Authenticated User Action Rate Limiter (Cart modifications, orders, reviews submission)
 * Allows normal customer interaction while preventing automated bot spam.
 */
export const userApiLimiter = rateLimit({
  windowMs: env.rateLimit.userWindowMs,
  max: env.rateLimit.userMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  },
  handler: rateLimitHandler(
    "Too many user actions performed in a short time. Please slow down.",
    "USER_RATE_LIMITED"
  ),
});
