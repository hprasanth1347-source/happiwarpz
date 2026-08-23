import { Router } from "express";
import {
  updateProfile,
  updatePassword,
  getLoginActivity,
  getActiveSessions,
  revokeSession,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { updateProfileSchema, changePasswordSchema } from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.put("/profile", validateBody(updateProfileSchema), updateProfile);
router.put("/password", validateBody(changePasswordSchema), updatePassword);
router.get("/login-activity", getLoginActivity);
router.get("/sessions", getActiveSessions);
router.delete("/sessions/:sessionId", revokeSession);

export default router;
