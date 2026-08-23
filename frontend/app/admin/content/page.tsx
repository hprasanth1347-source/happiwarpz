'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function AdminContentPage() {
  const [form, setForm] = useState({
    heroTitle: 'Handmade Bouquets & Everlasting Memories',
    heroSubtitle:
      'Crafted with passion, velvet elegance, and love. Premium handmade floral arrangements, glitter roses, sunflowers, keychains & bespoke custom gifts.',
    announcementBanner: '✨ ONLINE PAYMENT ONLY • FREE DELIVERY ON ALL ORDERS',
    aboutTitle: 'About Happiwrapz',
    aboutText:
      'Happiwrapz creates handmade floral bouquets, everlasting velvet roses, sunflowers, keychains, and thoughtful personalized gifts designed to make every moment unforgettable.',
    supportEmail: 'support@happiwrapz.com',
    supportPhone: '+91 98765 43210',
    instagramUrl:
      'https://www.instagram.com/happiwrapz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store', credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setForm((prev) => ({ ...prev, ...data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setErrorMsg(data.error || 'Failed to update website content.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            CMS & Live Content Management
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Website Content
          </h1>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-[#4CAF50] font-bold bg-[#4CAF50]/10 border border-[#4CAF50]/30 px-3.5 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Content Saved & Live</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#A39A90]">Loading CMS site content...</div>
      ) : (
        <form onSubmit={handleSaveContent} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-10 space-y-6">
          {/* Top Banner */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              1. Top Announcement Banner
            </h3>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Banner Text (Top Header)</label>
              <input
                type="text"
                value={form.announcementBanner}
                onChange={(e) => setForm({ ...form, announcementBanner: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          {/* Homepage Hero Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              2. Homepage Hero Section Content
            </h3>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Hero Main Heading Title *</label>
              <input
                type="text"
                required
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Hero Subtitle Paragraph *</label>
              <textarea
                rows={3}
                required
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              3. About Section Content
            </h3>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">About Section Title</label>
              <input
                type="text"
                value={form.aboutTitle}
                onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">About Description Text</label>
              <textarea
                rows={4}
                value={form.aboutText}
                onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              4. Contact & Social Link Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Business Support Email</label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Business Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-[#A39A90] block mb-1">Instagram Profile URL</label>
                <input
                  type="text"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Website Content</span>
          </button>
        </form>
      )}
    </div>
  );
}
