import hashlib
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database.database import get_db
from app.database.models import User, Session as UserSession, LoginActivity

pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_token_from_request(request: Request, header_token: Optional[str] = None) -> Optional[str]:
    if isinstance(header_token, str) and header_token.strip():
        return header_token.strip()

    # Check Authorization header (lowercase in Starlette request.headers)
    auth_header = request.headers.get("authorization") or request.headers.get("Authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        parts = auth_header.split(" ")
        if len(parts) >= 2:
            return parts[1].strip()

    # Check Cookie header string
    raw_cookie = request.headers.get("cookie", "")
    import re
    match = re.search(r'(?:happiwrapz_session|access_token)=([^;]+)', raw_cookie)
    if match:
        return match.group(1).strip()

    # Check cookies dict
    cookie_token = request.cookies.get("happiwrapz_session") or request.cookies.get("access_token")
    if cookie_token:
        return cookie_token.strip()

    return None

def create_user_session(db: Session, user_id: str, token: str, request: Request, max_age_seconds: int = 2592000):
    """Creates a recorded database session record for token revocation control."""
    try:
        token_hash = hash_token(token)
        ip_addr = request.client.host if request.client else "127.0.0.1"
        user_agent = request.headers.get("user-agent", "Web Browser")
        expires_at = datetime.utcnow() + timedelta(seconds=max_age_seconds)

        session = UserSession(
            userId=user_id,
            sessionTokenHash=token_hash,
            ipAddress=ip_addr,
            userAgent=user_agent,
            expiresAt=expires_at
        )
        db.add(session)
        db.commit()
    except Exception as e:
        print(f"[Session Warning] Failed to log session record: {e}")

def record_login_activity(db: Session, user_id: str, login_method: str, request: Request, success: bool = True):
    """Logs authentication activity into login_activities audit table."""
    try:
        ip_addr = request.client.host if request.client else "127.0.0.1"
        user_agent = request.headers.get("user-agent", "Web Browser")

        log_entry = LoginActivity(
            userId=user_id,
            loginMethod=login_method,
            ipAddress=ip_addr,
            userAgent=user_agent,
            success=success
        )
        db.add(log_entry)

        # Update last_login_at on User
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.last_login_at = datetime.utcnow()

        db.commit()
    except Exception as e:
        print(f"[Activity Warning] Failed to log login activity: {e}")

def is_session_revoked(db: Session, token: str) -> bool:
    """Checks if a session token has been revoked in database."""
    try:
        token_hash = hash_token(token)
        sess = db.query(UserSession).filter(UserSession.sessionTokenHash == token_hash).first()
        if sess and sess.revokedAt is not None:
            return True
    except Exception:
        pass
    return False

def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    token = get_token_from_request(request)
    if not token:
        return None
    try:
        if is_session_revoked(db, token):
            return None

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except Exception:
        return None

    user = db.query(User).filter(User.id == user_id).first()
    return user

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    user = get_current_user_optional(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
