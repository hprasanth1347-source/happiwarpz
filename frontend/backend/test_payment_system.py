import unittest
import requests
import hmac
import hashlib

BASE_URL = "http://127.0.0.1:8000"

class TestRazorpayPaymentIntegration(unittest.TestCase):

    def test_01_checkout_and_payment_flow(self):
        # 1. Create order
        order_payload = {
            "customerName": "Razorpay Test Customer",
            "customerEmail": "test_razorpay@happiwrapz.com",
            "customerPhone": "+919876543210",
            "address": "123 Flower Street",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600001",
            "deliveryDate": "2026-08-30",
            "items": [
              {
                "productId": "p1",
                "productName": "Handcrafted Red Bouquet",
                "quantity": 1,
                "price": 1499.0
              }
            ]
        }

        r_order = requests.post(f"{BASE_URL}/api/orders", json=order_payload)
        self.assertEqual(r_order.status_code, 200)
        order_data = r_order.json()
        order_id = order_data["orderId"]
        self.assertIsNotNone(order_id)

        # 2. Create Razorpay Payment Order
        r_rp = requests.post(f"{BASE_URL}/api/payment/create-order", json={"orderId": order_id})
        self.assertEqual(r_rp.status_code, 200)
        rp_data = r_rp.json()
        self.assertTrue(rp_data.get("success"))
        self.assertIsNotNone(rp_data.get("razorpayOrderId"))

        # 3. Verify HMAC-SHA256 Payment Signature
        rp_order_id = rp_data.get("razorpayOrderId")
        rp_payment_id = "pay_test_999888777"
        secret = "happiwrapz_razorpay_secret_key_123"
        
        signature = hmac.new(
            secret.encode('utf-8'),
            f"{rp_order_id}|{rp_payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        verify_payload = {
            "orderId": order_id,
            "razorpayOrderId": rp_order_id,
            "razorpayPaymentId": rp_payment_id,
            "razorpaySignature": signature
        }

        r_verify = requests.post(f"{BASE_URL}/api/payment/verify", json=verify_payload)
        self.assertEqual(r_verify.status_code, 200)
        verify_data = r_verify.json()
        self.assertTrue(verify_data.get("success"))
        self.assertEqual(verify_data.get("status"), "PAID")

if __name__ == "__main__":
    print("\nRunning Razorpay Payment Integration Automated Tests...\n")
    unittest.main()
