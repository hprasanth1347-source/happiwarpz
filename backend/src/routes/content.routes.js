import { Router } from "express";
import { sendSuccess } from "../utils/response.js";

const router = Router();

router.get("/banners", (req, res) => {
  return sendSuccess(res, "Store banners retrieved.", {
    announcement: "✨ Free Express Delivery on Custom Gift Hampers above ₹1500 | Use Code: HAPPI10",
    heroHeading: "Handcrafted Flowers & Bespoke Gift Wraps",
    heroSubheading: "Elevate your celebrations with custom flower bouquets and artisan gift wrappings crafted for unforgettable moments.",
  });
});

export default router;
