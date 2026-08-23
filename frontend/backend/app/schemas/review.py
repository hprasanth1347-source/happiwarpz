from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    productId: str
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    productId: str
    userId: str
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    createdAt: datetime

    class Config:
        from_attributes = True
