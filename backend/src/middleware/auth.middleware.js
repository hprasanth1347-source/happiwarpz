import { verifyToken } from "../utils/jwt.js";
import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

/**
 * Express Middleware to authenticate incoming requests via JWT Cookie or Authorization Header.
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.happiwrapz_token;

    // Fallback to Bearer token header if cookie is missing
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Authentication required. Please log in with Google or Admin.", "UNAUTHORIZED", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return sendError(res, "Invalid or expired session. Please sign in again.", "INVALID_TOKEN", 401);
    }

    let user = null;

    // If database is connected, attempt to fetch user
    if (isDatabaseConnected) {
      try {
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            role: true,
            accountStatus: true,
            profileImage: true,
            phone: true,
          },
        });
      } catch (dbErr) {
        logger.warn("Database lookup in auth middleware failed, using decoded token claims:", dbErr.message);
      }
    }

    // Fallback to decoded token claims if user was not found in DB or DB is offline
    if (!user) {
      user = {
        id: decoded.id,
        name: decoded.name || (decoded.role === "ADMIN" ? "Happiwrapz Admin" : "Customer"),
        email: decoded.email,
        role: decoded.role || "CUSTOMER",
        accountStatus: "ACTIVE",
      };
    }

    if (user.accountStatus === "SUSPENDED") {
      return sendError(res, "Your account has been suspended. Please contact support.", "ACCOUNT_SUSPENDED", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication Middleware Error:", error);
    return sendError(res, "Authentication failed.", "AUTH_ERROR", 401);
  }
};

/**
 * Optional authentication middleware that populates req.user if logged in, but does not throw errors if unauthenticated.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.happiwrapz_token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        let user = null;
        if (isDatabaseConnected) {
          try {
            user = await prisma.user.findUnique({
              where: { id: decoded.id },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                role: true,
                accountStatus: true,
              },
            });
          } catch (_) {}
        }

        if (!user) {
          user = {
            id: decoded.id,
            name: decoded.name || "Customer",
            email: decoded.email,
            role: decoded.role || "CUSTOMER",
            accountStatus: "ACTIVE",
          };
        }

        if (user.accountStatus === "ACTIVE") {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
};
