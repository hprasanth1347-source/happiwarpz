import { prisma, connectDB } from "../backend/src/config/database.js";

const CATEGORIES_DATA = [
  {
    id: "cat-1",
    slug: "rose-bouquets",
    name: "Rose Bouquets",
    description: "Elegant handmade roses for unforgettable moments.",
    isActive: true,
  },
  {
    id: "cat-2",
    slug: "sunflower-bouquets",
    name: "Sunflower Bouquets",
    description: "Bright blooms made to spread happiness.",
    isActive: true,
  },
  {
    id: "cat-3",
    slug: "handmade-keychains",
    name: "Handmade Keychains",
    description: "Small handmade gifts with a big meaning.",
    isActive: true,
  },
  {
    id: "cat-4",
    slug: "custom-gifts",
    name: "Custom Gifts",
    description: "Personalized creations made especially for you.",
    isActive: true,
  },
];

const PRODUCTS_DATA = [
  {
    id: "prod-1",
    name: "Rose Bouquet — Without Glitter",
    slug: "rose-bouquet-without-glitter",
    description: "Beautiful handmade velvet rose bouquet crafted without glitter for a classic, subtle, and elegant matte finish. Perfect for romantic anniversaries, birthdays, and classic flower lovers.",
    shortDescription: "Handmade classic velvet rose bouquet in matte finish.",
    categorySlug: "rose-bouquets",
    price: 299.0,
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { name: "1 Rose", price: 299.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "3 Roses", price: 599.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "5 Roses", price: 899.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "10 Roses", price: 1499.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    id: "prod-2",
    name: "Glitter Rose Bouquet",
    slug: "glitter-rose-bouquet",
    description: "Handmade velvet roses infused with shimmering glitter accents that catch the light from every angle. Ideal for birthdays, proposals, celebrations, and grand romantic gestures.",
    shortDescription: "Handcrafted glitter rose bouquet with sparkle finish.",
    categorySlug: "rose-bouquets",
    price: 349.0,
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { name: "1 Glitter Rose", price: 349.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "3 Glitter Roses", price: 699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "5 Glitter Roses", price: 999.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "10 Glitter Roses", price: 1699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    id: "prod-3",
    name: "Sunshine Sunflower Bouquet",
    slug: "sunshine-sunflower-bouquet",
    description: "Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns. Symbolizes happiness, loyalty, and warmth.",
    shortDescription: "Cheerful handmade sunflower bouquet arrangement.",
    categorySlug: "sunflower-bouquets",
    price: 449.0,
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { name: "1 Sunflower", price: 449.0, stock: 100, status: "ACTIVE" },
      { name: "3 Sunflowers", price: 799.0, stock: 100, status: "ACTIVE" },
      { name: "5 Sunflowers", price: 1199.0, stock: 100, status: "ACTIVE" },
    ],
  },
  {
    id: "prod-4",
    name: "Handcrafted Heart Charm Keychain",
    slug: "handcrafted-heart-charm-keychain",
    description: "Adorable handmade velvet heart trio keychain crafted with fine craftsmanship. Makes a lovely daily accessory, bag charm, or birthday giveaway gift.",
    shortDescription: "Handcrafted velvet heart keychain accessory.",
    categorySlug: "handmade-keychains",
    price: 149.0,
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
  },
  {
    id: "prod-5",
    name: "Bespoke Custom Luxury Gift Hamper",
    slug: "bespoke-custom-luxury-gift-hamper",
    description: "Personalized luxury handmade flower hamper customized with your preferred colors, greeting notes, and floral count.",
    shortDescription: "Custom handmade gift hamper tailored to your order.",
    categorySlug: "custom-gifts",
    price: 999.0,
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
  },
];

async function importProductsStandalone() {
  console.log("\n=========================================================");
  console.log("📦 IMPORTING ALL PRODUCT & CATEGORY DETAILS TO DATABASE");
  console.log("🚫 (Images completely omitted from database)");
  console.log("=========================================================\n");

  try {
    await connectDB();

    // 1. Save Categories without images
    console.log("1. Saving Categories to Database (without images)...");
    const categoryMap = new Map();

    for (const cat of CATEGORIES_DATA) {
      let existingCat = await prisma.category.findFirst({ where: { slug: cat.slug } }).catch(() => null);

      if (existingCat) {
        existingCat = await prisma.category.update({
          where: { id: existingCat.id },
          data: {
            name: cat.name,
            description: cat.description,
            image: null, // DO NOT add image in database
            isActive: cat.isActive,
          },
        });
      } else {
        existingCat = await prisma.category.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: null, // DO NOT add image in database
            isActive: cat.isActive,
          },
        });
      }

      categoryMap.set(cat.slug, existingCat.id);
      console.log(`   ✅ Category saved: ${existingCat.name} (ID: ${existingCat.id})`);
    }

    // 2. Save Products without images
    console.log("\n2. Saving Products & Variants to Database (without images)...");

    for (const prod of PRODUCTS_DATA) {
      const dbCategoryId = categoryMap.get(prod.categorySlug);

      if (!dbCategoryId) {
        console.warn(`   ⚠️ Category not found for: ${prod.name}`);
        continue;
      }

      const sku = `HW-${prod.slug.toUpperCase().slice(0, 8)}-${Math.floor(100 + Math.random() * 900)}`;
      let existingProd = await prisma.product.findFirst({ where: { slug: prod.slug } }).catch(() => null);

      if (existingProd) {
        existingProd = await prisma.product.update({
          where: { id: existingProd.id },
          data: {
            name: prod.name,
            description: prod.description,
            shortDescription: prod.shortDescription || "",
            price: Number(prod.price),
            salePrice: prod.salePrice ? Number(prod.salePrice) : null,
            image: "", // DO NOT add image in database
            images: [], // DO NOT add image in database
            inStock: prod.inStock !== undefined ? prod.inStock : true,
            isActive: prod.isActive !== undefined ? prod.isActive : true,
            isFeatured: prod.isFeatured !== undefined ? prod.isFeatured : false,
            advanceNoticeDays: prod.advanceNoticeDays || 7,
            advanceNoticeText: prod.advanceNoticeText || null,
            colorOptionAvailable: prod.colorOptionAvailable || false,
            customizationAvailable: prod.customizationAvailable || false,
            categoryId: dbCategoryId,
          },
        });
      } else {
        existingProd = await prisma.product.create({
          data: {
            name: prod.name,
            slug: prod.slug,
            description: prod.description,
            shortDescription: prod.shortDescription || "",
            price: Number(prod.price),
            salePrice: prod.salePrice ? Number(prod.salePrice) : null,
            sku: sku,
            image: "", // DO NOT add image in database
            images: [], // DO NOT add image in database
            inStock: prod.inStock !== undefined ? prod.inStock : true,
            isActive: prod.isActive !== undefined ? prod.isActive : true,
            isFeatured: prod.isFeatured !== undefined ? prod.isFeatured : false,
            advanceNoticeDays: prod.advanceNoticeDays || 7,
            advanceNoticeText: prod.advanceNoticeText || null,
            colorOptionAvailable: prod.colorOptionAvailable || false,
            customizationAvailable: prod.customizationAvailable || false,
            categoryId: dbCategoryId,
          },
        });
      }

      console.log(`   ✅ Product saved: ${existingProd.name} (Price: ₹${existingProd.price})`);

      // Delete existing variants and insert new
      await prisma.productVariant.deleteMany({ where: { productId: existingProd.id } }).catch(() => null);

      if (prod.variants && prod.variants.length > 0) {
        for (let i = 0; i < prod.variants.length; i++) {
          const v = prod.variants[i];
          await prisma.productVariant.create({
            data: {
              productId: existingProd.id,
              name: v.name,
              price: Number(v.price),
              stock: v.stock || 100,
              sku: `${existingProd.sku}-V${i + 1}`,
              status: v.status || "ACTIVE",
            },
          });
          console.log(`      ↳ Variant: ${v.name} (₹${v.price})`);
        }
      }
    }

    console.log("\n=========================================================");
    console.log("🎉 ALL PRODUCT DETAILS SUCCESSFULLY SAVED TO DATABASE (0 IMAGES)!");
    console.log("=========================================================\n");
  } catch (error) {
    console.error("❌ Database import failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

importProductsStandalone();
