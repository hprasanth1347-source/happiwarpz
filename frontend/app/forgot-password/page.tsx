'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.detail || data.error || 'Failed to submit password reset request.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D00000]/60 shadow-lg shadow-red-950/40">
            <Image src="/images/logo.png" alt="Happiwrapz Logo" fill className="object-cover" />
          </div>
          <span className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Happi<span className="text-[#D00000]">wrapz</span>
          </span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          Reset Password
        </h1>
        <p className="text-xs text-[#A39A90]">
          Enter your registered email address to receive a secure reset link.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">Check Your Email Inbox</h3>
          <p className="text-xs text-[#A39A90] leading-relaxed">
            If an active account exists for <strong className="text-[#F8F1E7]">{email}</strong>, password reset instructions have been sent to your email address. Please check your inbox and spam folder.
          </p>

          <div className="pt-2 border-t border-[#221D22]">
            <Link
              href="/login"
              className="text-xs text-[#C9A24A] font-bold hover:underline"
            >
              ← Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          {errorMsg && (
            <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <span>Sending Reset Link...</span> : <span>Send Reset Link</span>}
          </button>

          <div className="pt-4 border-t border-[#1C161C] text-center">
            <Link href="/login" className="text-xs text-[#A39A90] hover:text-[#C9A24A] flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
