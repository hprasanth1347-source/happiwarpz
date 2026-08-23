import { Router } from "express";
import {
  submitCustomRequest,
  getCustomRequests,
  updateCustomRequestStatus,
  deleteCustomRequest,
} from "../controllers/customRequest.controller.js";
import { optionalAuth, authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { upload, validateImageSignature } from "../middleware/upload.middleware.js";

const router = Router();

// Public / Customer submit inquiry (with optional reference image upload)
router.post(
  "/",
  optionalAuth,
  upload.single("referenceImage"),
  validateImageSignature,
  submitCustomRequest
);

// Admin routes
router.get("/", authenticate, requireAdmin, getCustomRequests);
router.put("/:id", authenticate, requireAdmin, updateCustomRequestStatus);
router.delete("/:id", authenticate, requireAdmin, deleteCustomRequest);

export default router;
