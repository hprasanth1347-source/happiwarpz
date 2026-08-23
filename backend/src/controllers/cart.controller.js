import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Get user cart items.
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            image: true,
            inStock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const subtotal = items.reduce((acc, item) => {
      const price = item.product.salePrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    return sendSuccess(res, "Cart fetched successfully.", { items, subtotal });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to user cart.
 */
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, variant, customMessage, specialInstructions } = req.body;

    if (!productId) {
      return sendError(res, "Product ID is required.", "MISSING_PRODUCT", 400);
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return sendError(res, "Product is not available.", "PRODUCT_UNAVAILABLE", 400);
    }

    // Check existing item in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId, variant: variant || null },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + parseInt(quantity, 10),
          ...(customMessage && { customMessage }),
          ...(specialInstructions && { specialInstructions }),
        },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: parseInt(quantity, 10),
          variant: variant || null,
          customMessage: customMessage || null,
          specialInstructions: specialInstructions || null,
        },
        include: { product: true },
      });
    }

    return sendSuccess(res, "Item added to cart.", { cartItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity.
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { id, userId } });
      return sendSuccess(res, "Item removed from cart.");
    }

    const updatedItem = await prisma.cartItem.updateMany({
      where: { id, userId },
      data: { quantity: parseInt(quantity, 10) },
    });

    return sendSuccess(res, "Cart item updated.", { updatedItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart.
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.cartItem.deleteMany({ where: { id, userId } });
    return sendSuccess(res, "Item removed from cart.");
  } catch (error) {
    next(error);
  }
};

/**
 * Clear entire user cart.
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    return sendSuccess(res, "Cart cleared successfully.");
  } catch (error) {
    next(error);
  }
};
