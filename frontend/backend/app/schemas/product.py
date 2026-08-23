from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.category import CategoryResponse

class ProductVariantBase(BaseModel):
    name: str
    price: float
    stock: int = 100
    sku: Optional[str] = None
    glitterOption: Optional[str] = None
    status: str = "ACTIVE"

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: str
    productId: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    description: str
    shortDescription: Optional[str] = None
    categoryId: str
    price: float
    salePrice: Optional[float] = None
    sku: Optional[str] = None
    image: str
    imagesJson: Optional[str] = None
    status: str = "ACTIVE"
    isFeatured: bool = False
    inStock: bool = True
    isActive: bool = True
    advanceNoticeDays: int = 7
    advanceNoticeText: Optional[str] = "Make sure to place the order at least one week earlier."
    colorOptionAvailable: bool = True
    customizationAvailable: bool = True

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = None

class ProductResponse(ProductBase):
    id: str
    category: Optional[CategoryResponse] = None
    variants: List[ProductVariantResponse] = []
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
