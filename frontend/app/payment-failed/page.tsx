import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#2A0808] border-2 border-[#D00000] mx-auto flex items-center justify-center text-[#D00000] shadow-[0_0_30px_rgba(208,0,0,0.3)]">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          Payment Unsuccessful
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Your payment could not be completed. Your cart is still safe and saved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          href="/checkout"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Link>

        <Link
          href="/cart"
          className="px-8 py-3.5 rounded-full border border-[#C9A24A]/40 bg-[#0D0D0D] text-[#F8F1E7] font-bold text-sm hover:border-[#C9A24A] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#C9A24A]" />
          <span>Return to Cart</span>
        </Link>
      </div>
    </div>
  );
}
