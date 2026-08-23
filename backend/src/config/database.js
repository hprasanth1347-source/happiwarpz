import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

// Global Prisma instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export let isDatabaseConnected = false;

/**
 * Auto-Seed Database with Initial Catalog (without storing images in database)
 */
const autoSeedDatabaseIfEmpty = async () => {
  try {
    const productCount = await prisma.product.count().catch(() => 0);
    if (productCount === 0) {
      logger.info("🌱 [Auto-Seed] Empty database detected. Seeding initial categories and products...");

      // 1. Categories (image: null)
      const catBouquets = await prisma.category.create({
        data: {
          name: "Rose Bouquets",
          slug: "rose-bouquets",
          description: "Handcrafted velvet rose bouquets for anniversaries and special moments.",
          image: null, // DO NOT add image in database
          isActive: true,
        },
      });

      const catSunflowers = await prisma.category.create({
        data: {
          name: "Sunflower Bouquets",
          slug: "sunflower-bouquets",
          description: "Bright handmade sunflower arrangements made to spread joy.",
          image: null, // DO NOT add image in database
          isActive: true,
        },
      });

      const catKeychains = await prisma.category.create({
        data: {
          name: "Handmade Keychains",
          slug: "handmade-keychains",
          description: "Plush pipe cleaner keychains and charms.",
          image: null, // DO NOT add image in database
          isActive: true,
        },
      });

      const catHampers = await prisma.category.create({
        data: {
          name: "Custom Gifts",
          slug: "custom-gifts",
          description: "Personalized hampers and bespoke gift wrappings.",
          image: null, // DO NOT add image in database
          isActive: true,
        },
      });

      // 2. Products (image: "", images: [])
      await prisma.product.create({
        data: {
          name: "Rose Bouquet — Without Glitter",
          slug: "rose-bouquet-without-glitter",
          description: "Beautiful handmade velvet rose bouquet crafted without glitter for a classic matte finish.",
          shortDescription: "Handmade classic velvet rose bouquet in matte finish.",
          categoryId: catBouquets.id,
          price: 299,
          salePrice: 249,
          sku: "HW-ROSE-MATTE",
          image: "", // DO NOT add image in database
          images: [], // DO NOT add image in database
          isFeatured: true,
          inStock: true,
          customizationAvailable: true,
          colorOptionAvailable: true,
          advanceNoticeDays: 7,
          advanceNoticeText: "Place bouquet order at least 1 week in advance.",
        },
      });

      await prisma.product.create({
        data: {
          name: "Glitter Rose Bouquet",
          slug: "glitter-rose-bouquet",
          description: "Handmade velvet roses infused with shimmering glitter accents that sparkle from every angle.",
          shortDescription: "Handcrafted glitter rose bouquet with sparkle finish.",
          categoryId: catBouquets.id,
          price: 349,
          salePrice: 299,
          sku: "HW-ROSE-GLITTER",
          image: "", // DO NOT add image in database
          images: [], // DO NOT add image in database
          isFeatured: true,
          inStock: true,
          customizationAvailable: true,
          colorOptionAvailable: true,
          advanceNoticeDays: 7,
          advanceNoticeText: "Place bouquet order at least 1 week in advance.",
        },
      });

      await prisma.product.create({
        data: {
          name: "Sunshine Sunflower Bouquet",
          slug: "sunshine-sunflower-bouquet",
          description: "Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns.",
          shortDescription: "Cheerful handmade sunflower bouquet arrangement.",
          categoryId: catSunflowers.id,
          price: 449,
          salePrice: 399,
          sku: "HW-SUNFLOWER-01",
          image: "", // DO NOT add image in database
          images: [], // DO NOT add image in database
          isFeatured: true,
          inStock: true,
          customizationAvailable: true,
          advanceNoticeDays: 7,
          advanceNoticeText: "Place bouquet order at least 1 week in advance.",
        },
      });

      await prisma.product.create({
        data: {
          name: "Handcrafted Heart Charm Keychain",
          slug: "handcrafted-heart-charm-keychain",
          description: "Adorable handmade velvet heart trio keychain crafted with fine craftsmanship.",
          shortDescription: "Handcrafted velvet heart keychain accessory.",
          categoryId: catKeychains.id,
          price: 149,
          salePrice: 129,
          sku: "HW-HEART-KEY",
          image: "", // DO NOT add image in database
          images: [], // DO NOT add image in database
          isFeatured: true,
          inStock: true,
          customizationAvailable: true,
        },
      });

      await prisma.product.create({
        data: {
          name: "Bespoke Custom Luxury Gift Hamper",
          slug: "bespoke-custom-luxury-gift-hamper",
          description: "Personalized luxury handmade flower hamper customized with your preferred colors and greeting notes.",
          shortDescription: "Custom handmade gift hamper tailored to your order.",
          categoryId: catHampers.id,
          price: 999,
          salePrice: 899,
          sku: "HW-HAMPER-CUSTOM",
          image: "", // DO NOT add image in database
          images: [], // DO NOT add image in database
          isFeatured: true,
          inStock: true,
          customizationAvailable: true,
        },
      });

      logger.info("✅ [Auto-Seed] Successfully seeded initial store catalog (0 images saved).");
    }
  } catch (err) {
    logger.warn("⚠️ [Auto-Seed] Notice:", err.message);
  }
};

export const connectDB = async () => {
  try {
    await prisma.$connect();
    isDatabaseConnected = true;
    logger.info("🟢 Successfully connected to MongoDB via Prisma ORM.");
    autoSeedDatabaseIfEmpty();
  } catch (error) {
    isDatabaseConnected = false;
    logger.warn("⚠️ MongoDB offline or unreachable. Express will use in-memory fallbacks.", error.message);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    isDatabaseConnected = false;
  } catch (error) {
    logger.error("Error disconnecting database:", error.message);
  }
};
