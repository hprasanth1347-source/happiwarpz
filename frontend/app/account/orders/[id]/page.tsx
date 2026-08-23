import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchFastAPI } from '@/lib/fastapiClient';

export const revalidate = 0;

interface CustomerOrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerOrderDetailPage({
  params,
}: CustomerOrderDetailProps) {
  const { id } = await params;

  const order = await fetchFastAPI(`/api/orders/${id}`);

  if (!order) {
    notFound();
  }

  const timelineSteps = [
    { key: 'PAID', label: 'PAID' },
    { key: 'PROCESSING', label: 'PROCESSING' },
    { key: 'CUSTOMIZATION', label: 'CUSTOMIZATION' },
    { key: 'READY', label: 'READY' },
    { key: 'SHIPPED', label: 'SHIPPED' },
    { key: 'DELIVERED', label: 'DELIVERED' },
  ];

  const currentIdx = timelineSteps.findIndex((s) => s.key === order.orderStatus);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#1A0A0A] border-2 border-[#C9A24A] mx-auto flex items-center justify-center text-[#D00000]">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F1E7]">
          Order Confirmed ❤️
        </h1>
        <p className="text-xs text-[#A39A90]">
          Order ID: <strong className="text-[#F4D068]">{order.orderNumber}</strong>
        </p>
      </div>

      {/* Visual Timeline Bar */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider text-center">
          Live Order Status Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= activeIdx;
            return (
              <div
                key={step.key}
                className={`p-3 rounded-2xl text-[11px] font-bold text-center border transition-all ${
                  isCompleted
                    ? 'bg-[#8B0000]/30 border-[#D00000] text-[#F8F1E7] shadow'
                    : 'bg-[#050505] border-[#221D22] text-[#555]'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#D00000]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#555]" />
                  )}
                </div>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Order Receipt */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#221D22] pb-6 text-xs text-[#A39A90]">
          <div>
            <span>Order Date:</span>
            <p className="text-[#F8F1E7] font-bold">
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div>
            <span>Payment Status:</span>
            <p className="text-[#4CAF50] font-bold">{order.paymentStatus}</p>
          </div>
          <div>
            <span>Payment Method:</span>
            <p className="text-[#C9A24A] font-bold">ONLINE PAYMENT</p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#F8F1E7] uppercase tracking-wider">
            Products Ordered
          </h3>
          {(order.orderItems || []).map((item: any) => (
            <div
              key={item.id}
              className="p-3.5 bg-[#050505] border border-[#221D22] rounded-xl flex justify-between items-center text-xs"
            >
              <div>
                <span className="font-bold text-[#F8F1E7] block">{item.productName}</span>
                <span className="text-[#A39A90]">
                  Qty: {item.quantity} {item.variantName ? `[${item.variantName}]` : ''}
                </span>
                {item.customColor && (
                  <span className="text-[#C9A24A] block">Color: {item.customColor}</span>
                )}
                {item.customMessage && (
                  <span className="text-[#A39A90] italic block">"{item.customMessage}"</span>
                )}
              </div>
              <span className="font-bold text-[#F4D068] text-sm">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="pt-4 border-t border-[#221D22] text-xs text-[#A39A90] space-y-1">
          <h4 className="font-bold text-[#F8F1E7] uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4 text-[#C9A24A]" />
            <span>Delivery Destination</span>
          </h4>
          <p className="text-[#F8F1E7] font-semibold">{order.customerName}</p>
          <p>{order.address}</p>
          <p>{order.city}, {order.state} - {order.pincode}</p>
          <p>Phone: {order.customerPhone}</p>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-[#221D22] flex justify-between items-center text-sm font-bold text-[#F8F1E7]">
          <span>Grand Total Paid</span>
          <span className="text-2xl text-[#F4D068]">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
