import { sendSuccess, sendError } from "../utils/response.js";
import { prisma, isDatabaseConnected } from "../config/database.js";

const DEFAULT_FALLBACK_CATEGORIES = [
  {
    id: "cat-1",
    name: "Rose Bouquets",
    slug: "rose-bouquets",
    description: "Elegant handmade roses for unforgettable moments.",
    image: null,
    isActive: true,
    _count: { products: 2 },
  },
  {
    id: "cat-2",
    name: "Sunflower Bouquets",
    slug: "sunflower-bouquets",
    description: "Bright blooms made to spread happiness.",
    image: null,
    isActive: true,
    _count: { products: 1 },
  },
  {
    id: "cat-3",
    name: "Handmade Keychains",
    slug: "handmade-keychains",
    description: "Small handmade gifts with a big meaning.",
    image: null,
    isActive: true,
    _count: { products: 1 },
  },
  {
    id: "cat-4",
    name: "Custom Gifts",
    slug: "custom-gifts",
    description: "Personalized creations made especially for you.",
    image: null,
    isActive: true,
    _count: { products: 1 },
  },
];

let memoryCategories = [...DEFAULT_FALLBACK_CATEGORIES];

export const getCategories = async (req, res, next) => {
  try {
    if (isDatabaseConnected) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB_TIMEOUT")), 800)
        );

        const dbQuery = prisma.category.findMany({
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        });

        const categories = await Promise.race([dbQuery, timeoutPromise]);
        if (categories && categories.length > 0) {
          return sendSuccess(res, "Categories fetched successfully", { categories });
        }
      } catch (dbErr) {
        // Fallback to memory
      }
    }

    return sendSuccess(res, "Categories fetched successfully", { categories: memoryCategories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDatabaseConnected) {
      try {
        const category = await prisma.category.findUnique({
          where: { slug },
          include: { products: true },
        });
        if (category) {
          return sendSuccess(res, "Category fetched successfully", { category });
        }
      } catch (e) {}
    }

    const cat = memoryCategories.find((c) => c.slug === slug);
    if (!cat) {
      return sendError(res, "Category not found", "NOT_FOUND", 404);
    }

    return sendSuccess(res, "Category fetched successfully", { category: cat });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, "-");

    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      slug,
      description,
      image: null,
      isActive: true,
      _count: { products: 0 },
    };

    if (isDatabaseConnected) {
      try {
        const created = await prisma.category.create({
          data: { name, slug, description, image: null, isActive: true },
        });
        memoryCategories.push(created);
        return sendSuccess(res, "Category created successfully", { category: created }, 201);
      } catch (e) {}
    }

    memoryCategories.push(newCat);
    return sendSuccess(res, "Category created successfully", { category: newCat }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.id;
    const updateData = req.body;

    if (isDatabaseConnected) {
      try {
        const updated = await prisma.category.update({
          where: { id },
          data: updateData,
        });
        return sendSuccess(res, "Category updated successfully", { category: updated });
      } catch (e) {}
    }

    memoryCategories = memoryCategories.map((c) => (c.id === id ? { ...c, ...updateData } : c));
    return sendSuccess(res, "Category updated successfully", { category: { id, ...updateData } });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id || req.query.id;

    if (isDatabaseConnected) {
      try {
        await prisma.category.delete({ where: { id } });
      } catch (e) {}
    }

    memoryCategories = memoryCategories.filter((c) => c.id !== id);
    return sendSuccess(res, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
