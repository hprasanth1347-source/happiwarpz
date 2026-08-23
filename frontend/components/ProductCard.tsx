'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

interface ProductProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category?: { name: string };
  isFeatured?: boolean;
  advanceNoticeText?: string | null;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      quantity: 1,
      advanceNoticeText: product.advanceNoticeText || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      description: product.description,
      categoryName: product.category?.name,
    });
  };

  return (
    <div className="group relative bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,162,74,0.15)] flex flex-col justify-between">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[#050505] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category / Featured Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.category && (
            <span className="bg-[#050505]/80 backdrop-blur-md border border-[#C9A24A]/30 text-[#F4D068] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#8B0000] text-white shadow-lg'
              : 'bg-[#050505]/60 text-[#F8F1E7]/70 hover:text-[#D00000] hover:bg-[#050505]'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>


      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-base font-serif font-semibold text-[#F8F1E7] group-hover:text-[#C9A24A] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#A39A90] line-clamp-2 mt-1 font-normal">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#1C161C] flex items-center gap-2 justify-between">
          <div>
            <span className="text-xs text-[#A39A90] block">Price</span>
            <span className="text-lg font-bold text-[#F4D068]">
              ₹{product.price}
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none ${
              added
                ? 'bg-[#4CAF50] text-white'
                : 'bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white hover:opacity-90 shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
