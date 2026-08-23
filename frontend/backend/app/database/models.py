import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    firstName = Column(String, nullable=True)
    lastName = Column(String, nullable=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    email_verified = Column(Boolean, default=False)
    phone = Column(String, nullable=True)
    phone_verified = Column(Boolean, default=False)
    passwordHash = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    resetToken = Column(String, nullable=True)
    resetTokenExpiry = Column(DateTime, nullable=True)
    role = Column(String, default="CUSTOMER")
    accountStatus = Column(String, default="ACTIVE")
    last_login_at = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    cartItems = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlistItems = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")

    oauthAccounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    otpVerifications = relationship("OTPVerification", back_populates="user", cascade="all, delete-orphan")
    passwordResetTokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    loginActivities = relationship("LoginActivity", back_populates="user", cascade="all, delete-orphan")

class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"
    __table_args__ = (UniqueConstraint("provider", "providerAccountId", name="uq_oauth_provider_account"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String, nullable=False) # e.g. "google"
    providerAccountId = Column(String, nullable=False)
    providerEmail = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="oauthAccounts")

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    phone = Column(String, nullable=False, index=True)
    otpHash = Column(String, nullable=False)
    purpose = Column(String, nullable=False) # LOGIN, REGISTRATION, PASSWORD_RESET, PHONE_VERIFICATION, PHONE_CHANGE
    expiresAt = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0)
    verifiedAt = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="otpVerifications")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tokenHash = Column(String, nullable=False, index=True)
    expiresAt = Column(DateTime, nullable=False)
    usedAt = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="passwordResetTokens")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sessionTokenHash = Column(String, nullable=False, index=True)
    ipAddress = Column(String, nullable=True)
    userAgent = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    expiresAt = Column(DateTime, nullable=False)
    revokedAt = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sessions")

class LoginActivity(Base):
    __tablename__ = "login_activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    loginMethod = Column(String, nullable=False) # PASSWORD, GOOGLE, PHONE_OTP
    ipAddress = Column(String, nullable=True)
    userAgent = Column(String, nullable=True)
    success = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="loginActivities")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="addresses")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    shortDescription = Column(Text, nullable=True)
    categoryId = Column(String, ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    salePrice = Column(Float, nullable=True)
    sku = Column(String, nullable=True)
    image = Column(String, nullable=False)
    imagesJson = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE")
    isFeatured = Column(Boolean, default=False)
    inStock = Column(Boolean, default=True)
    isActive = Column(Boolean, default=True)
    advanceNoticeDays = Column(Integer, default=7)
    advanceNoticeText = Column(String, default="Make sure to place the order at least one week earlier.")
    colorOptionAvailable = Column(Boolean, default=True)
    customizationAvailable = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    orderItems = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(String, primary_key=True, default=generate_uuid)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=100)
    sku = Column(String, nullable=True)
    glitterOption = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="variants")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variantId = Column(String, nullable=True)
    variantName = Column(String, nullable=True)
    quantity = Column(Integer, default=1)
    customColor = Column(String, nullable=True)
    customMessage = Column(String, nullable=True)
    specialInstructions = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="cartItems")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlistItems")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    orderNumber = Column(String, unique=True, index=True, nullable=False)
    userId = Column(String, ForeignKey("users.id"), nullable=True)
    customerName = Column(String, nullable=False)
    customerEmail = Column(String, nullable=False)
    customerPhone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    subtotal = Column(Float, nullable=False)
    deliveryCharge = Column(Float, default=0.0)
    totalAmount = Column(Float, nullable=False)
    paymentStatus = Column(String, default="PENDING")
    orderStatus = Column(String, default="PAID")
    deliveryDate = Column(String, nullable=True)
    razorpayOrderId = Column(String, nullable=True)
    razorpayPaymentId = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    orderItems = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    orderId = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id"), nullable=True)
    productName = Column(String, nullable=False)
    variantName = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    customColor = Column(String, nullable=True)
    customMessage = Column(String, nullable=True)
    specialInstructions = Column(String, nullable=True)
    referenceImageUrl = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="orderItems")
    product = relationship("Product", back_populates="orderItems")

class CustomRequest(Base):
    __tablename__ = "custom_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, nullable=True)
    customerName = Column(String, nullable=False)
    customerEmail = Column(String, nullable=False)
    customerPhone = Column(String, nullable=False)
    productType = Column(String, nullable=False)
    preferredColors = Column(String, nullable=True)
    quantity = Column(String, nullable=True)
    customMessage = Column(Text, nullable=True)
    specialInstructions = Column(Text, nullable=True)
    referenceImageUrl = Column(String, nullable=True)
    status = Column(String, default="NEW")
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    title = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class SiteContent(Base):
    __tablename__ = "site_contents"

    id = Column(String, primary_key=True, default=generate_uuid)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminSetting(Base):
    __tablename__ = "admin_settings"

    id = Column(String, primary_key=True, default=generate_uuid)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
