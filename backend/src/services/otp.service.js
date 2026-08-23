import { prisma } from "../config/database.js";
import { generateToken } from "../utils/jwt.js";

// In-memory OTP storage for development mode
const otpStore = new Map();

/**
 * Send Phone OTP (development mock mode returns default 123456 or logs to console).
 */
export const sendPhoneOtp = async (phone) => {
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    throw { statusCode: 400, message: "Invalid 10-digit mobile phone number.", code: "INVALID_PHONE" };
  }

  const otp = process.env.NODE_ENV === "development" ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  console.log(`📱 [OTP Service] Sent OTP ${otp} to phone ${cleanPhone}`);

  return {
    success: true,
    message: "OTP sent successfully via SMS.",
    phone: cleanPhone,
    // Development convenience notice
    ...(process.env.NODE_ENV === "development" && { devNote: "Development mode OTP is 123456" }),
  };
};

/**
 * Verify OTP and login/register phone user.
 */
export const verifyPhoneOtp = async (phone, otp) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const record = otpStore.get(cleanPhone);

  // Accept test OTP 123456 in development
  const isValid = (record && record.otp === otp && Date.now() < record.expiresAt) || (process.env.NODE_ENV === "development" && otp === "123456");

  if (!isValid) {
    throw { statusCode: 400, message: "Invalid or expired OTP code.", code: "INVALID_OTP" };
  }

  // Clear used OTP
  otpStore.delete(cleanPhone);

  let user = await prisma.user.findFirst({ where: { phone: cleanPhone } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: "Phone",
        lastName: "User",
        name: `User ${cleanPhone.slice(-4)}`,
        email: `phone_${cleanPhone}@happiwrapz.local`,
        phone: cleanPhone,
        phoneVerified: true,
        authProvider: "PHONE",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, lastLoginAt: new Date() },
    });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};
