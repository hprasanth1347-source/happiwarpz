import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "../utils/validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/", validateBody(addToCartSchema), addToCart);
router.put("/:id", validateBody(updateCartItemSchema), updateCartItem);
router.delete("/:id", removeFromCart);
router.delete("/", clearCart);

export default router;
