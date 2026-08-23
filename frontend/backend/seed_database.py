import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.database import engine, Base, SessionLocal
from app.database import models
from app.utils.security import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if admin already exists
        admin = db.query(models.User).filter(models.User.email == "admin@happiwrapz.com").first()
        if not admin:
            admin_user = models.User(
                email="admin@happiwrapz.com",
                firstName="Happiwrapz",
                lastName="Admin",
                name="Happiwrapz Admin",
                phone="+91 98765 43210",
                passwordHash=get_password_hash("AdminHappi2026!"),
                role="ADMIN",
                accountStatus="ACTIVE"
            )
            db.add(admin_user)
            db.commit()
            print("Created Admin user: admin@happiwrapz.com / AdminHappi2026!")

        # CMS Contents
        default_contents = [
            ("heroTitle", "Handmade Bouquets & Everlasting Memories"),
            ("heroSubtitle", "Crafted with passion, velvet elegance, and love. Premium handmade floral arrangements, glitter roses, sunflowers, keychains & bespoke custom gifts."),
            ("announcementBanner", "✨ ONLINE PAYMENT ONLY • FREE DELIVERY ON ALL ORDERS"),
            ("aboutTitle", "About Happiwrapz"),
            ("aboutText", "Happiwrapz creates handmade floral bouquets, everlasting velvet roses, sunflowers, keychains, and thoughtful personalized gifts designed to make every moment unforgettable."),
            ("supportPhone", "+91 98765 43210"),
            ("supportEmail", "support@happiwrapz.com"),
            ("instagramUrl", "https://www.instagram.com/happiwrapz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="),
        ]

        for k, v in default_contents:
            if not db.query(models.SiteContent).filter(models.SiteContent.key == k).first():
                db.add(models.SiteContent(key=k, value=v))
        db.commit()

        # Seed Categories
        cat_roses = db.query(models.Category).filter(models.Category.slug == "rose-bouquets").first()
        if not cat_roses:
            cat_roses = models.Category(
                name="Rose Bouquets",
                slug="rose-bouquets",
                description="Elegant handmade roses for unforgettable moments.",
                image="/images/products/roses/rose-without-glitter.png"
            )
            db.add(cat_roses)

        cat_sunflowers = db.query(models.Category).filter(models.Category.slug == "sunflower-bouquets").first()
        if not cat_sunflowers:
            cat_sunflowers = models.Category(
                name="Sunflower Bouquets",
                slug="sunflower-bouquets",
                description="Bright blooms made to spread happiness.",
                image="/images/products/sunflowers/sunflower-3-flowers.png"
            )
            db.add(cat_sunflowers)

        cat_keychains = db.query(models.Category).filter(models.Category.slug == "handmade-keychains").first()
        if not cat_keychains:
            cat_keychains = models.Category(
                name="Handmade Keychains",
                slug="handmade-keychains",
                description="Small handmade gifts with a big meaning.",
                image="/images/products/keychains/heart-trio.png"
            )
            db.add(cat_keychains)

        cat_custom = db.query(models.Category).filter(models.Category.slug == "custom-gifts").first()
        if not cat_custom:
            cat_custom = models.Category(
                name="Custom Gifts",
                slug="custom-gifts",
                description="Personalized creations made especially for you.",
                image="/images/original/happiwrapz_original_4.jpg"
            )
            db.add(cat_custom)

        db.commit()

        # Seed Products
        if db.query(models.Product).count() == 0:
            p1 = models.Product(
                name="Rose Bouquet — Without Glitter",
                slug="rose-bouquet-without-glitter",
                description="Beautiful handmade velvet rose bouquet crafted without glitter for a classic, subtle, and elegant matte finish. Perfect for romantic anniversaries, birthdays, and classic flower lovers.",
                shortDescription="Handmade classic velvet rose bouquet in matte finish.",
                categoryId=cat_roses.id,
                price=299.0,
                image="/images/products/roses/rose-without-glitter.png",
                isFeatured=True,
                inStock=True,
                isActive=True,
                advanceNoticeDays=7,
                advanceNoticeText="Place bouquet order at least 1 week in advance."
            )
            db.add(p1)
            db.flush()

            v1_1 = models.ProductVariant(productId=p1.id, name="1 Rose", price=299.0, glitterOption="WITHOUT_GLITTER")
            v1_2 = models.ProductVariant(productId=p1.id, name="3 Roses", price=599.0, glitterOption="WITHOUT_GLITTER")
            v1_3 = models.ProductVariant(productId=p1.id, name="5 Roses", price=899.0, glitterOption="WITHOUT_GLITTER")
            v1_4 = models.ProductVariant(productId=p1.id, name="10 Roses", price=1499.0, glitterOption="WITHOUT_GLITTER")
            db.add_all([v1_1, v1_2, v1_3, v1_4])

            p2 = models.Product(
                name="Glitter Rose Bouquet",
                slug="glitter-rose-bouquet",
                description="Handmade velvet roses infused with shimmering glitter accents that catch the light from every angle. Ideal for birthdays, proposals, celebrations, and grand romantic gestures.",
                shortDescription="Handcrafted glitter rose bouquet with sparkle finish.",
                categoryId=cat_roses.id,
                price=349.0,
                image="/images/products/roses/rose-with-glitter.png",
                isFeatured=True,
                inStock=True,
                isActive=True,
                advanceNoticeDays=7,
                advanceNoticeText="Place bouquet order at least 1 week in advance."
            )
            db.add(p2)
            db.flush()

            v2_1 = models.ProductVariant(productId=p2.id, name="1 Glitter Rose", price=349.0, glitterOption="WITH_GLITTER")
            v2_2 = models.ProductVariant(productId=p2.id, name="3 Glitter Roses", price=699.0, glitterOption="WITH_GLITTER")
            v2_3 = models.ProductVariant(productId=p2.id, name="5 Glitter Roses", price=999.0, glitterOption="WITH_GLITTER")
            v2_4 = models.ProductVariant(productId=p2.id, name="10 Glitter Roses", price=1699.0, glitterOption="WITH_GLITTER")
            db.add_all([v2_1, v2_2, v2_3, v2_4])

            p3 = models.Product(
                name="Sunshine Sunflower Bouquet",
                slug="sunshine-sunflower-bouquet",
                description="Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns. Symbolizes happiness, loyalty, and warmth.",
                shortDescription="Cheerful handmade sunflower bouquet arrangement.",
                categoryId=cat_sunflowers.id,
                price=449.0,
                image="/images/products/sunflowers/sunflower-3-flowers.png",
                isFeatured=True,
                inStock=True,
                isActive=True,
                advanceNoticeDays=7,
                advanceNoticeText="Place bouquet order at least 1 week in advance."
            )
            db.add(p3)
            db.flush()

            v3_1 = models.ProductVariant(productId=p3.id, name="1 Sunflower", price=449.0)
            v3_2 = models.ProductVariant(productId=p3.id, name="3 Sunflowers", price=799.0)
            v3_3 = models.ProductVariant(productId=p3.id, name="5 Sunflowers", price=1199.0)
            db.add_all([v3_1, v3_2, v3_3])

            p4 = models.Product(
                name="Handcrafted Heart Charm Keychain",
                slug="handcrafted-heart-charm-keychain",
                description="Adorable handmade velvet heart trio keychain crafted with fine craftsmanship. Makes a lovely daily accessory, bag charm, or birthday giveaway gift.",
                shortDescription="Handcrafted velvet heart keychain accessory.",
                categoryId=cat_keychains.id,
                price=149.0,
                image="/images/products/keychains/heart-trio.png",
                isFeatured=True,
                inStock=True,
                isActive=True
            )
            db.add(p4)

            db.commit()
            print("Successfully seeded products and variants into database!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
