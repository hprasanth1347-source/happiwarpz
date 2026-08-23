import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Clock, PackageCheck, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchFastAPI } from '@/lib/fastapiClient';

export const revalidate = 0;

interface OrdersPageProps {
  searchParams: Promise<{ orderNumber?: string; email?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const orderNumber = resolvedParams.orderNumber || '';
  const email = resolvedParams.email || '';

  let orders: any[] = [];
  if (orderNumber) {
    const singleOrder = await fetchFastAPI(`/api/orders/${orderNumber.trim()}`);
    if (singleOrder && singleOrder.id) {
      orders = [singleOrder];
    }
  } else if (email) {
    orders = (await fetchFastAPI(`/api/account/orders?email=${encodeURIComponent(email.trim())}`)) || [];
  }

  const statusSteps = [
    { key: 'PAID', label: 'Paid & Confirmed' },
    { key: 'PROCESSING', label: 'Order Processing' },
    { key: 'CUSTOMIZATION', label: 'Handcrafted' },
    { key: 'READY', label: 'Packed' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Customer Portal
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          Track Your Order Status
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          Enter your Happiwrapz Order Number (e.g. HW-108492) or Email Address to view real-time progress.
        </p>
      </div>

      {/* Search Form */}
      <form action="/orders" method="GET" className="bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            name="orderNumber"
            defaultValue={orderNumber}
            placeholder="Enter Order Number (e.g. HW-108492)"
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs hover:opacity-90 flex items-center justify-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Lookup Status</span>
        </button>
      </form>

      {/* Search Results */}
      {(orderNumber || email) && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-2">
              <AlertCircle className="w-8 h-8 text-[#A39A90] mx-auto" />
              <p className="text-base font-serif text-[#F8F1E7]">No order found</p>
              <p className="text-xs text-[#A39A90]">Please double check your order number or email.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const currentStepIdx = statusSteps.findIndex(
                (s) => s.key === ord.orderStatus
              );
              const activeIdx = currentStepIdx >= 0 ? currentStepIdx : 0;

              return (
                <div key={ord.id} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-6">
                  {/* Order Details Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-4">
                    <div>
                      <span className="text-xs text-[#A39A90] block">Order Number</span>
                      <span className="text-lg font-serif font-bold text-[#F4D068]">
                        {ord.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="bg-[#4CAF50]/10 text-[#4CAF50] font-bold px-3 py-1 rounded-full border border-[#4CAF50]/30">
                        {ord.paymentStatus}
                      </span>
                      <span className="text-[#F8F1E7] font-bold bg-[#181218] px-3 py-1 rounded-full border border-[#C9A24A]/40">
                        Status: {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-2">
                    <span className="text-xs text-[#A39A90] font-semibold block">Order Timeline</span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= activeIdx;
                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-xl text-[11px] font-bold text-center border transition-all ${
                              isDone
                                ? 'bg-[#8B0000]/30 border-[#D00000] text-[#F8F1E7]'
                                : 'bg-[#050505] border-[#221D22] text-[#555]'
                            }`}
                          >
                            {step.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-[#A39A90]">Items in this order:</span>
                    <div className="space-y-2">
                      {ord.orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-[#050505] p-3 rounded-xl text-xs border border-[#1C161C]"
                        >
                          <div>
                            <span className="font-bold text-[#F8F1E7] block">{item.productName}</span>
                            <span className="text-[#A39A90]">
                              Qty: {item.quantity} {item.variantName ? `(${item.variantName})` : ''}
                            </span>
                          </div>
                          <span className="font-bold text-[#F4D068]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#221D22] flex justify-between items-center text-xs text-[#A39A90]">
                    <span>Ordered on: {new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                    <span className="text-base font-bold text-[#F4D068]">Total Paid: ₹{ord.totalAmount}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
