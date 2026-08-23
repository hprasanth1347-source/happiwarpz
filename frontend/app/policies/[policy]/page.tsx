import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

interface PolicyProps {
  params: Promise<{ policy: string }>;
}

export default async function PolicyPage({ params }: PolicyProps) {
  const { policy } = await params;

  const policyData: Record<
    string,
    { title: string; subtitle: string; content: string[] }
  > = {
    'privacy-policy': {
      title: 'Privacy Policy',
      subtitle: 'How we protect and respect your personal information.',
      content: [
        'At Happiwrapz, we respect your privacy. This policy outlines how we collect, use, and protect your personal information when you use our website.',
        'We collect details such as your name, email address, phone number, and delivery address strictly for processing orders, custom requests, and providing customer support.',
        'We do not sell, rent, or share your personal data with third parties except as necessary to complete your payment (via Razorpay) and deliver your order.',
        'All payment transactions are encrypted using bank-grade SSL security by Razorpay. We do not store your credit card or UPI password details on our servers.',
      ],
    },
    'terms-and-conditions': {
      title: 'Terms & Conditions',
      subtitle: 'Guidelines governing the use of Happiwrapz online store.',
      content: [
        'By accessing or placing an order on Happiwrapz, you agree to these terms and conditions.',
        'Handmade Products: Every product sold on Happiwrapz is handcrafted. Minor variations in flower shading, ribbon placement, or dimensions are natural characteristics of handmade craftsmanship.',
        'Order Lead Time: Bouquet orders must be placed at least 1 week earlier to ensure adequate time for handcrafting and packaging.',
        'Online Payment Only: Every order must be paid online prior to order confirmation. Cash on Delivery (COD) is strictly unavailable.',
      ],
    },
    'shipping-policy': {
      title: 'Shipping & Delivery Policy',
      subtitle: 'Information regarding dispatch timelines and delivery.',
      content: [
        'Because all bouquets and custom hampers are handcrafted to order, please allow 3 to 7 working days for crafting prior to dispatch.',
        'Once dispatched, tracking details will be updated in your order lookup portal.',
        'Please ensure that your delivery address, phone number, and PIN code are accurate at checkout to prevent delivery delays.',
      ],
    },
    'refund-policy': {
      title: 'Refund & Cancellation Policy',
      subtitle: 'Clear terms regarding order cancellations and damaged items.',
      content: [
        'Cancellations: Orders may be cancelled within 12 hours of placement before handcrafting begins.',
        'Replacements: In the unlikely event that your parcel arrives damaged during transit, please contact us within 24 hours of delivery with photos/video of the packaging for a replacement.',
        'Because our products are customized handmade gifts, returns based solely on change of mind after dispatch cannot be accepted.',
      ],
    },
    'payment-policy': {
      title: 'Payment Policy (Strictly No COD)',
      subtitle: 'Important notice regarding payment methods.',
      content: [
        'Happiwrapz operates strictly on an ONLINE PAYMENT ONLY model.',
        'We do NOT offer Cash on Delivery (COD) under any circumstances.',
        'Supported online payment options include: UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Net Banking, and Digital Wallets.',
        'Orders are confirmed and scheduled for handcrafting only after server-side cryptographic payment verification succeeds.',
      ],
    },
  };

  const data = policyData[policy];
  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Happiwrapz Policies
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          {data.title}
        </h1>
        <p className="text-sm text-[#A39A90]">{data.subtitle}</p>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 space-y-6 text-sm text-[#A39A90] leading-relaxed">
        {data.content.map((paragraph, index) => (
          <p key={index} className="border-b border-[#1C161C] pb-4 last:border-0 last:pb-0">
            {paragraph}
          </p>
        ))}
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
