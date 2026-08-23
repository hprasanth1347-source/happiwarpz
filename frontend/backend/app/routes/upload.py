import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.config import settings
from app.database.models import User
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/api/upload", tags=["Upload"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension {ext} not allowed. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    upload_folder = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_folder, exist_ok=True)

    unique_filename = f"upload_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_folder, unique_filename)

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit")

    with open(file_path, "wb") as f:
        f.write(contents)

    file_url = f"/uploads/{unique_filename}"
    return {
        "success": True,
        "url": file_url,
        "filename": unique_filename
    }
