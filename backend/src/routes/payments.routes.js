import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { verifyPaymentSchema } from "../utils/validation.js";

const router = Router();

router.post("/create-order", authenticate, createPaymentOrder);
router.post("/verify", authenticate, validateBody(verifyPaymentSchema), verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
