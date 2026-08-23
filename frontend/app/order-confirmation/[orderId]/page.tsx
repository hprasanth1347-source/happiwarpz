import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Heart, ArrowRight, Clock, MapPin } from 'lucide-react';
import { fetchFastAPI } from '@/lib/fastapiClient';

export const revalidate = 0;

interface OrderConfirmationProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  const { orderId } = await params;

  const order = await fetchFastAPI(`/api/orders/${orderId}`);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      {/* Header Emblem */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#1A0A0A] border-2 border-[#C9A24A] mx-auto flex items-center justify-center text-[#D00000] shadow-[0_0_30px_rgba(201,162,74,0.3)]">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <span className="bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
          Order Verified & Confirmed
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          Thank You for Your Order ❤️
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Your Happiwrapz order <strong className="text-[#F4D068]">{order.orderNumber}</strong> has been received and confirmed.
        </p>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Receipt Header Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#221D22] text-xs">
          <div>
            <span className="text-[#A39A90] block">Order Number</span>
            <span className="text-sm font-bold text-[#F8F1E7]">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-[#A39A90] block">Order Date</span>
            <span className="text-sm font-bold text-[#F8F1E7]">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-[#A39A90] block">Payment Method</span>
            <span className="text-sm font-bold text-[#C9A24A]">Online Payment</span>
          </div>
          <div>
            <span className="text-[#A39A90] block">Payment Status</span>
            <span className="text-sm font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded inline-block">
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider">
            Items Ordered
          </h3>
          <div className="space-y-3">
            {(order.orderItems || []).map((item: any) => (
              <div
                key={item.id}
                className="p-3 bg-[#050505] border border-[#221D22] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#F8F1E7]">{item.productName}</h4>
                  <div className="text-[#A39A90] space-y-0.5 mt-0.5">
                    {item.variantName && <span>Variant: {item.variantName} • </span>}
                    <span>Qty: {item.quantity}</span>
                    {item.customColor && <p>Color: {item.customColor}</p>}
                    {item.customMessage && <p className="italic">"{item.customMessage}"</p>}
                  </div>
                </div>
                <span className="font-bold text-[#F4D068] text-sm">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Advance Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#221D22]">
          <div className="space-y-1.5 text-xs text-[#A39A90]">
            <h4 className="font-bold text-[#F8F1E7] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C9A24A]" />
              <span>Delivery Address</span>
            </h4>
            <p className="text-[#F8F1E7] font-semibold">{order.customerName}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} - {order.pincode}</p>
            <p>Phone: {order.customerPhone}</p>
          </div>

          <div className="p-4 bg-[#1F0A0A] border border-[#8B0000]/50 rounded-2xl space-y-1 text-xs text-[#F8F1E7]">
            <div className="flex items-center gap-1.5 text-[#D00000] font-bold">
              <Clock className="w-4 h-4" />
              <span>Order Preparation Notice</span>
            </div>
            <p className="text-[#A39A90] leading-relaxed">
              Every Happiwrapz bouquet is handmade with care. Please allow approximately 1 week for crafting and packaging before shipping.
            </p>
          </div>
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t border-[#221D22] flex justify-between items-center text-sm font-bold text-[#F8F1E7]">
          <span>Total Amount Paid</span>
          <span className="text-2xl text-[#F4D068]">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/orders?orderNumber=${order.orderNumber}`}
          className="px-6 py-3 rounded-full border border-[#C9A24A] bg-[#0D0D0D] text-[#F8F1E7] font-bold text-xs hover:bg-[#C9A24A] hover:text-black transition-all text-center"
        >
          Track Order Status
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
