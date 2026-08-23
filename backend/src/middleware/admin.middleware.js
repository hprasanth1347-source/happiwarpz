import { sendError } from "../utils/response.js";

/**
 * Express Middleware enforcing ADMIN role permissions.
 * Must be executed AFTER authenticate middleware.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, "Authentication required.", "UNAUTHORIZED", 401);
  }

  // Strict check against user.role strictly matching "ADMIN"
  if (req.user.role !== "ADMIN") {
    return sendError(res, "Access denied. Admin permissions required.", "FORBIDDEN", 403);
  }

  next();
};
