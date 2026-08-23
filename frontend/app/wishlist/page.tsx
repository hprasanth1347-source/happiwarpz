'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/lib/wishlistContext';
import { useCart } from '@/lib/cartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      productName: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: 1,
    });
    removeFromWishlist(item.productId);
    setIsCartOpen(true);
  };

  return (
    <div className="site-container py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Saved Favorites
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            My Wishlist ❤️
          </h1>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-[#A39A90] hover:text-[#D00000] flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Wishlist</span>
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#181014] border border-[#C9A24A]/40 flex items-center justify-center mx-auto text-[#D00000]">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-[#A39A90]">
            Explore our handmade floral bouquets and keychains, and save your favorite items!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90"
          >
            <span>Explore Gifts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A]/40 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <Link
                  href={`/product/${item.slug}`}
                  className="block relative aspect-square rounded-xl bg-[#050505] overflow-hidden border border-[#221D22]"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.productId);
                    }}
                    className="absolute top-2 right-2 bg-black/80 text-[#D00000] p-1.5 rounded-full hover:bg-[#D00000] hover:text-white transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                <div>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-base font-serif font-bold text-[#F8F1E7] hover:text-[#C9A24A] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-sm font-bold text-[#F4D068] mt-1 block">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#221D22]">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
