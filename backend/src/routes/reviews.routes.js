import { Router } from "express";
import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { reviewSchema } from "../utils/validation.js";

const router = Router();

// Public route to view reviews
router.get("/product/:productId", getProductReviews);

// Protected routes
router.post("/", authenticate, validateBody(reviewSchema), createReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
