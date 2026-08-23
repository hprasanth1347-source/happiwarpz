import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Heart,
  ChevronRight,
  Lock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Gift,
  Award,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-[#A39A90] pt-12 pb-8 px-4 sm:px-6 lg:px-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Luxury Gold Bordered Card Container */}
        <div className="bg-[#080808] border border-[#C9A24A]/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
          
          {/* Subtle Background Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E4002B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
            
            {/* ══════════════════════════════════════════
                1. LEFT COLUMN: Brand Identity & Features
            ══════════════════════════════════════════ */}
            <div className="lg:col-span-4 space-y-6 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#221D22] pb-8 lg:pb-0">
              
              {/* Brand Logo & Name */}
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E4002B] group-hover:border-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#E4002B]/30 bg-[#050505] p-0.5 shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="Happiwrapz Logo"
                    fill
                    className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold tracking-tight leading-none text-white">
                    Happi<span className="text-[#E4002B] drop-shadow-[0_0_8px_rgba(228,0,43,0.4)]">wrapz</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
                    HANDMADE FLOWERS & GIFTS
                  </span>
                </div>
              </Link>

              {/* Italic Motto */}
              <p className="text-sm font-serif italic text-[#D4AF37] flex items-center gap-1.5">
                <span>"Because moments deserve flowers."</span>
                <Heart className="w-3.5 h-3.5 fill-[#E4002B] text-[#E4002B]" />
              </p>

              {/* Brand Description */}
              <p className="text-xs text-[#A39A90] leading-relaxed">
                Happiwrapz creates handmade floral bouquets, everlasting roses, sunflowers, keychains, and thoughtful personalized gifts designed to make every moment unforgettable.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1C161C]">
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#050505] border border-[#221D22]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <span className="text-[10px] font-medium text-white leading-tight">Handmade with Love</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#050505] border border-[#221D22]">
                  <Award className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <span className="text-[10px] font-medium text-white leading-tight">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#050505] border border-[#221D22]">
                  <Gift className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <span className="text-[10px] font-medium text-white leading-tight">Unique & Personalized</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#050505] border border-[#221D22]">
                  <Heart className="w-4 h-4 text-[#E4002B] mb-1" />
                  <span className="text-[10px] font-medium text-white leading-tight">Made to Adore</span>
                </div>
              </div>

              {/* Social Media Follow Section */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] uppercase tracking-widest text-[#F8F1E7] font-bold block">
                  FOLLOW US
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/happiwrapz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/40 text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z" />
                    </svg>
                  </a>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#E60023]/10 border border-[#E60023]/40 text-[#E60023] flex items-center justify-center hover:bg-[#E60023] hover:text-white transition-all shadow-sm"
                    aria-label="Pinterest"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/40 text-[#FF0000] flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all shadow-sm"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                2. MIDDLE GRID: Navigation Columns
            ══════════════════════════════════════════ */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Column 1: COLLECTIONS */}
              <div className="space-y-4">
                <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>COLLECTIONS</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href="/shop?category=flower-bouquets"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Rose Bouquets (With & Without Glitter)</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=flower-bouquets"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Sunflower Bouquets</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=handcrafted-keychains"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Handmade Keychain Collection</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=luxury-hampers"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Custom Gift Hampers</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1 font-bold text-white"
                    >
                      <span>Shop All Products</span>
                      <ChevronRight className="w-3 h-3 text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: CUSTOMER SUPPORT (NO Admin Portal Link) */}
              <div className="space-y-4">
                <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>CUSTOMER SUPPORT</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href="/login"
                      className="text-[#D4AF37] font-bold hover:underline flex items-center justify-between group py-1"
                    >
                      <span>Customer Account Login</span>
                      <ChevronRight className="w-3 h-3 text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Track Order Status</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/custom-gifts"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Request Custom Design</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>About Happiwrapz</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                    >
                      <span>Contact & Enquiries</span>
                      <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                3. RIGHT GRID: Policies & Payment Badge Box
            ══════════════════════════════════════════ */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-serif font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>POLICIES & PAYMENT</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/policies/privacy-policy"
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                  >
                    <span>Privacy Policy</span>
                    <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/terms-and-conditions"
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                  >
                    <span>Terms & Conditions</span>
                    <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/shipping-policy"
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                  >
                    <span>Shipping Policy</span>
                    <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/refund-policy"
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                  >
                    <span>Refund & Cancellation Policy</span>
                    <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/payment-policy"
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group py-1"
                  >
                    <span>Payment Policy (No COD)</span>
                    <ChevronRight className="w-3 h-3 text-[#A39A90] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>

              {/* 100% Secure Payment Box Badge */}
              <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#D4AF37]/40 shadow-inner space-y-2 pt-3">
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>100% Secure Online Payment</span>
                </div>
                <p className="text-[10.5px] text-[#A39A90] leading-tight">
                  UPI, Credit/Debit Cards, Net Banking &amp; Wallets powered by Razorpay.
                </p>
                
                {/* Payment Logos Pill Badges */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-white text-black text-[9px] font-black rounded tracking-tight">UPI</span>
                  <span className="px-2 py-0.5 bg-[#1A1F71] text-white text-[9px] font-bold rounded tracking-wider">VISA</span>
                  <span className="px-2 py-0.5 bg-[#EB001B] text-white text-[9px] font-bold rounded tracking-wider">MC</span>
                  <span className="px-2 py-0.5 bg-[#0066B3] text-white text-[9px] font-bold rounded tracking-tight">RuPay</span>
                </div>

                <div className="pt-1.5 border-t border-[#1C161C] flex items-center gap-1.5 text-[10.5px] text-[#E4002B] font-semibold">
                  <span>❌</span>
                  <span>Cash on Delivery not available</span>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════
              4. GET IN TOUCH & ARTISTIC ROSE FOOTER ROW
          ══════════════════════════════════════════ */}
          <div className="mt-10 pt-8 border-t border-[#1C161C] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Get In Touch Contact Details */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#050505] border border-[#221D22] text-[#D4AF37] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">+91 98765 43210</div>
                  <div className="text-[10.5px] text-[#A39A90]">Mon - Sat: 9AM - 7PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#050505] border border-[#221D22] text-[#D4AF37] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">hello@happiwrapz.com</div>
                  <div className="text-[10.5px] text-[#A39A90]">We reply within 24 hrs</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#050505] border border-[#221D22] text-[#D4AF37] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Happiwrapz Studio</div>
                  <div className="text-[10.5px] text-[#A39A90]">Coimbatore, Tamil Nadu, India</div>
                </div>
              </div>
            </div>

            {/* Artistic Gold & Red Rose Graphic Overlay Accent */}
            <div className="md:col-span-4 flex justify-end">
              <div className="relative w-40 h-20 opacity-80 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-l from-[#E4002B]/20 via-[#D4AF37]/10 to-transparent rounded-full blur-xl" />
                <div className="relative text-right text-xs font-serif italic text-[#D4AF37] font-semibold pr-2 pt-4">
                  ✨ Designed to adore
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════
            5. BOTTOM COPYRIGHT BAR
        ══════════════════════════════════════════ */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A39A90] px-2">
          <p>© {new Date().getFullYear()} Happiwrapz. All rights reserved.</p>
          
          <div className="flex items-center gap-1 text-[#D4AF37] font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#E4002B] text-[#E4002B]" />
            <span>love for your special moments.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <span>|</span>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
