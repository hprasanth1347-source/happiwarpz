import random
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.database.models import Order, OrderItem, User, CartItem
from app.schemas.order import OrderCreate
from app.utils.security import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_number():
    rand_digits = str(random.randint(100000, 999999))
    return f"HW-{rand_digits}"

@router.post("")
def create_order(
    data: OrderCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not data.items or len(data.items) == 0:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    subtotal = sum(item.price * item.quantity for item in data.items)
    delivery_charge = 0.0
    total_amount = subtotal + delivery_charge
    order_num = generate_order_number()

    user_id = current_user.id if current_user else None

    order = Order(
        orderNumber=order_num,
        userId=user_id,
        customerName=data.customerName,
        customerEmail=data.customerEmail,
        customerPhone=data.customerPhone,
        address=data.address,
        city=data.city,
        state=data.state,
        pincode=data.pincode,
        subtotal=subtotal,
        deliveryCharge=delivery_charge,
        totalAmount=total_amount,
        paymentStatus="PENDING",
        orderStatus="CONFIRMED",
        deliveryDate=data.deliveryDate
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in data.items:
        order_item = OrderItem(
            orderId=order.id,
            productId=item.productId,
            productName=item.productName,
            variantName=item.variantName,
            quantity=item.quantity,
            price=item.price,
            customColor=item.customColor,
            customMessage=item.customMessage,
            specialInstructions=item.specialInstructions,
            referenceImageUrl=item.referenceImageUrl
        )
        db.add(order_item)

    # Clear user's cart if logged in
    if current_user:
        db.query(CartItem).filter(CartItem.userId == current_user.id).delete()

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "orderId": order.id,
        "orderNumber": order.orderNumber,
        "order": {
            "id": order.id,
            "orderNumber": order.orderNumber,
            "totalAmount": order.totalAmount,
            "paymentStatus": order.paymentStatus,
            "orderStatus": order.orderStatus,
            "createdAt": order.createdAt.isoformat() if order.createdAt else None
        }
    }

@router.get("")
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).options(joinedload(Order.orderItems)).filter(Order.userId == current_user.id).order_by(Order.createdAt.desc()).all()
    return orders

@router.get("/{id_or_number}")
def get_order_by_id_or_number(id_or_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).options(joinedload(Order.orderItems)).filter(
        (Order.id == id_or_number) | (Order.orderNumber == id_or_number)
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

# Additional router for /api/checkout and /api/account/orders
extra_router = APIRouter(prefix="/api", tags=["Checkout & Account Orders"])

@extra_router.post("/checkout")
def checkout_post(
    data: dict,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    items = data.get("items", [])
    if not items:
        raise HTTPException(status_code=400, detail="Checkout items are required")

    subtotal = sum(float(i.get("price", 0)) * int(i.get("quantity", 1)) for i in items)
    delivery_charge = 0.0
    total_amount = subtotal + delivery_charge
    order_num = generate_order_number()

    user_id = current_user.id if current_user else None

    order = Order(
        orderNumber=order_num,
        userId=user_id,
        customerName=data.get("customerName") or data.get("name") or "Guest Customer",
        customerEmail=data.get("customerEmail") or data.get("email") or "guest@happiwrapz.com",
        customerPhone=data.get("customerPhone") or data.get("phone") or "",
        address=data.get("address") or "",
        city=data.get("city") or "",
        state=data.get("state") or "",
        pincode=data.get("pincode") or "",
        subtotal=subtotal,
        deliveryCharge=delivery_charge,
        totalAmount=total_amount,
        paymentStatus="PENDING",
        orderStatus="CONFIRMED",
        deliveryDate=data.get("deliveryDate")
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in items:
        order_item = OrderItem(
            orderId=order.id,
            productId=item.get("productId"),
            productName=item.get("productName") or item.get("name") or "Handmade Flower",
            variantName=item.get("variantName") or item.get("selectedVariantName"),
            quantity=int(item.get("quantity", 1)),
            price=float(item.get("price", 0)),
            customColor=item.get("customColor"),
            customMessage=item.get("customMessage"),
            specialInstructions=item.get("specialInstructions"),
            referenceImageUrl=item.get("referenceImageUrl")
        )
        db.add(order_item)

    if current_user:
        db.query(CartItem).filter(CartItem.userId == current_user.id).delete()

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "orderId": order.id,
        "orderNumber": order.orderNumber,
        "order": {
            "id": order.id,
            "orderNumber": order.orderNumber,
            "totalAmount": order.totalAmount,
            "paymentStatus": order.paymentStatus,
            "orderStatus": order.orderStatus,
            "createdAt": order.createdAt.isoformat() if order.createdAt else None
        }
    }

@extra_router.get("/account/orders")
def get_account_orders(
    email: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Order).options(joinedload(Order.orderItems))
    if current_user:
        query = query.filter((Order.userId == current_user.id) | (Order.customerEmail == current_user.email))
    elif email:
        query = query.filter(Order.customerEmail == email.lower())
    else:
        return []

    orders = query.order_by(Order.createdAt.desc()).all()
    return orders

