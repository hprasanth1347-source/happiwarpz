import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

let memoryWishlistItems = [];

/**
 * Get user wishlist items.
 */
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isHexId = /^[0-9a-fA-F]{24}$/.test(userId);

    if (isDatabaseConnected && isHexId) {
      try {
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
      } catch (e) {}
    }

    const items = memoryWishlistItems.filter((w) => w.userId === userId);
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

    if (isDatabaseConnected) {
      try {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(productId);
        const product = isHexId
          ? await prisma.product.findUnique({ where: { id: productId } })
          : await prisma.product.findUnique({ where: { slug: productId } });
        if (product) {
          const actualProductId = product.id;

          const existing = await prisma.wishlistItem.findFirst({
            where: { userId, productId: actualProductId },
          });

          if (existing) {
            await prisma.wishlistItem.delete({ where: { id: existing.id } });
            return sendSuccess(res, "Product removed from wishlist.", { inWishlist: false });
          } else {
            const item = await prisma.wishlistItem.create({
              data: { userId, productId: actualProductId },
              include: { product: true },
            });
            return sendSuccess(res, "Product added to wishlist.", { inWishlist: true, item }, 201);
          }
        }
      } catch (e) {}
    }

    // Memory Fallback
    const existingIndex = memoryWishlistItems.findIndex(
      (w) => w.userId === userId && w.productId === productId
    );

    if (existingIndex >= 0) {
      memoryWishlistItems.splice(existingIndex, 1);
      return sendSuccess(res, "Product removed from wishlist.", { inWishlist: false });
    } else {
      const item = {
        id: `wish_${Date.now()}`,
        userId,
        productId,
        product: { id: productId, name: "Handcrafted Rose Bouquet", price: 299, slug: "rose-bouquet" },
        createdAt: new Date().toISOString(),
      };
      memoryWishlistItems.unshift(item);
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
