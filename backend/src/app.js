import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { sendSuccess } from "./utils/response.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { publicApiLimiter, userApiLimiter } from "./middleware/rateLimiter.middleware.js";

// Import all API routes
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import customRequestsRoutes from "./routes/customRequests.routes.js";
import contentRoutes from "./routes/content.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (needed for accurate IP rate limiting behind Vercel/Nginx/Render/AWS)
app.set("trust proxy", 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Managed per route / Next.js frontend
  })
);

// CORS configuration for Frontend requests (Vercel & Local)
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        origin.includes("vercel.app") || 
        origin.includes("localhost") || 
        origin === env.frontendUrl
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middlewares with safe payload limits
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Cookie parser middleware for HTTP-only JWT cookies
app.use(cookieParser());

// Serve static uploaded files with secure no-execute headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// System Health Check Endpoint
app.get("/api/health", (req, res) => {
  return sendSuccess(res, "Happiwrapz API is running smoothly", {
    status: "healthy",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Mount Application REST API Routes with Tiered Rate Limiters
app.use("/api/auth", authRoutes); // authLimiter is mounted directly inside auth.routes.js
app.use("/api/users", userApiLimiter, usersRoutes);
app.use("/api/products", publicApiLimiter, productsRoutes);
app.use("/api/categories", publicApiLimiter, categoriesRoutes);
app.use("/api/cart", userApiLimiter, cartRoutes);
app.use("/api/wishlist", userApiLimiter, wishlistRoutes);
app.use("/api/orders", userApiLimiter, ordersRoutes);
app.use("/api/payments", userApiLimiter, paymentsRoutes);
app.use("/api/reviews", publicApiLimiter, reviewsRoutes);
app.use("/api/custom-requests", userApiLimiter, customRequestsRoutes);
app.use("/api/content", publicApiLimiter, contentRoutes);
app.use("/api/admin", adminRoutes);

// Fallback 404 for unknown endpoints
app.use(notFoundHandler);

// Production-safe Global Error Handler
app.use(errorHandler);

export default app;
