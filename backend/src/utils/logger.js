/**
 * Centralized Application Logger
 * Formats and records errors, warnings, and security events with timestamps and context.
 */

export const logger = {
  info: (message, context = {}) => {
    console.log(`ℹ️ [${new Date().toISOString()}] [INFO] ${message}`, Object.keys(context).length ? context : "");
  },

  warn: (message, context = {}) => {
    console.warn(`⚠️ [${new Date().toISOString()}] [WARN] ${message}`, Object.keys(context).length ? context : "");
  },

  error: (message, error = null, context = {}) => {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    } : error;

    console.error(`❌ [${new Date().toISOString()}] [ERROR] ${message}`, {
      ...context,
      error: errorDetails,
    });
  },

  security: (message, context = {}) => {
    console.warn(`🚨 [${new Date().toISOString()}] [SECURITY_ALERT] ${message}`, context);
  },
};
