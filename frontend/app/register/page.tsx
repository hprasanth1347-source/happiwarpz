'use client';

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const cleanForm = {
        ...form,
        email: form.email.trim().toLowerCase(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify(cleanForm),
      });

      const data = await res.json();
      const token = data.token || data.data?.token || data.accessToken;
      const user = data.user || data.data?.user;

      if (res.ok && (data.success || token)) {
        if (token) {
          const maxAge = 31536000; // 365 days (1 year)
          document.cookie = `happiwrapz_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `happiwrapz_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

          const registeredUserObj = user || {
            id: `usr_${Date.now()}`,
            firstName: cleanForm.firstName,
            lastName: cleanForm.lastName,
            name: `${cleanForm.firstName} ${cleanForm.lastName}`.trim(),
            email: cleanForm.email,
            phone: cleanForm.phone,
            role: 'CUSTOMER',
            accountStatus: 'ACTIVE',
            createdAt: new Date().toISOString(),
            orderCount: 0,
            totalSpent: 0,
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('happiwrapz_token', token);
            localStorage.setItem('happiwrapz_user', JSON.stringify(registeredUserObj));

            try {
              const existingPool = JSON.parse(localStorage.getItem('happiwrapz_registered_users') || '[]');
              const exists = existingPool.some((u: any) => u.email?.toLowerCase() === cleanForm.email.toLowerCase());
              if (!exists) {
                existingPool.unshift(registeredUserObj);
                localStorage.setItem('happiwrapz_registered_users', JSON.stringify(existingPool));
              }
            } catch (_) {}
          }
        }

        window.dispatchEvent(new Event('auth-change'));
        window.location.href = nextUrl || '/account';
      } else {
        setErrorMsg(data.detail || data.message || data.error || 'Failed to create account.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D00000]/60 shadow-lg shadow-red-950/40">
            <Image src="/images/logo.png" alt="Happiwrapz Logo" fill className="object-cover" priority />
          </div>
          <span className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Happi<span className="text-[#D00000]">wrapz</span>
          </span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
          Create Account
        </h1>
        <p className="text-xs text-[#A39A90]">
          Register for faster checkout and order tracking.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#A39A90] block mb-1">First Name *</label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Ananya"
              className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
            />
          </div>
          <div>
            <label className="text-xs text-[#A39A90] block mb-1">Last Name *</label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Sharma"
              className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ananya@example.com"
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div>
          <label className="text-xs text-[#A39A90] block mb-1">Phone / WhatsApp *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div>
          <label className="text-xs text-[#A39A90] block mb-1">Password (Min. 8 characters) *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#A39A90] hover:text-[#F8F1E7]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#A39A90] block mb-1">Confirm Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-[#A39A90] hover:text-[#F8F1E7]"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
        </button>

        <div className="pt-4 border-t border-[#1C161C] flex justify-between items-center text-xs text-[#A39A90]">
          <span>Already have an account?</span>
          <Link href={nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : '/login'} className="text-[#C9A24A] font-bold hover:underline">
            Log In →
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[#A39A90]">Loading register...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
