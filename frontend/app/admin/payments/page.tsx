'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Search, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const res = await adminFetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchPayments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllOrders = async () => {
    if (!confirm('CAUTION: Are you sure you want to CLEAR ALL test payment records?')) return;
    try {
      const res = await adminFetch('/api/admin/orders/clear-all', {
        method: 'DELETE',
      });
      if (res.ok) fetchPayments();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPayments = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus !== 'ALL' && o.paymentStatus !== filterStatus) return false;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Razorpay Transaction Log
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Payment Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearAllOrders}
            className="px-4 py-2 rounded-xl bg-[#2A0808] border border-[#D00000]/60 text-[#D00000] text-xs font-bold hover:bg-[#D00000] hover:text-white transition-all flex items-center gap-1.5 shadow"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Test Payments</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID, order ID, or customer..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#C9A24A] text-black shadow'
                  : 'bg-[#050505] border border-[#221D22] text-[#A39A90] hover:text-[#F8F1E7]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      {loading ? (
        <div className="text-center py-20 text-[#A39A90]">Loading payment logs...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-16 bg-[#0D0D0D] border border-[#221D22] rounded-3xl text-[#A39A90]">
          No payment transactions found matching filter.
        </div>
      ) : (
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#221D22] text-[#C9A24A] uppercase font-serif tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Razorpay Payment ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C161C]">
              {filteredPayments.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#141414] transition-colors">
                  <td className="p-4 font-bold text-[#F8F1E7]">{ord.orderNumber}</td>
                  <td className="p-4 font-mono text-[#A39A90]">
                    {ord.razorpayPaymentId || 'N/A'}
                  </td>
                  <td className="p-4 text-[#F8F1E7]">
                    <div>{ord.customerName}</div>
                    <div className="text-[10px] text-[#A39A90]">{ord.customerPhone}</div>
                  </td>
                  <td className="p-4 font-bold text-[#F4D068]">₹{ord.totalAmount}</td>
                  <td className="p-4 text-[#C9A24A] font-semibold">Online (Razorpay)</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'PAID'
                          ? 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/40'
                          : ord.paymentStatus === 'FAILED'
                          ? 'bg-[#D00000]/20 text-[#D00000] border border-[#D00000]/40'
                          : 'bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/40'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-[#A39A90]">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
