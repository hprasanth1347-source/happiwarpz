import { Router } from "express";
import {
  getDashboardStats,
  getCustomers,
  updateCustomerStatus,
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

// 2. Customers & Users
router.get("/customers", getCustomers);
router.get("/users", getCustomers);
router.put("/customers", updateCustomerStatus);
router.put("/customers/:id/status", updateCustomerStatus);
router.put("/users/:id/status", updateCustomerStatus);

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

// 7. Settings & Content
router.get("/settings", getAdminSettings);
router.post("/settings", saveAdminSettings);
router.get("/content", getAdminContent);
router.post("/content", saveAdminContent);

export default router;
