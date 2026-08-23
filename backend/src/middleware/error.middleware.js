import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { selfHealingGuardian } from "../services/selfHealingGuardian.service.js";

/**
 * Production-Safe Global Error Handler
 * Ensures no stack traces, raw SQL queries, Prisma internals, or filesystem paths are leaked to the client.
 */
export const errorHandler = (err, req, res, next) => {
  // Capture in Self-Healing Guardian Registry & trigger automatic recovery if applicable
  selfHealingGuardian.captureAndHeal(err, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Always log complete error details server-side for backend debugging & observability
  logger.error(`[API Error] ${req.method} ${req.originalUrl}: ${err.message}`, err, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  let statusCode = err.statusCode || 500;
  let errorCode = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected error occurred. Please try again.";

  // Handle Multer upload errors
  if (err.name === "MulterError") {
    statusCode = 400;
    errorCode = "UPLOAD_ERROR";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds the permitted limit (maximum 5MB).";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded at once.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field in upload request.";
    }
  }

  // Handle JSON parsing syntax errors (malformed request body)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    errorCode = "INVALID_JSON";
    message = "Malformed JSON payload in request body.";
  }

  // Handle Prisma Known Request Errors
  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      // Unique constraint violation (e.g. duplicate email)
      statusCode = 409;
      errorCode = "DUPLICATE_RESOURCE";
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field";
      message = `An entry with this ${target} already exists.`;
    } else if (err.code === "P2025") {
      // Record not found
      statusCode = 404;
      errorCode = "NOT_FOUND";
      message = "Requested record was not found.";
    } else {
      statusCode = 400;
      errorCode = "DATABASE_ERROR";
      message = "A database operation failed.";
    }
  }

  // Handle Prisma Validation Errors
  if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    errorCode = "DATA_VALIDATION_ERROR";
    message = "Invalid data format provided for database operation.";
  }

  // Handle MongoDB / BSON Cast Errors
  if (err.name === "BSONError" || err.message?.includes("Argument passed in must be a single String of 12 bytes")) {
    statusCode = 400;
    errorCode = "INVALID_ID";
    message = "Invalid resource identifier format.";
  }

  // Handle Zod Validation Errors if passed to next()
  if (err.name === "ZodError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = err.errors?.[0]?.message || "Validation failed.";
  }

  // In production, ensure no unhandled internal server error leaks technical details
  if (env.isProduction && statusCode === 500) {
    message = "An unexpected error occurred on the server. Please try again later.";
    errorCode = "INTERNAL_SERVER_ERROR";
  }

  return res.status(statusCode).json({
    success: false,
    error: errorCode,
    message,
    ...(env.nodeEnv === "development" && {
      debug: {
        rawMessage: err.message,
        stack: err.stack,
      },
    }),
  });
};

/**
 * 404 Route Not Found Middleware.
 */
export const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    error: "NOT_FOUND",
    message: `Endpoint not found - ${req.method} ${req.originalUrl}`,
  });
};
