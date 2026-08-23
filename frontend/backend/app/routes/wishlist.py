from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import WishlistItem, Product, User
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("")
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(WishlistItem).filter(WishlistItem.userId == current_user.id).all()
    result = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        if product:
            result.append({
                "id": item.id,
                "productId": product.id,
                "name": product.name,
                "slug": product.slug,
                "price": product.price,
                "image": product.image,
                "description": product.description
            })
    return result

@router.post("")
def add_to_wishlist(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product_id = data.get("productId")
    if not product_id:
        raise HTTPException(status_code=400, detail="productId is required")

    existing = db.query(WishlistItem).filter(
        WishlistItem.userId == current_user.id,
        WishlistItem.productId == product_id
    ).first()

    if existing:
        return {"success": True, "message": "Product already in wishlist", "id": existing.id}

    item = WishlistItem(userId=current_user.id, productId=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "Added to wishlist", "id": item.id}

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(WishlistItem).filter(
        WishlistItem.userId == current_user.id,
        (WishlistItem.productId == product_id) | (WishlistItem.id == product_id)
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"success": True, "message": "Removed from wishlist"}
