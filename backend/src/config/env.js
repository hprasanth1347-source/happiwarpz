import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Secret validation check
const defaultJwtSecret = "happiwrapz_default_secret_key";
const currentJwtSecret = process.env.JWT_SECRET || defaultJwtSecret;

if (isProduction) {
  const missingSecrets = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === defaultJwtSecret) {
    missingSecrets.push("JWT_SECRET (must not use default fallback in production)");
  }
  if (!process.env.DATABASE_URL) {
    missingSecrets.push("DATABASE_URL");
  }

  if (missingSecrets.length > 0) {
    console.error("❌ CRITICAL SECURITY ERROR: Missing required production secrets:\n" + missingSecrets.map(s => `  - ${s}`).join("\n"));
    throw new Error(`Production startup aborted due to missing/insecure secrets: ${missingSecrets.join(", ")}`);
  }
}

// Export centralized environment configuration object
export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  databaseUrl: process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/happiwrapz",
  jwtSecret: currentJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "Happiwrapz <no-reply@happiwrapz.com>",

  // Rate Limiting Configurations (window in ms, max requests)
  rateLimit: {
    authWindowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || String(15 * 60 * 1000), 10),
    authMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX || "10", 10),
    publicWindowMs: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS || String(15 * 60 * 1000), 10),
    publicMax: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || "200", 10),
    userWindowMs: parseInt(process.env.RATE_LIMIT_USER_WINDOW_MS || String(15 * 60 * 1000), 10),
    userMax: parseInt(process.env.RATE_LIMIT_USER_MAX || "500", 10),
  },

  // Upload limits
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024), 10),
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
};
