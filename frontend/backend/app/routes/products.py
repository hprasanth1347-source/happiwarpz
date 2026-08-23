from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.database.models import Product, Category, ProductVariant, Review
from app.schemas.product import ProductResponse, CategoryResponse

router = APIRouter(prefix="/api", tags=["Products & Categories"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.isActive == True).all()
    return categories

@router.get("/products")
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(joinedload(Product.category), joinedload(Product.variants)).filter(Product.isActive == True)

    if category:
        query = query.join(Category).filter(Category.slug == category)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter((Product.name.ilike(s)) | (Product.description.ilike(s)))

    if featured is not None:
        query = query.filter(Product.isFeatured == featured)

    if sort == "price-low":
        query = query.order_by(Product.price.asc())
    elif sort == "price-high":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.createdAt.asc())

    products = query.all()
    return products

@router.get("/products/{id_or_slug}")
def get_product(id_or_slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.variants)
    ).filter(
        (Product.id == id_or_slug) | (Product.slug == id_or_slug)
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews = db.query(Review).options(joinedload(Review.user)).filter(Review.productId == product.id).all()
    review_list = [
        {
            "id": r.id,
            "rating": r.rating,
            "title": r.title,
            "comment": r.comment,
            "createdAt": r.createdAt.isoformat() if r.createdAt else None,
            "userName": r.user.name or r.user.firstName or "Anonymous Customer"
        }
        for r in reviews
    ]

    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "description": product.description,
        "shortDescription": product.shortDescription,
        "categoryId": product.categoryId,
        "category": {"id": product.category.id, "name": product.category.name, "slug": product.category.slug} if product.category else None,
        "price": product.price,
        "salePrice": product.salePrice,
        "sku": product.sku,
        "image": product.image,
        "imagesJson": product.imagesJson,
        "status": product.status,
        "isFeatured": product.isFeatured,
        "inStock": product.inStock,
        "isActive": product.isActive,
        "advanceNoticeDays": product.advanceNoticeDays,
        "advanceNoticeText": product.advanceNoticeText,
        "colorOptionAvailable": product.colorOptionAvailable,
        "customizationAvailable": product.customizationAvailable,
        "createdAt": product.createdAt.isoformat() if product.createdAt else None,
        "variants": [
            {
                "id": v.id,
                "name": v.name,
                "price": v.price,
                "stock": v.stock,
                "glitterOption": v.glitterOption,
                "status": v.status,
            }
            for v in product.variants
        ],
        "reviews": review_list
    }
