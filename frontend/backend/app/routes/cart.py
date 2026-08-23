from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.database.models import CartItem, Product, ProductVariant, User
from app.schemas.cart import CartItemCreate, CartItemUpdate
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("")
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.userId == current_user.id).all()
    result = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        if not product:
            continue
        unit_price = product.price
        if item.variantId:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item.variantId).first()
            if variant:
                unit_price = variant.price

        result.append({
            "id": item.id,
            "productId": product.id,
            "productName": product.name,
            "slug": product.slug,
            "image": product.image,
            "variantId": item.variantId,
            "selectedVariantName": item.variantName,
            "price": unit_price,
            "quantity": item.quantity,
            "customColor": item.customColor,
            "customMessage": item.customMessage,
            "specialInstructions": item.specialInstructions,
            "advanceNoticeText": product.advanceNoticeText,
        })
    return result

@router.post("")
def add_to_cart(data: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.productId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(CartItem).filter(
        CartItem.userId == current_user.id,
        CartItem.productId == data.productId,
        CartItem.variantId == data.variantId
    ).first()

    if existing:
        existing.quantity += data.quantity
        if data.customColor:
            existing.customColor = data.customColor
        if data.customMessage:
            existing.customMessage = data.customMessage
        if data.specialInstructions:
            existing.specialInstructions = data.specialInstructions
        db.commit()
        db.refresh(existing)
        return {"success": True, "message": "Cart quantity updated", "item": {"id": existing.id, "quantity": existing.quantity}}
    else:
        new_item = CartItem(
            userId=current_user.id,
            productId=data.productId,
            variantId=data.variantId,
            variantName=data.variantName,
            quantity=data.quantity,
            customColor=data.customColor,
            customMessage=data.customMessage,
            specialInstructions=data.specialInstructions
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return {"success": True, "message": "Item added to cart", "item": {"id": new_item.id, "quantity": new_item.quantity}}

@router.put("/{item_id}")
def update_cart_item(item_id: str, data: CartItemUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.userId == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if data.quantity is not None:
        if data.quantity <= 0:
            db.delete(item)
            db.commit()
            return {"success": True, "message": "Item removed from cart"}
        item.quantity = data.quantity

    if data.customColor is not None:
        item.customColor = data.customColor
    if data.customMessage is not None:
        item.customMessage = data.customMessage
    if data.specialInstructions is not None:
        item.specialInstructions = data.specialInstructions

    db.commit()
    return {"success": True, "message": "Cart item updated"}

@router.delete("/{item_id}")
def delete_cart_item(item_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.userId == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"success": True, "message": "Item removed from cart"}

@router.delete("")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.userId == current_user.id).delete()
    db.commit()
    return {"success": True, "message": "Cart cleared"}
