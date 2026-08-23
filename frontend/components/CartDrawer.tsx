'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#0D0D0D] border-l border-[#221D22] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#221D22] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D00000] shrink-0 bg-[#050505]">
                <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-contain p-0.5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">
                  Shopping Bag
                </h3>
                <span className="text-xs bg-[#8B0000] text-white px-2 py-0.5 rounded-full font-bold">
                  {cart.length}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#A39A90] hover:text-[#F8F1E7] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181218] border border-[#C9A24A]/30 mx-auto flex items-center justify-center text-[#C9A24A]">
                  🌹
                </div>
                <h4 className="text-lg font-serif text-[#F8F1E7]">
                  Your cart is waiting for something beautiful.
                </h4>
                <p className="text-sm text-[#A39A90] max-w-xs mx-auto">
                  Explore our handcrafted roses, sunflowers, and handmade keychains.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3 bg-[#120F12] border border-[#221D22] rounded-xl relative group"
                >
                  <div className="relative w-20 h-20 bg-[#050505] rounded-lg overflow-hidden flex-shrink-0 border border-[#221D22]">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-[#F8F1E7] truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#A39A90] hover:text-[#D00000] transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant & Customization info */}
                      <div className="text-xs text-[#C9A24A] mt-0.5 space-y-0.5">
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
                          <p className="text-[#A39A90] truncate">
                            Color: {item.customColor}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-[#050505] border border-[#221D22] rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="text-[#A39A90] hover:text-[#F8F1E7] p-0.5"
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
                          className="text-[#A39A90] hover:text-[#F8F1E7] p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#F4D068]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#221D22] bg-[#050505] space-y-4">
              {/* Advance order notice */}
              <div className="flex items-start gap-2 bg-[#1C0D0D] border border-[#8B0000]/40 p-2.5 rounded-lg text-xs text-[#F8F1E7]">
                <Clock className="w-4 h-4 text-[#D00000] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Handmade Notice:</strong> Please place bouquet orders at least 1 week earlier.
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm font-medium text-[#F8F1E7]">
                <span>Subtotal</span>
                <span className="text-lg font-bold text-[#F4D068]">
                  ₹{cartSubtotal}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-[#A39A90]">
                <span>Shipping / Delivery</span>
                <span className="text-xs text-[#4CAF50]">Calculated at checkout</span>
              </div>

              {/* Online Payment badge */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#C9A24A]">
                <ShieldCheck className="w-4 h-4" />
                <span>Online payment only (Razorpay secure)</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-[#221D22] bg-[#050505] text-[#F8F1E7] text-xs font-semibold hover:border-[#C9A24A] transition-all"
                >
                  View cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-semibold shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-1"
                >
                  <span>Proceed to checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
