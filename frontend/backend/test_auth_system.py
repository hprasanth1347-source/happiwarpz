import sys
import os
import unittest
import requests

BASE_URL = "http://127.0.0.1:8000"

class TestAuthenticationSystem(unittest.TestCase):

    def test_01_backend_health(self):
        r = requests.get(f"{BASE_URL}/api/health")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json().get("status"), "ok")

    def test_02_email_registration_and_login(self):
        email = f"authtest_{os.urandom(4).hex()}@happiwrapz.com"
        password = "Password123!"

        # Register
        r_reg = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Auth Test User",
            "email": email,
            "password": password
        })
        self.assertEqual(r_reg.status_code, 200)
        self.assertTrue(r_reg.json().get("success"))
        token = r_reg.json().get("token")
        self.assertIsNotNone(token)

        # Login
        r_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": password
        })
        self.assertEqual(r_login.status_code, 200)
        self.assertTrue(r_login.json().get("success"))

        # Verify Me
        headers = {"Authorization": f"Bearer {token}"}
        r_me = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        self.assertEqual(r_me.status_code, 200)
        self.assertTrue(r_me.json().get("authenticated"))

    def test_03_phone_otp_flow(self):
        phone = f"+9198{os.urandom(3).hex()[:8]}"
        
        # Send OTP
        r_otp = requests.post(f"{BASE_URL}/api/auth/phone/send-otp", json={
            "phone": phone,
            "purpose": "LOGIN"
        })
        self.assertEqual(r_otp.status_code, 200)
        self.assertTrue(r_otp.json().get("success"))

    def test_04_forgot_password_no_token_leakage(self):
        r = requests.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": "admin@happiwrapz.com"
        })
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json().get("success"))
        self.assertNotIn("resetToken", r.json()) # Token must NEVER leak in API JSON

    def test_05_google_oauth_redirect(self):
        r = requests.get(f"{BASE_URL}/api/auth/google", allow_redirects=False)
        self.assertEqual(r.status_code, 307)
        self.assertIn("accounts.google.com", r.headers.get("location"))

if __name__ == "__main__":
    print("\nRunning Master Authentication System Automated Tests...\n")
    unittest.main()
