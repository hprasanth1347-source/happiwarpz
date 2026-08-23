import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/**
 * Update user profile details.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    const fullName = `${firstName || req.user.firstName} ${lastName || req.user.lastName}`.trim();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        name: fullName,
        ...(phone && { phone }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
      },
    });

    return sendSuccess(res, "Profile updated successfully.", { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password.
 */
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return sendError(res, "New password must be at least 6 characters.", "INVALID_INPUT", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.passwordHash) {
      return sendError(res, "Google authenticated accounts cannot change password directly.", "OAUTH_ACCOUNT", 400);
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, "Current password is incorrect.", "INVALID_PASSWORD", 400);
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return sendSuccess(res, "Password changed successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Get user login activity security logs.
 */
export const getLoginActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logs = await prisma.loginActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return sendSuccess(res, "Login activity retrieved.", { logs });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active user sessions.
 */
export const getActiveSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessions = await prisma.session.findMany({
      where: { userId, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, "Active sessions retrieved.", { sessions });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke specific active session.
 */
export const revokeSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    await prisma.session.updateMany({
      where: { id: sessionId, userId },
      data: { revokedAt: new Date() },
    });

    return sendSuccess(res, "Session revoked successfully.");
  } catch (error) {
    next(error);
  }
};
