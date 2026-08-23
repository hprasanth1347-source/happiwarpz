import sqlite3
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.database import engine, Base, SessionLocal
from app.database import models

def migrate():
    dev_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dev.db"))
    if not os.path.exists(dev_db_path):
        print(f"No existing dev.db found at {dev_db_path}. Creating fresh database schema.")
        Base.metadata.create_all(bind=engine)
        return

    print(f"Found existing Prisma dev.db at {dev_db_path}. Starting migration into SQLAlchemy...")
    Base.metadata.create_all(bind=engine)

    src_conn = sqlite3.connect(dev_db_path)
    src_conn.row_factory = sqlite3.Row
    src_cursor = src_conn.cursor()

    db = SessionLocal()

    try:
        # Migrate Users
        src_cursor.execute("SELECT * FROM User")
        users = src_cursor.fetchall()
        print(f"Migrating {len(users)} users...")
        for u in users:
            row = dict(u)
            if not db.query(models.User).filter(models.User.id == row["id"]).first():
                user = models.User(
                    id=row["id"],
                    firstName=row.get("firstName"),
                    lastName=row.get("lastName"),
                    name=row.get("name"),
                    email=row["email"],
                    phone=row.get("phone"),
                    passwordHash=row.get("passwordHash"),
                    resetToken=row.get("resetToken"),
                    role=row.get("role", "CUSTOMER"),
                    accountStatus=row.get("accountStatus", "ACTIVE"),
                )
                db.add(user)

        # Migrate Categories
        src_cursor.execute("SELECT * FROM Category")
        categories = src_cursor.fetchall()
        print(f"Migrating {len(categories)} categories...")
        for c in categories:
            row = dict(c)
            if not db.query(models.Category).filter(models.Category.id == row["id"]).first():
                cat = models.Category(
                    id=row["id"],
                    name=row["name"],
                    slug=row["slug"],
                    description=row.get("description"),
                    image=row.get("image"),
                    isActive=bool(row.get("isActive", 1)),
                )
                db.add(cat)

        db.commit()

        # Migrate Products
        src_cursor.execute("SELECT * FROM Product")
        products = src_cursor.fetchall()
        print(f"Migrating {len(products)} products...")
        for p in products:
            row = dict(p)
            if not db.query(models.Product).filter(models.Product.id == row["id"]).first():
                prod = models.Product(
                    id=row["id"],
                    name=row["name"],
                    slug=row["slug"],
                    description=row["description"],
                    shortDescription=row.get("shortDescription"),
                    categoryId=row["categoryId"],
                    price=float(row["price"]),
                    salePrice=float(row["salePrice"]) if row.get("salePrice") is not None else None,
                    sku=row.get("sku"),
                    image=row["image"],
                    imagesJson=row.get("imagesJson"),
                    status=row.get("status", "ACTIVE"),
                    isFeatured=bool(row.get("isFeatured", 0)),
                    inStock=bool(row.get("inStock", 1)),
                    isActive=bool(row.get("isActive", 1)),
                    advanceNoticeDays=int(row.get("advanceNoticeDays", 7)),
                    advanceNoticeText=row.get("advanceNoticeText"),
                    colorOptionAvailable=bool(row.get("colorOptionAvailable", 1)),
                    customizationAvailable=bool(row.get("customizationAvailable", 1)),
                )
                db.add(prod)

        db.commit()

        # Migrate Product Variants
        src_cursor.execute("SELECT * FROM ProductVariant")
        variants = src_cursor.fetchall()
        print(f"Migrating {len(variants)} product variants...")
        for v in variants:
            row = dict(v)
            if not db.query(models.ProductVariant).filter(models.ProductVariant.id == row["id"]).first():
                variant = models.ProductVariant(
                    id=row["id"],
                    productId=row["productId"],
                    name=row["name"],
                    price=float(row["price"]),
                    stock=int(row.get("stock", 100)),
                    sku=row.get("sku"),
                    glitterOption=row.get("glitterOption"),
                    status=row.get("status", "ACTIVE"),
                )
                db.add(variant)

        db.commit()

        # Migrate Orders & OrderItems
        src_cursor.execute("SELECT * FROM 'Order'")
        orders = src_cursor.fetchall()
        print(f"Migrating {len(orders)} orders...")
        for o in orders:
            row = dict(o)
            if not db.query(models.Order).filter(models.Order.id == row["id"]).first():
                order = models.Order(
                    id=row["id"],
                    orderNumber=row["orderNumber"],
                    userId=row.get("userId"),
                    customerName=row["customerName"],
                    customerEmail=row["customerEmail"],
                    customerPhone=row["customerPhone"],
                    address=row["address"],
                    city=row["city"],
                    state=row["state"],
                    pincode=row["pincode"],
                    subtotal=float(row["subtotal"]),
                    deliveryCharge=float(row.get("deliveryCharge", 0)),
                    totalAmount=float(row["totalAmount"]),
                    paymentStatus=row.get("paymentStatus", "PENDING"),
                    orderStatus=row.get("orderStatus", "CONFIRMED"),
                    deliveryDate=row.get("deliveryDate"),
                    razorpayOrderId=row.get("razorpayOrderId"),
                    razorpayPaymentId=row.get("razorpayPaymentId"),
                )
                db.add(order)

        db.commit()

        src_cursor.execute("SELECT * FROM OrderItem")
        items = src_cursor.fetchall()
        print(f"Migrating {len(items)} order items...")
        for item_row in items:
            row = dict(item_row)
            if not db.query(models.OrderItem).filter(models.OrderItem.id == row["id"]).first():
                order_item = models.OrderItem(
                    id=row["id"],
                    orderId=row["orderId"],
                    productId=row.get("productId"),
                    productName=row["productName"],
                    variantName=row.get("variantName"),
                    quantity=int(row["quantity"]),
                    price=float(row["price"]),
                    customColor=row.get("customColor"),
                    customMessage=row.get("customMessage"),
                    specialInstructions=row.get("specialInstructions"),
                    referenceImageUrl=row.get("referenceImageUrl"),
                )
                db.add(order_item)

        db.commit()

        # Migrate Custom Requests
        src_cursor.execute("SELECT * FROM CustomRequest")
        reqs = src_cursor.fetchall()
        print(f"Migrating {len(reqs)} custom requests...")
        for r in reqs:
            row = dict(r)
            if not db.query(models.CustomRequest).filter(models.CustomRequest.id == row["id"]).first():
                creq = models.CustomRequest(
                    id=row["id"],
                    userId=row.get("userId"),
                    customerName=row["customerName"],
                    customerEmail=row["customerEmail"],
                    customerPhone=row["customerPhone"],
                    productType=row["productType"],
                    preferredColors=row.get("preferredColors"),
                    quantity=str(row.get("quantity", "1")),
                    customMessage=row.get("customMessage"),
                    specialInstructions=row.get("specialInstructions"),
                    referenceImageUrl=row.get("referenceImageUrl"),
                    status=row.get("status", "NEW"),
                )
                db.add(creq)

        db.commit()

        # Migrate SiteContent & AdminSettings
        try:
            src_cursor.execute("SELECT * FROM SiteContent")
            contents = src_cursor.fetchall()
            for sc in contents:
                row = dict(sc)
                if not db.query(models.SiteContent).filter(models.SiteContent.key == row["key"]).first():
                    db.add(models.SiteContent(id=row["id"], key=row["key"], value=row["value"]))
            db.commit()
        except Exception as e:
            print("SiteContent migration note:", e)

        try:
            src_cursor.execute("SELECT * FROM AdminSetting")
            settings_list = src_cursor.fetchall()
            for st in settings_list:
                row = dict(st)
                if not db.query(models.AdminSetting).filter(models.AdminSetting.key == row["key"]).first():
                    db.add(models.AdminSetting(id=row["id"], key=row["key"], value=row["value"]))
            db.commit()
        except Exception as e:
            print("AdminSetting migration note:", e)

        print("Migration from dev.db to SQLAlchemy database (happiwrapz.db) completed successfully!")

    except Exception as err:
        print(f"Error during migration: {err}")
        db.rollback()
    finally:
        src_conn.close()
        db.close()

if __name__ == "__main__":
    migrate()
