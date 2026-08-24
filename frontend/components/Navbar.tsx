'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Heart, ShieldCheck, ChevronDown, User, LogOut, Home, Store, Mail, Info, Gift } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let localToken: string | null = null;
    let localUser: any = null;

    if (typeof window !== 'undefined') {
      localToken = localStorage.getItem('happiwrapz_token');
      const userStr = localStorage.getItem('happiwrapz_user');
      if (userStr) {
        try {
          localUser = JSON.parse(userStr);
          setUser(localUser);
        } catch (_) {}
      }
    }

    const headers: Record<string, string> = {};
    if (localToken) {
      headers['Authorization'] = `Bearer ${localToken}`;
    }

    fetch('/api/auth/me', {
      cache: 'no-store',
      credentials: 'same-origin',
      headers,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        const currentUser = data.user || data.data?.user;
        if (currentUser) {
          setUser(currentUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('happiwrapz_user', JSON.stringify(currentUser));
          }
        }
      })
      .catch(() => {
        // If localUser exists, keep it active so the user never gets abruptly logged out
        if (!localUser) setUser(null);
      });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('happiwrapz_token');
      localStorage.removeItem('happiwrapz_user');
      document.cookie = 'happiwrapz_session=; path=/; max-age=0';
      document.cookie = 'access_token=; path=/; max-age=0';
      document.cookie = 'happiwrapz_token=; path=/; max-age=0';
    }
    setUser(null);
    setMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/shop', label: 'Shop', icon: <Store className="w-4 h-4" />, hasDropdown: true },
    { href: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Sticky Header Wrapper */}
      <header className="sticky top-0 z-50 w-full transition-all duration-300">
        
        {/* Top Announcement Bar (full width with animated marquee & matching theme background) */}
        <div className="w-full bg-[#050505] border-b border-white/10 text-[#F8F1E7] text-[11px] sm:text-xs py-2 overflow-hidden relative shadow-sm">
          <div className="flex whitespace-nowrap animate-marquee">
            {/* Repeated marquee sequence for seamless looping animation */}
            {[1, 2, 3].map((key) => (
              <div key={key} className="flex items-center gap-6 sm:gap-10 shrink-0 px-4">
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  ✨ Online payment only
                </span>
                <span className="text-[#D4AF37]/50">•</span>
                <span className="text-white/90">
                  Place bouquet orders at least 1 week in advance
                </span>
                <span className="text-[#D4AF37]/50">•</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  Free gift card included ❤️
                </span>
                <span className="text-[#D4AF37]/50">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width Container for Floating Navbar */}
        <div className="w-full px-3 sm:px-6 lg:px-10 pt-2 pb-1">
          <div 
            className={`relative flex items-center justify-between px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-[#050505]/90 backdrop-blur-xl border border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.85)] transition-all duration-300 ${
              isScrolled 
                ? 'bg-[#050505]/98 border-[#E4002B]/40 shadow-[0_8px_30px_rgba(0,0,0,0.95),0_0_20px_rgba(228,0,43,0.2)]' 
                : 'hover:border-[#D4AF37]/35 hover:shadow-[0_8px_28px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)]'
            }`}
          >
            
            {/* 1. Left Section: Logo + Brand Name + Tagline */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 py-0.5 min-w-0">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#E4002B] group-hover:border-[#D4AF37] transition-all duration-300 shadow-md shadow-[#E4002B]/40 bg-[#050505] p-0.5 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Happiwrapz Logo"
                  fill
                  className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl lg:text-2xl font-serif font-bold tracking-tight leading-none truncate">
                  <span className="text-white">Happi</span>
                  <span className="text-[#E4002B] drop-shadow-[0_0_8px_rgba(228,0,43,0.4)]">wrapz</span>
                </span>
                <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5 truncate">
                  MOMENTS DESERVE FLOWERS
                </span>
              </div>
            </Link>

            {/* 2. Center Section: Desktop Nav Menu Items */}
            <nav className="hidden lg:flex items-center gap-8 sm:gap-10 text-sm font-medium text-white/90">
              <Link 
                href="/" 
                className={`hover:text-[#D4AF37] transition-colors relative py-1 ${
                  pathname === '/' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Home
                {pathname === '/' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_6px_#D4AF37]" />
                )}
              </Link>

              {/* Shop Menu Item with Dropdown Caret */}
              <div className="relative group py-1">
                <Link 
                  href="/shop" 
                  className={`flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors py-1 ${
                    pathname.startsWith('/shop') ? 'text-[#D4AF37] font-semibold' : ''
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown className="w-4 h-4 text-[#D4AF37] group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu Box */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1 mt-2">
                  <Link 
                    href="/shop" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-white hover:bg-white/5 hover:text-[#D4AF37] transition-colors font-bold"
                  >
                    Shop All Products
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <Link 
                    href="/shop?category=flower-bouquets" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Flower Bouquets
                  </Link>
                  <Link 
                    href="/shop?category=custom-gift-wraps" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Custom Gift Wraps
                  </Link>
                  <Link 
                    href="/shop?category=luxury-hampers" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Luxury Hampers
                  </Link>
                  <Link 
                    href="/shop?category=handcrafted-keychains" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Handcrafted Keychains
                  </Link>
                  <Link 
                    href="/custom-gifts" 
                    className="block px-3.5 py-2 rounded-xl text-xs text-[#D4AF37] hover:bg-white/5 font-semibold transition-colors"
                  >
                    ✨ Custom Gift Request
                  </Link>
                </div>
              </div>

              <Link 
                href="/about" 
                className={`hover:text-[#D4AF37] transition-colors relative py-1 ${
                  pathname === '/about' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                About
                {pathname === '/about' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_6px_#D4AF37]" />
                )}
              </Link>
              
              <Link 
                href="/contact" 
                className={`hover:text-[#D4AF37] transition-colors relative py-1 ${
                  pathname === '/contact' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Contact
                {pathname === '/contact' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_6px_#D4AF37]" />
                )}
              </Link>
            </nav>

            {/* 3. Right Section: Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* Search Icon Button */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className="p-1.5 sm:p-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all rounded-full" 
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Login Button - desktop badge, mobile compact icon */}
              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {user.role === 'ADMIN' ? (
                      <Link 
                        href="/admin" 
                        className="text-[11px] sm:text-xs bg-gradient-to-r from-[#E4002B] to-[#8B0000] border border-[#E4002B] text-white font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full hover:shadow-md transition-all flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline sm:inline">ADMIN</span>
                      </Link>
                    ) : (
                      <Link 
                        href="/account" 
                        className="text-[11px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-colors font-semibold flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full"
                      >
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                        <span className="hidden xs:inline sm:inline">Account</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="text-xs text-white/60 hover:text-[#E4002B] transition-colors p-1 sm:p-1.5 rounded-full" 
                      title="Logout"
                      aria-label="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="border border-[#D4AF37]/50 text-white hover:bg-[#D4AF37] hover:text-black font-semibold px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 text-[11px] sm:text-xs shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] group-hover:text-black" />
                    <span className="hidden sm:inline">LOGIN</span>
                  </Link>
                )}
              </div>

              {/* Wishlist Heart Icon */}
              <Link 
                href="/wishlist" 
                className="relative p-1.5 sm:p-2 text-white/80 hover:text-[#E4002B] hover:bg-white/5 transition-all rounded-full" 
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E4002B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#050505] shadow-sm">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Red Circle Badge */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-1.5 sm:p-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all rounded-full" 
                title="Cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E4002B] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#050505] shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-white hover:text-[#D4AF37] hover:bg-white/5 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mobile Menu Drawer */}
        <div
          className={`lg:hidden max-w-7xl mx-auto px-4 transition-all duration-300 ease-in-out mt-1 ${
            mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'text-white/90 hover:bg-white/5 hover:text-[#D4AF37]'
                }`}
              >
                <span className="text-[#D4AF37]">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            <Link
              href="/custom-gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-colors"
            >
              <Gift className="w-4 h-4 text-[#D4AF37]" />
              Custom Gift Request
            </Link>

            {/* Mobile Auth Drawer Section */}
            <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-1.5 text-xs text-[#D4AF37] font-semibold">
                    Signed in as: {user.name || user.email}
                  </div>
                  {user.role === 'ADMIN' ? (
                    <Link 
                      href="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#E4002B] to-[#8B0000]"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/account" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white hover:bg-white/5 hover:text-[#D4AF37]"
                    >
                      <User className="w-4 h-4 text-[#D4AF37]" /> My Account
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[#E4002B] hover:bg-white/5 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black text-sm font-bold transition-all"
                >
                  <User className="w-4 h-4 text-[#D4AF37]" /> LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
