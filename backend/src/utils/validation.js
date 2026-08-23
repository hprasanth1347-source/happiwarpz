import { z } from "zod";

// Common reusable schema helpers
// Accepts either MongoDB 24-hex ObjectId, CUID, UUID, or valid identifier
export const objectIdSchema = z.string().min(1, "Identifier is required").max(100, "Identifier too long");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+]?[0-9\s-]{10,18}$/, "Invalid phone number format. Must be 10-18 digits.");

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255, "Email cannot exceed 255 characters");

/* =========================================================================
   AUTH SCHEMAS
   ========================================================================= */

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(50, "First name too long"),
    lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name too long"),
    email: emailSchema,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
    phone: phoneSchema.optional().nullable(),
  });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required").max(100),
  });

export const googleAuthSchema = z
  .object({
    credential: z.string().optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    picture: z.string().optional(),
    googleId: z.string().optional(),
  });

export const phoneOtpSchema = z
  .object({
    phone: phoneSchema,
  });

export const phoneVerifySchema = z
  .object({
    phone: phoneSchema,
    otp: z.string().trim().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain digits only"),
  });

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
  });

/* =========================================================================
   USER PROFILE SCHEMAS
   ========================================================================= */

export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
    phone: phoneSchema.optional().nullable(),
    address: z.string().trim().max(300).optional().nullable(),
    city: z.string().trim().max(100).optional().nullable(),
    state: z.string().trim().max(100).optional().nullable(),
    pincode: z.string().trim().regex(/^\d{5,8}$/, "Invalid pincode").optional().nullable(),
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(100),
  });

/* =========================================================================
   PRODUCT SCHEMAS
   ========================================================================= */

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200, "Name is too long").optional(),
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long").optional(),
    slug: z.string().optional(),
    description: z.string().trim().min(3, "Description must be at least 3 characters"),
    shortDescription: z.string().optional().nullable(),
    price: z.coerce.number().positive("Price must be greater than 0"),
    salePrice: z.coerce.number().positive().optional().nullable(),
    originalPrice: z.coerce.number().positive().optional().nullable(),
    categoryId: objectIdSchema,
    stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(10).optional(),
    sku: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    tags: z.array(z.string().trim()).optional().default([]),
    isFeatured: z.union([z.boolean(), z.string()]).optional().default(false),
    inStock: z.union([z.boolean(), z.string()]).optional().default(true),
    isActive: z.union([z.boolean(), z.string()]).optional().default(true),
    customizationAvailable: z.union([z.boolean(), z.string()]).optional().default(false),
    colorOptionAvailable: z.union([z.boolean(), z.string()]).optional().default(false),
    advanceNoticeDays: z.coerce.number().int().min(0).default(1).optional(),
    variants: z.array(z.any()).optional(),
  });

export const updateProductSchema = createProductSchema.partial();

/* =========================================================================
   CART & WISHLIST SCHEMAS
   ========================================================================= */

export const addToCartSchema = z
  .object({
    productId: objectIdSchema,
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(99, "Quantity cannot exceed 99").default(1),
    variant: z.string().optional().nullable(),
    customMessage: z.string().max(1000).optional().nullable(),
    specialInstructions: z.string().max(1000).optional().nullable(),
    selectedOptions: z.record(z.any()).optional().nullable(),
  });

export const updateCartItemSchema = z
  .object({
    quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").max(99, "Quantity cannot exceed 99"),
  });

export const wishlistToggleSchema = z
  .object({
    productId: objectIdSchema,
  });

/* =========================================================================
   ORDER & CHECKOUT SCHEMAS
   ========================================================================= */

export const addressSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required").max(100).optional(),
    phone: phoneSchema.optional(),
    street: z.string().trim().min(3, "Street address is required").max(255).optional(),
    city: z.string().trim().min(1, "City is required").max(100).optional(),
    state: z.string().trim().min(1, "State is required").max(100).optional(),
    pincode: z.string().trim().regex(/^\d{5,8}$/, "Invalid postal/zip code").optional(),
    country: z.string().trim().default("India").optional(),
  });

export const createOrderSchema = z
  .object({
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    deliveryDate: z.string().optional(),
    shippingAddress: z.union([addressSchema, z.string()]).optional(),
    paymentMethod: z.enum(["COD", "RAZORPAY", "CARD", "UPI", "NETBANKING"]).optional().default("RAZORPAY"),
    orderNotes: z.string().trim().max(500).optional(),
    items: z.array(z.any()).optional(),
    cartItems: z.array(z.any()).optional(),
  });

/* =========================================================================
   PAYMENT SCHEMAS
   ========================================================================= */

export const verifyPaymentSchema = z
  .object({
    orderId: objectIdSchema,
    razorpayOrderId: z.string().optional().nullable(),
    razorpayPaymentId: z.string().optional().nullable(),
    razorpaySignature: z.string().optional().nullable(),
    isTestBypass: z.boolean().optional().nullable(),
  });

/* =========================================================================
   CUSTOM REQUEST & REVIEW SCHEMAS
   ========================================================================= */

export const customRequestSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    phone: phoneSchema,
    email: emailSchema,
    occasion: z.string().trim().min(1, "Occasion is required").max(100),
    budget: z.coerce.number().positive("Budget must be a positive number"),
    preferredColors: z.string().trim().max(200).optional().nullable(),
    customMessage: z.string().trim().max(1000).optional().nullable(),
    description: z.string().trim().min(3, "Description must be at least 3 characters").max(2000),
    referenceImage: z.string().optional().nullable(),
  });

export const reviewSchema = z
  .object({
    productId: objectIdSchema,
    rating: z.coerce.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    comment: z.string().trim().min(2, "Comment must be at least 2 characters").max(1000, "Comment cannot exceed 1000 characters"),
  });
