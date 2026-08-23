'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/customers', { cache: 'no-store' });
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        const custArray = Array.isArray(data) ? data : data.data?.customers || data.customers || data.data || [];
        setCustomers(custArray);
      }
    } catch (e) {
      console.error('Failed to fetch customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await adminFetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountStatus: newStatus }),
      });

      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === userId ? { ...c, accountStatus: newStatus } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter((c) => {
    if (!c) return false;
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toString();
    const query = (searchQuery || '').toLowerCase();

    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Clientele & Accounts
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Customer Management
          </h1>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#221D22] text-xs text-[#F8F1E7] hover:border-[#C9A24A] flex items-center gap-1.5 self-start cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#C9A24A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full bg-[#0D0D0D] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#C9A24A] animate-spin mx-auto" />
            <div>Loading registered customer accounts...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-1">
            <Users className="w-8 h-8 text-[#A39A90]/40 mx-auto mb-2" />
            <div className="text-sm font-semibold text-[#F8F1E7]">No Customers Found</div>
            <div>No customer accounts match your search.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] border-b border-[#221D22] text-[#A39A90]">
                <tr>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Total Orders</th>
                  <th className="p-4 font-semibold">Lifetime Spend</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181216]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#120F12]/60 transition-colors">
                    <td className="p-4 font-semibold text-[#F8F1E7]">
                      {cust.name || 'Valued Customer'}
                      <div className="text-[10px] text-[#A39A90] font-normal">
                        Joined: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-[#F8F1E7]">{cust.email}</div>
                      <div className="text-[11px] text-[#A39A90]">{cust.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4 font-medium text-[#F8F1E7]">
                      {cust.orderCount || 0} Orders
                    </td>
                    <td className="p-4 font-bold text-[#F8F1E7]">
                      ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#2A0808] text-[#D00000] border border-[#D00000]/30'
                        }`}
                      >
                        {cust.accountStatus || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust.id, cust.accountStatus || 'ACTIVE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          cust.accountStatus === 'ACTIVE'
                            ? 'bg-[#2A0808] text-[#D00000] hover:bg-[#D00000] hover:text-white border border-[#D00000]/40'
                            : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-800 border border-emerald-500/40'
                        }`}
                      >
                        {cust.accountStatus === 'ACTIVE' ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
