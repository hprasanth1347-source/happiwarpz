import { prisma } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { customRequestSchema } from "../utils/validation.js";

/**
 * Submit Custom Gift Inquiry Request.
 */
export const submitCustomRequest = async (req, res, next) => {
  try {
    const validatedData = customRequestSchema.parse({
      ...req.body,
      budget: parseFloat(req.body.budget),
    });

    const referenceImage = req.file ? `/uploads/${req.file.filename}` : req.body.referenceImage || null;

    const customRequest = await prisma.customRequest.create({
      data: {
        userId: req.user ? req.user.id : null,
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email,
        occasion: validatedData.occasion,
        budget: validatedData.budget,
        preferredColors: validatedData.preferredColors || null,
        customMessage: validatedData.customMessage || null,
        description: validatedData.description,
        referenceImage,
        status: "PENDING",
      },
    });

    return sendSuccess(res, "Custom gift inquiry submitted successfully! We will contact you soon.", { customRequest }, 201);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, error.errors[0].message, "VALIDATION_ERROR", 400);
    }
    next(error);
  }
};

/**
 * Admin: Get list of all custom gift inquiries.
 */
export const getCustomRequests = async (req, res, next) => {
  try {
    const requests = await prisma.customRequest.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, "Custom gift requests retrieved.", { requests });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update custom gift request status & admin notes.
 */
export const updateCustomRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await prisma.customRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    return sendSuccess(res, "Custom request updated successfully.", { customRequest: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete custom request.
 */
export const deleteCustomRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.customRequest.delete({ where: { id } });
    return sendSuccess(res, "Custom request deleted.");
  } catch (error) {
    next(error);
  }
};
