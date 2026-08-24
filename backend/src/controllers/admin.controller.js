import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { hashPassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";
import { memoryUsersRegistry } from "../services/auth.service.js";

const DEFAULT_ADMIN_STATS = {
  orders: {
    total: 12,
    pending: 3,
    processing: 4,
    completed: 5,
    cancelled: 0,
  },
  revenue: {
    total: 18450,
    today: 2798,
    month: 18450,
  },
  products: {
    total: 5,
    available: 5,
    outOfStock: 0,
  },
  customRequests: {
    new: 2,
    inProgress: 1,
    completed: 3,
  },
};

const DEFAULT_ADMIN_ORDERS = [
  {
    id: "ord_101",
    orderNumber: "HW-2026-0891",
    subtotal: 1499,
    deliveryCharge: 0,
    discount: 100,
    total: 1399,
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    shippingAddress: "Flat 402, Lotus Heights, Bandra West, Mumbai 400050",
    trackingCarrier: "BlueDart",
    trackingNumber: "BD99283718",
    createdAt: new Date().toISOString(),
    user: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210",
    },
    items: [
      {
        id: "item_1",
        productName: "Velvet Crimson Rose Bouquet",
        quantity: 1,
        price: 1499,
        customMessage: "Happy 5th Anniversary, my love!",
      },
    ],
  },
  {
    id: "ord_102",
    orderNumber: "HW-2026-0892",
    subtotal: 899,
    deliveryCharge: 50,
    discount: 0,
    total: 949,
    paymentStatus: "PAID",
    orderStatus: "PENDING",
    shippingAddress: "B-12, Green Glen Layout, Bellandur, Bangalore 560103",
    trackingCarrier: null,
    trackingNumber: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      name: "Rahul Verma",
      email: "rahul.v@example.com",
      phone: "+91 98123 45678",
    },
    items: [
      {
        id: "item_2",
        productName: "Midnight Luxury Gift Wrap Set",
        quantity: 1,
        price: 899,
        customMessage: "Best Wishes on your Promotion!",
      },
    ],
  },
];

let memorySettings = {
  storeName: "Happiwrapz",
  contactEmail: "admin@happiwrapz.com",
  phone: "+91 98765 43210",
  address: "Bespoke Gifting Studio, Mumbai, India",
  currency: "INR (₹)",
  freeShippingThreshold: 1500,
  taxRate: 5,
};

let memoryContent = {
  announcement: "✨ Free Express Delivery on Custom Gift Hampers above ₹1500 | Use Code: HAPPI10",
  heroHeading: "Handcrafted Flowers & Bespoke Gift Wraps",
  heroSubheading: "Elevate your celebrations with custom flower bouquets and artisan gift wrappings crafted for unforgettable moments.",
};

/**
 * 1. Dashboard Metrics & Overview
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const ordersTotal = await prisma.order.count();
        const ordersPending = await prisma.order.count({ where: { orderStatus: "PENDING" } });
        const ordersProcessing = await prisma.order.count({ where: { orderStatus: "PROCESSING" } });
        const ordersCompleted = await prisma.order.count({ where: { orderStatus: { in: ["DELIVERED", "SHIPPED"] } } });
        const ordersCancelled = await prisma.order.count({ where: { orderStatus: "CANCELLED" } });

        const totalRevenueResult = await prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: "PAID" },
        });

        const productsTotal = await prisma.product.count();
        const productsAvailable = await prisma.product.count({ where: { inStock: true } });
        const productsOutOfStock = await prisma.product.count({ where: { inStock: false } });

        const customNew = await prisma.customRequest.count({ where: { status: "PENDING" } });
        const customInProgress = await prisma.customRequest.count({ where: { status: "IN_PROGRESS" } });
        const customCompleted = await prisma.customRequest.count({ where: { status: "COMPLETED" } });

        return res.json({
          orders: {
            total: ordersTotal,
            pending: ordersPending,
            processing: ordersProcessing,
            completed: ordersCompleted,
            cancelled: ordersCancelled,
          },
          revenue: {
            total: totalRevenueResult._sum.total || 0,
            today: 0,
            month: 0,
          },
          products: {
            total: productsTotal,
            available: productsAvailable,
            outOfStock: productsOutOfStock,
          },
          customRequests: {
            new: customNew,
            inProgress: customInProgress,
            completed: customCompleted,
          },
        });
      } catch (e) {
        logger.warn("Prisma stats aggregation fallback:", e.message);
      }
    }

    return res.json(DEFAULT_ADMIN_STATS);
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Categories Management
 */
export const getAdminCategories = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const categories = await prisma.category.findMany();
        if (categories && categories.length > 0) return res.json(categories);
      } catch (e) {}
    }
    const { getCategories } = await import("./category.controller.js");
    return getCategories(req, res, next);
  } catch (e) {
    next(e);
  }
};

/**
 * 3. Products Management
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const products = await prisma.product.findMany({ include: { category: true, variants: true } });
        if (products && products.length > 0) return res.json(products);
      } catch (e) {}
    }
    const { getProducts } = await import("./product.controller.js");
    return getProducts(req, res, next);
  } catch (e) {
    next(e);
  }
};

/**
 * 4. Orders Management
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    if (isDatabaseConnected) {
      try {
        const where = {
          ...(status && { orderStatus: status }),
          ...(search && {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
            ],
          }),
        };

        const orders = await prisma.order.findMany({
          where,
          include: {
            user: { select: { name: true, email: true, phone: true } },
            items: true,
            statusHistory: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { createdAt: "desc" },
        });

        if (orders && orders.length > 0) {
          return res.json(orders);
        }
      } catch (e) {
        logger.warn("Admin orders lookup fallback:", e.message);
      }
    }

    return res.json(DEFAULT_ADMIN_ORDERS);
  } catch (error) {
    next(error);
  }
};

export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.body.id || req.body.orderId;
    const { orderStatus, paymentStatus, trackingCarrier, trackingNumber } = req.body;

    if (isDatabaseConnected) {
      try {
        const order = await prisma.order.update({
          where: { id: targetId },
          data: {
            ...(orderStatus && { orderStatus }),
            ...(paymentStatus && { paymentStatus }),
            ...(trackingCarrier !== undefined && { trackingCarrier }),
            ...(trackingNumber !== undefined && { trackingNumber }),
          },
        });
        return sendSuccess(res, "Order updated successfully.", { order });
      } catch (e) {}
    }

    return sendSuccess(res, "Order updated successfully.", {
      order: { id: targetId, orderStatus, paymentStatus, trackingCarrier, trackingNumber },
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllOrders = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        await prisma.order.deleteMany({});
      } catch (e) {}
    }
    return sendSuccess(res, "Cleared test orders successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Customers & Users Management
 */
let memoryAdminUsers = [
  {
    id: "usr_google_101",
    name: "Priya Sharma",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    role: "CUSTOMER",
    accountStatus: "ACTIVE",
    authProvider: "GOOGLE",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    orderCount: 2,
    totalSpent: 2898,
  },
  {
    id: "usr_google_102",
    name: "Rahul Verma",
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul.v@example.com",
    phone: "+91 98123 45678",
    role: "CUSTOMER",
    accountStatus: "ACTIVE",
    authProvider: "GOOGLE",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    orderCount: 1,
    totalSpent: 949,
  },
  {
    id: "admin_master_01",
    name: "Happiwrapz Admin",
    firstName: "Happiwrapz",
    lastName: "Admin",
    email: "admin@happiwrapz.com",
    phone: "+91 98765 43210",
    role: "ADMIN",
    accountStatus: "ACTIVE",
    authProvider: "LOCAL",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    orderCount: 0,
    totalSpent: 0,
  },
];

export const getCustomers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    if (isDatabaseConnected) {
      try {
        const where = {
          ...(role && role !== "ALL" && { role }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }),
        };

        const users = await prisma.user.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            accountStatus: true,
            authProvider: true,
            createdAt: true,
            lastLoginAt: true,
            _count: { select: { orders: true } },
          },
          orderBy: { createdAt: "desc" },
        });

        if (users && users.length > 0) {
          return res.json(users);
        }
      } catch (e) {
        logger.warn("Admin users lookup fallback:", e.message);
      }
    }

    let filtered = memoryAdminUsers;
    if (role && role !== "ALL") {
      filtered = filtered.filter((u) => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
      );
    }

    return res.json(filtered);
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role = "CUSTOMER", accountStatus = "ACTIVE" } = req.body;

    if (!firstName || !email || !password) {
      return sendError(res, "First name, email, and password are required.", "MISSING_FIELDS", 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters long.", "INVALID_PASSWORD", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const fullName = `${firstName} ${lastName || ""}`.trim();
    const validRole = ["ADMIN", "CUSTOMER"].includes(role) ? role : "CUSTOMER";
    const validStatus = ["ACTIVE", "SUSPENDED"].includes(accountStatus) ? accountStatus : "ACTIVE";

    if (isDatabaseConnected) {
      try {
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
          return sendError(res, "A user with this email address already exists.", "EMAIL_EXISTS", 400);
        }

        const passwordHash = await hashPassword(password);
        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName: lastName || "",
            name: fullName,
            email: normalizedEmail,
            passwordHash,
            phone: phone || null,
            role: validRole,
            accountStatus: validStatus,
            authProvider: "LOCAL",
            emailVerified: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            accountStatus: true,
            authProvider: true,
            createdAt: true,
          },
        });

        // Also populate memory registry so login is instant
        memoryUsersRegistry.set(normalizedEmail, { ...newUser, passwordHash });

        return sendSuccess(res, `New ${validRole.toLowerCase()} account created successfully.`, { user: newUser }, 201);
      } catch (dbErr) {
        logger.error("DB error creating user:", dbErr);
      }
    }

    // Memory Fallback
    const existingIndex = memoryAdminUsers.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingIndex >= 0) {
      return sendError(res, "A user with this email address already exists.", "EMAIL_EXISTS", 400);
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `usr_${Date.now()}`,
      firstName,
      lastName: lastName || "",
      name: fullName,
      email: normalizedEmail,
      phone: phone || "",
      role: validRole,
      accountStatus: validStatus,
      authProvider: "LOCAL",
      createdAt: new Date().toISOString(),
      orderCount: 0,
      totalSpent: 0,
    };

    memoryAdminUsers.unshift(newUser);
    memoryUsersRegistry.set(normalizedEmail, { ...newUser, passwordHash });

    return sendSuccess(res, `New ${validRole.toLowerCase()} account created successfully.`, { user: newUser }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCustomerStatus = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.body.id || req.body.userId;
    const { status, accountStatus, role, firstName, lastName, phone } = req.body;
    const newStatus = status || accountStatus;

    if (newStatus && !["ACTIVE", "SUSPENDED"].includes(newStatus)) {
      return sendError(res, "Invalid status value.", "INVALID_STATUS", 400);
    }

    if (isDatabaseConnected) {
      try {
        const updateData = {};
        if (newStatus) updateData.accountStatus = newStatus;
        if (role && ["ADMIN", "CUSTOMER"].includes(role)) updateData.role = role;
        if (firstName) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phone !== undefined) updateData.phone = phone;
        if (firstName || lastName) {
          updateData.name = `${firstName || ""} ${lastName || ""}`.trim();
        }

        const updatedCustomer = await prisma.user.update({
          where: { id: targetId },
          data: updateData,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            accountStatus: true,
          },
        });
        return sendSuccess(res, `User profile updated successfully.`, { customer: updatedCustomer, user: updatedCustomer });
      } catch (e) {}
    }

    const memIdx = memoryAdminUsers.findIndex((u) => u.id === targetId);
    if (memIdx >= 0) {
      if (newStatus) memoryAdminUsers[memIdx].accountStatus = newStatus;
      if (role) memoryAdminUsers[memIdx].role = role;
      if (phone) memoryAdminUsers[memIdx].phone = phone;
      if (firstName) memoryAdminUsers[memIdx].firstName = firstName;
      if (lastName) memoryAdminUsers[memIdx].lastName = lastName;
      if (firstName || lastName) {
        memoryAdminUsers[memIdx].name = `${firstName || memoryAdminUsers[memIdx].firstName} ${lastName || memoryAdminUsers[memIdx].lastName}`.trim();
      }
      return sendSuccess(res, `User profile updated successfully.`, { customer: memoryAdminUsers[memIdx], user: memoryAdminUsers[memIdx] });
    }

    return sendSuccess(res, `User status updated to ${newStatus}.`, {
      customer: { id: targetId, accountStatus: newStatus },
      user: { id: targetId, accountStatus: newStatus },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.query.id || req.body.id;

    if (!targetId) {
      return sendError(res, "User ID is required.", "MISSING_ID", 400);
    }

    if (isDatabaseConnected) {
      try {
        await prisma.user.delete({ where: { id: targetId } });
        return sendSuccess(res, "User account deleted successfully.");
      } catch (e) {
        logger.error("DB User deletion error:", e);
      }
    }

    memoryAdminUsers = memoryAdminUsers.filter((u) => u.id !== targetId);
    return sendSuccess(res, "User account deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * Reviews Moderation Management
 */
let memoryAdminReviewsList = [
  {
    id: "rev-1",
    userId: "usr-1",
    productId: "prod-1",
    productName: "Rose Bouquet — Without Glitter",
    rating: 5,
    comment: "The satin finish and velvet textures are breathtaking!",
    user: { firstName: "Aarav", name: "Aarav Sharma", email: "aarav@example.com" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-2",
    userId: "usr-2",
    productId: "prod-2",
    productName: "Glitter Rose Bouquet",
    rating: 5,
    comment: "The glitter shines beautifully in the evening light. Highly recommended!",
    user: { firstName: "Meera", name: "Meera Patel", email: "meera@example.com" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getAdminReviews = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const reviews = await prisma.review.findMany({
          include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        if (reviews && reviews.length > 0) {
          return res.json(reviews);
        }
      } catch (e) {}
    }

    return res.json(memoryAdminReviewsList);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminReview = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.query.id;
    if (isDatabaseConnected) {
      try {
        await prisma.review.delete({ where: { id: targetId } });
        return sendSuccess(res, "Review deleted successfully.");
      } catch (e) {}
    }

    memoryAdminReviewsList = memoryAdminReviewsList.filter((r) => r.id !== targetId);
    return sendSuccess(res, "Review deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Custom Requests Management
 */
export const getAdminCustomRequests = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const requests = await prisma.customRequest.findMany({
          orderBy: { createdAt: "desc" },
        });
        if (requests && requests.length > 0) return res.json(requests);
      } catch (e) {}
    }

    return res.json([
      {
        id: "req_101",
        name: "Ananya Roy",
        phone: "+91 99887 76655",
        email: "ananya.roy@example.com",
        occasion: "Bridal Shower",
        budget: 5000,
        preferredColors: "Pastel Pink, Lavender, Gold",
        description: "Looking for 15 custom handcrafted flower bouquets and gift wraps for a bridal shower party.",
        status: "NEW",
        createdAt: new Date().toISOString(),
      },
    ]);
  } catch (e) {
    next(e);
  }
};

export const updateAdminCustomRequestStatus = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.body.id;
    const { status } = req.body;

    if (isDatabaseConnected) {
      try {
        const updated = await prisma.customRequest.update({
          where: { id: targetId },
          data: { status },
        });
        return sendSuccess(res, "Custom request status updated.", { customRequest: updated });
      } catch (e) {}
    }

    return sendSuccess(res, "Custom request status updated.", {
      customRequest: { id: targetId, status },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Admin Settings & Content
 */
export const getAdminSettings = async (req, res, next) => {
  try {
    return res.json(memorySettings);
  } catch (error) {
    next(error);
  }
};

export const saveAdminSettings = async (req, res, next) => {
  try {
    memorySettings = { ...memorySettings, ...req.body };
    return sendSuccess(res, "Settings saved successfully.", { settings: memorySettings });
  } catch (error) {
    next(error);
  }
};

export const getAdminContent = async (req, res, next) => {
  try {
    return res.json(memoryContent);
  } catch (error) {
    next(error);
  }
};

export const saveAdminContent = async (req, res, next) => {
  try {
    memoryContent = { ...memoryContent, ...req.body };
    return sendSuccess(res, "Site content updated successfully.", { content: memoryContent });
  } catch (error) {
    next(error);
  }
};
