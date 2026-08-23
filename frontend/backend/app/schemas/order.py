from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class OrderItemCreate(BaseModel):
    productId: Optional[str] = None
    productName: str
    variantName: Optional[str] = None
    quantity: int
    price: float
    customColor: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None
    referenceImageUrl: Optional[str] = None

class OrderCreate(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    address: str
    city: str
    state: str
    pincode: str
    deliveryDate: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: str
    orderId: str
    productId: Optional[str] = None
    productName: str
    variantName: Optional[str] = None
    quantity: int
    price: float
    customColor: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None
    referenceImageUrl: Optional[str] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    orderNumber: str
    userId: Optional[str] = None
    customerName: str
    customerEmail: str
    customerPhone: str
    address: str
    city: str
    state: str
    pincode: str
    subtotal: float
    deliveryCharge: float
    totalAmount: float
    paymentStatus: str
    orderStatus: str
    deliveryDate: Optional[str] = None
    razorpayOrderId: Optional[str] = None
    razorpayPaymentId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    orderItems: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    orderStatus: Optional[str] = None
    paymentStatus: Optional[str] = None
