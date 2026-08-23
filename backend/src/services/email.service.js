import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Create Nodemailer transport
const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPassword,
  },
});

/**
 * Send email helper function with safe fallback logging for development mode.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!env.smtpUser || env.smtpUser.includes("your_email")) {
      console.log(`✉️ [Development Email Mode] To: ${to} | Subject: ${subject}`);
      return { success: true, mode: "DEVELOPMENT_LOG" };
    }

    const info = await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject,
      text: text || "Please view this email in an HTML-compatible email client.",
      html,
    });

    console.log(`✉️ Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Welcome Email to newly registered user.
 */
export const sendWelcomeEmail = async (user) => {
  const subject = "Welcome to Happiwrapz — Handcrafted Gifts & Bouquets!";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #E86F88; font-family: Georgia, serif;">Welcome to Happiwrapz, ${user.firstName}! 🎉</h2>
      <p>Thank you for creating an account with Happiwrapz. We are delighted to have you!</p>
      <p>Explore our curated luxury handmade gifts, fresh flower arrangements, and custom hampers crafted with love for every special moment.</p>
      <div style="margin: 30px 0;">
        <a href="${env.frontendUrl}/shop" style="background-color: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Explore Collections</a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
      <p style="font-size: 12px; color: #777;">Happiwrapz — Because Moments Deserve Flowers.</p>
    </div>
  `;
  return await sendEmail({ to: user.email, subject, html });
};

/**
 * Send Order Confirmation Email.
 */
export const sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Order Confirmation #${order.orderNumber} - Happiwrapz`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #E86F88;">Order Confirmed! 💐</h2>
      <p>Hi ${user.firstName || "Customer"}, thank you for your order!</p>
      <p><strong>Order Number:</strong> #${order.orderNumber}</p>
      <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
      <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
      <h3>Order Timeline</h3>
      <p>We have received your order and our artisan team will begin preparing it shortly.</p>
      <div style="margin: 30px 0;">
        <a href="${env.frontendUrl}/account/orders/${order.id}" style="background-color: #E86F88; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Track Order Status</a>
      </div>
    </div>
  `;
  return await sendEmail({ to: user.email, subject, html });
};
