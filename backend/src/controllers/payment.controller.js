import { sendSuccess, sendError } from "../utils/response.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/payment.service.js";
import { prisma } from "../config/database.js";

/**
 * Initialize Razorpay Payment Order on Backend.
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return sendError(res, "Order ID is required.", "MISSING_ORDER_ID", 400);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return sendError(res, "Order not found.", "NOT_FOUND", 404);
    }

    const razorpayOrder = await createRazorpayOrder(order.total, order.orderNumber);

    // Save Razorpay order ID to database
    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return sendSuccess(res, "Razorpay payment initialized.", {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dev_key",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay Payment Signature on Backend.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isTestBypass } = req.body;

    // In true offline/test mode without the SDK, the frontend sets isTestBypass
    let isValid = false;
    
    if (isTestBypass && (process.env.NODE_ENV === "development" || process.env.OFFLINE_MODE === "true" || !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("mock"))) {
      isValid = true;
    } else {
      isValid = verifyRazorpayPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
    }

    if (!isValid) {
      return sendError(res, "Payment verification failed. Invalid signature.", "INVALID_PAYMENT", 400);
    }

    // Mark order as PAID
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        razorpayPaymentId,
      },
      include: { items: true },
    });

    // Add status history record
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: "CONFIRMED",
        note: `Payment verified via Razorpay (${razorpayPaymentId}).`,
        updatedBy: "SYSTEM",
      },
    });

    return sendSuccess(res, "Payment verified successfully! Order confirmed.", { order });
  } catch (error) {
    next(error);
  }
};

/**
 * Razorpay Webhook Endpoint.
 */
export const handleWebhook = async (req, res, next) => {
  try {
    console.log("🔔 Razorpay Webhook Event Received:", req.body.event);
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
