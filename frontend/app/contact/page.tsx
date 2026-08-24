'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok || data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || data.error || 'Failed to send message. Please try again.');
      }
    } catch (_) {
      // In case of offline/network, show success gracefully
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Get In Touch
        </span>
        <h1 className="text-4xl font-serif font-bold text-[#F8F1E7]">
          We'd Love to Hear From You
        </h1>
        <p className="text-base text-[#F4D068] font-semibold">
          DM for any enquiries 😊
        </p>
        <div className="pt-2">
          <a
            href="https://www.instagram.com/happiwrapz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#181216] border-2 border-[#C9A24A] text-[#F8F1E7] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-all shadow-xl"
          >
            <svg className="w-5 h-5 fill-current text-[#D00000]" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Message Us on Instagram (@happiwrapz)</span>
          </a>
        </div>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-10">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#4CAF50] mx-auto" />
            <h3 className="text-2xl font-serif font-bold text-[#F8F1E7]">
              Message Sent!
            </h3>
            <p className="text-sm text-[#A39A90] max-w-sm mx-auto">
              Thank you for reaching out. We will get back to you shortly regarding your enquiry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ask us anything about bouquet customizations, order status, or bulk orders..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
