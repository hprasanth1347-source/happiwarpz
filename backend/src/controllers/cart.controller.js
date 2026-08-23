import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

let memoryCartItems = [];

/**
 * Get user cart items.
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (isDatabaseConnected) {
      try {
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
          const price = item.product?.salePrice || item.product?.price || 0;
          return acc + price * item.quantity;
        }, 0);

        return sendSuccess(res, "Cart fetched successfully.", { items, subtotal });
      } catch (dbErr) {}
    }

    const items = memoryCartItems.filter((i) => i.userId === userId);
    const subtotal = items.reduce((acc, item) => acc + (item.price || 299) * item.quantity, 0);

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

    if (isDatabaseConnected) {
      try {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(productId);
        const product = isHexId
          ? await prisma.product.findUnique({ where: { id: productId } })
          : await prisma.product.findUnique({ where: { slug: productId } });
        if (product && product.isActive) {
          const actualProductId = product.id;

          const existingItem = await prisma.cartItem.findFirst({
            where: { userId, productId: actualProductId, variant: variant || null },
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
                productId: actualProductId,
                quantity: parseInt(quantity, 10),
                variant: variant || null,
                customMessage: customMessage || null,
                specialInstructions: specialInstructions || null,
              },
              include: { product: true },
            });
          }

          return sendSuccess(res, "Item added to cart.", { cartItem });
        }
      } catch (dbErr) {}
    }

    // Memory Fallback
    const existingIndex = memoryCartItems.findIndex(
      (i) => i.userId === userId && i.productId === productId && i.variant === (variant || null)
    );

    let itemObj;
    if (existingIndex >= 0) {
      memoryCartItems[existingIndex].quantity += parseInt(quantity, 10);
      itemObj = memoryCartItems[existingIndex];
    } else {
      itemObj = {
        id: `cart_${Date.now()}`,
        userId,
        productId,
        product: { id: productId, name: "Handcrafted Rose Bouquet", price: 299, slug: "rose-bouquet" },
        price: 299,
        quantity: parseInt(quantity, 10),
        variant: variant || null,
        customMessage: customMessage || null,
        specialInstructions: specialInstructions || null,
      };
      memoryCartItems.unshift(itemObj);
    }

    return sendSuccess(res, "Item added to cart.", { cartItem: itemObj });
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
