import { Router } from "express";
import {
  getDashboardStats,
  getCustomers,
  createAdminUser,
  updateCustomerStatus,
  deleteAdminUser,
  getAllOrders,
  updateAdminOrderStatus,
  clearAllOrders,
  getAdminProducts,
  getAdminCategories,
  getAdminCustomRequests,
  updateAdminCustomRequestStatus,
  getAdminSettings,
  saveAdminSettings,
  getAdminContent,
  saveAdminContent,
  getAdminReviews,
  deleteAdminReview,
} from "../controllers/admin.controller.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Require both authentication & admin role for all admin routes
router.use(authenticate, requireAdmin);

// 1. Dashboard Metrics
router.get("/dashboard", getDashboardStats);
router.get("/metrics", getDashboardStats);

// 2. Customers & Users Management (Create, Read, Update, Delete)
router.get("/customers", getCustomers);
router.post("/customers", createAdminUser);
router.get("/users", getCustomers);
router.post("/users", createAdminUser);
router.put("/customers", updateCustomerStatus);
router.put("/customers/:id", updateCustomerStatus);
router.put("/customers/:id/status", updateCustomerStatus);
router.put("/users", updateCustomerStatus);
router.put("/users/:id", updateCustomerStatus);
router.put("/users/:id/status", updateCustomerStatus);
router.delete("/customers/:id", deleteAdminUser);
router.delete("/customers", deleteAdminUser);
router.delete("/users/:id", deleteAdminUser);
router.delete("/users", deleteAdminUser);

// 3. Orders Management
router.get("/orders", getAllOrders);
router.put("/orders", updateAdminOrderStatus);
router.put("/orders/:id", updateAdminOrderStatus);
router.delete("/orders/clear-all", clearAllOrders);

// 4. Products Management
router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.put("/products", updateProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// 5. Categories Management
router.get("/categories", getAdminCategories);
router.post("/categories", createCategory);
router.put("/categories", updateCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// 6. Custom Requests
router.get("/custom-requests", getAdminCustomRequests);
router.put("/custom-requests", updateAdminCustomRequestStatus);
router.put("/custom-requests/:id", updateAdminCustomRequestStatus);

// 7. Reviews Moderation
router.get("/reviews", getAdminReviews);
router.delete("/reviews/:id", deleteAdminReview);
router.delete("/reviews", deleteAdminReview);

// 8. Settings & Content
router.get("/settings", getAdminSettings);
router.post("/settings", saveAdminSettings);
router.put("/settings", saveAdminSettings);
router.get("/content", getAdminContent);
router.post("/content", saveAdminContent);
router.put("/content", saveAdminContent);

export default router;
