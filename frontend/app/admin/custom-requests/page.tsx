'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Search, RefreshCw, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchCustomRequests = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/custom-requests', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const reqArray = Array.isArray(data) ? data : data.data?.customRequests || data.customRequests || data.data || [];
        setRequests(reqArray);
      }
    } catch (e) {
      console.error('Failed to load custom requests', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await adminFetch('/api/admin/custom-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const statusList = ['ALL', 'NEW', 'PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  const safeRequests = Array.isArray(requests) ? requests : [];

  const filteredRequests = safeRequests.filter((r) => {
    if (!r) return false;
    const cName = (r.customerName || r.name || '').toLowerCase();
    const cPhone = (r.customerPhone || r.phone || '').toString().toLowerCase();
    const pType = (r.productType || r.occasion || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch = cName.includes(query) || cPhone.includes(query) || pType.includes(query);

    if (!matchesSearch) return false;
    if (filterStatus !== 'ALL') {
      const current = (r.status || '').toUpperCase();
      const target = filterStatus.replace(/\s+/g, '_').toUpperCase();
      if (current !== target && current !== filterStatus.toUpperCase()) {
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
            Bespoke Gifting Pipeline
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Custom Gift Requests
          </h1>
        </div>

        <button
          onClick={fetchCustomRequests}
          className="px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#221D22] text-xs text-[#F8F1E7] hover:border-[#C9A24A] flex items-center gap-1.5 self-start cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#C9A24A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom requests by customer, phone, or occasion..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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

      {/* Requests Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#A39A90] space-y-2">
          <RefreshCw className="w-6 h-6 text-[#C9A24A] animate-spin mx-auto" />
          <div>Loading bespoke gift inquiries...</div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-20 text-center text-xs text-[#A39A90] bg-[#0D0D0D] border border-[#221D22] rounded-2xl p-8 space-y-2">
          <MessageSquareHeart className="w-10 h-10 text-[#A39A90]/40 mx-auto" />
          <div className="text-sm font-semibold text-[#F8F1E7]">No Custom Inquiries Found</div>
          <div>No bespoke gift inquiries match your filter criteria.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => {
            const customerName = req.customerName || req.name || 'Client';
            const customerPhone = req.customerPhone || req.phone || 'N/A';
            const customerEmail = req.customerEmail || req.email || 'N/A';
            const occasion = req.occasion || req.productType || 'Custom Hamper';

            return (
              <div
                key={req.id}
                className="bg-[#0D0D0D] border border-[#221D22] rounded-2xl p-5 space-y-4 shadow-lg hover:border-[#C9A24A]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                      {occasion}
                    </span>
                    <select
                      value={req.status || 'NEW'}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                      className="bg-[#050505] border border-[#221D22] text-[11px] text-[#F8F1E7] rounded-lg px-2 py-1 focus:border-[#C9A24A] focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[#F8F1E7]">{customerName}</div>
                    <div className="flex items-center gap-2 text-xs text-[#A39A90]">
                      <Phone className="w-3 h-3 text-[#C9A24A]" />
                      <span>{customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#A39A90]">
                      <Mail className="w-3 h-3 text-[#C9A24A]" />
                      <span className="truncate">{customerEmail}</span>
                    </div>
                  </div>

                  {req.budget && (
                    <div className="text-xs text-[#A39A90]">
                      Budget: <span className="text-[#F8F1E7] font-semibold">₹{req.budget}</span>
                    </div>
                  )}

                  {req.preferredColors && (
                    <div className="text-xs text-[#A39A90]">
                      Colors: <span className="text-[#F8F1E7] font-semibold">{req.preferredColors}</span>
                    </div>
                  )}

                  <div className="p-3 bg-[#050505] border border-[#1C161C] rounded-xl text-xs text-[#F8F1E7]/90 leading-relaxed max-h-28 overflow-y-auto">
                    {req.description || req.details || 'No additional notes provided.'}
                  </div>
                </div>

                <div className="text-[10px] text-[#A39A90]/60 border-t border-[#181216] pt-2 flex items-center justify-between">
                  <span>ID: {req.id}</span>
                  <span>{req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
