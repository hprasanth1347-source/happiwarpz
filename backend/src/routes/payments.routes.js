import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { verifyPaymentSchema } from "../utils/validation.js";

const router = Router();

router.post("/create-order", optionalAuth, createPaymentOrder);
router.post("/verify", optionalAuth, validateBody(verifyPaymentSchema), verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
