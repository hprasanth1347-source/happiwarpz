import React from 'react';
import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';

export const metadata = {
  title: 'Sitemap | Happiwrapz Handmade Flowers & Gifts',
  description: 'Complete directory and sitemap of all pages and collections on Happiwrapz.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Shop Collections',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'Rose Bouquets', href: '/shop?category=flower-bouquets' },
        { label: 'Sunflower Bouquets', href: '/shop?category=sunflower-bouquets' },
        { label: 'Handmade Keychains', href: '/keychains' },
        { label: 'Custom Gift Hampers', href: '/custom-gifts' },
      ],
    },
    {
      title: 'Customer Services',
      links: [
        { label: 'Customer Account Login', href: '/login' },
        { label: 'Track Order Status', href: '/account/orders' },
        { label: 'Request Custom Gift', href: '/custom-gifts' },
        { label: 'About Happiwrapz', href: '/about' },
        { label: 'Contact & Support', href: '/contact' },
        { label: 'Admin Portal Login', href: '/admin/login' },
      ],
    },
    {
      title: 'Store Policies',
      links: [
        { label: 'Privacy Policy', href: '/policies/privacy-policy' },
        { label: 'Terms & Conditions', href: '/policies/terms-and-conditions' },
        { label: 'Shipping Policy', href: '/policies/shipping-policy' },
        { label: 'Refund & Cancellation Policy', href: '/policies/refund-policy' },
        { label: 'Payment Policy (No COD)', href: '/policies/payment-policy' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Map className="w-4 h-4" />
          <span>Directory</span>
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          Happiwrapz Sitemap
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Explore all store collections, account services, and policies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4 shadow-lg"
          >
            <h3 className="text-base font-serif font-bold text-[#F4D068] border-b border-[#221D22] pb-3">
              {section.title}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A39A90]">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#D4AF37]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Explore Shop Catalogue
        </Link>
      </div>
    </div>
  );
}
