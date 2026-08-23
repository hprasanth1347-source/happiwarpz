import { sendSuccess, sendError } from "../utils/response.js";
import { authenticateGoogleUser, loginAdminUser, registerUser, loginUser } from "../services/auth.service.js";
import { setAuthCookie, clearAuthCookie } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

/**
 * 1. Customer Registration (Email / Password)
 */
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return sendError(res, "First name, last name, email, and password are required.", "MISSING_FIELDS", 400);
    }

    const { user, token } = await registerUser({ firstName, lastName, email, password, phone });
    setAuthCookie(res, token);
    return sendSuccess(res, "Account created successfully! Welcome to Happiwrapz.", { user, token }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 2. User & Admin Login (Email / Password)
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";

    if (!email || !password) {
      return sendError(res, "Email and password are required.", "MISSING_CREDENTIALS", 400);
    }

    const { user, token } = await loginUser({ email, password, ipAddress, userAgent });
    setAuthCookie(res, token);
    return sendSuccess(res, `Welcome back, ${user.name}!`, { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Customer Google OAuth Sign-In Endpoint
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, email, name, picture, googleId } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";

    const { user, token } = await authenticateGoogleUser({
      credential,
      email,
      name,
      picture,
      googleId,
      ipAddress,
      userAgent,
    });

    setAuthCookie(res, token);

    return sendSuccess(res, `Welcome back, ${user.name}! Signed in with Google.`, { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Dedicated Administrator Login Endpoint
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";

    if (!email || !password) {
      return sendError(res, "Admin email and password are required.", "MISSING_CREDENTIALS", 400);
    }

    const { user, token } = await loginAdminUser({ email, password, ipAddress, userAgent });
    setAuthCookie(res, token);

    return sendSuccess(res, "Administrator authentication successful! Welcome to the Admin Portal.", { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Get Current Authenticated User & Permissions
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "Not authenticated", "UNAUTHORIZED", 401);
    }
    return sendSuccess(res, "User profile retrieved.", { user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. User / Admin Logout
 */
export const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);
    return sendSuccess(res, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};
