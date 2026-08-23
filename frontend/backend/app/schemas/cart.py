from typing import Optional
from pydantic import BaseModel

class CartItemCreate(BaseModel):
    productId: str
    variantId: Optional[str] = None
    variantName: Optional[str] = None
    quantity: int = 1
    customColor: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    customColor: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None

class CartItemResponse(BaseModel):
    id: str
    userId: str
    productId: str
    variantId: Optional[str] = None
    variantName: Optional[str] = None
    quantity: int
    customColor: Optional[str] = None
    customMessage: Optional[str] = None
    specialInstructions: Optional[str] = None

    class Config:
        from_attributes = True
