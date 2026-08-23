import urllib.parse
import requests
from fastapi import HTTPException
from app.config import settings

GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo"
GOOGLE_TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo"

def get_google_auth_url(state: str = "login") -> str:
    """Generates the official Google OAuth 2.0 authorization URL."""
    client_id = settings.GOOGLE_CLIENT_ID or "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
    params = {
        "client_id": client_id,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": state
    }
    return f"{GOOGLE_AUTH_ENDPOINT}?{urllib.parse.urlencode(params)}"

def get_google_user_info(code: str) -> dict:
    """Exchanges Google authorization code for tokens and verifies identity server-side."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=400,
            detail="Google OAuth is not configured in backend .env (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required)"
        )

    # 1. Exchange authorization code for tokens
    token_payload = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    token_res = requests.post(GOOGLE_TOKEN_ENDPOINT, data=token_payload, timeout=10)
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to exchange authorization code with Google")

    tokens = token_res.json()
    access_token = tokens.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No access token received from Google")

    # 2. Verify identity and fetch verified user profile server-side
    userinfo_res = requests.get(
        GOOGLE_USERINFO_ENDPOINT,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10
    )

    if userinfo_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to verify Google user profile server-side")

    profile = userinfo_res.json()
    
    return {
        "google_id": profile.get("sub"),
        "email": profile.get("email", "").lower().strip(),
        "email_verified": profile.get("email_verified", False),
        "name": profile.get("name"),
        "given_name": profile.get("given_name"),
        "family_name": profile.get("family_name"),
        "picture": profile.get("picture")
    }

def verify_google_id_token_credential(id_token_str: str) -> dict:
    """Verifies a Google Identity Services credential (ID Token) server-side."""
    if not id_token_str:
        raise HTTPException(status_code=400, detail="Google credential ID token is required")

    resp = requests.get(f"{GOOGLE_TOKENINFO_ENDPOINT}?id_token={id_token_str}", timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid or expired Google credential token")

    token_info = resp.json()
    google_id = token_info.get("sub")
    email = token_info.get("email", "").lower().strip()

    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Unable to extract user identity from Google token")

    return {
        "google_id": google_id,
        "email": email,
        "email_verified": token_info.get("email_verified") == "true" or token_info.get("email_verified") is True,
        "name": token_info.get("name"),
        "given_name": token_info.get("given_name"),
        "family_name": token_info.get("family_name"),
        "picture": token_info.get("picture")
    }
