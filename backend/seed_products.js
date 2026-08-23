import { connectDB, prisma } from "./src/config/database.js";
import fs from "fs";

async function main() {
  await connectDB();
  const data = JSON.parse(
    fs.readFileSync("C:/Users/ELCOT/Documents/happi/backend/app/data/products.json", "utf8")
  );

  for (const cat of data.categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        isActive: cat.isActive,
      },
    });
  }
  console.log("Categories seeded.");

  for (const prod of data.products) {
    const category = await prisma.category.findUnique({
      where: { slug: data.categories.find((c) => c.id === prod.categoryId).slug },
    });

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDescription: prod.shortDescription || "",
        price: prod.price,
        salePrice: prod.salePrice,
        inStock: prod.inStock,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        image: prod.image,
        categoryId: category.id,
        advanceNoticeDays: prod.advanceNoticeDays || null,
        advanceNoticeText: prod.advanceNoticeText || null,
        colorOptionAvailable: prod.colorOptionAvailable || false,
        customizationAvailable: prod.customizationAvailable || false,
        variants: prod.variants
          ? {
              create: prod.variants.map((v) => ({
                name: v.name,
                price: v.price,
                stock: v.stock,
                glitterOption: v.glitterOption || null,
              })),
            }
          : undefined,
      },
    });
  }
  console.log("Products seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
