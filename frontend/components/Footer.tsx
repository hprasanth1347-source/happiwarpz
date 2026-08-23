import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#221D22] text-[#A39A90] pt-16 pb-8">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#D00000] group-hover:border-[#F4D068] transition-all duration-300 shadow-xl shadow-red-950/70 shrink-0 bg-[#050505] p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Happiwrapz Logo"
                  fill
                  className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight leading-none">
                  <span className="text-[#F8F1E7]">Happi</span>
                  <span className="text-[#D00000]">wrapz</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A24A] font-semibold mt-1">
                  Handmade Flowers & Gifts
                </span>
              </div>
            </Link>
            <p className="text-sm font-serif italic text-[#C9A24A]">
              "Because moments deserve flowers."
            </p>
            <p className="text-xs text-[#A39A90] leading-relaxed">
              Happiwrapz creates handmade floral bouquets, everlasting roses, sunflowers, keychains, and thoughtful personalized gifts designed to make every moment unforgettable.
            </p>
            <div className="text-xs text-[#F4D068] font-medium pt-1">
              ✨ Handmade with love • Made to adore
            </div>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/happiwrapz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181216] border border-[#C9A24A]/40 text-[#F4D068] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-all shadow-md"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Follow @happiwrapz</span>
              </a>
            </div>
          </div>

          {/* Collections & Shop */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#F8F1E7] tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=rose-bouquets" className="hover:text-[#C9A24A] transition-colors">
                  Rose Bouquets (With & Without Glitter)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sunflower-bouquets" className="hover:text-[#C9A24A] transition-colors">
                  Sunflower Bouquets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=handmade-keychains" className="hover:text-[#C9A24A] transition-colors">
                  Handmade Keychain Collection
                </Link>
              </li>
              <li>
                <Link href="/custom-gifts" className="hover:text-[#C9A24A] transition-colors">
                  Custom Gift Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C9A24A] transition-colors">
                  Shop All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#F8F1E7] tracking-wider uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-[#C9A24A] transition-colors font-bold text-[#F4D068]">
                  Customer Account Login
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#C9A24A] transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link href="/custom-gifts" className="hover:text-[#C9A24A] transition-colors">
                  Request Custom Design
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C9A24A] transition-colors">
                  About Happiwrapz
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A24A] transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#C9A24A] transition-colors text-[#A39A90]">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Online Payment */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#F8F1E7] tracking-wider uppercase">
              Policies & Payment
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-[#C9A24A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-and-conditions" className="hover:text-[#C9A24A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-policy" className="hover:text-[#C9A24A] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund-policy" className="hover:text-[#C9A24A] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/payment-policy" className="hover:text-[#C9A24A] transition-colors">
                  Payment Policy (No COD)
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <div className="bg-[#120E12] border border-[#C9A24A]/30 p-3 rounded-xl text-xs text-[#F8F1E7] space-y-1">
                <div className="flex items-center gap-1.5 text-[#F4D068] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Secure Online Payment</span>
                </div>
                <p className="text-[11px] text-[#A39A90]">
                  UPI, Credit/Debit Cards, Net Banking & Wallets powered by Razorpay.
                </p>
                <p className="text-[10px] text-[#D00000] font-bold">
                  ❌ Cash on Delivery not available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#1A161A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Happiwrapz. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#C9A24A]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-current text-[#D00000]" />
            <span>for your special moments.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
