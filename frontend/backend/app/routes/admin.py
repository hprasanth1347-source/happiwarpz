import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.database.models import (
    User, Product, Category, ProductVariant, Order, OrderItem, CustomRequest, SiteContent, AdminSetting, AdminLog
)
from app.schemas.product import ProductCreate
from app.schemas.order import OrderStatusUpdate
from app.schemas.custom_request import CustomRequestStatusUpdate
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ----------------------------------------------------
# 1. DASHBOARD METRICS & OVERVIEW
# ----------------------------------------------------

@router.get("/dashboard")
@router.get("/metrics")
def get_dashboard_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    today_date = datetime.datetime.now(datetime.timezone.utc).date()

    orders_total = db.query(Order).count()
    orders_pending = db.query(Order).filter(Order.orderStatus == "CONFIRMED").count()
    orders_processing = db.query(Order).filter(Order.orderStatus == "PROCESSING").count()
    orders_completed = db.query(Order).filter(Order.orderStatus.in_(["COMPLETED", "DELIVERED"])).count()
    orders_cancelled = db.query(Order).filter(Order.orderStatus == "CANCELLED").count()

    paid_orders = db.query(Order).filter(Order.paymentStatus == "PAID").all()
    total_revenue = sum(o.totalAmount for o in paid_orders)
    today_revenue = sum(o.totalAmount for o in paid_orders if o.createdAt and o.createdAt.date() == today_date)
    month_revenue = sum(o.totalAmount for o in paid_orders if o.createdAt and o.createdAt.month == today_date.month and o.createdAt.year == today_date.year)

    products_total = db.query(Product).count()
    products_available = db.query(Product).filter(Product.inStock == True, Product.isActive == True).count()
    products_out_of_stock = db.query(Product).filter(Product.inStock == False).count()

    custom_new = db.query(CustomRequest).filter(CustomRequest.status == "NEW").count()
    custom_in_progress = db.query(CustomRequest).filter(CustomRequest.status == "IN_PROGRESS").count()
    custom_completed = db.query(CustomRequest).filter(CustomRequest.status == "COMPLETED").count()

    return {
        "orders": {
            "total": orders_total,
            "pending": orders_pending,
            "processing": orders_processing,
            "completed": orders_completed,
            "cancelled": orders_cancelled,
        },
        "revenue": {
            "total": total_revenue,
            "today": today_revenue,
            "month": month_revenue,
        },
        "products": {
            "total": products_total,
            "available": products_available,
            "outOfStock": products_out_of_stock,
        },
        "customRequests": {
            "new": custom_new,
            "inProgress": custom_in_progress,
            "completed": custom_completed,
        }
    }

# ----------------------------------------------------
# 2. CATEGORIES MANAGEMENT
# ----------------------------------------------------

@router.get("/categories")
def admin_get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        prod_count = db.query(Product).filter(Product.categoryId == cat.id).count()
        result.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description,
            "image": cat.image,
            "isActive": cat.isActive,
            "_count": {"products": prod_count}
        })
    return result

@router.post("/categories")
def admin_create_category(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    name = data.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")
    slug = data.get("slug") or name.lower().replace(" ", "-")
    cat = Category(
        name=name,
        slug=slug,
        description=data.get("description"),
        image=data.get("image"),
        isActive=data.get("isActive", True)
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"success": True, "category": cat}

@router.put("/categories")
def admin_update_category_body(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_id = data.get("id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Category ID is required")
    return perform_category_update(target_id, data, db)

@router.put("/categories/{id}")
def admin_update_category_path(id: str, data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_category_update(id, data, db)

def perform_category_update(target_id: str, data: dict, db: Session):
    cat = db.query(Category).filter(Category.id == target_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if "name" in data and data["name"]:
        cat.name = data["name"]
    if "slug" in data and data["slug"]:
        cat.slug = data["slug"]
    if "description" in data:
        cat.description = data["description"]
    if "isActive" in data:
        cat.isActive = bool(data["isActive"])

    db.commit()
    return {"success": True, "message": "Category updated", "category": {"id": cat.id, "name": cat.name}}

@router.delete("/categories")
def admin_delete_category_query(id: Optional[str] = Query(None), admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not id:
        raise HTTPException(status_code=400, detail="Category ID is required")
    return perform_category_delete(id, db)

@router.delete("/categories/{id}")
def admin_delete_category_path(id: str, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_category_delete(id, db)

def perform_category_delete(target_id: str, db: Session):
    cat = db.query(Category).filter(Category.id == target_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    # Reassign products cleanly to default catalog category if any exist
    products = db.query(Product).filter(Product.categoryId == target_id).all()
    if products:
        fallback_cat = db.query(Category).filter(Category.slug == "general-catalog").first()
        if not fallback_cat or fallback_cat.id == target_id:
            fallback_cat = db.query(Category).filter(Category.id != target_id).first()
            if not fallback_cat:
                fallback_cat = Category(name="General Catalog", slug="general-catalog", description="Default fallback category")
                db.add(fallback_cat)
                db.commit()
                db.refresh(fallback_cat)

        for p in products:
            p.categoryId = fallback_cat.id

    db.delete(cat)
    db.commit()
    return {"success": True, "message": "Category deleted successfully"}

# ----------------------------------------------------
# 3. PRODUCTS MANAGEMENT
# ----------------------------------------------------

@router.get("/products")
def admin_get_products(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    products = db.query(Product).options(joinedload(Product.category), joinedload(Product.variants)).order_by(Product.createdAt.desc()).all()
    return products

@router.post("/products")
def admin_create_product(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    name = data.get("name")
    slug = data.get("slug") or name.lower().replace(" ", "-")
    categoryId = data.get("categoryId")
    price = float(data.get("price", 0))

    if not name or not categoryId:
        raise HTTPException(status_code=400, detail="Name and categoryId are required")

    product = Product(
        name=name,
        slug=slug,
        description=data.get("description", ""),
        shortDescription=data.get("shortDescription"),
        categoryId=categoryId,
        price=price,
        salePrice=float(data.get("salePrice")) if data.get("salePrice") else None,
        image=data.get("image", "/images/logo.png"),
        imagesJson=data.get("imagesJson"),
        status=data.get("status", "ACTIVE"),
        isFeatured=data.get("isFeatured", False),
        inStock=data.get("inStock", True),
        isActive=data.get("isActive", True),
        advanceNoticeDays=int(data.get("advanceNoticeDays", 7)),
        advanceNoticeText=data.get("advanceNoticeText")
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    variants_data = data.get("variants", [])
    for v in variants_data:
        variant = ProductVariant(
            productId=product.id,
            name=v.get("name"),
            price=float(v.get("price", price)),
            stock=int(v.get("stock", 100)),
            glitterOption=v.get("glitterOption")
        )
        db.add(variant)

    db.commit()
    return {"success": True, "message": "Product created", "product": {"id": product.id, "name": product.name}}

@router.put("/products")
def admin_update_product_body(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_id = data.get("id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Product ID is required")
    return perform_product_update(target_id, data, db)

@router.put("/products/{id}")
def admin_update_product_path(id: str, data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_product_update(id, data, db)

def perform_product_update(target_id: str, data: dict, db: Session):
    product = db.query(Product).filter(Product.id == target_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field in ["name", "slug", "description", "shortDescription", "categoryId", "image", "imagesJson", "status", "advanceNoticeText"]:
        if field in data and data[field] is not None:
            setattr(product, field, data[field])

    for float_field in ["price", "salePrice"]:
        if float_field in data and data[float_field] is not None:
            setattr(product, float_field, float(data[float_field]))

    for bool_field in ["isFeatured", "inStock", "isActive", "colorOptionAvailable", "customizationAvailable"]:
        if bool_field in data and data[bool_field] is not None:
            setattr(product, bool_field, bool(data[bool_field]))

    db.commit()
    return {"success": True, "message": "Product updated"}

@router.delete("/products")
def admin_delete_product_query(id: Optional[str] = Query(None), admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not id:
        raise HTTPException(status_code=400, detail="Product ID is required")
    return perform_product_delete(id, db)

@router.delete("/products/{id}")
def admin_delete_product_path(id: str, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_product_delete(id, db)

def perform_product_delete(target_id: str, db: Session):
    product = db.query(Product).filter(Product.id == target_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"success": True, "message": "Product deleted"}

# ----------------------------------------------------
# 4. ORDERS MANAGEMENT
# ----------------------------------------------------

@router.get("/orders")
def admin_get_orders(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).options(joinedload(Order.orderItems)).order_by(Order.createdAt.desc()).all()
    return orders

@router.put("/orders")
def admin_update_order_status_body(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_id = data.get("orderId") or data.get("id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Order ID is required")
    return perform_order_status_update(target_id, data, db)

@router.put("/orders/{id}")
def admin_update_order_status_path(id: str, data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_order_status_update(id, data, db)

def perform_order_status_update(target_id: str, data: dict, db: Session):
    order = db.query(Order).filter(Order.id == target_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order_status = data.get("orderStatus")
    payment_status = data.get("paymentStatus")

    if order_status:
        order.orderStatus = order_status
    if payment_status:
        order.paymentStatus = payment_status

    db.commit()
    return {"success": True, "message": "Order status updated", "order": {"id": order.id, "orderStatus": order.orderStatus, "paymentStatus": order.paymentStatus}}

@router.delete("/orders/clear-all")
def admin_clear_all_orders(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    count = len(orders)
    for o in orders:
        db.delete(o)
    db.commit()
    return {"success": True, "message": f"Cleared {count} test payment orders successfully"}

@router.delete("/orders")
def admin_delete_order(id: Optional[str] = Query(None), admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not id:
        raise HTTPException(status_code=400, detail="Order ID is required")
    if id == "clear-all":
        return admin_clear_all_orders(admin, db)
    return perform_order_delete(id, db)

@router.delete("/orders/{id}")
def admin_delete_order_path(id: str, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    if id == "clear-all":
        return admin_clear_all_orders(admin, db)
    return perform_order_delete(id, db)

def perform_order_delete(target_id: str, db: Session):
    order = db.query(Order).filter(Order.id == target_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"success": True, "message": "Order deleted successfully"}

# ----------------------------------------------------
# 5. CUSTOMERS & USERS MANAGEMENT
# ----------------------------------------------------

@router.get("/customers")
@router.get("/users")
def admin_get_customers(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.createdAt.desc()).all()
    result = []
    for u in users:
        user_orders = db.query(Order).filter(Order.userId == u.id).all()
        order_count = len(user_orders)
        total_spent = sum(o.totalAmount for o in user_orders if o.paymentStatus == "PAID")
        result.append({
            "id": u.id,
            "name": u.name or f"{u.firstName or ''} {u.lastName or ''}".strip() or u.email,
            "email": u.email,
            "phone": u.phone or "N/A",
            "role": u.role,
            "accountStatus": u.accountStatus,
            "orderCount": order_count,
            "totalSpent": total_spent,
            "createdAt": u.createdAt.isoformat() if u.createdAt else None
        })
    return result

@router.put("/customers")
def admin_toggle_user_status_body(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_id = data.get("userId") or data.get("id")
    if not target_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    return perform_user_status_toggle(target_id, data, db)

@router.put("/users/{id}/status")
def admin_toggle_user_status_path(id: str, data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_user_status_toggle(id, data, db)

def perform_user_status_toggle(target_id: str, data: dict, db: Session):
    user = db.query(User).filter(User.id == target_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    status_val = data.get("accountStatus")
    if status_val:
        user.accountStatus = status_val
        db.commit()
    return {"success": True, "message": "User status updated"}

# ----------------------------------------------------
# 6. CUSTOM REQUESTS MANAGEMENT
# ----------------------------------------------------

@router.get("/custom-requests")
def admin_get_custom_requests(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    requests = db.query(CustomRequest).order_by(CustomRequest.createdAt.desc()).all()
    return requests

@router.put("/custom-requests")
def admin_update_custom_request_body(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    target_id = data.get("id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Custom request ID is required")
    return perform_custom_request_update(target_id, data, db)

@router.put("/custom-requests/{id}")
def admin_update_custom_request_path(id: str, data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return perform_custom_request_update(id, data, db)

def perform_custom_request_update(target_id: str, data: dict, db: Session):
    req = db.query(CustomRequest).filter(CustomRequest.id == target_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Custom request not found")

    status_val = data.get("status")
    if status_val:
        req.status = status_val
        db.commit()
    return {"success": True, "message": "Custom request status updated"}

# ----------------------------------------------------
# 7. ADMIN SETTINGS & SITE CONTENT
# ----------------------------------------------------

@router.get("/settings")
def admin_get_settings(db: Session = Depends(get_db)):
    settings_items = db.query(AdminSetting).all()
    result = {item.key: item.value for item in settings_items}
    return result

@router.post("/settings")
def admin_save_settings(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    for k, v in data.items():
        setting = db.query(AdminSetting).filter(AdminSetting.key == k).first()
        if setting:
            setting.value = str(v)
        else:
            db.add(AdminSetting(key=k, value=str(v)))
    db.commit()
    return {"success": True, "message": "Settings saved"}

@router.get("/content")
def admin_get_content(db: Session = Depends(get_db)):
    content_items = db.query(SiteContent).all()
    result = {item.key: item.value for item in content_items}
    return result

@router.post("/content")
def admin_save_content(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    for k, v in data.items():
        content = db.query(SiteContent).filter(SiteContent.key == k).first()
        if content:
            content.value = str(v)
        else:
            db.add(SiteContent(key=k, value=str(v)))
    db.commit()
    return {"success": True, "message": "Content saved"}

# Public /api/content router
content_router = APIRouter(prefix="/api/content", tags=["Public Content"])

@content_router.get("")
def get_public_content(db: Session = Depends(get_db)):
    content_items = db.query(SiteContent).all()
    result = {item.key: item.value for item in content_items}
    return result

@content_router.post("")
def save_public_content(data: dict, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    for k, v in data.items():
        content = db.query(SiteContent).filter(SiteContent.key == k).first()
        if content:
            content.value = str(v)
        else:
            db.add(SiteContent(key=k, value=str(v)))
    db.commit()
    return {"success": True, "message": "Content saved"}
