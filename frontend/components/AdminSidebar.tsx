'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MessageSquareHeart,
  Users,
  CreditCard,
  Settings,
  Layout,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/admin/login') return null;

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('happiwrapz_token');
    localStorage.removeItem('happiwrapz_user');
    window.location.href = '/admin/login';
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Website Content', href: '/admin/content', icon: Layout },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: MessageSquareHeart },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden bg-[#0D0D0D] border-b border-[#221D22] p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D00000] shrink-0">
            <Image src="/images/logo.png" alt="Happiwrapz Admin" fill className="object-cover" />
          </div>
          <span className="text-lg font-serif font-bold text-[#F8F1E7]">Happi<span className="text-[#D00000]">wrapz</span></span>
          <span className="text-[10px] bg-[#8B0000] text-white px-2 py-0.5 rounded font-bold uppercase ml-1">Admin</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#F8F1E7]">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D0D0D] border-r border-[#221D22] flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-[#221D22] pb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D00000] shrink-0">
                <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-cover" />
              </div>
              <span className="text-xl font-serif font-bold text-[#F8F1E7]">Happi<span className="text-[#D00000]">wrapz</span></span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white shadow-lg font-bold'
                      : 'text-[#A39A90] hover:text-[#F8F1E7] hover:bg-[#141414]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C9A24A]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#221D22] bg-[#050505] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#4CAF50] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Online Payment Only Mode</span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-between text-xs text-[#D00000] hover:text-white transition-colors pt-2 border-t border-[#1C161C] font-bold"
          >
            <span>Log Out Admin Session</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}
