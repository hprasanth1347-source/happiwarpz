from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    rememberMe: Optional[bool] = False

class UserResponse(BaseModel):
    id: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    name: Optional[str] = None
    email: str
    email_verified: Optional[bool] = False
    phone: Optional[str] = None
    phone_verified: Optional[bool] = False
    profile_image: Optional[str] = None
    role: str
    accountStatus: str
    createdAt: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

class SendOTPRequest(BaseModel):
    phone: str
    purpose: Optional[str] = "LOGIN" # LOGIN, REGISTRATION, PASSWORD_RESET, PHONE_VERIFICATION, PHONE_CHANGE

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    purpose: Optional[str] = "LOGIN"

class VerifyOTPResetPasswordRequest(BaseModel):
    phone: str
    otp: str
    newPassword: str

class UpdateProfileRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

class SetPasswordRequest(BaseModel):
    newPassword: str

class LinkGoogleRequest(BaseModel):
    code: str

class LinkPhoneRequest(BaseModel):
    phone: str
    otp: str

class VerifyEmailRequest(BaseModel):
    token: str
