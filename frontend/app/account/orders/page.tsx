import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { fetchFastAPI } from '@/lib/fastapiClient';

export const revalidate = 0;

interface AccountOrdersProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function AccountOrdersPage({ searchParams }: AccountOrdersProps) {
  const resolvedParams = await searchParams;
  const email = resolvedParams.email || '';

  let orders: any[] = [];
  if (email) {
    orders = (await fetchFastAPI(`/api/account/orders?email=${encodeURIComponent(email.trim().toLowerCase())}`)) || [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Customer Portal
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          My Orders History
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          View your past orders, delivery tracking, and purchase details.
        </p>
      </div>

      {/* Email filter input form */}
      <form action="/account/orders" method="GET" className="bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl flex gap-3">
        <input
          type="email"
          name="email"
          defaultValue={email}
          placeholder="Enter your email address to view orders..."
          required
          className="flex-1 bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs hover:opacity-90"
        >
          View My Orders
        </button>
      </form>

      {email && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-3">
              <ShoppingBag className="w-8 h-8 text-[#A39A90] mx-auto" />
              <p className="text-base font-serif text-[#F8F1E7]">No orders found for "{email}"</p>
              <Link href="/shop" className="inline-block px-6 py-2 rounded-full bg-[#C9A24A] text-black text-xs font-bold">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A]/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[#F4D068]">
                      {ord.orderNumber}
                    </span>
                    <span className="bg-[#4CAF50]/10 text-[#4CAF50] text-xs font-bold px-2.5 py-0.5 rounded">
                      {ord.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#A39A90]">
                    Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {(ord.orderItems || ord.items || []).length} item(s)
                  </p>
                  <p className="text-xs text-[#C9A24A] font-semibold">
                    Status: {ord.orderStatus}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-[#F8F1E7]">
                    ₹{ord.totalAmount}
                  </span>
                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="px-4 py-2 rounded-xl bg-[#181318] border border-[#C9A24A]/40 text-[#F8F1E7] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
