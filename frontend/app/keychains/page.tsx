"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Paintbrush, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Star, 
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { KEYCHAIN_PRODUCTS, KeychainProduct } from "@/lib/keychainsData";

export default function KeychainsPage() {
  const { addToCart, openDrawer } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Items (13)" },
    { id: "hearts", label: "💖 Hearts & Bows" },
    { id: "flowers", label: "🌸 Flowers & Blossoms" },
    { id: "creatures", label: "🐾 Cute Creatures" },
    { id: "fruits", label: "🍓 Fruits & Sweets" },
    { id: "bouquets", label: "💐 Craft Bouquets" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? KEYCHAIN_PRODUCTS 
    : KEYCHAIN_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddToCart = async (product: KeychainProduct) => {
    try {
      await addToCart(product.id, 1, "Standard Keyring");
    } catch (err) {
      console.error(err);
    }
  };

  const isWishlisted = (id: string) => isInWishlist(id);

  return (
    <div className="min-h-screen bg-black text-gray-100 pb-20">
      
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950/80 via-dark-surface to-black border-b border-dark-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Handcrafted Chenille Stem Charm Collection
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Plush Pipe Cleaner Keychains & Bag Charms
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Hand-woven with velvety high-density chenille wire, genuine faux pearls, and non-tarnish metallic hardware. Perfect cute accents for keys, bags, & thoughtful gifts!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/keychain-builder"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <Paintbrush className="w-4 h-4" />
              Build Custom Keychain Visualizer
            </Link>
            
            <a
              href="#keychain-catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-dark-surface border border-dark-border hover:bg-dark-hover text-gray-200 font-semibold text-sm transition-all"
            >
              Explore Collection ({KEYCHAIN_PRODUCTS.length})
            </a>
          </div>

          {/* Quick Stats Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-dark-border/60 pt-8">
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-medium text-gray-300">100% Hand-Woven Wire</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-medium text-gray-300">Pearl & Velvet Accents</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-medium text-gray-300">Free Gift Packaging</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Truck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-medium text-gray-300">Express Delivery Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Catalog & Filter Section ─── */}
      <section id="keychain-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Category Filter</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-dark-surface text-gray-400 border border-dark-border hover:bg-dark-hover hover:text-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group bg-dark-surface border border-dark-border hover:border-brand-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badge Container */}
              <div className="relative aspect-square w-full bg-dark-card overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 text-brand-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-400 hover:scale-110 transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-brand-500 text-brand-500" : ""}`} />
                </button>

                {/* Color Swatch Dots */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full">
                  {product.colors.map((c, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 font-semibold mb-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({product.reviewsCount})</span>
                  </div>

                  <h3 className="font-medium text-sm text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-2 border-t border-dark-border flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-white">
                      ₹{product.salePrice}
                    </div>
                    {product.price > product.salePrice && (
                      <div className="text-xs text-gray-500 line-through">
                        ₹{product.price}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-brand-600/20 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Customizer Banner Callout ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-dark-surface to-purple-950 border border-brand-500/30 p-8 sm:p-12">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Paintbrush className="w-3.5 h-3.5" /> Interactive 2D Visualizer Tool
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Want a Completely Custom Pipe Cleaner Keychain?
            </h2>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Design your own handcrafted charm in real time! Choose your favourite stem colors, flower/heart shapes, pearls, bows, and gold or silver keyring hardware.
            </p>

            <div className="pt-2">
              <Link
                href="/keychain-builder"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black hover:bg-gray-100 font-bold text-sm shadow-2xl transition-all transform hover:-translate-y-0.5"
              >
                Launch Keychain Builder <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Handcrafting & Quality Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-dark-border pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Why You&apos;ll Love Happiwrapz Keychains
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Every keychain is artisan crafted with meticulous attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Ultra-Dense Plush Wire</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We use premium 6mm and 8mm high-density chenille stems that stay soft, full, and hold their shape over long daily use.
            </p>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Premium Accent Hardware</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Equipped with rust-resistant alloy keyrings, sturdy ball chains, genuine synthetic pearl beads, and soft velvet bow knots.
            </p>
          </div>

          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Gift-Ready Packaging</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Includes individual protective gift backing cards with a personalized handwritten note card option for birthday or anniversary gifts.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
