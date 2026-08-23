import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    id: "shipping",
    title: "1. Shipping & Express Delivery",
    content: `All orders are dispatched via express delivery partners. Estimated delivery is 2–5 business days. 
For bouquet orders, please place them at least 1 week in advance to ensure freshness and availability. 
Tracking numbers and live status are visible directly on your order detail page.`,
  },
  {
    id: "payment",
    title: "2. Payment Policy (No COD)",
    content: `Happiwrapz accepts only online payment methods — UPI, Credit/Debit Cards, Net Banking, and 
Digital Wallets via Razorpay. Cash on Delivery (COD) is not available. All transactions are 
100% secure and encrypted.`,
  },
  {
    id: "refund",
    title: "3. Refund & Cancellation Policy",
    content: `Orders can be cancelled within 12 hours of placement for a full refund. After 12 hours, 
cancellations are not accepted as production begins. If your bouquet arrives damaged, please 
notify our support team within 24 hours with a photo and we will offer a replacement or refund.`,
  },
  {
    id: "privacy",
    title: "4. Privacy Policy",
    content: `Your personal data (name, email, address) is used solely to process and deliver your orders. 
We do not sell or share your data with third parties. Payment data is handled securely by 
Razorpay and is never stored on our servers.`,
  },
  {
    id: "terms",
    title: "5. Terms & Conditions",
    content: `By placing an order on Happiwrapz, you agree to our pricing, delivery timelines, 
and customization terms. Product colours may slightly vary from photos due to screen differences. 
All designs are subject to material availability.`,
  },
];

export default function PoliciesPage() {
  return (
    <main className="bg-dark-bg min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Legal & Store Info</p>
          <h1 className="font-serif text-4xl font-bold text-white">Policies & Terms</h1>
          <p className="text-xs text-gray-500">Last updated: August 2026</p>
        </div>

        {/* Secure payment banner */}
        <div className="flex items-center gap-3 p-4 bg-dark-surface border border-dark-border rounded-xl">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-xs text-gray-300">
            <strong className="text-white">100% Secure Online Payment</strong> — UPI, Cards, Net Banking & Wallets via Razorpay.{" "}
            <span className="text-brand-500 font-semibold">Cash on Delivery not available.</span>
          </p>
        </div>

        {/* Policy sections */}
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.id} id={s.id} className="bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-8 space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg font-bold text-white">{s.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Contact link */}
        <div className="text-center text-xs text-gray-500 pt-4">
          Questions?{" "}
          <Link href="/contact" className="text-brand-400 hover:text-brand-300 font-semibold">
            Contact us
          </Link>{" "}
          or DM us on{" "}
          <a href="https://instagram.com/happiwrapz" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 font-semibold">
            @happiwrapz
          </a>
        </div>

      </div>
    </main>
  );
}
