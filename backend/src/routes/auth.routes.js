import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  adminLogin,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

// Apply auth rate limiting
router.use(authLimiter);

// 1. Email & Password Registration & Login
router.post("/register", register);
router.post("/login", login);

// 2. Google OAuth Customer Login
router.post("/google", googleAuth);

// 3. Dedicated Administrator Login
router.post("/admin-login", adminLogin);

// 4. Current User Session Check
router.get("/me", authenticate, getMe);

// 5. Logout
router.post("/logout", logout);

export default router;
