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
  Star,
  Truck,
  Gift,
  RotateCcw,
  Info,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';

interface Variant {
  id: string;
  name: string;
  price: number;
  stock?: number;
  glitterOption?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  imagesJson?: string[];
  advanceNoticeDays?: number;
  advanceNoticeText?: string | null;
  colorOptionAvailable?: boolean;
  customizationAvailable?: boolean;
  category?: { id?: string; name: string; slug: string } | null;
  variants?: Variant[];
  reviews?: any[];
}

const COLOR_SUGGESTIONS = [
  { name: 'Classic Crimson Red', color: '#D00000' },
  { name: 'Pastel Pink', color: '#FFB6C1' },
  { name: 'Warm Sunshine Yellow', color: '#FFD700' },
  { name: 'Royal Lavender Purple', color: '#9370DB' },
  { name: 'Sky Blue & White', color: '#87CEEB' },
  { name: 'Black & Gold Luxury Wrap', color: '#2B2416' },
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Ananya S.',
    rating: 5,
    date: '2 days ago',
    comment: 'Absolutely stunning! The velvet finish is so soft and the bouquet arrived in pristine packaging. It never withers — worth every rupee!',
  },
  {
    id: 'rev-2',
    author: 'Priya R.',
    rating: 5,
    date: '1 week ago',
    comment: 'Ordered with glitter for my best friend’s birthday. She was in tears! The handwritten gift card note made it extra special.',
  },
  {
    id: 'rev-3',
    author: 'Karthik V.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Incredible handmade craftsmanship. Arrived right on schedule for our anniversary. Highly recommend Happiwrapz!',
  },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, openDrawer } = useCart();

  // Category normalization
  const categoryName = product?.category?.name || 'Handcrafted Flowers';
  const categorySlug = product?.category?.slug || 'rose-bouquets';

  // Variants & Type Detection
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;
  const isRoseProduct = product?.slug?.toLowerCase().includes('rose') || categorySlug.includes('rose');
  const isSunflowerProduct = product?.slug?.toLowerCase().includes('sunflower') || categorySlug.includes('sunflower');

  // Image Gallery setup
  const rawImages = product?.images || product?.imagesJson || [];
  const allImages = rawImages.length > 0 ? rawImages : [product?.image || '/images/products/roses/rose-without-glitter.png'];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Glitter Finish State
  const initialGlitter = product?.slug?.includes('without') ? 'WITHOUT_GLITTER' : (product?.slug?.includes('glitter') ? 'WITH_GLITTER' : 'WITHOUT_GLITTER');
  const [selectedGlitter, setSelectedGlitter] = useState<'WITHOUT_GLITTER' | 'WITH_GLITTER'>(initialGlitter);

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(hasVariants ? variants[0] : null);

  // Customization States
  const [quantity, setQuantity] = useState(1);
  const [customColor, setCustomColor] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'delivery' | 'reviews'>('details');
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic Price Calculation
  let currentPrice = product?.price || 299;

  if (isRoseProduct) {
    // If selected variant is set, check if matching finish exists
    const variantName = selectedVariant?.name || '1 Rose';
    const cleanName = variantName.replace(/Glitter\s*/i, '').trim();

    // Look for matching variant with finish
    const matched = variants.find(
      (v) =>
        (v.name.includes(cleanName) || v.name === variantName) &&
        (v.glitterOption === selectedGlitter || !v.glitterOption)
    );

    if (matched) {
      currentPrice = matched.price;
    } else if (selectedVariant) {
      currentPrice = selectedVariant.price;
      // Add slight glitter differential if switching on a single product
      if (selectedGlitter === 'WITH_GLITTER' && !selectedVariant.name.toLowerCase().includes('glitter')) {
        currentPrice += 50;
      }
    }
  } else if (selectedVariant) {
    currentPrice = selectedVariant.price;
  }

  // Pre-configured Rose and Sunflower Count Pills
  const roseOptions = [
    { label: '1 Rose', withoutPrice: 299, withPrice: 349 },
    { label: '3 Roses', withoutPrice: 599, withPrice: 699 },
    { label: '5 Roses', withoutPrice: 899, withPrice: 999 },
    { label: '10 Roses', withoutPrice: 1499, withPrice: 1699 },
  ];

  const sunflowerOptions = [
    { label: '1 Sunflower', price: 449 },
    { label: '3 Sunflowers', price: 799 },
    { label: '5 Sunflowers', price: 1199 },
  ];

  // Handle Add To Cart
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      image: allImages[selectedImageIndex] || product.image,
      price: currentPrice,
      quantity,
      selectedVariantName: selectedVariant?.name || (isRoseProduct ? (selectedGlitter === 'WITH_GLITTER' ? 'Glitter Finish' : 'Classic Matte') : undefined),
      glitterOption: isRoseProduct ? selectedGlitter : null,
      customColor: customColor.trim() || undefined,
      customMessage: customMessage.trim() || undefined,
      advanceNoticeText: product.advanceNoticeText || 'Make sure to place bouquet order at least 1 week earlier.',
    });

    setAdded(true);
    if (typeof openDrawer === 'function') {
      openDrawer();
    }
    setTimeout(() => setAdded(false), 2500);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Handle Share Product
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-[#A39A90] mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
        <span className="text-[#555]">/</span>
        <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
        <span className="text-[#555]">/</span>
        <Link href={`/shop?category=${categorySlug}`} className="hover:text-[#D4AF37] transition-colors">
          {categoryName}
        </Link>
        <span className="text-[#555]">/</span>
        <span className="text-[#F8F1E7] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* LEFT: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
          <div className="relative aspect-square bg-[#0D0D0D] border border-[#C9A24A]/30 rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src={allImages[selectedImageIndex] || product.image || '/images/products/roses/rose-without-glitter.png'}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            
            {/* Glitter Finish Badge */}
            {isRoseProduct && selectedGlitter === 'WITH_GLITTER' && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-[#FFD700]/30 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>With Sparkle Glitter</span>
              </div>
            )}

            {/* Handcrafted Badge */}
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md text-[#D4AF37] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#D4AF37]/40 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>100% Handmade</span>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-[#0A0A0A] ${
                    selectedImageIndex === idx ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/20' : 'border-[#26201A] hover:border-[#D4AF37]/50 opacity-70'
                  }`}
                >
                  <Image src={img} alt={`${product.name} preview ${idx + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-[#080808] border border-[#221D22] rounded-2xl flex flex-col items-center">
              <Heart className="w-4 h-4 text-[#E4002B] mb-1" />
              <span className="font-semibold text-white text-[11px]">Everlasting</span>
              <span className="text-[9.5px] text-[#A69C90]">Never withers</span>
            </div>
            <div className="p-3 bg-[#080808] border border-[#221D22] rounded-2xl flex flex-col items-center">
              <Clock className="w-4 h-4 text-[#D4AF37] mb-1" />
              <span className="font-semibold text-white text-[11px]">Advance Order</span>
              <span className="text-[9.5px] text-[#A69C90]">1 week notice</span>
            </div>
            <div className="p-3 bg-[#080808] border border-[#221D22] rounded-2xl flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-[#4CAF50] mb-1" />
              <span className="font-semibold text-white text-[11px]">100% Safe</span>
              <span className="text-[9.5px] text-[#A69C90]">Razorpay payment</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Product Customization & Ordering Details */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Title & Ratings */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2.5">
              <span className="bg-[#181218] border border-[#C9A24A]/40 text-[#F4D068] text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                {categoryName}
              </span>
              
              <button
                type="button"
                onClick={handleShare}
                className="text-xs text-[#A39A90] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
                title="Share product link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Verified Status */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-[#FFD700]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[#F8F1E7] font-bold">4.9 / 5.0</span>
              <span className="text-[#666]">|</span>
              <span className="text-[#A39A90]">(18 Verified Customer Reviews)</span>
              <span className="text-[#666]">|</span>
              <span className="text-[#4CAF50] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Made to Order
              </span>
            </div>

            <p className="text-sm text-[#A69C90] mt-3.5 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* ADVANCE HANDMADE ORDER NOTICE BANNER */}
          <div className="bg-[#1C0808] border-2 border-[#8B0000] p-4 rounded-2xl flex items-start gap-3.5 text-xs text-[#F8F1E7] shadow-lg shadow-[#8B0000]/10">
            <Clock className="w-5 h-5 text-[#FF334B] flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h5 className="font-bold text-[#FF334B] text-xs uppercase tracking-wider mb-0.5">
                Handmade Advance Notice Requirement
              </h5>
              <p className="text-[#E0D7CD] leading-relaxed text-[11.5px]">
                {product.advanceNoticeText ||
                  'Every flower is intricately handcrafted with love. Please place your order at least 1 week in advance for timely crafting and dispatch.'}
              </p>
            </div>
          </div>

          {/* Live Dynamic Price Card */}
          <div className="p-5 bg-[#0D0D0D] border border-[#C9A24A]/30 rounded-2xl flex items-center justify-between shadow-inner">
            <div>
              <span className="text-xs text-[#A39A90] block mb-0.5">Total Amount:</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-bold text-[#F4D068] tracking-tight">
                  ₹{currentPrice * quantity}
                </span>
                {product.salePrice && product.salePrice > currentPrice && (
                  <span className="text-sm text-[#777] line-through">
                    ₹{product.salePrice * quantity}
                  </span>
                )}
              </div>
            </div>

            {quantity > 1 && (
              <div className="text-right">
                <span className="text-xs text-[#A39A90] block">Unit Price</span>
                <span className="text-sm font-semibold text-white">₹{currentPrice} × {quantity}</span>
              </div>
            )}
          </div>

          {/* 1. ROSE FINISH & QUANTITY SELECTION */}
          {isRoseProduct && (
            <div className="space-y-4 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Select Finish & Rose Count</span>
                </h4>
                <span className="text-[10px] text-[#A69C90]">Glitter sparkles under light</span>
              </div>

              {/* Glitter Finish Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGlitter('WITHOUT_GLITTER')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    selectedGlitter === 'WITHOUT_GLITTER'
                      ? 'bg-[#8B0000] text-white border-[#FF334B] shadow-md'
                      : 'bg-[#050505] text-[#A39A90] border-[#221D22] hover:border-[#C9A24A]'
                  }`}
                >
                  <span className="font-semibold">Classic Matte Finish</span>
                  <span className="text-[10px] opacity-80">Without Glitter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGlitter('WITH_GLITTER')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    selectedGlitter === 'WITH_GLITTER'
                      ? 'bg-[#8B0000] text-white border-[#FF334B] shadow-md'
                      : 'bg-[#050505] text-[#A39A90] border-[#221D22] hover:border-[#C9A24A]'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>Sparkling Finish</span>
                  </div>
                  <span className="text-[10px] opacity-80">With Glitter (+₹50)</span>
                </button>
              </div>

              {/* Rose Count Buttons */}
              <div className="space-y-2 pt-1">
                <span className="text-xs text-[#A39A90] font-medium block">Select Number of Roses:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {roseOptions.map((opt) => {
                    const optionPrice = selectedGlitter === 'WITH_GLITTER' ? opt.withPrice : opt.withoutPrice;
                    const isSelected = selectedVariant?.name?.includes(opt.label) || (!selectedVariant && opt.label === '1 Rose');
                    
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          const matched = variants.find((v) => v.name.includes(opt.label));
                          setSelectedVariant(matched || { id: `var_${opt.label}`, name: opt.label, price: optionPrice });
                        }}
                        className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                          isSelected
                            ? 'bg-[#C9A24A] text-black border-[#FFD700] shadow-md shadow-[#C9A24A]/20 scale-[1.02]'
                            : 'bg-[#050505] text-[#F8F1E7] border-[#221D22] hover:border-[#C9A24A]'
                        }`}
                      >
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-[11px] opacity-90 mt-0.5">₹{optionPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. SUNFLOWER COUNT SELECTION */}
          {isSunflowerProduct && (
            <div className="space-y-3 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
              <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                Select Sunflower Bouquet Size
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {sunflowerOptions.map((opt) => {
                  const isSelected = selectedVariant?.name?.includes(opt.label) || (!selectedVariant && opt.label === '1 Sunflower');
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        const matched = variants.find((v) => v.name.includes(opt.label));
                        setSelectedVariant(matched || { id: `var_${opt.label}`, name: opt.label, price: opt.price });
                      }}
                      className={`p-3.5 rounded-xl text-xs font-bold text-center border transition-all ${
                        isSelected
                          ? 'bg-[#C9A24A] text-black border-[#FFD700] shadow-md scale-[1.02]'
                          : 'bg-[#050505] text-[#F8F1E7] border-[#221D22] hover:border-[#C9A24A]'
                      }`}
                    >
                      <div className="font-bold">{opt.label}</div>
                      <div className="text-[11px] opacity-90 mt-0.5">₹{opt.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. GENERIC PRODUCT VARIANTS (If not rose/sunflower but has variants) */}
          {!isRoseProduct && !isSunflowerProduct && hasVariants && (
            <div className="space-y-3 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
              <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                Select Option / Style
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                        isSelected
                          ? 'bg-[#C9A24A] text-black border-[#FFD700] shadow-md scale-[1.02]'
                          : 'bg-[#050505] text-[#F8F1E7] border-[#221D22] hover:border-[#C9A24A]'
                      }`}
                    >
                      <div>{v.name}</div>
                      <div className="text-[11px] opacity-90 mt-0.5">₹{v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. CUSTOMIZATION OPTIONS (Color & Free Message Card) */}
          <div className="space-y-4 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Customization & Personalization</span>
              </h4>
              <span className="text-[10px] text-[#4CAF50] font-semibold">Free Service</span>
            </div>

            {/* Custom Color Selector & Chips */}
            <div>
              <label className="text-xs text-[#A39A90] block mb-2 font-medium">
                Color Preference (Colour modification available):
              </label>

              {/* Quick Select Color Chips */}
              <div className="flex flex-wrap gap-2 mb-2.5">
                {COLOR_SUGGESTIONS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setCustomColor(col.name)}
                    className={`text-[10.5px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                      customColor === col.name
                        ? 'bg-[#221D22] text-[#FFD700] border-[#FFD700]'
                        : 'bg-[#050505] text-[#A69C90] border-[#221D22] hover:border-[#C9A24A]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: col.color }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="Or type custom shade e.g. Crimson Red with Gold Ribbon..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            {/* Custom Gift Message Card */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#A39A90] font-medium flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Personal Gift Card Message (Free):</span>
                </label>
                <span className="text-[10px] text-[#666]">{customMessage.length}/150</span>
              </div>
              <textarea
                rows={2}
                maxLength={150}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your heartfelt note for the recipient (printed on luxury floral greeting card)..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          {/* 5. QUANTITY SELECTOR */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs text-[#A39A90] font-semibold">Quantity:</span>
            <div className="flex items-center gap-3 bg-[#0D0D0D] border border-[#221D22] rounded-xl px-4 py-2.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-[#A39A90] hover:text-white font-bold text-base px-1"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-sm font-bold text-[#F8F1E7] min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-[#A39A90] hover:text-white font-bold text-base px-1"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* 6. PRIMARY ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                added
                  ? 'bg-[#4CAF50] text-white shadow-[#4CAF50]/30'
                  : 'bg-gradient-to-r from-[#D00000] via-[#B8001F] to-[#8B0000] text-white hover:opacity-95 shadow-[#D00000]/25 active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Bag!</span>
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
              className="w-full py-4 rounded-xl border-2 border-[#C9A24A] bg-[#141014] text-[#F8F1E7] font-bold text-sm hover:bg-[#C9A24A] hover:text-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 7. SECURE PAYMENT NOTICE */}
          <div className="p-4 bg-[#080808] border border-[#241F1A] rounded-2xl flex items-center gap-3.5 text-xs text-[#A39A90]">
            <ShieldCheck className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
            <div>
              <span className="text-[#F8F1E7] font-semibold block text-xs">
                100% Secure Online Payment via Razorpay
              </span>
              <span className="text-[11px] text-[#8C8377]">
                UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking. (Cash on Delivery not available).
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════
          PRODUCT DETAILS TABS (Details, Care, Shipping, Reviews)
      ════════════════════════════════════════════════════════════════ */}
      <div className="mt-16 pt-8 border-t border-[#26201A]">
        {/* Tab Headers */}
        <div className="flex items-center gap-3 sm:gap-6 border-b border-[#26201A] overflow-x-auto pb-3">
          {[
            { id: 'details', label: 'Product Details' },
            { id: 'care', label: 'Handmade Care Guide' },
            { id: 'delivery', label: 'Shipping & Notice' },
            { id: 'reviews', label: 'Customer Reviews (18)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap pb-1 border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#F4D068] border-[#F4D068]'
                  : 'text-[#8C8377] border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="py-8 text-xs sm:text-sm leading-relaxed text-[#A69C90]">
          
          {/* 1. Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-white font-serif text-lg font-bold">Artisan Craftsmanship</h3>
                <p>
                  Every Happiwrapz creation is hand-rolled, shaped, and wrapped by passionate floral artisans.
                  Unlike real flowers that wither within days, our plush velvet and chenille stem bouquets stay blooming forever as treasured keepsakes.
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-[#D4AF37] pt-2">
                  <li><span className="text-[#A69C90]">Premium soft velvet chenille pipe cleaners</span></li>
                  <li><span className="text-[#A69C90]">Luxury matte black craft wrapping paper</span></li>
                  <li><span className="text-[#A69C90]">Silk satin ribbon and optional glitter accents</span></li>
                  <li><span className="text-[#A69C90]">Complementary personalized greeting card</span></li>
                </ul>
              </div>

              <div className="space-y-3 bg-[#0D0D0D] p-5 rounded-2xl border border-[#221D22]">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Specifications</h4>
                <div className="space-y-2 text-xs divide-y divide-[#221D22]">
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777]">Brand:</span>
                    <span className="text-white font-medium">Happiwrapz</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777]">Flower Lifespan:</span>
                    <span className="text-[#4CAF50] font-medium">Everlasting (Permanent)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777]">Occasion:</span>
                    <span className="text-white font-medium">Anniversaries, Birthdays, Proposals, Valentine’s, Gifts</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777]">Origin:</span>
                    <span className="text-white font-medium">Handcrafted in Coimbatore, India</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Care Guide Tab */}
          {activeTab === 'care' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-white font-serif text-lg font-bold">How to Care for Your Handmade Bouquet</h3>
              <p>Keep your handmade flowers looking fresh and vibrant for years with these simple tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-1.5">
                  <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#4CAF50]" />
                    <span>Dusting</span>
                  </div>
                  <p className="text-[11.5px]">Gently blow dry on cool setting or use a soft dry brush to remove dust.</p>
                </div>
                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-1.5">
                  <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#4CAF50]" />
                    <span>Shape Retaining</span>
                  </div>
                  <p className="text-[11.5px]">Petals are flexible and bendable — reshape gently with your fingers anytime.</p>
                </div>
                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-1.5">
                  <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#FF334B]" />
                    <span>Avoid Water</span>
                  </div>
                  <p className="text-[11.5px]">Do not submerge in water or spray liquids to preserve yarn and glue integrity.</p>
                </div>
                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-1.5">
                  <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Display</span>
                  </div>
                  <p className="text-[11.5px]">Place in a vase, on a work desk, or keep wrapped in its premium presentation sleeve.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Delivery Tab */}
          {activeTab === 'delivery' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-white font-serif text-lg font-bold">Shipping & Advance Order Notice</h3>
              <p>
                Because each bouquet is handmade individually from scratch, please ensure to place your orders with adequate preparation time:
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">1-Week Crafting Lead Time</h5>
                    <p className="text-[11.5px] mt-0.5">Please order at least 7 days before your special occasion.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#4CAF50] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">Safe All-India Shipping</h5>
                    <p className="text-[11.5px] mt-0.5">Dispatched in reinforced corrugated gift boxes with foam support so petals never bend.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0D0D0D] border border-[#221D22] rounded-2xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white flex items-baseline gap-2">
                    <span>4.9</span>
                    <span className="text-xs text-[#A39A90] font-normal">out of 5 stars</span>
                  </div>
                  <div className="flex items-center text-[#FFD700] mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-[#A39A90]">
                  Based on 18 verified customer gift deliveries
                </div>
              </div>

              {/* Review Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEFAULT_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-5 bg-[#080808] border border-[#221D22] rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{rev.author}</span>
                      <span className="text-[10px] text-[#666]">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-[#FFD700]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[11.5px] text-[#A69C90] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
