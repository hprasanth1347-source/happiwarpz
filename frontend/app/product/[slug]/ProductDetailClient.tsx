'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Sparkles,
  Heart,
  Clock,
  Check,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Palette,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';

interface Variant {
  id: string;
  name: string;
  price: number;
  glitterOption?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  advanceNoticeText?: string | null;
  colorOptionAvailable: boolean;
  customizationAvailable: boolean;
  category: { name: string; slug: string };
  variants: Variant[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Variants handling
  const hasVariants = product.variants && product.variants.length > 0;
  const isRoseProduct = product.slug.includes('rose');
  const isSunflowerProduct = product.slug.includes('sunflower');

  // Initial states
  const [selectedGlitter, setSelectedGlitter] = useState<'WITHOUT_GLITTER' | 'WITH_GLITTER'>(
    'WITHOUT_GLITTER'
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants ? product.variants[0] : null
  );

  const [quantity, setQuantity] = useState(1);
  const [customColor, setCustomColor] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [added, setAdded] = useState(false);

  // Compute current price
  let currentPrice = product.price;

  if (isRoseProduct) {
    // Find matching variant based on selected name and glitter option
    const currentName = selectedVariant?.name || '1 Rose';
    const match = product.variants.find(
      (v) =>
        v.name === currentName &&
        v.glitterOption === selectedGlitter
    );
    if (match) {
      currentPrice = match.price;
    }
  } else if (selectedVariant) {
    currentPrice = selectedVariant.price;
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      image: product.image,
      price: currentPrice,
      quantity,
      selectedVariantName: selectedVariant?.name,
      glitterOption: isRoseProduct ? selectedGlitter : null,
      customColor: customColor.trim() || undefined,
      customMessage: customMessage.trim() || undefined,
      advanceNoticeText: product.advanceNoticeText || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Rose counts unique options
  const roseCounts = ['1 Rose', '3 Roses', '6 Roses', '7 Roses', '10 Roses', '15 Roses', '20 Roses'];
  const sunflowerCounts = ['1 Sunflower', '3 Sunflowers', '6 Sunflowers', '10 Sunflowers'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#A39A90] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#C9A24A]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#C9A24A]">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#C9A24A]">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#F8F1E7] font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4 sticky top-28">
          <div className="relative aspect-square bg-[#0D0D0D] border border-[#C9A24A]/30 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain p-2 hover:scale-105 transition-transform duration-500"
            />
            {isRoseProduct && selectedGlitter === 'WITH_GLITTER' && (
              <div className="absolute top-4 right-4 bg-[#8B0000] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F4D068]" />
                <span>With Glitter Finish</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Customization Details */}
        <div className="space-y-6">
          <div>
            <span className="bg-[#181218] border border-[#C9A24A]/40 text-[#F4D068] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">
              {product.category.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F1E7]">
              {product.name}
            </h1>
            <p className="text-sm text-[#A39A90] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* ADVANCE ORDER NOTICE ALERT */}
          <div className="bg-[#1F0A0A] border-2 border-[#8B0000] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#F8F1E7]">
            <Clock className="w-5 h-5 text-[#D00000] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-[#D00000] text-sm mb-0.5 uppercase tracking-wider">
                Handmade Order Notice
              </h5>
              <p>
                {product.advanceNoticeText ||
                  'Make sure to place the order at least one week earlier.'}
              </p>
            </div>
          </div>

          {/* Live Price Display */}
          <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-[#A39A90] block">Total Price</span>
              <div className="text-3xl font-bold text-[#F4D068]">
                ₹{currentPrice * quantity}
              </div>
            </div>
            {quantity > 1 && (
              <span className="text-xs text-[#A39A90]">
                (₹{currentPrice} × {quantity})
              </span>
            )}
          </div>

          {/* 1. Rose Options (Glitter Toggle & Rose Count) */}
          {isRoseProduct && (
            <div className="space-y-4 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
              <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                1. Select Finish & Rose Quantity
              </h4>

              {/* Glitter Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGlitter('WITHOUT_GLITTER')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                    selectedGlitter === 'WITHOUT_GLITTER'
                      ? 'bg-[#8B0000] text-white border-[#D00000] shadow-md'
                      : 'bg-[#050505] text-[#A39A90] border-[#221D22] hover:border-[#C9A24A]'
                  }`}
                >
                  Without Glitter
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGlitter('WITH_GLITTER')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                    selectedGlitter === 'WITH_GLITTER'
                      ? 'bg-[#8B0000] text-white border-[#D00000] shadow-md'
                      : 'bg-[#050505] text-[#A39A90] border-[#221D22] hover:border-[#C9A24A]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4D068]" />
                  <span>With Glitter</span>
                </button>
              </div>

              {/* Rose Count Selector */}
              <div className="space-y-2">
                <span className="text-xs text-[#A39A90]">Select Number of Roses:</span>
                <div className="grid grid-cols-4 gap-2">
                  {roseCounts.map((cnt) => {
                    const matchedVar = product.variants.find(
                      (v) => v.name === cnt && v.glitterOption === selectedGlitter
                    );
                    const isSelected = selectedVariant?.name === cnt;
                    return (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() =>
                          setSelectedVariant(matchedVar || product.variants[0])
                        }
                        className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                          isSelected
                            ? 'bg-[#C9A24A] text-black border-[#F4D068]'
                            : 'bg-[#050505] text-[#F8F1E7] border-[#221D22] hover:border-[#C9A24A]'
                        }`}
                      >
                        <div>{cnt}</div>
                        <div className="text-[10px] opacity-80">
                          ₹{matchedVar?.price || 60}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. Sunflower Count Selector */}
          {isSunflowerProduct && (
            <div className="space-y-3 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
              <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                Select Sunflower Quantity
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sunflowerCounts.map((cnt) => {
                  const matchedVar = product.variants.find((v) => v.name === cnt);
                  const isSelected = selectedVariant?.name === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() =>
                        setSelectedVariant(matchedVar || product.variants[0])
                      }
                      className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                        isSelected
                          ? 'bg-[#C9A24A] text-black border-[#F4D068]'
                          : 'bg-[#050505] text-[#F8F1E7] border-[#221D22] hover:border-[#C9A24A]'
                      }`}
                    >
                      <div>{cnt}</div>
                      <div className="text-[11px] opacity-80">
                        ₹{matchedVar?.price || 120}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color & Custom Message Inputs */}
          <div className="space-y-4 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
            <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
              Customization Options
            </h4>

            {/* Custom Color Input */}
            <div>
              <label className="text-xs text-[#A39A90] block mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Color Preference (Colour change available):</span>
              </label>
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="e.g. Red & Gold ribbon, Pastel Pink, Crimson..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            {/* Custom Gift Card Message */}
            <div>
              <label className="text-xs text-[#A39A90] block mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Personal Gift Card Message (Free):</span>
              </label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your heartfelt message for the recipient..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#A39A90] font-semibold">Quantity:</span>
            <div className="flex items-center gap-3 bg-[#0D0D0D] border border-[#221D22] rounded-xl px-4 py-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-[#A39A90] hover:text-white font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold text-[#F8F1E7] min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-[#A39A90] hover:text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                added
                  ? 'bg-[#4CAF50] text-white'
                  : 'bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white hover:opacity-90 shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 rounded-xl border-2 border-[#C9A24A] bg-[#141014] text-[#F8F1E7] font-bold text-sm hover:bg-[#C9A24A] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Online Payment Policy Banner */}
          <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl flex items-center gap-3 text-xs text-[#A39A90]">
            <ShieldCheck className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
            <div>
              <span className="text-[#F8F1E7] font-semibold block">
                Online Payment Only
              </span>
              <span>100% secure payment via Razorpay. No Cash on Delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
