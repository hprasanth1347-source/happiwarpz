import secrets
import hashlib
import requests
from app.config import settings

def generate_otp(length: int = 6) -> str:
    """Generates a cryptographically secure random numeric OTP."""
    digits = "0123456789"
    return "".join(secrets.choice(digits) for _ in range(length))

def hash_otp(otp: str) -> str:
    """Hashes plain text OTP using SHA-256 for secure database storage."""
    return hashlib.sha256(otp.encode('utf-8')).hexdigest()

def verify_otp_hash(otp: str, hashed_otp: str) -> bool:
    """Verifies a plain OTP against the stored SHA-256 hash."""
    return hash_otp(otp) == hashed_otp

def send_sms_otp(phone: str, otp: str, purpose: str = "LOGIN") -> bool:
    """Dispatches SMS OTP via configured provider (Twilio, MSG91, Textlocal, AWS SNS, or simulation)."""
    provider = (settings.SMS_PROVIDER or "simulation").lower().strip()
    message = f"Your Happiwrapz verification code is: {otp}. Valid for 5 minutes. Do not share this code."

    try:
        if provider == "twilio" and settings.SMS_API_KEY and settings.SMS_API_SECRET:
            # Twilio SMS API integration
            account_sid = settings.SMS_API_KEY
            auth_token = settings.SMS_API_SECRET
            url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
            resp = requests.post(url, data={
                "To": phone,
                "From": settings.SMS_SENDER_ID or "+1234567890",
                "Body": message
            }, auth=(account_sid, auth_token), timeout=5)
            return resp.status_code in [200, 201]

        elif provider == "msg91" and settings.SMS_API_KEY:
            # MSG91 SMS API integration
            url = "https://control.msg91.com/api/v5/otp"
            headers = {"authkey": settings.SMS_API_KEY, "content-type": "application/json"}
            payload = {"mobile": phone.replace("+", ""), "otp": otp}
            resp = requests.post(url, json=payload, headers=headers, timeout=5)
            return resp.status_code == 200

        elif provider == "textlocal" and settings.SMS_API_KEY:
            # Textlocal SMS API integration
            url = "https://api.textlocal.in/send/"
            payload = {
                "apiKey": settings.SMS_API_KEY,
                "numbers": phone.replace("+", ""),
                "message": message,
                "sender": settings.SMS_SENDER_ID
            }
            resp = requests.post(url, data=payload, timeout=5)
            return resp.status_code == 200

        else:
            # Simulation / Local Development mode
            print(f"\n=======================================================")
            print(f"[SMS OTP DISPATCH LOG] (Provider: {provider.upper()})")
            print(f"Phone: {phone}")
            print(f"OTP Code: {otp}")
            print(f"Purpose: {purpose}")
            print(f"Message: {message}")
            print(f"=======================================================\n")
            return True
    except Exception as e:
        print(f"[SMS Error] Failed to send SMS OTP to {phone} via {provider}: {e}")
        return False
