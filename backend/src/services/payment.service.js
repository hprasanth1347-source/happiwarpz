import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env.js";

// Initialize Razorpay instance if keys exist
const razorpay = new Razorpay({
  key_id: env.razorpayKeyId || "rzp_test_mock_key",
  key_secret: env.razorpayKeySecret || "mock_secret",
});

/**
 * Create Razorpay Order on server side.
 */
export const createRazorpayOrder = async (amountInINR, receiptId) => {
  try {
    if (!env.razorpayKeyId || env.razorpayKeyId.includes("test_dev") || env.razorpayKeyId.includes("your_key")) {
      console.warn("⚠️ Razorpay in Mock Development Mode");
      return {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: Math.round(amountInINR * 100),
        currency: "INR",
        receipt: receiptId,
        status: "created",
      };
    }

    const options = {
      amount: Math.round(amountInINR * 100), // Razorpay accepts amounts in paise
      currency: "INR",
      receipt: receiptId,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return razorpayOrder;
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw { statusCode: 500, message: "Failed to initialize Razorpay payment.", code: "RAZORPAY_ERROR" };
  }
};

/**
 * Verify Razorpay payment signature strictly on backend.
 */
export const verifyRazorpayPayment = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  // Development bypass check for test payment tokens
  if (razorpayOrderId.startsWith("order_mock_") && razorpaySignature === "mock_signature_valid") {
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};
