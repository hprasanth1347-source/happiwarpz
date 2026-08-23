'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: 'Happiwrapz',
    storeTagline: 'Because moments deserve flowers.',
    currency: 'INR (₹)',
    minAdvanceNoticeDays: '7',
    supportEmail: 'support@happiwrapz.com',
    supportPhone: '+91 98765 43210',
    instagramUrl: 'https://instagram.com/happiwrapz',
    paymentModeStatus: 'ONLINE_ONLY_RAZORPAY',
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store', credentials: 'include' })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login?next=/admin/settings';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setForm((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Configuration & Policies
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Store Settings
          </h1>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-[#4CAF50] font-bold bg-[#4CAF50]/10 border border-[#4CAF50]/30 px-3.5 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#A39A90]">Loading store settings...</div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-10 space-y-6">
          {/* General Store Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              1. Brand Identity Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Store Name</label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Store Tagline</label>
                <input
                  type="text"
                  value={form.storeTagline}
                  onChange={(e) => setForm({ ...form, storeTagline: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Advance Lead Time Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              2. Handmade Lead Time & Delivery Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Default Minimum Advance Lead Time (Days)</span>
                </label>
                <input
                  type="number"
                  value={form.minAdvanceNoticeDays}
                  onChange={(e) => setForm({ ...form, minAdvanceNoticeDays: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
                <span className="text-[10px] text-[#A39A90] mt-1 block">
                  Enforced at checkout date selector (e.g. 7 days for bouquets).
                </span>
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Currency Symbol</label>
                <input
                  type="text"
                  disabled
                  value={form.currency}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#A39A90]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              3. Business Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Support Email</label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>
          </div>

          {/* Security & Payment Rules */}
          <div className="p-4 bg-[#120E12] border-2 border-[#C9A24A]/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#4CAF50]" />
              <div>
                <span className="text-xs font-bold text-[#F8F1E7] block">
                  Online Payment Security Mode
                </span>
                <span className="text-[11px] text-[#A39A90]">
                  Razorpay SSL Encryption Active • NO COD Rule Enforced
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#4CAF50]/20 text-[#4CAF50] px-3 py-1 rounded-full font-bold">
              ACTIVE
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </form>
      )}
    </div>
  );
}
