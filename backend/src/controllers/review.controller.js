import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { reviewSchema } from "../utils/validation.js";

/**
 * Submit product review.
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validatedData = reviewSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: validatedData.productId } });
    if (!product) {
      return sendError(res, "Product not found.", "NOT_FOUND", 404);
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { userId, productId: validatedData.productId },
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
        productId: validatedData.productId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      include: {
        user: { select: { firstName: true, name: true, profileImage: true } },
      },
    });

    return sendSuccess(res, "Review submitted successfully.", { review }, 201);
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

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { firstName: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = reviews.length;
    const averageRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;

    return sendSuccess(res, "Product reviews fetched.", { reviews, total, averageRating: parseFloat(averageRating) });
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
