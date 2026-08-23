from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class CustomRequestCreate(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    productType: str
    preferredColors: Optional[str] = None
    quantity: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None
    referenceImageUrl: Optional[str] = None

class CustomRequestResponse(CustomRequestCreate):
    id: str
    userId: Optional[str] = None
    status: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class CustomRequestStatusUpdate(BaseModel):
    status: str
