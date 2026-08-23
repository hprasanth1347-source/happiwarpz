import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { logger } from "./utils/logger.js";

// Process Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  logger.error("FATAL UNCAUGHT EXCEPTION — Process may be in an unstable state:", err);
  if (env.isProduction) {
    process.exit(1);
  }
});

// Process Unhandled Promise Rejection Handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("FATAL UNHANDLED PROMISE REJECTION:", reason);
});

const startServer = async () => {
  const server = app.listen(env.port, () => {
    logger.info(`Happiwrapz Express Server listening on port ${env.port} (${env.nodeEnv})`);
    console.log(`
✨ ===================================================
   Happiwrapz Express REST API Server Started!
   URL: ${env.backendUrl}
   Environment: ${env.nodeEnv}
   Health Check: ${env.backendUrl}/api/health
=================================================== ✨
    `);
  });

  // Graceful Shutdown on termination signals
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });

    // Force close after 10s if connections hang
    setTimeout(() => {
      logger.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Connect to database (Prisma MongoDB) in background
  connectDB().catch((err) => {
    logger.error("Failed to connect to MongoDB Database:", err);
  });
};

startServer();
