import { Router } from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getWishlist);
router.post("/", toggleWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
