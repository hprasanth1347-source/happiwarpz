export interface KeychainProduct {
  id: string;
  name: string;
  slug: string;
  category: "hearts" | "flowers" | "creatures" | "fruits" | "bouquets";
  price: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  shortDescription: string;
  colors: string[];
}

export const KEYCHAIN_PRODUCTS: KeychainProduct[] = [
  {
    id: "kc-1",
    name: "Triple Stacked Hearts Pipe Cleaner Keychain",
    slug: "triple-stacked-hearts-keychain",
    category: "hearts",
    price: 299,
    salePrice: 249,
    rating: 4.9,
    reviewsCount: 42,
    badge: "🔥 Bestseller",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800",
    shortDescription: "Handcrafted 3-tier plush hearts in vibrant Magenta, Soft Pink, and Pure White.",
    colors: ["#db2777", "#f472b6", "#ffffff"]
  },
  {
    id: "kc-2",
    name: "Cherry Velvet Bow & Pearl Keychain",
    slug: "cherry-velvet-bow-pearl-keychain",
    category: "fruits",
    price: 349,
    salePrice: 299,
    rating: 5.0,
    reviewsCount: 58,
    badge: "⭐ Top Rated",
    image: "https://images.unsplash.com/photo-1582142839970-2b932644346c?w=800",
    shortDescription: "Coiled red chenille stem cherries with olive green velvet bow & pearl core.",
    colors: ["#dc2626", "#65a30d", "#fef08a"]
  },
  {
    id: "kc-3",
    name: "Single Magenta Fluffy Heart Keychain",
    slug: "single-magenta-fluffy-heart-keychain",
    category: "hearts",
    price: 199,
    salePrice: 169,
    rating: 4.8,
    reviewsCount: 29,
    badge: "Cute & Mini",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    shortDescription: "Soft, vibrant magenta plush heart key charm crafted with high-density chenille wire.",
    colors: ["#e11d48"]
  },
  {
    id: "kc-4",
    name: "White Daisy Flower Pipe Cleaner Keychain",
    slug: "white-daisy-flower-keychain",
    category: "flowers",
    price: 279,
    salePrice: 229,
    rating: 4.9,
    reviewsCount: 36,
    badge: "Fresh Floral",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800",
    shortDescription: "6-petal white daisy with bright orange pompom center & green stem.",
    colors: ["#ffffff", "#f97316", "#22c55e"]
  },
  {
    id: "kc-5",
    name: "Pink Tulip Flower Pipe Cleaner Keychain",
    slug: "pink-tulip-flower-keychain",
    category: "flowers",
    price: 299,
    salePrice: 249,
    rating: 5.0,
    reviewsCount: 47,
    badge: "Customer Favorite",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800",
    shortDescription: "Handcrafted pastel pink tulip bloom with flexible green stem & leaf.",
    colors: ["#f472b6", "#16a34a"]
  },
  {
    id: "kc-6",
    name: "Coiled Pink Ribbon Bow Keychain",
    slug: "coiled-pink-ribbon-bow-keychain",
    category: "hearts",
    price: 299,
    salePrice: 259,
    rating: 4.9,
    reviewsCount: 31,
    badge: "🎀 Aesthetic",
    image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800",
    shortDescription: "Layered soft pink and hot pink ribbon bow with pearl accent & gold hardware keyring.",
    colors: ["#f472b6", "#be185d", "#eab308"]
  },
  {
    id: "kc-7",
    name: "Bright Sunflower Pipe Cleaner Keychain",
    slug: "bright-sunflower-keychain",
    category: "flowers",
    price: 319,
    salePrice: 279,
    rating: 4.9,
    reviewsCount: 52,
    badge: "🌻 Bright & Sunny",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
    shortDescription: "Golden yellow chenille sunflower with dark brown coiled center & green leaves.",
    colors: ["#eab308", "#78350f", "#15803d"]
  },
  {
    id: "kc-8",
    name: "Blue Tulip Trio Bouquet Keychain",
    slug: "blue-tulip-trio-bouquet-keychain",
    category: "bouquets",
    price: 379,
    salePrice: 329,
    rating: 5.0,
    reviewsCount: 64,
    badge: "💐 Mini Bouquet",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
    shortDescription: "Trio of sky blue chenille tulips tied with a pink ribbon bow and pearl centerpiece.",
    colors: ["#38bdf8", "#ec4899", "#16a34a"]
  },
  {
    id: "kc-9",
    name: "White Sakura Cherry Blossom Keychain",
    slug: "white-sakura-cherry-blossom-keychain",
    category: "flowers",
    price: 319,
    salePrice: 279,
    rating: 4.8,
    reviewsCount: 22,
    badge: "🌸 Japanese Style",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
    shortDescription: "Handcrafted white Sakura flower with pink gradient core, pearl center & gold chain.",
    colors: ["#ffffff", "#f472b6", "#eab308"]
  },
  {
    id: "kc-10",
    name: "Plush Magenta Strawberry Keychain",
    slug: "plush-magenta-strawberry-keychain",
    category: "fruits",
    price: 329,
    salePrice: 289,
    rating: 4.9,
    reviewsCount: 19,
    badge: "🍓 Sweet Treat",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800",
    shortDescription: "Coiled vibrant magenta strawberry charm with green velvet leaf top & pearl seeds.",
    colors: ["#be185d", "#65a30d"]
  },
  {
    id: "kc-11",
    name: "Cute Sky Blue Jellyfish Keychain",
    slug: "cute-sky-blue-jellyfish-keychain",
    category: "creatures",
    price: 349,
    salePrice: 299,
    rating: 5.0,
    reviewsCount: 48,
    badge: "🪼 Ocean Cute",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    shortDescription: "Pastel sky blue chenille jellyfish dome with pearl dots & bouncy wavy tentacles.",
    colors: ["#38bdf8", "#7dd3fc"]
  },
  {
    id: "kc-12",
    name: "Black & Pink Fluffy Cat Paw Bag Charm",
    slug: "black-pink-fluffy-cat-paw-charm",
    category: "creatures",
    price: 359,
    salePrice: 319,
    rating: 5.0,
    reviewsCount: 53,
    badge: "🐾 Paw Power",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800",
    shortDescription: "Dual-tone black & pink fluffy cat paw bag charm with pearl beaded wristlet strap.",
    colors: ["#000000", "#f472b6"]
  },
  {
    id: "kc-13",
    name: "Pipe Cleaner Sunflower Craft Bouquet",
    slug: "pipe-cleaner-sunflower-craft-bouquet",
    category: "bouquets",
    price: 1199,
    salePrice: 999,
    rating: 5.0,
    reviewsCount: 71,
    badge: "✨ Luxury Gift",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
    shortDescription: "3 everlasting chenille stem sunflowers wrapped in luxury matte black paper with yellow ribbon.",
    colors: ["#eab308", "#000000", "#15803d"]
  }
];
