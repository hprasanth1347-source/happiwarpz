import { Router } from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getOrderMessages,
  sendOrderMessage,
  getOrdersByEmail,
} from "../controllers/order.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createOrderSchema } from "../utils/validation.js";

const router = Router();

// Public route for order lookup
router.get("/lookup", getOrdersByEmail);

// Checkout supports both logged-in users and guest customers
router.post("/", optionalAuth, validateBody(createOrderSchema), placeOrder);

// Authenticated customer order management
router.get("/", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);

// Order Customer-Admin Chat Endpoints
router.get("/:id/messages", authenticate, getOrderMessages);
router.post("/:id/messages", authenticate, sendOrderMessage);

export default router;
