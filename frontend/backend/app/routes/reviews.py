from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Review, Product, User
from app.schemas.review import ReviewCreate
from app.utils.security import get_current_user

router = APIRouter(prefix="/api", tags=["Reviews"])

@router.post("/products/{product_id}/reviews")
def create_review(
    product_id: str,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Review).filter(
        Review.productId == product_id,
        Review.userId == current_user.id
    ).first()

    if existing:
        existing.rating = data.rating
        existing.title = data.title
        existing.comment = data.comment
        db.commit()
        db.refresh(existing)
        return {"success": True, "message": "Review updated", "id": existing.id}

    review = Review(
        productId=product_id,
        userId=current_user.id,
        rating=data.rating,
        title=data.title,
        comment=data.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return {"success": True, "message": "Review submitted successfully", "id": review.id}

@router.delete("/reviews/{id}")
def delete_review(id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(review)
    db.commit()
    return {"success": True, "message": "Review deleted"}
