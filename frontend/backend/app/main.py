import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.database import engine, Base
from app.routes import (
    auth, products, cart, wishlist, orders, payment, custom_requests, reviews, account, admin, upload
)

# Create Database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Happiwrapz E-Commerce REST API",
    description="Python FastAPI backend for Happiwrapz handmade flowers & gifts e-commerce platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
allowed_origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import time
from collections import defaultdict

# In-Memory Rate Limiter (IP-based Token Bucket)
IP_REQUEST_LOG = defaultdict(list)
RATE_LIMIT_WINDOW = 60 # seconds
MAX_REQUESTS_PER_WINDOW = 150 # max 150 requests/min per IP
MAX_AUTH_REQUESTS_PER_WINDOW = 30 # max 30 sensitive auth requests/min per IP

@app.middleware("http")
async def add_security_headers_and_rate_limiting(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()

    # Purge old timestamp entries
    IP_REQUEST_LOG[client_ip] = [t for t in IP_REQUEST_LOG[client_ip] if now - t < RATE_LIMIT_WINDOW]

    path = request.url.path
    is_auth_route = path.startswith("/api/auth/login") or path.startswith("/api/auth/register") or path.startswith("/api/auth/phone/send-otp")
    limit = MAX_AUTH_REQUESTS_PER_WINDOW if is_auth_route else MAX_REQUESTS_PER_WINDOW

    if len(IP_REQUEST_LOG[client_ip]) >= limit:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests from this IP. Please wait a moment before trying again."}
        )

    IP_REQUEST_LOG[client_ip].append(now)

    response = await call_next(request)

    # Comprehensive Web Security Headers & CSP Policy
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://accounts.google.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "img-src 'self' data: https:; "
        "font-src 'self' https://fonts.gstatic.com; "
        "frame-src 'self' https://api.razorpay.com https://accounts.google.com; "
        "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 http://localhost:3000 http://127.0.0.1:3000 https://api.razorpay.com https://accounts.google.com;"
    )
    return response

# Ensure upload directory exists and mount static files
upload_dir = os.path.abspath(settings.UPLOAD_DIR)
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(orders.extra_router)
app.include_router(payment.router)
app.include_router(custom_requests.router)
app.include_router(reviews.router)
app.include_router(account.router)
app.include_router(admin.router)
app.include_router(admin.content_router)
app.include_router(upload.router)

@app.get("/")
def root():
    return {
        "success": True,
        "name": "Happiwrapz Python FastAPI Backend API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "happiwrapz-fastapi"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal Server Error", "detail": str(exc)}
    )
