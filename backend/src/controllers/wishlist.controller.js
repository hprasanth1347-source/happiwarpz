import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Get user wishlist items.
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, "Wishlist fetched successfully.", { items });
  } catch (error) {
    next(error);
  }
};

/**
 * Add or toggle product in wishlist.
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return sendError(res, "Product ID is required.", "MISSING_PRODUCT", 400);
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return sendSuccess(res, "Product removed from wishlist.", { inWishlist: false });
    } else {
      const item = await prisma.wishlistItem.create({
        data: { userId, productId },
        include: { product: true },
      });
      return sendSuccess(res, "Product added to wishlist.", { inWishlist: true, item }, 201);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product from wishlist.
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return sendSuccess(res, "Product removed from wishlist.");
  } catch (error) {
    next(error);
  }
};
