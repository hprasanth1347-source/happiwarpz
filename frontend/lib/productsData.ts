export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  glitterOption?: string;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: Category;
  price: number;
  salePrice?: number;
  image: string;
  imagesJson?: string[];
  status: string;
  isFeatured: boolean;
  inStock: boolean;
  isActive: boolean;
  advanceNoticeDays?: number;
  advanceNoticeText?: string;
  colorOptionAvailable?: boolean;
  customizationAvailable?: boolean;
  variants?: ProductVariant[];
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORIES_DATA: Category[] = [
  {
    id: "cat-1",
    slug: "rose-bouquets",
    name: "Rose Bouquets",
    description: "Elegant handmade roses for unforgettable moments.",
    image: "/images/products/roses/rose-without-glitter.png",
    isActive: true,
  },
  {
    id: "cat-2",
    slug: "sunflower-bouquets",
    name: "Sunflower Bouquets",
    description: "Bright blooms made to spread happiness.",
    image: "/images/products/sunflowers/sunflower-3-flowers.png",
    isActive: true,
  },
  {
    id: "cat-3",
    slug: "handmade-keychains",
    name: "Handmade Keychains",
    description: "Small handmade gifts with a big meaning.",
    image: "/images/products/keychains/heart-trio.png",
    isActive: true,
  },
  {
    id: "cat-4",
    slug: "custom-gifts",
    name: "Custom Gifts",
    description: "Personalized creations made especially for you.",
    image: "/images/original/happiwrapz_original_4.jpg",
    isActive: true,
  },
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: "prod-1",
    name: "Rose Bouquet — Without Glitter",
    slug: "rose-bouquet-without-glitter",
    description: "Beautiful handmade velvet rose bouquet crafted without glitter for a classic, subtle, and elegant matte finish. Perfect for romantic anniversaries, birthdays, and classic flower lovers.",
    shortDescription: "Handmade classic velvet rose bouquet in matte finish.",
    categoryId: "cat-1",
    category: CATEGORIES_DATA[0],
    price: 299.0,
    image: "/images/products/roses/rose-without-glitter.png",
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-1", name: "1 Rose", price: 299.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-2", name: "3 Roses", price: 599.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-3", name: "5 Roses", price: 899.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
      { id: "v-4", name: "10 Roses", price: 1499.0, stock: 100, glitterOption: "WITHOUT_GLITTER", status: "ACTIVE" },
    ],
    reviews: [],
  },
  {
    id: "prod-2",
    name: "Glitter Rose Bouquet",
    slug: "glitter-rose-bouquet",
    description: "Handmade velvet roses infused with shimmering glitter accents that catch the light from every angle. Ideal for birthdays, proposals, celebrations, and grand romantic gestures.",
    shortDescription: "Handcrafted glitter rose bouquet with sparkle finish.",
    categoryId: "cat-1",
    category: CATEGORIES_DATA[0],
    price: 349.0,
    image: "/images/products/roses/rose-with-glitter.png",
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-5", name: "1 Glitter Rose", price: 349.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-6", name: "3 Glitter Roses", price: 699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-7", name: "5 Glitter Roses", price: 999.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
      { id: "v-8", name: "10 Glitter Roses", price: 1699.0, stock: 100, glitterOption: "WITH_GLITTER", status: "ACTIVE" },
    ],
    reviews: [],
  },
  {
    id: "prod-3",
    name: "Sunshine Sunflower Bouquet",
    slug: "sunshine-sunflower-bouquet",
    description: "Bright, cheerful handmade sunflower arrangement crafted from premium velvet yarns. Symbolizes happiness, loyalty, and warmth.",
    shortDescription: "Cheerful handmade sunflower bouquet arrangement.",
    categoryId: "cat-2",
    category: CATEGORIES_DATA[1],
    price: 449.0,
    image: "/images/products/sunflowers/sunflower-3-flowers.png",
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    advanceNoticeDays: 7,
    advanceNoticeText: "Place bouquet order at least 1 week in advance.",
    colorOptionAvailable: true,
    customizationAvailable: true,
    variants: [
      { id: "v-9", name: "1 Sunflower", price: 449.0, stock: 100, status: "ACTIVE" },
      { id: "v-10", name: "3 Sunflowers", price: 799.0, stock: 100, status: "ACTIVE" },
      { id: "v-11", name: "5 Sunflowers", price: 1199.0, stock: 100, status: "ACTIVE" },
    ],
    reviews: [],
  },
  {
    id: "prod-4",
    name: "Handcrafted Heart Charm Keychain",
    slug: "handcrafted-heart-charm-keychain",
    description: "Adorable handmade velvet heart trio keychain crafted with fine craftsmanship. Makes a lovely daily accessory, bag charm, or birthday giveaway gift.",
    shortDescription: "Handcrafted velvet heart keychain accessory.",
    categoryId: "cat-3",
    category: CATEGORIES_DATA[2],
    price: 149.0,
    image: "/images/products/keychains/heart-trio.png",
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
    reviews: [],
  },
  {
    id: "prod-5",
    name: "Bespoke Custom Luxury Gift Hamper",
    slug: "bespoke-custom-luxury-gift-hamper",
    description: "Personalized luxury handmade flower hamper customized with your preferred colors, greeting notes, and floral count.",
    shortDescription: "Custom handmade gift hamper tailored to your order.",
    categoryId: "cat-4",
    category: CATEGORIES_DATA[3],
    price: 999.0,
    image: "/images/original/happiwrapz_original_4.jpg",
    status: "ACTIVE",
    isFeatured: true,
    inStock: true,
    isActive: true,
    variants: [],
    reviews: [],
  },
];

export function getLocalCategories(): Category[] {
  return CATEGORIES_DATA;
}

export function getLocalProducts(params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Product[] {
  let list = [...PRODUCTS_DATA];

  if (params?.category) {
    list = list.filter((p) => p.category?.slug === params.category || p.categoryId === params.category);
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (params?.featured !== undefined) {
    list = list.filter((p) => p.isFeatured === params.featured);
  }

  if (params?.sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (params?.sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

export function getLocalProductByIdOrSlug(idOrSlug: string): Product | null {
  return PRODUCTS_DATA.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}
