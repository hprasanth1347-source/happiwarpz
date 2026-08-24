'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock, Search, Truck, CheckCircle2 } from 'lucide-react';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let localToken: string | null = null;
    let localUser: any = null;

    if (typeof window !== 'undefined') {
      localToken = localStorage.getItem('happiwrapz_token');
      const userStr = localStorage.getItem('happiwrapz_user');
      if (userStr) {
        try {
          localUser = JSON.parse(userStr);
          setUser(localUser);
        } catch (_) {}
      }
    }

    const fetchOrders = async () => {
      try {
        const headers: Record<string, string> = {};
        if (localToken) headers['Authorization'] = `Bearer ${localToken}`;

        const emailParam = localUser?.email ? `?email=${encodeURIComponent(localUser.email)}` : '';
        const res = await fetch(`/api/orders${emailParam}`, {
          headers,
          cache: 'no-store',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const ordArray = data.data?.orders || data.orders || (Array.isArray(data) ? data : []);
          setOrders(Array.isArray(ordArray) ? ordArray : []);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchNum = (ord.orderNumber || '').toLowerCase().includes(q);
    const matchItems = (ord.orderItems || ord.items || []).some((it: any) =>
      (it.productName || it.name || '').toLowerCase().includes(q)
    );
    return matchNum || matchItems;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Customer Portal
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          My Orders History
        </h1>
        <p className="text-sm text-[#A39A90] max-w-md mx-auto">
          View all your handcrafted flower orders, live admin tracking updates, and invoices.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number (e.g. HW-2026-0891) or product name..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20 text-[#A39A90]">Loading your orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#A39A90] mx-auto opacity-50" />
          <div className="space-y-1">
            <p className="text-lg font-serif font-bold text-[#F8F1E7]">
              {searchQuery ? 'No matching orders found' : 'You haven’t placed any orders yet'}
            </p>
            <p className="text-xs text-[#A39A90]">
              {searchQuery ? 'Try searching with a different keyword.' : 'Explore our collection of handcrafted velvet roses & bouquets.'}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold shadow-lg hover:opacity-95 transition-opacity"
          >
            <span>Browse Bouquet Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const items = ord.orderItems || ord.items || [];
            const isDelivered = ord.orderStatus === 'DELIVERED';
            const isShipped = ord.orderStatus === 'SHIPPED';

            return (
              <div
                key={ord.id}
                className="bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A]/40 rounded-3xl p-6 sm:p-7 space-y-4 transition-all shadow-md"
              >
                {/* Order Top Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1A1F] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-serif font-bold text-[#F4D068]">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        ord.paymentStatus === 'PAID' ? 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isDelivered ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isShipped ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        'bg-[#C9A24A]/10 text-[#C9A24A] border border-[#C9A24A]/30'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#A39A90]">
                      Ordered on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {items.length} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-[#A39A90] block">Total Amount</span>
                      <span className="text-xl font-bold text-[#F8F1E7]">
                        ₹{ord.total || ord.totalAmount}
                      </span>
                    </div>
                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="px-4 py-2 rounded-xl bg-[#181318] border border-[#C9A24A]/40 text-[#F8F1E7] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>Order Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {items.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#050505] border border-[#1A161A] p-2.5 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-[#D00000] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#F8F1E7] truncate">{it.productName || it.name}</p>
                        <p className="text-[10px] text-[#A39A90]">Qty: {it.quantity || 1} • ₹{it.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking info if added by admin */}
                {ord.trackingCarrier && ord.trackingNumber && (
                  <div className="flex items-center gap-2 bg-[#121012] border border-[#C9A24A]/30 px-3.5 py-2 rounded-xl text-xs text-[#F8F1E7]">
                    <Truck className="w-4 h-4 text-[#C9A24A] shrink-0" />
                    <span>Courier: <strong className="text-[#C9A24A]">{ord.trackingCarrier}</strong></span>
                    <span>•</span>
                    <span>Tracking No: <strong>{ord.trackingNumber}</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
