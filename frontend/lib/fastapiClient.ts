const FASTAPI_URL = process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

const FALLBACK_CATEGORIES = [
  {
    id: "cat_flower_bouquets",
    name: "Flower Bouquets",
    slug: "flower-bouquets",
    description: "Handcrafted fresh red roses, lilies, and customized floral arrangements.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
  },
  {
    id: "cat_custom_gift_wraps",
    name: "Custom Gift Wraps",
    slug: "custom-gift-wraps",
    description: "Artisan black wrapping paper with satin ribbons and personalized bows.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
  },
  {
    id: "cat_luxury_hampers",
    name: "Luxury Hampers",
    slug: "luxury-hampers",
    description: "Curated gift hampers for anniversaries, birthdays, and celebrations.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
  },
  {
    id: "cat_handcrafted_keychains",
    name: "Handcrafted Keychains",
    slug: "handcrafted-keychains",
    description: "Adorable handmade plush chenille stem pipe cleaner keychains, bag charms, and cute accessories.",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
  },
];

const FALLBACK_PRODUCTS = [
  {
    id: "prod_rose_bouquet_01",
    name: "Velvet Crimson Rose Bouquet",
    slug: "velvet-crimson-rose-bouquet",
    description: "Signature bouquet featuring 24 premium long-stem crimson red roses wrapped in handcrafted matte black craft paper with a silk satin ribbon bow. Perfect for romantic anniversaries and special moments.",
    shortDescription: "24 fresh crimson roses in luxury black craft wrap.",
    categoryId: "cat_flower_bouquets",
    category: { name: "Flower Bouquets", slug: "flower-bouquets" },
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
    isActive: true,
    customizationAvailable: true,
    colorOptionAvailable: true,
    advanceNoticeDays: 1,
  },
  {
    id: "prod_midnight_wrap_02",
    name: "Midnight Luxury Gift Wrap Set",
    slug: "midnight-luxury-gift-wrap-set",
    description: "Bespoke gift wrapping featuring dark textured paper, hand-tied crimson velvet bow, and personalized calligraphy note card.",
    shortDescription: "Artisan black craft wrap with velvet bow.",
    categoryId: "cat_custom_gift_wraps",
    category: { name: "Custom Gift Wraps", slug: "custom-gift-wraps" },
    price: 899,
    salePrice: 749,
    sku: "HW-WRAP-002",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
    images: ["https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800"],
    isFeatured: true,
    inStock: true,
    isActive: true,
    customizationAvailable: true,
    colorOptionAvailable: true,
    advanceNoticeDays: 1,
  },
  {
    id: "prod_royal_hamper_03",
    name: "Royal Celebration Gift Hamper",
    slug: "royal-celebration-gift-hamper",
    description: "An extravagant gift hamper containing gourmet chocolates, scented soy candle, custom photo frame, and a mini rose bouquet.",
    shortDescription: "Gourmet chocolates, scented candle & mini bouquet hamper.",
    categoryId: "cat_luxury_hampers",
    category: { name: "Luxury Hampers", slug: "luxury-hampers" },
    price: 2999,
    salePrice: 2499,
    sku: "HW-HAMP-003",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"],
    isFeatured: true,
    inStock: true,
    isActive: true,
    customizationAvailable: true,
    advanceNoticeDays: 1,
  },
  {
    id: "prod_keychain_hearts_04",
    name: "Triple Stacked Hearts Pipe Cleaner Keychain",
    slug: "triple-stacked-hearts-keychain",
    description: "Charming handcrafted keychain crafted from premium soft chenille stems with 3 stacked hearts in vibrant Magenta, Soft Pink, and Pure White, finished with a silver keyring chain.",
    shortDescription: "Vibrant 3-tier plush hearts in magenta, pink & white.",
    categoryId: "cat_handcrafted_keychains",
    category: { name: "Handcrafted Keychains", slug: "handcrafted-keychains" },
    price: 299,
    salePrice: 249,
    sku: "HW-KEY-001",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
    images: ["https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800"],
    isFeatured: true,
    inStock: true,
    isActive: true,
    customizationAvailable: true,
    colorOptionAvailable: true,
    advanceNoticeDays: 1,
  },
  {
    id: "prod_sunflower_bouquet_05",
    name: "Golden Radiant Sunflower Bouquet",
    slug: "golden-radiant-sunflower-bouquet",
    description: "Vibrant handcrafted bouquet of bright yellow sunflowers paired with delicate baby's breath and tied with rustic jute wrap.",
    shortDescription: "Bright yellow sunflowers in rustic jute wrap.",
    categoryId: "cat_flower_bouquets",
    category: { name: "Flower Bouquets", slug: "flower-bouquets" },
    price: 1199,
    salePrice: 999,
    sku: "HW-SUN-005",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
    images: ["https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800"],
    isFeatured: true,
    inStock: true,
    isActive: true,
    customizationAvailable: true,
    advanceNoticeDays: 1,
  },
];

export async function fetchFastAPI(path: string, options?: RequestInit) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${FASTAPI_URL}${path}`, {
      cache: 'no-store',
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      
      // Automatically unwrap Express 'sendSuccess' wrapper format if it exists
      if (data && data.success && data.data) {
        if (data.data.products) return data.data.products;
        if (data.data.product) return data.data.product;
        if (data.data.categories) return data.data.categories;
        if (data.data.orders) return data.data.orders;
        return data.data;
      }
      return data;
    }
  } catch (err) {
    // Silent fallback
  }

  // Resilient Fallbacks
  if (path.startsWith('/api/categories')) {
    return FALLBACK_CATEGORIES;
  }
  if (path.startsWith('/api/products/')) {
    const slug = path.replace('/api/products/', '').split('?')[0];
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || FALLBACK_PRODUCTS[0];
  }
  if (path.startsWith('/api/products')) {
    if (path.includes('category=')) {
      const catParam = path.split('category=')[1]?.split('&')[0];
      return FALLBACK_PRODUCTS.filter(
        (p) => p.category?.slug === catParam || p.categoryId === catParam || p.categoryId === `cat_${catParam?.replace(/-/g, '_')}`
      );
    }
    return FALLBACK_PRODUCTS;
  }

  return null;
}
