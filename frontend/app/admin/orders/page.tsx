'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Filter,
  Trash2,
} from 'lucide-react';
import InvoiceModal from '@/components/InvoiceModal';
import { adminFetch } from '@/lib/adminFetch';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const ordersArray = Array.isArray(data) ? data : data.data?.orders || data.orders || data.data || [];
        setOrders(ordersArray);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, orderStatus: string) => {
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this payment order?')) return;
    try {
      const res = await adminFetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllOrders = async () => {
    if (!confirm('CAUTION: Are you sure you want to CLEAR ALL test payment orders?')) return;
    try {
      const res = await adminFetch('/api/admin/orders/clear-all', {
        method: 'DELETE',
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const statusList = [
    'ALL',
    'PAID',
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  const safeOrdersList = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrdersList.filter((o) => {
    if (!o) return false;
    const orderNum = (o.orderNumber || o.id || '').toString().toLowerCase();
    const custName = (o.user?.name || o.customerName || '').toString().toLowerCase();
    const custPhone = (o.user?.phone || o.customerPhone || '').toString();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch =
      orderNum.includes(query) ||
      custName.includes(query) ||
      custPhone.includes(query);

    if (!matchesSearch) return false;
    if (filterStatus !== 'ALL') {
      const currentStatus = (o.orderStatus || '').toUpperCase();
      const currentPay = (o.paymentStatus || '').toUpperCase();
      const target = filterStatus.toUpperCase();
      if (currentStatus !== target && currentPay !== target) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Fulfillment & Invoicing
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Order Management
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#221D22] text-xs text-[#F8F1E7] hover:border-[#C9A24A] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#C9A24A] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Orders</span>
          </button>

          <button
            onClick={handleClearAllOrders}
            className="px-4 py-2 rounded-xl bg-[#2A0808] border border-[#D00000]/60 text-[#D00000] text-xs font-bold hover:bg-[#D00000] hover:text-white transition-all flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Orders</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer name, or phone..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#A39A90] mr-1 hidden sm:block" />
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#C9A24A] text-black shadow'
                  : 'bg-[#050505] text-[#A39A90] hover:text-[#F8F1E7] border border-[#221D22]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#C9A24A] animate-spin mx-auto" />
            <div>Loading store orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-1">
            <ShoppingBag className="w-8 h-8 text-[#A39A90]/40 mx-auto mb-2" />
            <div className="text-sm font-semibold text-[#F8F1E7]">No Orders Found</div>
            <div>No orders match your search criteria.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] border-b border-[#221D22] text-[#A39A90]">
                <tr>
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer Details</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Fulfillment Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181216]">
                {filteredOrders.map((ord) => {
                  const customerName = ord.user?.name || ord.customerName || 'Customer';
                  const customerEmail = ord.user?.email || ord.customerEmail || 'No email';
                  const customerPhone = ord.user?.phone || ord.customerPhone || 'N/A';
                  const itemsCount = ord.items?.length || ord.orderItems?.length || 1;
                  const total = ord.total || ord.totalAmount || 0;

                  return (
                    <tr key={ord.id} className="hover:bg-[#120F12]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#C9A24A]">
                        {ord.orderNumber || ord.id}
                        <div className="text-[10px] text-[#A39A90] font-normal">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="font-semibold text-[#F8F1E7]">{customerName}</div>
                        <div className="text-[11px] text-[#A39A90]">{customerPhone}</div>
                        <div className="text-[10px] text-[#A39A90]/70 truncate max-w-[180px]">{customerEmail}</div>
                      </td>

                      <td className="p-4 text-[#F8F1E7]">
                        <span className="font-medium">{itemsCount} Item(s)</span>
                      </td>

                      <td className="p-4 font-bold text-[#F8F1E7]">
                        ₹{total.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {ord.paymentStatus || 'PAID'}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={ord.orderStatus || 'PROCESSING'}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="bg-[#050505] border border-[#221D22] text-[11px] text-[#F8F1E7] rounded-lg px-2.5 py-1 focus:border-[#C9A24A] focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="p-1.5 rounded-lg bg-[#050505] border border-[#221D22] text-[#C9A24A] hover:bg-[#C9A24A] hover:text-black transition-colors"
                          title="Generate Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg bg-[#2A0808] border border-[#D00000]/40 text-[#D00000] hover:bg-[#D00000] hover:text-white transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
