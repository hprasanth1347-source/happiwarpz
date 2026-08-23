import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

DB_PATH = os.path.join(BASE_DIR, "happiwrapz.db").replace("\\", "/")

class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{DB_PATH}"
    SECRET_KEY: str = "happiwrapz_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200
    FRONTEND_URL: str = "http://localhost:3000"
    RAZORPAY_KEY_ID: str = "rzp_test_R2L94J8Z9X1234"
    RAZORPAY_KEY_SECRET: str = "happiwrapz_razorpay_secret_key_123"
    RAZORPAY_WEBHOOK_SECRET: str = "happiwrapz_webhook_secret_123"
    UPLOAD_DIR: str = "./uploads"

    # SMTP Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@happiwrapz.com"
    # Google OAuth Settings
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/api/auth/google/callback"

    # SMS OTP Settings (Providers: twilio, msg91, textlocal, firebase, aws_sns, simulation)
    SMS_PROVIDER: str = "simulation"
    SMS_API_KEY: str = ""
    SMS_API_SECRET: str = ""
    SMS_SENDER_ID: str = "HAPPIW"

    class Config:
        env_file = ENV_PATH
        extra = "ignore"

settings = Settings()
