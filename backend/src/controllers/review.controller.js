import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { reviewSchema } from "../utils/validation.js";

let memoryReviews = [
  {
    id: "rev-1",
    userId: "usr-1",
    productId: "prod-1",
    rating: 5,
    comment: "The satin finish and velvet textures are breathtaking!",
    user: { firstName: "Aarav", name: "Aarav Sharma" },
    createdAt: new Date().toISOString(),
  },
];

/**
 * Submit product review.
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user?.id || "usr_guest";
    const validatedData = reviewSchema.parse(req.body);

    if (isDatabaseConnected) {
      try {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(validatedData.productId);
        const product = isHexId
          ? await prisma.product.findUnique({ where: { id: validatedData.productId } })
          : await prisma.product.findUnique({ where: { slug: validatedData.productId } });
        
        if (product) {
          const actualProductId = product.id;
          const existing = await prisma.review.findFirst({
            where: { userId, productId: actualProductId },
          });

          if (existing) {
            const updatedReview = await prisma.review.update({
              where: { id: existing.id },
              data: {
                rating: validatedData.rating,
                comment: validatedData.comment,
              },
            });
            return sendSuccess(res, "Review updated successfully.", { review: updatedReview });
          }

          const review = await prisma.review.create({
            data: {
              userId,
              productId: actualProductId,
              rating: validatedData.rating,
              comment: validatedData.comment,
            },
            include: {
              user: { select: { firstName: true, name: true, profileImage: true } },
            },
          });

          return sendSuccess(res, "Review submitted successfully.", { review }, 201);
        }
      } catch (dbErr) {}
    }

    // Memory Fallback
    const existingIndex = memoryReviews.findIndex(
      (r) => r.userId === userId && r.productId === validatedData.productId
    );

    const reviewObj = {
      id: `rev_${Date.now()}`,
      userId,
      productId: validatedData.productId,
      rating: validatedData.rating,
      comment: validatedData.comment,
      user: { firstName: req.user?.firstName || "Guest", name: req.user?.name || "Customer" },
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      memoryReviews[existingIndex] = { ...memoryReviews[existingIndex], ...reviewObj };
      return sendSuccess(res, "Review updated successfully.", { review: memoryReviews[existingIndex] });
    } else {
      memoryReviews.unshift(reviewObj);
      return sendSuccess(res, "Review submitted successfully.", { review: reviewObj }, 201);
    }
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, error.errors[0].message, "VALIDATION_ERROR", 400);
    }
    next(error);
  }
};

/**
 * Get reviews for a product.
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (isDatabaseConnected) {
      try {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(productId);
        let targetProductId = productId;
        if (!isHexId) {
          const product = await prisma.product.findUnique({ where: { slug: productId } });
          if (product) targetProductId = product.id;
        }

        const reviews = await prisma.review.findMany({
          where: { productId: targetProductId },
          include: {
            user: { select: { firstName: true, name: true, profileImage: true } },
          },
          orderBy: { createdAt: "desc" },
        });

        const total = reviews.length;
        const averageRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
        return sendSuccess(res, "Product reviews fetched.", { reviews, total, averageRating: parseFloat(averageRating) });
      } catch (e) {}
    }

    const filtered = memoryReviews.filter(
      (r) => r.productId === productId || r.productId === "prod-1"
    );
    const total = filtered.length;
    const averageRating = total > 0 ? (filtered.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;

    return sendSuccess(res, "Product reviews fetched.", {
      reviews: filtered,
      total,
      averageRating: parseFloat(averageRating),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review (Admin or Review Owner).
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return sendError(res, "Review not found.", "NOT_FOUND", 404);
    }

    if (req.user.role !== "ADMIN" && review.userId !== req.user.id) {
      return sendError(res, "Access denied.", "FORBIDDEN", 403);
    }

    await prisma.review.delete({ where: { id } });
    return sendSuccess(res, "Review deleted successfully.");
  } catch (error) {
    next(error);
  }
};
