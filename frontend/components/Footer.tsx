import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Lock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Flower2,
  ShieldCheck,
  Gift,
  Send,
  User,
  Sparkles,
  XCircle,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-[#9E9589] pt-8 pb-8 px-3 sm:px-6 lg:px-8 font-sans antialiased overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto">
        
        {/* ════════════════════════════════════════════════════════════════
            LUXURY GOLD-BORDERED CARD (Encloses Entire Footer)
        ════════════════════════════════════════════════════════════════ */}
        <div className="relative bg-[#000000] border border-[#D4AF37]/50 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.98)] overflow-hidden">
          
          {/* Ambient Backlight Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E4002B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-[500px] h-[500px] bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* ════════════════════════════════════════════════════════════════
              ACTUAL FULL BOTANICAL ROSE ARTWORK
          ════════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
            <Image
              src="/images/footer-rose-actual.png"
              alt="Botanical Rose Luxury Artwork"
              fill
              className="object-cover object-right opacity-95"
              priority
              unoptimized
            />
          </div>

          {/* ════════════════════════════════════════════════════════════════
              MAIN 5-COLUMN GRID (Brand Column + 4 Navigation Columns)
          ════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 relative z-10">
            
            {/* ─── COLUMN 1: BRAND IDENTITY & FEATURE BADGES ─── */}
            <div className="lg:col-span-3 space-y-5 lg:pr-5 border-b lg:border-b-0 lg:border-r border-[#26201A] pb-8 lg:pb-0">
              
              {/* Brand Logo & Name */}
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="relative w-[58px] h-[58px] rounded-full overflow-hidden border-2 border-[#E4002B] bg-[#050505] p-0.5 shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(228,0,43,0.35)] group-hover:border-[#D4AF37] transition-all">
                  <Image
                    src="/images/logo.png"
                    alt="Happiwrapz Logo"
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[28px] font-serif font-bold tracking-tight leading-none text-white">
                    Happi<span className="text-[#E4002B] drop-shadow-[0_0_10px_rgba(228,0,43,0.5)]">wrapz</span>
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mt-1">
                    HANDMADE FLOWERS & GIFTS
                  </span>
                </div>
              </Link>

              {/* Golden Italic Motto */}
              <p className="text-sm font-serif italic text-[#D4AF37] flex items-center gap-1.5 font-normal tracking-wide">
                <span>Because moments deserve flowers.</span>
                <span className="text-[#E4002B] text-base leading-none">♡</span>
              </p>

              {/* Brand Description */}
              <p className="text-[11.5px] text-[#A69C90] leading-relaxed">
                Happiwrapz creates handmade floral bouquets, everlasting roses, sunflowers, keychains, and thoughtful personalized gifts designed to make every moment unforgettable.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-4 border-y border-[#26201A] py-3 text-center">
                <div className="flex flex-col items-center px-1 border-r border-[#26201A]">
                  <Flower2 className="w-4 h-4 text-[#D4AF37] mb-1" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-white leading-tight">Handmade with Love</span>
                </div>
                <div className="flex flex-col items-center px-1 border-r border-[#26201A]">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] mb-1" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-white leading-tight">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center px-1 border-r border-[#26201A]">
                  <Gift className="w-4 h-4 text-[#D4AF37] mb-1" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-white leading-tight">Unique & Custom</span>
                </div>
                <div className="flex flex-col items-center px-1">
                  <Heart className="w-4 h-4 text-[#D4AF37] mb-1" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-white leading-tight">Made to Adore</span>
                </div>
              </div>

              {/* Social Media Follow Badges */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-[#E0D7CD] font-bold block">
                  FOLLOW US
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-110 transition-all"
                    aria-label="Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-110 transition-all"
                    aria-label="Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z" />
                    </svg>
                  </a>
                  {/* Pinterest */}
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#BD081C] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-110 transition-all"
                    aria-label="Pinterest"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-110 transition-all"
                    aria-label="YouTube"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-110 transition-all"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ─── COLUMNS 2-5: NAVIGATION / POLICIES / CONTACT ─── */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-5">
              
              {/* Column 1: COLLECTIONS */}
              <div className="space-y-4">
                <h4 className="text-[11.5px] font-bold text-white tracking-[0.16em] uppercase flex items-center gap-2 font-sans">
                  <Flower2 className="w-4 h-4 text-[#FF4D6D]" strokeWidth={2} />
                  <span>COLLECTIONS</span>
                </h4>
                <ul className="space-y-2.5 text-[11px] text-[#A69C90]">
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/shop?category=rose-bouquets" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Rose Bouquets (With & Without Glitter)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/shop?category=sunflower-bouquets" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Sunflower Bouquets</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/shop?category=handmade-keychains" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Handmade Keychain Collection</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/custom-gifts" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Custom Gift Hampers</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="pt-0.5">
                    <Link href="/shop" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group text-white font-medium">
                      <span>Shop All Products</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#73695E] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: CUSTOMER SUPPORT */}
              <div className="space-y-4">
                <h4 className="text-[11.5px] font-bold text-white tracking-[0.16em] uppercase flex items-center gap-2 font-sans">
                  <User className="w-4 h-4 text-[#E5A93C]" strokeWidth={2} />
                  <span>CUSTOMER SUPPORT</span>
                </h4>
                <ul className="space-y-2.5 text-[11px] text-[#A69C90]">
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/login" className="text-[#E5A93C] font-semibold hover:underline flex items-center justify-between group">
                      <span>Customer Account Login</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C] shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/orders" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Track Order Status</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/custom-gifts" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Request Custom Design</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/about" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>About Happiwrapz</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Contact & Enquiries</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="pt-0.5">
                    <Link href="/admin/login" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Admin Portal Login</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: POLICIES & PAYMENT */}
              <div className="space-y-4">
                <h4 className="text-[11.5px] font-bold text-white tracking-[0.16em] uppercase flex items-center gap-2 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#8C52FF]" strokeWidth={2} />
                  <span>POLICIES & PAYMENT</span>
                </h4>
                <ul className="space-y-2.5 text-[11px] text-[#A69C90]">
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/policies/privacy-policy" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Privacy Policy</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/policies/terms-and-conditions" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Terms & Conditions</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/policies/shipping-policy" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Shipping Policy</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="border-b border-[#1A1614] pb-2">
                    <Link href="/policies/refund-policy" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Refund & Cancellation Policy</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                  <li className="pb-1">
                    <Link href="/policies/payment-policy" className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                      <span>Payment Policy (No COD)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#554D44] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </Link>
                  </li>
                </ul>

                {/* 100% Secure Online Payment Badge Box */}
                <div className="p-3 rounded-2xl bg-[#080808] border border-[#D4AF37]/50 space-y-2 mt-2 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[#E5A93C] text-[11px] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>100% Secure Online Payment</span>
                  </div>
                  <p className="text-[9.5px] text-[#A69C90] leading-snug">
                    UPI, Credit/Debit Cards, Net Banking & Wallets powered by Razorpay.
                  </p>
                  
                  {/* Payment Method Badges */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="px-2 py-0.5 bg-white text-black text-[9px] font-black tracking-tight rounded-[3px] shadow-sm">
                      UPI
                    </div>
                    <div className="px-2 py-0.5 bg-[#1A1F71] text-white text-[9px] font-black tracking-wider italic rounded-[3px] shadow-sm">
                      VISA
                    </div>
                    <div className="px-1.5 py-0.5 bg-[#141414] rounded-[3px] flex items-center border border-[#333]">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] -mr-1.5 opacity-95"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-95"></div>
                    </div>
                    <div className="px-1.5 py-0.5 bg-white text-[#005FA8] text-[9px] font-black tracking-tight rounded-[3px] shadow-sm">
                      RuPay<span className="text-[#F37021]">❯</span>
                    </div>
                  </div>

                  {/* Cash on Delivery Unavailable Warning */}
                  <div className="pt-1.5 border-t border-[#241F1A] flex items-center gap-1.5 text-[10px] text-[#FF334B] font-medium">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Cash on Delivery not available</span>
                  </div>
                </div>

              </div>

              {/* ─── Column 4: GET IN TOUCH ─── */}
              <div className="space-y-4">
                <h4 className="text-[11.5px] font-bold text-white tracking-[0.16em] uppercase flex items-center gap-2 font-sans">
                  <Send className="w-4 h-4 text-[#D4AF37]" strokeWidth={2} />
                  <span>GET IN TOUCH</span>
                </h4>
                
                <div className="space-y-4 pt-1">
                  
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#D4AF37] mt-0.5 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold tracking-wide">+91 98765 43210</div>
                      <div className="text-[10px] text-[#A69C90] mt-0.5">Mon - Sat: 9AM - 7PM</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#D4AF37] mt-0.5 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold tracking-wide">hello@happiwrapz.com</div>
                      <div className="text-[10px] text-[#A69C90] mt-0.5">We reply within 24 hrs</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#D4AF37] mt-0.5 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold tracking-wide">Happiwrapz Studio</div>
                      <div className="text-[10px] text-[#A69C90] mt-0.5 leading-relaxed">
                        Coimbatore, Tamil Nadu<br />India - 641001
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              SUB-BAR: COPYRIGHT & ACCESSIBILITY (Inside the Golden Card)
          ════════════════════════════════════════════════════════════════ */}
          <div className="mt-10 pt-5 border-t border-[#26201A] flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#8C8377] relative z-10">
            <p>© 2026 Happiwrapz. All rights reserved.</p>
            
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-medium text-[11px]">
              <span className="text-[#FF4D6D]">♡</span>
              <span>Crafted with <span className="text-[#FF334B] font-semibold">love</span> for your special moments.</span>
            </div>

            <div className="flex items-center gap-3.5 text-[11px]">
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              <span className="text-[#3E3832]">|</span>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <span className="text-[#3E3832]">|</span>
              <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
