import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Happiwrapz MongoDB database...");

  // Hash passwords for seed accounts
  const adminPasswordHash = await bcrypt.hash("ChangeThisPassword123!", 10);
  const customerPasswordHash = await bcrypt.hash("CustomerPassword123!", 10);

  // 1. Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      firstName: "Happiwrapz",
      lastName: "Admin",
      name: "Happiwrapz Store Admin",
      email: "admin@example.com",
      emailVerified: true,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      accountStatus: "ACTIVE",
    },
  });
  console.log("✅ Created Admin User: admin@example.com");

  // 2. Upsert Customer User
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      firstName: "Priya",
      lastName: "Sharma",
      name: "Priya Sharma",
      email: "customer@example.com",
      emailVerified: true,
      phone: "9876543210",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      accountStatus: "ACTIVE",
    },
  });
  console.log("✅ Created Customer User: customer@example.com");

  // 3. Create Categories
  const categoryData = [
    {
      name: "Flower Bouquets",
      slug: "flower-bouquets",
      description: "Handcrafted fresh red roses, lilies, and customized floral arrangements.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
    },
    {
      name: "Custom Gift Wraps",
      slug: "custom-gift-wraps",
      description: "Artisan black wrapping paper with satin ribbons and personalized bows.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
    },
    {
      name: "Luxury Hampers",
      slug: "luxury-hampers",
      description: "Curated gift hampers for anniversaries, birthdays, and celebrations.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    },
    {
      name: "Handcrafted Keychains",
      slug: "handcrafted-keychains",
      description: "Adorable handmade plush chenille stem pipe cleaner keychains, bag charms, and cute accessories.",
      image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
    },
  ];

  const categories = [];
  for (const cat of categoryData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(createdCat);
  }
  console.log(`✅ Created ${categories.length} Product Categories`);

  // 4. Create Products
  const bouquetCategory = categories.find((c) => c.slug === "flower-bouquets");
  const wrapCategory = categories.find((c) => c.slug === "custom-gift-wraps");
  const hamperCategory = categories.find((c) => c.slug === "luxury-hampers");
  const keychainCategory = categories.find((c) => c.slug === "handcrafted-keychains") || categories[0];

  const productData = [
    {
      name: "Velvet Crimson Rose Bouquet",
      slug: "velvet-crimson-rose-bouquet",
      description: "Signature bouquet featuring 24 premium long-stem crimson red roses wrapped in handcrafted matte black craft paper with a silk satin ribbon bow. Perfect for romantic anniversaries and special moments.",
      shortDescription: "24 fresh crimson roses in luxury black craft wrap.",
      categoryId: bouquetCategory.id,
      price: 1499,
      salePrice: 1299,
      sku: "HW-ROSE-001",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
      images: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
      ],
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
      colorOptionAvailable: true,
      advanceNoticeDays: 1,
    },
    {
      name: "Midnight Luxury Gift Wrap Set",
      slug: "midnight-luxury-gift-wrap-set",
      description: "Bespoke gift wrapping featuring dark textured paper, hand-tied crimson velvet bow, and personalized calligraphy note card.",
      shortDescription: "Artisan black craft wrap with velvet bow.",
      categoryId: wrapCategory.id,
      price: 899,
      salePrice: 749,
      sku: "HW-WRAP-002",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
      colorOptionAvailable: true,
    },
    {
      name: "Royal Celebration Gift Hamper",
      slug: "royal-celebration-gift-hamper",
      description: "An extravagant gift hamper containing gourmet chocolates, scented soy candle, custom photo frame, and a mini rose bouquet.",
      shortDescription: "Gourmet chocolates, scented candle & mini bouquet hamper.",
      categoryId: hamperCategory.id,
      price: 2999,
      salePrice: 2499,
      sku: "HW-HAMP-003",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    // Handcrafted Pipe Cleaner Keychains & Gifts
    {
      name: "Triple Stacked Hearts Pipe Cleaner Keychain",
      slug: "triple-stacked-hearts-keychain",
      description: "Charming handcrafted keychain crafted from premium soft chenille stems with 3 stacked hearts in vibrant Magenta, Soft Pink, and Pure White, finished with a silver keyring chain.",
      shortDescription: "Vibrant 3-tier plush hearts in magenta, pink & white.",
      categoryId: keychainCategory.id,
      price: 299,
      salePrice: 249,
      sku: "HW-KEY-001",
      image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
      colorOptionAvailable: true,
    },
    {
      name: "Cherry Velvet Bow & Pearl Keychain",
      slug: "cherry-velvet-bow-pearl-keychain",
      description: "Adorable pair of coiled red chenille stem cherries with an olive green velvet bow and a luminous pearl accent centerpiece.",
      shortDescription: "Coiled red cherries with olive bow & pearl centerpiece.",
      categoryId: keychainCategory.id,
      price: 349,
      salePrice: 299,
      sku: "HW-KEY-002",
      image: "https://images.unsplash.com/photo-1582142839970-2b932644346c?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Single Magenta Fluffy Heart Keychain",
      slug: "single-magenta-fluffy-heart-keychain",
      description: "Ultra-soft single magenta pink plush heart charm handmade with love using high-density fluffy pipe cleaners.",
      shortDescription: "Soft vibrant magenta plush heart key charm.",
      categoryId: keychainCategory.id,
      price: 199,
      salePrice: 169,
      sku: "HW-KEY-003",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
      isFeatured: false,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "White Daisy Flower Pipe Cleaner Keychain",
      slug: "white-daisy-flower-keychain",
      description: "Cheerful handmade daisy featuring 6 white chenille petals, a sunny orange pompom core, and a vibrant green stem.",
      shortDescription: "6-petal white daisy with orange pompom & stem.",
      categoryId: keychainCategory.id,
      price: 279,
      salePrice: 229,
      sku: "HW-KEY-004",
      image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Pink Tulip Flower Pipe Cleaner Keychain",
      slug: "pink-tulip-flower-keychain",
      description: "Sweet pastel pink tulip flower bulb handmade with chenille stems, detailed green stem, and curved leaves.",
      shortDescription: "Pastel pink tulip bloom with green stem & leaf.",
      categoryId: keychainCategory.id,
      price: 299,
      salePrice: 249,
      sku: "HW-KEY-005",
      image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Coiled Pink Ribbon Bow Keychain",
      slug: "coiled-pink-ribbon-bow-keychain",
      description: "Elegant layered ribbon bow key charm in soft pastel pink and magenta with a glowing pearl centerpiece and gold hardware keyring.",
      shortDescription: "Dual-tone pink ribbon bow with pearl & gold keyring.",
      categoryId: keychainCategory.id,
      price: 299,
      salePrice: 259,
      sku: "HW-KEY-006",
      image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Bright Sunflower Pipe Cleaner Keychain",
      slug: "bright-sunflower-keychain",
      description: "Radiant golden yellow sunflower made from chenille stems with a coiled chocolate brown center and dark green leaves.",
      shortDescription: "Golden yellow sunflower with brown core & leaves.",
      categoryId: keychainCategory.id,
      price: 319,
      salePrice: 279,
      sku: "HW-KEY-007",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Blue Tulip Trio Bouquet Keychain",
      slug: "blue-tulip-trio-bouquet-keychain",
      description: "Miniature bouquet charm featuring 3 sky blue pipe cleaner tulips tied with a pink ribbon bow and pearl accent.",
      shortDescription: "Trio of sky blue tulips tied with pink bow & pearl.",
      categoryId: keychainCategory.id,
      price: 379,
      salePrice: 329,
      sku: "HW-KEY-008",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "White Sakura Cherry Blossom Keychain",
      slug: "white-sakura-cherry-blossom-keychain",
      description: "Handcrafted white Sakura cherry blossom charm with delicate pink center gradient, pearl core, and gold chain.",
      shortDescription: "White cherry blossom with pink gradient core & pearl.",
      categoryId: keychainCategory.id,
      price: 319,
      salePrice: 279,
      sku: "HW-KEY-009",
      image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
      isFeatured: false,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Plush Magenta Strawberry Keychain",
      slug: "plush-magenta-strawberry-keychain",
      description: "Coiled vibrant magenta strawberry charm with green velvet leaves and mini pearl seed highlights.",
      shortDescription: "Coiled magenta strawberry with leaf top & pearl seeds.",
      categoryId: keychainCategory.id,
      price: 329,
      salePrice: 289,
      sku: "HW-KEY-010",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800",
      isFeatured: false,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Cute Sky Blue Jellyfish Keychain",
      slug: "cute-sky-blue-jellyfish-keychain",
      description: "Whimsical ocean blue chenille jellyfish bag charm with pearl-embellished dome and bouncy curly tentacles.",
      shortDescription: "Pastel blue jellyfish with pearl dome & wavy tentacles.",
      categoryId: keychainCategory.id,
      price: 349,
      salePrice: 299,
      sku: "HW-KEY-011",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Black & Pink Fluffy Cat Paw Bag Charm",
      slug: "black-pink-fluffy-cat-paw-charm",
      description: "Cute dual-tone black and soft pink fluffy cat/bear paw charm with a pearl beaded wristlet handle.",
      shortDescription: "Dual-tone black & pink cat paw with beaded wristlet loop.",
      categoryId: keychainCategory.id,
      price: 359,
      salePrice: 319,
      sku: "HW-KEY-012",
      image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
    {
      name: "Pipe Cleaner Sunflower Craft Bouquet",
      slug: "pipe-cleaner-sunflower-craft-bouquet",
      description: "Everlasting handcrafted flower bouquet featuring 3 radiant pipe cleaner sunflowers wrapped in luxury matte black craft paper with a golden yellow satin bow.",
      shortDescription: "3 everlasting chenille sunflowers in luxury black wrap.",
      categoryId: bouquetCategory.id,
      price: 1199,
      salePrice: 999,
      sku: "HW-BOUQ-002",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
      isFeatured: true,
      inStock: true,
      customizationAvailable: true,
    },
  ];

  const products = [];
  for (const prod of productData) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      const createdProd = await prisma.product.create({
        data: {
          ...prod,
          variants: {
            create: [
              { name: "Standard (12 Roses)", price: prod.price - 400, stock: 15, sku: `${prod.sku}-STD` },
              { name: "Deluxe (24 Roses)", price: prod.price, stock: 20, sku: `${prod.sku}-DLX` },
            ],
          },
        },
      });
      products.push(createdProd);
    } else {
      products.push(existing);
    }
  }
  console.log(`✅ Created ${products.length} Products`);

  // 5. Create Sample Order with Order Tracking History & Customer-Admin Chat
  const sampleProduct = products[0];
  const orderNumber = "HW-2026-10001";

  const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
  if (!existingOrder) {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: customer.id,
        subtotal: 1299,
        deliveryCharge: 0,
        total: 1299,
        paymentStatus: "PAID",
        orderStatus: "PROCESSING",
        shippingAddress: "123 Rose Avenue, Koramangala, Bengaluru, Karnataka 560034",
        trackingCarrier: "HappiExpress Courier",
        trackingNumber: "EXP-987654",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productName: sampleProduct.name,
              quantity: 1,
              price: 1299,
              variant: "Deluxe (24 Roses)",
              customMessage: "Happy Birthday my love! ❤️",
              specialInstructions: "Please deliver before 5:00 PM.",
            },
          ],
        },
        statusHistory: {
          create: [
            { status: "PENDING", note: "Order placed successfully.", updatedBy: "SYSTEM" },
            { status: "CONFIRMED", note: "Payment of ₹1299 verified.", updatedBy: "SYSTEM" },
            { status: "PROCESSING", note: "Floral artisans assembling red rose bouquet.", updatedBy: "ADMIN" },
          ],
        },
        messages: {
          create: [
            {
              senderId: customer.id,
              senderRole: "CUSTOMER",
              message: "Hi Admin! Could you please ensure the bouquet includes a red ribbon bow?",
              createdAt: new Date(Date.now() - 3600000),
            },
            {
              senderId: admin.id,
              senderRole: "ADMIN",
              message: "Hello Priya! Absolutely, our team has selected fresh crimson roses tied with a silk red satin bow.",
              createdAt: new Date(Date.now() - 1800000),
            },
          ],
        },
      },
    });
    console.log(`✅ Created Sample Order #${order.orderNumber} with Tracking & Customer-Admin Chat`);
  }

  // 6. Create Sample Product Review
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: sampleProduct.id,
      rating: 5,
      comment: "Absolutely stunning bouquet! The roses stayed fresh for days and the black craft wrapping looked extremely elegant.",
    },
  });

  // 7. Create Sample Custom Request
  await prisma.customRequest.create({
    data: {
      userId: customer.id,
      name: "Priya Sharma",
      phone: "9876543210",
      email: "customer@example.com",
      occasion: "Anniversary",
      budget: 3500,
      preferredColors: "Crimson Red and Gold",
      customMessage: "Happy 5th Anniversary!",
      description: "I would like a custom luxury hamper with red roses, personalized wine glasses, and black textured gift wrap.",
      status: "PENDING",
    },
  });
  console.log("✅ Created Sample Custom Gift Request");

  console.log("🎉 Seeding complete! Database ready for development.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
