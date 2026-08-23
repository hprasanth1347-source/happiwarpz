import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Accessibility Statement | Happiwrapz Handmade Flowers',
  description: 'Happiwrapz is committed to ensuring digital accessibility for all users.',
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Commitment</span>
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          Accessibility Statement
        </h1>
        <p className="text-sm text-[#A39A90]">
          Making our handmade shopping experience seamless and accessible to everyone.
        </p>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 space-y-6 text-sm text-[#A39A90] leading-relaxed">
        <p>
          Happiwrapz is dedicated to digital accessibility and ensuring that our website is usable for all individuals, including people with visual, hearing, cognitive, and motor impairments.
        </p>
        <p className="border-t border-[#1C161C] pt-4">
          We continuously optimize color contrasts, provide keyboard navigation support, implement semantic HTML landmarks, and ensure descriptive text alternatives for imagery.
        </p>
        <p className="border-t border-[#1C161C] pt-4">
          If you encounter any accessibility barriers while browsing or purchasing on Happiwrapz, please contact our support team at <a href="mailto:hello@happiwrapz.com" className="text-[#F4D068] underline">hello@happiwrapz.com</a>. We will gladly assist you.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="text-xs font-bold text-[#C9A24A] hover:underline"
        >
          ← Return to Happiwrapz Shop
        </Link>
      </div>
    </div>
  );
}
