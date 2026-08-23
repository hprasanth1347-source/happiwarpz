'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#0D0D0D] border-2 border-[#C9A24A]/40 mx-auto flex items-center justify-center text-[#C9A24A]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          Your cart is waiting for something beautiful.
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Explore our handmade roses, sunshine sunflower bouquets, and handmade keychains crafted with love.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-[#221D22] pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#A39A90] mt-1">
            Review your handmade selections before proceeding to secure online checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A39A90] hover:text-[#D00000] transition-colors"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="p-4 bg-[#0D0D0D] border border-[#221D22] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl bg-[#050505] overflow-hidden flex-shrink-0 border border-[#221D22]">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-base font-serif font-bold text-[#F8F1E7] hover:text-[#C9A24A] transition-colors"
                  >
                    {item.productName}
                  </Link>

                  <div className="text-xs text-[#C9A24A] space-y-0.5">
                    {item.selectedVariantName && (
                      <p>Variant: {item.selectedVariantName}</p>
                    )}
                    {item.glitterOption && (
                      <p>
                        Finish:{' '}
                        {item.glitterOption === 'WITH_GLITTER'
                          ? '✨ With Glitter'
                          : 'Without Glitter'}
                      </p>
                    )}
                    {item.customColor && (
                      <p className="text-[#A39A90]">Color: {item.customColor}</p>
                    )}
                    {item.customMessage && (
                      <p className="text-[#A39A90] italic">"{item.customMessage}"</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#1C161C]">
                {/* Quantity adjust */}
                <div className="flex items-center gap-3 bg-[#050505] border border-[#221D22] rounded-xl px-3 py-1.5">
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    className="text-[#A39A90] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-[#F8F1E7] min-w-[1.25rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    className="text-[#A39A90] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-[#F4D068] block">
                    ₹{item.price * item.quantity}
                  </span>
                  <span className="text-[10px] text-[#A39A90]">
                    ₹{item.price} each
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-[#A39A90] hover:text-[#D00000] p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Advance notice reminder box */}
          <div className="p-4 bg-[#1F0A0A] border border-[#8B0000]/50 rounded-2xl flex items-start gap-3 text-xs text-[#F8F1E7]">
            <Clock className="w-5 h-5 text-[#D00000] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-[#D00000] mb-0.5">
                Handmade Order Lead Time
              </h5>
              <p>
                Please make sure to place your bouquet orders at least one week earlier so our artisans have sufficient time to craft your custom arrangements.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-6 h-fit">
          <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-[#A39A90]">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-[#F8F1E7] font-semibold">₹{cartSubtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="text-[#4CAF50] font-semibold">Free Standard Shipping</span>
            </div>

            <div className="pt-3 border-t border-[#221D22] flex justify-between items-center text-base font-bold text-[#F8F1E7]">
              <span>Grand Total</span>
              <span className="text-2xl text-[#F4D068]">₹{cartSubtotal}</span>
            </div>
          </div>

          <div className="p-3 bg-[#050505] border border-[#C9A24A]/30 rounded-xl text-xs text-[#C9A24A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Online Payment Only via Razorpay</span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm tracking-wider uppercase hover:opacity-90 shadow-xl flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="text-center">
            <Link
              href="/shop"
              className="text-xs text-[#A39A90] hover:text-[#C9A24A] transition-colors"
            >
              ← Add more items from shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
