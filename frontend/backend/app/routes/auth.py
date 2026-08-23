import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session as DBSession

from app.config import settings
from app.database.database import get_db
from app.database.models import (
    User, OAuthAccount, OTPVerification, PasswordResetToken, Session as UserSession, LoginActivity
)
from app.schemas.user import (
    UserRegister, UserLogin, UserResponse, ForgotPasswordRequest, ResetPasswordRequest,
    SendOTPRequest, VerifyOTPRequest, VerifyOTPResetPasswordRequest, ChangePasswordRequest,
    SetPasswordRequest, LinkPhoneRequest
)
from app.utils.security import (
    get_password_hash, verify_password, create_access_token, get_current_user,
    get_current_user_optional, get_token_from_request, hash_token,
    create_user_session, record_login_activity
)
from app.utils.sms import generate_otp, hash_otp, verify_otp_hash, send_sms_otp
from app.utils.oauth import get_google_auth_url, get_google_user_info
from app.utils.email import send_password_reset_email, send_login_notification_email, send_welcome_email

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# ----------------------------------------------------
# 1. EMAIL + PASSWORD AUTHENTICATION
# ----------------------------------------------------

@router.post("/register")
def register(data: UserRegister, request: Request, response: Response, db: DBSession = Depends(get_db)):
    clean_email = data.email.lower().strip()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email address already exists")

    hashed_pw = get_password_hash(data.password)
    user_name = (data.name or f"{data.firstName or ''} {data.lastName or ''}").strip() or clean_email.split("@")[0]

    new_user = User(
        firstName=data.firstName,
        lastName=data.lastName,
        name=user_name,
        email=clean_email,
        phone=data.phone,
        passwordHash=hashed_pw,
        role="CUSTOMER",
        accountStatus="ACTIVE",
        email_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log Welcome Email & Activity
    send_welcome_email(clean_email, new_user.name)
    record_login_activity(db, new_user.id, "REGISTER_EMAIL", request, success=True)

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    max_age = 30 * 24 * 3600
    create_user_session(db, new_user.id, token, request, max_age_seconds=max_age)

    response.set_cookie(
        key="happiwrapz_session",
        value=token,
        httponly=True,
        max_age=max_age,
        samesite="lax",
        secure=False
    )

    return {
        "success": True,
        "token": token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
        }
    }

@router.post("/login")
def login(data: UserLogin, request: Request, response: Response, db: DBSession = Depends(get_db)):
    clean_email = data.email.lower().strip()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not user.passwordHash or not verify_password(data.password, user.passwordHash):
        if user:
            record_login_activity(db, user.id, "PASSWORD", request, success=False)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.accountStatus == "DISABLED":
        raise HTTPException(status_code=403, detail="Account has been disabled")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    max_age = 30 * 24 * 3600 if data.rememberMe else 24 * 3600

    create_user_session(db, user.id, token, request, max_age_seconds=max_age)
    record_login_activity(db, user.id, "PASSWORD", request, success=True)

    response.set_cookie(
        key="happiwrapz_session",
        value=token,
        httponly=True,
        max_age=max_age,
        samesite="lax",
        secure=False
    )

    # Security Login Notification Email
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Web Browser")
    send_login_notification_email(user.email, user.name or "User", client_ip, user_agent)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "firstName": user.firstName,
            "lastName": user.lastName,
        }
    }

@router.post("/logout")
def logout(request: Request, response: Response, db: DBSession = Depends(get_db)):
    token = get_token_from_request(request)
    if token:
        token_h = hash_token(token)
        sess = db.query(UserSession).filter(UserSession.sessionTokenHash == token_h).first()
        if sess:
            sess.revokedAt = datetime.utcnow()
            db.commit()

    response.delete_cookie(key="happiwrapz_session")
    response.delete_cookie(key="access_token")
    return {"success": True, "message": "Logged out successfully"}

@router.post("/logout-all")
def logout_all_devices(request: Request, response: Response, current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Revokes all active database sessions for current user across all devices."""
    active_sessions = db.query(UserSession).filter(
        UserSession.userId == current_user.id,
        UserSession.revokedAt.is_(None)
    ).all()

    for s in active_sessions:
        s.revokedAt = datetime.utcnow()

    db.commit()
    response.delete_cookie(key="happiwrapz_session")
    response.delete_cookie(key="access_token")

    return {"success": True, "message": f"Logged out from all {len(active_sessions)} active devices successfully"}

# ----------------------------------------------------
# 2. GOOGLE OAUTH 2.0 AUTHENTICATION
# ----------------------------------------------------

@router.get("/google")
def google_login_redirect(state: str = "login"):
    """Redirects browser to official Google OAuth 2.0 consent page."""
    auth_url = get_google_auth_url(state=state)
    return RedirectResponse(url=auth_url)

@router.get("/google/callback")
def google_callback(code: str, request: Request, response: Response, db: DBSession = Depends(get_db)):
    """Backend callback verifying Google OAuth code server-side."""
    google_profile = get_google_user_info(code)
    google_id = google_profile["google_id"]
    email = google_profile["email"]
    name = google_profile["name"]

    # 1. Check if OAuthAccount already exists
    oauth_acc = db.query(OAuthAccount).filter(
        OAuthAccount.provider == "google",
        OAuthAccount.providerAccountId == google_id
    ).first()

    if oauth_acc:
        user = oauth_acc.user
    else:
        # 2. Check if User with email exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create new user automatically
            user = User(
                email=email,
                name=name or email.split("@")[0],
                email_verified=google_profile.get("email_verified", True),
                profile_image=google_profile.get("picture"),
                role="CUSTOMER",
                accountStatus="ACTIVE"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Link Google OAuthAccount to User
        new_oauth = OAuthAccount(
            userId=user.id,
            provider="google",
            providerAccountId=google_id,
            providerEmail=email
        )
        db.add(new_oauth)
        db.commit()

    if user.accountStatus == "DISABLED":
        raise HTTPException(status_code=403, detail="Account has been disabled")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    create_user_session(db, user.id, token, request, max_age_seconds=30*24*3600)
    record_login_activity(db, user.id, "GOOGLE", request, success=True)

    redirect_target = f"{settings.FRONTEND_URL}/account?token={token}" if user.role != "ADMIN" else f"{settings.FRONTEND_URL}/admin?token={token}"
    res = RedirectResponse(url=redirect_target)
    res.set_cookie(key="happiwrapz_session", value=token, httponly=True, max_age=30*24*3600, samesite="lax", secure=False)
    return res

@router.post("/google/verify-credential")
def verify_google_credential_token(data: dict, request: Request, response: Response, db: DBSession = Depends(get_db)):
    """Verifies a Google Identity Services credential token from the frontend and logs in/creates the user."""
    credential = data.get("credential")
    if not credential:
        raise HTTPException(status_code=400, detail="Google credential token is required")

    from app.utils.oauth import verify_google_id_token_credential
    google_profile = verify_google_id_token_credential(credential)

    google_id = google_profile["google_id"]
    email = google_profile["email"]
    name = google_profile["name"]

    oauth_acc = db.query(OAuthAccount).filter(
        OAuthAccount.provider == "google",
        OAuthAccount.providerAccountId == google_id
    ).first()

    if oauth_acc:
        user = oauth_acc.user
    else:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                name=name or email.split("@")[0],
                email_verified=google_profile.get("email_verified", True),
                profile_image=google_profile.get("picture"),
                role="CUSTOMER",
                accountStatus="ACTIVE"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        new_oauth = OAuthAccount(
            userId=user.id,
            provider="google",
            providerAccountId=google_id,
            providerEmail=email
        )
        db.add(new_oauth)
        db.commit()

    if user.accountStatus == "DISABLED":
        raise HTTPException(status_code=403, detail="Account has been disabled")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    create_user_session(db, user.id, token, request, max_age_seconds=30*24*3600)
    record_login_activity(db, user.id, "GOOGLE", request, success=True)

    response.set_cookie(key="happiwrapz_session", value=token, httponly=True, max_age=30*24*3600, samesite="lax", secure=False)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    }

@router.post("/google/link")
def link_google_account(data: dict, current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Links Google OAuth account to currently logged in user."""
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Google authorization code is required")

    google_profile = get_google_user_info(code)
    google_id = google_profile["google_id"]

    existing = db.query(OAuthAccount).filter(
        OAuthAccount.provider == "google",
        OAuthAccount.providerAccountId == google_id
    ).first()

    if existing:
        if existing.userId != current_user.id:
            raise HTTPException(status_code=400, detail="This Google account is already connected to another account.")
        return {"success": True, "message": "Google account is already connected."}

    oauth_acc = OAuthAccount(
        userId=current_user.id,
        provider="google",
        providerAccountId=google_id,
        providerEmail=google_profile.get("email")
    )
    db.add(oauth_acc)
    db.commit()
    return {"success": True, "message": "Google account connected successfully."}

@router.delete("/google/unlink")
def unlink_google_account(current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Unlinks Google OAuth account if user has another usable login method."""
    has_password = current_user.passwordHash is not None
    has_phone = current_user.phone is not None and current_user.phone_verified

    if not has_password and not has_phone:
        raise HTTPException(status_code=400, detail="Cannot disconnect Google. Please set a password or add a phone number first.")

    oauth_acc = db.query(OAuthAccount).filter(
        OAuthAccount.userId == current_user.id,
        OAuthAccount.provider == "google"
    ).first()

    if not oauth_acc:
        raise HTTPException(status_code=404, detail="No connected Google account found.")

    db.delete(oauth_acc)
    db.commit()
    return {"success": True, "message": "Google account disconnected successfully."}

# ----------------------------------------------------
# 3. PHONE NUMBER + SMS OTP AUTHENTICATION
# ----------------------------------------------------

@router.post("/phone/send-otp")
def send_phone_otp(data: SendOTPRequest, db: DBSession = Depends(get_db)):
    """Generates 6-digit OTP, saves hashed OTP with 5min expiry, and dispatches SMS."""
    clean_phone = data.phone.strip()
    if not clean_phone or len(clean_phone) < 10:
        raise HTTPException(status_code=400, detail="Valid mobile phone number is required")

    # Rate limiting check: 30s resend cooldown
    recent_otp = db.query(OTPVerification).filter(
        OTPVerification.phone == clean_phone,
        OTPVerification.purpose == data.purpose,
        OTPVerification.createdAt >= datetime.utcnow() - timedelta(seconds=30)
    ).first()

    if recent_otp:
        raise HTTPException(status_code=429, detail="Please wait 30 seconds before requesting a new OTP.")

    otp = generate_otp(6)
    hashed_otp = hash_otp(otp)
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    otp_rec = OTPVerification(
        phone=clean_phone,
        otpHash=hashed_otp,
        purpose=data.purpose,
        expiresAt=expires_at,
        attempts=0
    )
    db.add(otp_rec)
    db.commit()

    sms_sent = send_sms_otp(clean_phone, otp, purpose=data.purpose)

    return {
        "success": True,
        "message": f"OTP sent to {clean_phone}.",
        "phone": clean_phone,
        "cooldownSeconds": 30,
        "smsSent": sms_sent
    }

@router.post("/phone/verify-otp")
def verify_phone_otp(data: VerifyOTPRequest, request: Request, response: Response, db: DBSession = Depends(get_db)):
    """Verifies 6-digit SMS OTP and logs in or creates user account."""
    clean_phone = data.phone.strip()

    otp_rec = db.query(OTPVerification).filter(
        OTPVerification.phone == clean_phone,
        OTPVerification.purpose == data.purpose,
        OTPVerification.verifiedAt.is_(None),
        OTPVerification.expiresAt >= datetime.utcnow()
    ).order_by(OTPVerification.createdAt.desc()).first()

    if not otp_rec:
        raise HTTPException(status_code=400, detail="OTP has expired or is invalid. Please request a new OTP.")

    if otp_rec.attempts >= 5:
        raise HTTPException(status_code=429, detail="Maximum OTP verification attempts exceeded. Please request a new OTP.")

    otp_rec.attempts += 1

    if not verify_otp_hash(data.otp, otp_rec.otpHash):
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please check and try again.")

    # OTP is valid!
    otp_rec.verifiedAt = datetime.utcnow()

    # Find user by phone
    user = db.query(User).filter(User.phone == clean_phone).first()

    if not user:
        # Create user with phone
        generated_email = f"user_{clean_phone.replace('+', '')}@happiwrapz.com"
        user = User(
            phone=clean_phone,
            phone_verified=True,
            email=generated_email,
            name=f"User {clean_phone[-4:]}",
            role="CUSTOMER",
            accountStatus="ACTIVE"
        )
        db.add(user)
    else:
        user.phone_verified = True

    db.commit()

    if user.accountStatus == "DISABLED":
        raise HTTPException(status_code=403, detail="Account has been disabled")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    create_user_session(db, user.id, token, request, max_age_seconds=30*24*3600)
    record_login_activity(db, user.id, "PHONE_OTP", request, success=True)

    response.set_cookie(key="happiwrapz_session", value=token, httponly=True, max_age=30*24*3600, samesite="lax", secure=False)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "phone": user.phone,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    }

@router.post("/phone/link")
def link_phone_number(data: LinkPhoneRequest, current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Links verified phone number to logged in user."""
    clean_phone = data.phone.strip()

    otp_rec = db.query(OTPVerification).filter(
        OTPVerification.phone == clean_phone,
        OTPVerification.verifiedAt.isnot(None),
        OTPVerification.expiresAt >= datetime.utcnow() - timedelta(minutes=10)
    ).order_by(OTPVerification.createdAt.desc()).first()

    if not otp_rec or not verify_otp_hash(data.otp, otp_rec.otpHash):
        raise HTTPException(status_code=400, detail="OTP verification required before linking phone number.")

    existing = db.query(User).filter(User.phone == clean_phone, User.id != current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="This phone number is already linked to another account.")

    current_user.phone = clean_phone
    current_user.phone_verified = True
    db.commit()

    return {"success": True, "message": "Phone number linked successfully."}

@router.delete("/phone/unlink")
def unlink_phone_number(current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Unlinks phone number if another auth method exists."""
    has_password = current_user.passwordHash is not None
    has_google = db.query(OAuthAccount).filter(OAuthAccount.userId == current_user.id, OAuthAccount.provider == "google").first() is not None

    if not has_password and not has_google:
        raise HTTPException(status_code=400, detail="Cannot unlink phone number. Please set a password or connect Google first.")

    current_user.phone = None
    current_user.phone_verified = False
    db.commit()

    return {"success": True, "message": "Phone number unlinked successfully."}

# ----------------------------------------------------
# 4. PASSWORD MANAGEMENT & ACCOUNT SECURITY
# ----------------------------------------------------

@router.post("/change-password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Changes password for logged in user after verifying current password."""
    if not current_user.passwordHash:
        raise HTTPException(status_code=400, detail="You currently have no password set. Please use Set Password instead.")

    if not verify_password(data.currentPassword, current_user.passwordHash):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if len(data.newPassword) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    current_user.passwordHash = get_password_hash(data.newPassword)
    db.commit()

    return {"success": True, "message": "Password changed successfully."}

@router.post("/set-password")
def set_password(data: SetPasswordRequest, current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Allows Google / Phone users to set a local password for the first time."""
    if current_user.passwordHash:
        raise HTTPException(status_code=400, detail="Password is already configured. Use Change Password.")

    if len(data.newPassword) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")

    current_user.passwordHash = get_password_hash(data.newPassword)
    db.commit()

    return {"success": True, "message": "Password set successfully."}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: DBSession = Depends(get_db)):
    clean_email = data.email.lower().strip()
    user = db.query(User).filter(User.email == clean_email).first()

    generic_msg = "If an account with this email exists, password reset instructions have been sent to your email inbox."
    if not user:
        return {"success": True, "message": generic_msg}

    token = str(uuid.uuid4())
    user.resetToken = token
    db.commit()

    send_password_reset_email(clean_email, token)
    return {"success": True, "message": generic_msg}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: DBSession = Depends(get_db)):
    user = db.query(User).filter(User.resetToken == data.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user.passwordHash = get_password_hash(data.password)
    user.resetToken = None
    db.commit()

    # Revoke all existing sessions on password reset
    active_sessions = db.query(UserSession).filter(UserSession.userId == user.id, UserSession.revokedAt.is_(None)).all()
    for s in active_sessions:
        s.revokedAt = datetime.utcnow()
    db.commit()

    return {"success": True, "message": "Password reset successfully. You may now sign in."}

# ----------------------------------------------------
# 5. USER SESSION & SECURITY DASHBOARD APIS
# ----------------------------------------------------

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user_optional), db: DBSession = Depends(get_db)):
    if not current_user:
        return {"authenticated": False, "user": None}

    google_linked = db.query(OAuthAccount).filter(OAuthAccount.userId == current_user.id, OAuthAccount.provider == "google").first() is not None

    return {
        "authenticated": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "email_verified": current_user.email_verified,
            "phone": current_user.phone,
            "phone_verified": current_user.phone_verified,
            "name": current_user.name,
            "firstName": current_user.firstName,
            "lastName": current_user.lastName,
            "role": current_user.role,
            "accountStatus": current_user.accountStatus,
            "hasPassword": current_user.passwordHash is not None,
            "googleConnected": google_linked,
            "lastLoginAt": current_user.last_login_at.isoformat() if current_user.last_login_at else None
        }
    }

@router.get("/sessions")
def get_user_sessions(current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Returns list of active database sessions for security management."""
    sessions = db.query(UserSession).filter(
        UserSession.userId == current_user.id,
        UserSession.revokedAt.is_(None)
    ).order_by(UserSession.createdAt.desc()).all()

    return [
        {
            "id": s.id,
            "ipAddress": s.ipAddress,
            "userAgent": s.userAgent,
            "createdAt": s.createdAt.isoformat() if s.createdAt else None,
            "expiresAt": s.expiresAt.isoformat() if s.expiresAt else None,
        }
        for s in sessions
    ]

@router.get("/login-activity")
def get_login_activity(current_user: User = Depends(get_current_user), db: DBSession = Depends(get_db)):
    """Returns user's authentication activity log."""
    logs = db.query(LoginActivity).filter(
        LoginActivity.userId == current_user.id
    ).order_by(LoginActivity.createdAt.desc()).limit(20).all()

    return [
        {
            "id": log.id,
            "loginMethod": log.loginMethod,
            "ipAddress": log.ipAddress,
            "userAgent": log.userAgent,
            "success": log.success,
            "createdAt": log.createdAt.isoformat() if log.createdAt else None
        }
        for log in logs
    ]
