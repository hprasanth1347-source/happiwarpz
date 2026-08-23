from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.schemas.user import UpdateProfileRequest, ChangePasswordRequest
from app.utils.security import get_current_user, get_password_hash, verify_password

router = APIRouter(prefix="/api/account", tags=["Account"])

@router.put("/profile")
def update_profile(data: UpdateProfileRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.firstName is not None:
        current_user.firstName = data.firstName
    if data.lastName is not None:
        current_user.lastName = data.lastName
    if data.phone is not None:
        current_user.phone = data.phone

    user_name = f"{current_user.firstName or ''} {current_user.lastName or ''}".strip() or current_user.email.split("@")[0]
    current_user.name = user_name

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "firstName": current_user.firstName,
            "lastName": current_user.lastName,
            "phone": current_user.phone
        }
    }

@router.put("/password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.currentPassword, current_user.passwordHash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.passwordHash = get_password_hash(data.newPassword)
    db.commit()

    return {"success": True, "message": "Password changed successfully"}
