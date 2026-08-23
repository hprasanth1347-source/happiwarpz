import { sendSuccess, sendError } from "../utils/response.js";
import { prisma, isDatabaseConnected } from "../config/database.js";

const DEFAULT_FALLBACK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Rose Bouquet — Without Glitter",
    slug: "rose-bouquet-without-glitter",
    description: "Beautiful handmade velvet rose bouquet crafted without glitter for a classic, subtle, and elegant matte finish. Perfect for romantic anniversaries, birthdays, and classic flower lovers.",
    shortDescription: "Handmade classic velvet rose bouquet in matte finish.",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Rose Bouquets", slug: "rose-bouquets" },
    price: 299,
    salePrice: 249,
    sku: "HW-ROSE-MATTE-01",
    image: "/images/products/roses/rose-without-glitter.png",
    images: ["/images/products/roses/rose-without-glitter.png"],
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-1", name: "1 Rose", price: 299, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-2", name: "3 Roses", price: 599, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-3", name: "5 Roses", price: 899, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-4", name: "10 Roses", price: 1499, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    id: "prod-2",
    name: "Glitter Rose Bouquet",
    slug: "glitter-rose-bouquet",
    description: "Handmade velvet roses infused with shimmering glitter accents that catch the light from every angle. Ideal for birthdays, proposals, celebrations, and grand romantic gestures.",
    shortDescription: "Handcrafted glitter rose bouquet with sparkle finish.",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Rose Bouquets", slug: "rose-bouquets" },
    price: 349,
    salePrice: 299,
    sku: "HW-ROSE-GLITTER-02",
    image: "/images/products/roses/rose-with-glitter.png",
    images: ["/images/products/roses/rose-with-glitter.png"],
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-5", name: "1 Glitter Rose", price: 349, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-6", name: "3 Glitter Roses", price: 699, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-7", name: "5 Glitter Roses", price: 999, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-8", name: "10 Glitter Roses", price: 1699, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
    ],
  },
  {
    id: "prod-3",
    name: "Sunshine Sunflower Bouquet",
    slug: "sunshine-sunflower-bouquet",
    description: "Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns. Symbolizes happiness, loyalty, and warmth.",
    shortDescription: "Cheerful handmade sunflower bouquet arrangement.",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Sunflower Bouquets", slug: "sunflower-bouquets" },
    price: 449,
    salePrice: 399,
    sku: "HW-SUNFLOWER-03",
    image: "/images/products/sunflowers/sunflower-3-flowers.png",
    images: ["/images/products/sunflowers/sunflower-3-flowers.png"],
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-9", name: "1 Sunflower", price: 449, stock: 100, status: "ACTIVE" },
      { id: "v-10", name: "3 Sunflowers", price: 799, stock: 100, status: "ACTIVE" },
      { id: "v-11", name: "5 Sunflowers", price: 1199, stock: 100, status: "ACTIVE" },
    ],
  },
  {
    id: "prod-4",
    name: "Handcrafted Heart Charm Keychain",
    slug: "handcrafted-heart-charm-keychain",
    description: "Adorable handmade velvet heart trio keychain crafted with fine craftsmanship. Makes a lovely daily accessory, bag charm, or birthday giveaway gift.",
    shortDescription: "Handcrafted velvet heart keychain accessory.",
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Handmade Keychains", slug: "handmade-keychains" },
    price: 149,
    salePrice: 129,
    sku: "HW-HEART-KEY-04",
    image: "/images/products/keychains/heart-trio.png",
    images: ["/images/products/keychains/heart-trio.png"],
    status: "PUBLISHED",
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
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Custom Gifts", slug: "custom-gifts" },
    price: 999,
    salePrice: 899,
    sku: "HW-HAMPER-CUSTOM-05",
    image: "/images/original/happiwrapz_original_4.jpg",
    images: ["/images/original/happiwrapz_original_4.jpg"],
    status: "PUBLISHED",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
  },
];

let memoryProducts = [...DEFAULT_FALLBACK_PRODUCTS];

/**
 * Get all products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, featured } = req.query;

    if (isDatabaseConnected) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB_TIMEOUT")), 800)
        );

        const where = {
          isActive: true,
          ...(category && { category: { slug: category } }),
          ...(featured !== undefined && { isFeatured: featured === "true" }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
        };

        const orderBy = {};
        if (sort === "price_asc" || sort === "price-low") orderBy.price = "asc";
        else if (sort === "price_desc" || sort === "price-high") orderBy.price = "desc";
        else orderBy.createdAt = "desc";

        const dbQuery = prisma.product.findMany({
          where,
          include: { category: true, variants: true },
          orderBy,
        });

        const products = await Promise.race([dbQuery, timeoutPromise]);
        if (products && products.length > 0) {
          return sendSuccess(res, "Products fetched successfully", { products });
        }
      } catch (dbErr) {
        // Fallback to memory catalog
      }
    }

    // Filter memory products
    let list = [...memoryProducts];
    if (category) {
      list = list.filter(
        (p) => p.category?.slug === category || p.categoryId === category
      );
    }
    if (featured !== undefined) {
      list = list.filter((p) => String(p.isFeatured) === String(featured));
    }
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (sort === "price_asc" || sort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc" || sort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return sendSuccess(res, "Products fetched successfully", { products: list });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by slug or ID
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDatabaseConnected) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB_TIMEOUT")), 800)
        );

        const isHexId = /^[0-9a-fA-F]{24}$/.test(slug);
        const whereClause = isHexId ? { OR: [{ slug }, { id: slug }] } : { slug };

        const dbQuery = prisma.product.findFirst({
          where: whereClause,
          include: {
            category: true,
            variants: true,
            reviews: { include: { user: { select: { name: true } } } },
          },
        });

        const product = await Promise.race([dbQuery, timeoutPromise]);
        if (product) {
          return sendSuccess(res, "Product fetched successfully", { product });
        }
      } catch (e) {}
    }

    const memoryProduct = memoryProducts.find(
      (p) => p.slug === slug || p.id === slug
    );

    if (!memoryProduct) {
      return sendError(res, "Product not found", "NOT_FOUND", 404);
    }

    return sendSuccess(res, "Product fetched successfully", { product: memoryProduct });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  req.query.featured = "true";
  return getProducts(req, res, next);
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      salePrice,
      categoryId,
      advanceNoticeDays,
      advanceNoticeText,
      isFeatured,
      inStock,
      isActive,
      colorOptionAvailable,
      customizationAvailable,
      variants,
    } = req.body;

    const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, "-");
    const sku = req.body.sku || `HW-${slug.slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      id: `prod_${Date.now()}`,
      name,
      slug,
      description,
      shortDescription: shortDescription || "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku,
      image: "",
      images: [],
      categoryId,
      isFeatured: Boolean(isFeatured),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      advanceNoticeDays: Number(advanceNoticeDays || 7),
      advanceNoticeText,
      colorOptionAvailable: Boolean(colorOptionAvailable),
      customizationAvailable: Boolean(customizationAvailable),
      variants: variants || [],
    };

    if (isDatabaseConnected) {
      try {
        const dbProduct = await prisma.product.create({
          data: {
            name: newProduct.name,
            slug: newProduct.slug,
            description: newProduct.description,
            shortDescription: newProduct.shortDescription,
            price: newProduct.price,
            salePrice: newProduct.salePrice,
            sku: newProduct.sku,
            image: "",
            images: [],
            categoryId: newProduct.categoryId,
            isFeatured: newProduct.isFeatured,
            inStock: newProduct.inStock,
            isActive: newProduct.isActive,
            advanceNoticeDays: newProduct.advanceNoticeDays,
            advanceNoticeText: newProduct.advanceNoticeText,
            colorOptionAvailable: newProduct.colorOptionAvailable,
            customizationAvailable: newProduct.customizationAvailable,
          },
        });
        memoryProducts.unshift(dbProduct);
        return sendSuccess(res, "Product created successfully", { product: dbProduct }, 201);
      } catch (e) {}
    }

    memoryProducts.unshift(newProduct);
    return sendSuccess(res, "Product created successfully", { product: newProduct }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.id;
    const updateData = req.body;

    if (isDatabaseConnected) {
      try {
        const updated = await prisma.product.update({
          where: { id },
          data: updateData,
        });
        return sendSuccess(res, "Product updated successfully", { product: updated });
      } catch (e) {}
    }

    memoryProducts = memoryProducts.map((p) => (p.id === id ? { ...p, ...updateData } : p));
    return sendSuccess(res, "Product updated successfully", { product: { id, ...updateData } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id || req.query.id;

    if (isDatabaseConnected) {
      try {
        await prisma.product.delete({ where: { id } });
      } catch (e) {}
    }

    memoryProducts = memoryProducts.filter((p) => p.id !== id);
    return sendSuccess(res, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};
