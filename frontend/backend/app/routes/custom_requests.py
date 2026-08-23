from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import CustomRequest, User
from app.schemas.custom_request import CustomRequestCreate
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/api/custom-requests", tags=["Custom Requests"])

@router.post("")
def submit_custom_request(
    data: CustomRequestCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    request_obj = CustomRequest(
        userId=user_id,
        customerName=data.customerName,
        customerEmail=data.customerEmail,
        customerPhone=data.customerPhone,
        productType=data.productType,
        preferredColors=data.preferredColors,
        quantity=data.quantity,
        customMessage=data.customMessage,
        specialInstructions=data.specialInstructions,
        referenceImageUrl=data.referenceImageUrl,
        status="NEW"
    )
    db.add(request_obj)
    db.commit()
    db.refresh(request_obj)

    return {
        "success": True,
        "message": "Custom request submitted successfully",
        "requestId": request_obj.id
    }
