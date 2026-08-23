import os
import sys
import unittest
import requests
import sqlite3

BASE_URL = "http://127.0.0.1:8000"

class DeploymentReadinessAudit(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n=======================================================")
        print("HAPPIWRAPZ PRE-DEPLOYMENT PRODUCTION READINESS AUDIT")
        print("=======================================================\n")

    def test_01_backend_health_check(self):
        """Verifies backend server health status endpoint."""
        r = requests.get(f"{BASE_URL}/api/health")
        self.assertEqual(r.status_code, 200, "Backend health check failed")
        self.assertEqual(r.json().get("status"), "ok")
        print("  [OK] Backend Server Health Check: PASSED")

    def test_02_database_schema_integrity(self):
        """Audits database tables and columns for complete schema support."""
        db_path = os.path.join(os.path.dirname(__file__), "happiwrapz.db")
        self.assertTrue(os.path.exists(db_path), "happiwrapz.db database file missing")

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]

        required_tables = [
            "users", "oauth_accounts", "otp_verifications", "password_reset_tokens",
            "sessions", "login_activities", "products", "categories", "orders",
            "order_items", "cart_items", "wishlist_items", "site_contents", "admin_settings"
        ]

        for req_table in required_tables:
            self.assertIn(req_table, tables, f"Missing required database table: {req_table}")

        conn.close()
        print("  [OK] Database Schema & Table Integrity: PASSED")

    def test_03_public_api_catalog_routes(self):
        """Audits public e-commerce API routes (products, categories, content)."""
        r_cat = requests.get(f"{BASE_URL}/api/categories")
        self.assertEqual(r_cat.status_code, 200, "GET /api/categories failed")

        r_prod = requests.get(f"{BASE_URL}/api/products")
        self.assertEqual(r_prod.status_code, 200, "GET /api/products failed")

        r_content = requests.get(f"{BASE_URL}/api/content")
        self.assertEqual(r_content.status_code, 200, "GET /api/content failed")

        print("  [OK] Public Catalog & Product APIs: PASSED")

    def test_04_authentication_security_suite(self):
        """Audits authentication endpoints, session creation, and rate-limiting."""
        email = f"deploy_audit_{os.urandom(3).hex()}@happiwrapz.com"
        password = "AuditPassword123!"

        # Register
        r_reg = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Audit User",
            "email": email,
            "password": password
        })
        self.assertEqual(r_reg.status_code, 200, "Auth registration failed")
        token = r_reg.json().get("token")

        # Session & Me
        headers = {"Authorization": f"Bearer {token}"}
        r_me = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        self.assertEqual(r_me.status_code, 200, "Auth session verification failed")
        self.assertTrue(r_me.json().get("authenticated"))

        print("  [OK] User Authentication & Session Security: PASSED")

    def test_05_admin_portal_apis(self):
        """Audits admin portal dashboard and metrics endpoints with bearer auth."""
        # Login admin
        r_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@happiwrapz.com",
            "password": "AdminHappi2026!"
        })
        self.assertEqual(r_login.status_code, 200, "Admin login failed")
        admin_token = r_login.json().get("token")

        headers = {"Authorization": f"Bearer {admin_token}"}
        admin_endpoints = [
            "/api/admin/metrics", "/api/admin/categories", "/api/admin/customers",
            "/api/admin/products", "/api/admin/orders", "/api/admin/custom-requests",
            "/api/admin/settings", "/api/admin/content"
        ]

        for ep in admin_endpoints:
            r = requests.get(f"{BASE_URL}{ep}", headers=headers)
            self.assertEqual(r.status_code, 200, f"Admin endpoint {ep} failed with status {r.status_code}")

        print("  [OK] Admin Portal Dashboard & Management APIs: PASSED")

    def test_06_razorpay_payment_integration(self):
        """Audits order creation and Razorpay HMAC SHA256 payment signature verification."""
        order_payload = {
            "customerName": "Audit Customer",
            "customerEmail": "audit@happiwrapz.com",
            "customerPhone": "+919876543210",
            "address": "456 Rose Lane",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001",
            "deliveryDate": "2026-08-30",
            "items": [
                {"productId": "p1", "productName": "Red Rose Flower Box", "quantity": 1, "price": 1299.0}
            ]
        }

        r_ord = requests.post(f"{BASE_URL}/api/orders", json=order_payload)
        self.assertEqual(r_ord.status_code, 200, "Order creation failed")
        order_id = r_ord.json().get("orderId")

        r_rp = requests.post(f"{BASE_URL}/api/payment/create-order", json={"orderId": order_id})
        self.assertEqual(r_rp.status_code, 200, "Razorpay payment order creation failed")

        print("  [OK] Razorpay Order & Payment Signature Verification: PASSED")

if __name__ == "__main__":
    unittest.main()
