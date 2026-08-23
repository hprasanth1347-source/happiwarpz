import { MongoClient, ObjectId } from "../backend/node_modules/mongodb/lib/index.js";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/happiwrapz";
const DB_NAME = "happiwrapz";

const CATEGORIES_DATA = [
  {
    slug: "rose-bouquets",
    name: "Rose Bouquets",
    description: "Elegant handmade roses for unforgettable moments.",
    image: null, // DO NOT add image in database
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "sunflower-bouquets",
    name: "Sunflower Bouquets",
    description: "Bright blooms made to spread happiness.",
    image: null, // DO NOT add image in database
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "handmade-keychains",
    name: "Handmade Keychains",
    description: "Small handmade gifts with a big meaning.",
    image: null, // DO NOT add image in database
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "custom-gifts",
    name: "Custom Gifts",
    description: "Personalized creations made especially for you.",
    image: null, // DO NOT add image in database
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const PRODUCTS_DATA = [
  {
    name: "Rose Bouquet — Without Glitter",
    slug: "rose-bouquet-without-glitter",
    description: "Beautiful handmade velvet rose bouquet crafted without glitter for a classic, subtle, and elegant matte finish. Perfect for romantic anniversaries, birthdays, and classic flower lovers.",
    shortDescription: "Handmade classic velvet rose bouquet in matte finish.",
    categorySlug: "rose-bouquets",
    price: 299.0,
    salePrice: 249.0,
    sku: "HW-ROSE-MATTE-01",
    image: "", // DO NOT add image in database
    images: [], // DO NOT add image in database
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      { name: "1 Rose", price: 299.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "3 Roses", price: 599.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "5 Roses", price: 899.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { name: "10 Roses", price: 1499.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    name: "Glitter Rose Bouquet",
    slug: "glitter-rose-bouquet",
    description: "Handmade velvet roses infused with shimmering glitter accents that catch the light from every angle. Ideal for birthdays, proposals, celebrations, and grand romantic gestures.",
    shortDescription: "Handcrafted glitter rose bouquet with sparkle finish.",
    categorySlug: "rose-bouquets",
    price: 349.0,
    salePrice: 299.0,
    sku: "HW-ROSE-GLITTER-02",
    image: "", // DO NOT add image in database
    images: [], // DO NOT add image in database
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      { name: "1 Glitter Rose", price: 349.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "3 Glitter Roses", price: 699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "5 Glitter Roses", price: 999.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { name: "10 Glitter Roses", price: 1699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    name: "Sunshine Sunflower Bouquet",
    slug: "sunshine-sunflower-bouquet",
    description: "Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns. Symbolizes happiness, loyalty, and warmth.",
    shortDescription: "Cheerful handmade sunflower bouquet arrangement.",
    categorySlug: "sunflower-bouquets",
    price: 449.0,
    salePrice: 399.0,
    sku: "HW-SUNFLOWER-03",
    image: "", // DO NOT add image in database
    images: [], // DO NOT add image in database
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      { name: "1 Sunflower", price: 449.0, stock: 100, status: "ACTIVE" },
      { name: "3 Sunflowers", price: 799.0, stock: 100, status: "ACTIVE" },
      { name: "5 Sunflowers", price: 1199.0, stock: 100, status: "ACTIVE" },
    ],
  },
  {
    name: "Handcrafted Heart Charm Keychain",
    slug: "handcrafted-heart-charm-keychain",
    description: "Adorable handmade velvet heart trio keychain crafted with fine craftsmanship. Makes a lovely daily accessory, bag charm, or birthday giveaway gift.",
    shortDescription: "Handcrafted velvet heart keychain accessory.",
    categorySlug: "handmade-keychains",
    price: 149.0,
    salePrice: 129.0,
    sku: "HW-HEART-KEY-04",
    image: "", // DO NOT add image in database
    images: [], // DO NOT add image in database
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Bespoke Custom Luxury Gift Hamper",
    slug: "bespoke-custom-luxury-gift-hamper",
    description: "Personalized luxury handmade flower hamper customized with your preferred colors, greeting notes, and floral count.",
    shortDescription: "Custom handmade gift hamper tailored to your order.",
    categorySlug: "custom-gifts",
    price: 999.0,
    salePrice: 899.0,
    sku: "HW-HAMPER-CUSTOM-05",
    image: "", // DO NOT add image in database
    images: [], // DO NOT add image in database
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabaseNative() {
  console.log("\n=========================================================");
  console.log("🚀 SAVING ALL PRODUCT DETAILS TO MONGODB (NO IMAGES)");
  console.log("=========================================================\n");

  const client = new MongoClient(MONGODB_URI, { directConnection: true, serverSelectionTimeoutMS: 3000 });

  try {
    await client.connect();
    console.log("🟢 Connected directly to MongoDB.");
    const db = client.db(DB_NAME);

    const categoriesCol = db.collection("Category");
    const productsCol = db.collection("Product");
    const variantsCol = db.collection("ProductVariant");

    // 1. Categories
    console.log("\n1. Saving Categories (0 images)...");
    const categoryMap = new Map();

    for (const cat of CATEGORIES_DATA) {
      const existing = await categoriesCol.findOne({ slug: cat.slug });
      let catId;
      if (existing) {
        catId = existing._id;
        await categoriesCol.updateOne(
          { _id: catId },
          {
            $set: {
              name: cat.name,
              description: cat.description,
              image: null, // DO NOT add image in database
              isActive: cat.isActive,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        const insertRes = await categoriesCol.insertOne({
          _id: new ObjectId(),
          ...cat,
        });
        catId = insertRes.insertedId;
      }
      categoryMap.set(cat.slug, catId);
      console.log(`   ✅ Category: ${cat.name} (ID: ${catId.toString()})`);
    }

    // 2. Products
    console.log("\n2. Saving Products & Variants (0 images)...");

    for (const prod of PRODUCTS_DATA) {
      const categoryId = categoryMap.get(prod.categorySlug);
      if (!categoryId) continue;

      const { variants, categorySlug, ...prodData } = prod;
      const existing = await productsCol.findOne({ slug: prod.slug });

      let prodId;
      if (existing) {
        prodId = existing._id;
        await productsCol.updateOne(
          { _id: prodId },
          {
            $set: {
              ...prodData,
              categoryId: categoryId,
              image: "", // DO NOT add image in database
              images: [], // DO NOT add image in database
              updatedAt: new Date(),
            },
          }
        );
      } else {
        const insertRes = await productsCol.insertOne({
          _id: new ObjectId(),
          ...prodData,
          categoryId: categoryId,
        });
        prodId = insertRes.insertedId;
      }

      console.log(`   ✅ Product: ${prod.name} (Price: ₹${prod.price})`);

      // Delete & insert variants
      await variantsCol.deleteMany({ productId: prodId });

      if (variants && variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          await variantsCol.insertOne({
            _id: new ObjectId(),
            productId: prodId,
            name: v.name,
            price: Number(v.price),
            stock: v.stock || 100,
            sku: `${prod.sku}-V${i + 1}`,
            status: v.status || "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`      ↳ Variant: ${v.name} (₹${v.price})`);
        }
      }
    }

    console.log("\n=========================================================");
    console.log("🎉 ALL PRODUCT DETAILS SUCCESSFULLY SAVED IN DATABASE!");
    console.log("=========================================================\n");
  } catch (err) {
    console.error("❌ MongoDB connection or write error:", err.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedDatabaseNative();
