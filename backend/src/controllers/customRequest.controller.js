import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { customRequestSchema } from "../utils/validation.js";

let memoryCustomRequests = [];

/**
 * Submit Custom Gift Inquiry Request.
 */
export const submitCustomRequest = async (req, res, next) => {
  try {
    const raw = req.body || {};
    const name = (raw.name || raw.customerName || "").trim();
    const email = (raw.email || raw.customerEmail || "").trim();
    const phone = (raw.phone || raw.customerPhone || "").trim();
    const occasion = (raw.occasion || raw.productType || "Custom Gift").trim();
    const budget = parseFloat(raw.budget) || 1000;
    const description = (raw.description || raw.specialInstructions || raw.customMessage || "Custom Handmade Gift Request").trim();

    const validatedData = customRequestSchema.parse({
      ...raw,
      name,
      email,
      phone,
      occasion,
      budget,
      description,
      preferredColors: raw.preferredColors || null,
      customMessage: raw.customMessage || null,
    });

    const referenceImage = req.file ? `/uploads/${req.file.filename}` : req.body.referenceImage || null;
    const finalUserId = req.user?.id && /^[0-9a-fA-F]{24}$/.test(req.user.id) ? req.user.id : null;

    if (isDatabaseConnected) {
      try {
        const customRequest = await prisma.customRequest.create({
          data: {
            userId: finalUserId,
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
      } catch (dbErr) {}
    }

    const memoryReq = {
      id: `req_${Date.now()}`,
      userId: finalUserId,
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
      createdAt: new Date().toISOString(),
    };

    memoryCustomRequests.unshift(memoryReq);
    return sendSuccess(res, "Custom gift inquiry submitted successfully! We will contact you soon.", { customRequest: memoryReq }, 201);
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
