'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, CheckCircle2, ArrowRight, Palette, Clock } from 'lucide-react';

export default function CustomGiftsPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productType: 'Rose Bouquet',
    preferredColors: '',
    quantity: '1',
    customMessage: '',
    specialInstructions: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit customization request.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-[#181218] border border-[#C9A24A]/40 text-[#F4D068] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailor-Made Gifts</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#F8F1E7]">
          Customise Your Gift
        </h1>
        <p className="text-sm sm:text-base text-[#A39A90] max-w-xl mx-auto leading-relaxed">
          "Have something special in mind? Tell us what you want and we'll create it with love."
        </p>
      </div>

      {submitted ? (
        <div className="p-10 bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#1A0A0A] border border-[#C9A24A] mx-auto flex items-center justify-center text-[#4CAF50]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#F8F1E7]">
            Custom Request Received ❤️
          </h2>
          <p className="text-sm text-[#A39A90] max-w-md mx-auto">
            Thank you, {formData.customerName}! Our artisans will review your custom request and reach out to you via WhatsApp or Email shortly.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90"
            >
              Explore Existing Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-10 space-y-6">
          {error && (
            <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-xl text-xs text-[#F8F1E7]">
              {error}
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              1. Your Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Your Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Roy"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="priya@example.com"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F8F1E7] uppercase tracking-wider border-b border-[#221D22] pb-2">
              2. Custom Gift Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                >
                  <option value="Rose Bouquet">Rose Bouquet</option>
                  <option value="Sunflower Bouquet">Sunflower Bouquet</option>
                  <option value="Handmade Keychain">Handmade Keychain</option>
                  <option value="Custom Gift Box / Hamper">Custom Gift Box / Hamper</option>
                  <option value="Other Handmade Item">Other Handmade Item</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Preferred Colors / Theme</label>
                <input
                  type="text"
                  name="preferredColors"
                  value={formData.preferredColors}
                  onChange={handleChange}
                  placeholder="e.g. Crimson & Gold, Pastel Pink & Cream..."
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Approximate Quantity Needed</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 1 Bouquet of 12 Roses"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Gift Card Message</label>
                <input
                  type="text"
                  name="customMessage"
                  value={formData.customMessage}
                  onChange={handleChange}
                  placeholder="Card note text for the recipient..."
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Special Instructions & Reference Ideas</label>
              <textarea
                rows={4}
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Describe any specific wrapping styles, glitter preferences, flower types, or special delivery date requests..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          <div className="p-4 bg-[#1F0A0A] border border-[#8B0000]/50 rounded-2xl flex items-center gap-3 text-xs text-[#F8F1E7]">
            <Clock className="w-5 h-5 text-[#D00000] flex-shrink-0" />
            <span>Custom handmade orders require at least 1 week lead time.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm tracking-wider uppercase hover:opacity-90 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Submit Custom Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
