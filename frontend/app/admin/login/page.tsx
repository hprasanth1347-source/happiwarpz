'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DedicatedAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in as ADMIN
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('happiwrapz_token');
        if (!token) return;

        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const user = data.user || data.data?.user;
          if (data.authenticated && user?.role === 'ADMIN') {
            router.push('/admin');
          }
        }
      } catch (e) {}
    };

    checkExistingSession();
  }, [router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: password,
        }),
      });

      const data = await res.json();
      const token = data.token || data.data?.token || data.accessToken;
      const user = data.user || data.data?.user;

      if (res.ok && (data.success || token) && token) {
        if (user?.role && user.role !== 'ADMIN') {
          setError('Access Denied: This account does not have Admin privileges.');
          setLoading(false);
          return;
        }

        // Store tokens & session cookies
        const maxAge = 2592000;
        document.cookie = `happiwrapz_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `happiwrapz_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        if (typeof window !== 'undefined') {
          localStorage.setItem('happiwrapz_token', token);
          localStorage.setItem('happiwrapz_user', JSON.stringify(user || { role: 'ADMIN', email: cleanEmail }));
        }

        window.location.href = '/admin';
      } else {
        setError(data.detail || data.message || data.error || 'Invalid Admin login credentials.');
      }
    } catch (err) {
      setError('Connection to backend server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F1E7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D00000] bg-[#050505] p-0.5">
              <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-contain p-0.5" />
            </div>
            <span className="text-2xl font-serif font-bold text-[#F8F1E7]">
              Happi<span className="text-[#D00000]">wrapz</span>
            </span>
          </Link>

          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C9A24A] bg-[#181216] px-3 py-1 rounded-full border border-[#C9A24A]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Admin Portal Login</span>
            </span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#F8F1E7]">
            Store Management System
          </h1>
          <p className="text-xs text-[#A39A90]">
            Enter your admin credentials to access the store dashboard.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 bg-[#2A0808] border border-[#D00000] rounded-xl text-xs text-[#F8F1E7] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D00000] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs text-[#A39A90] block mb-1">Admin Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@happiwrapz.com"
                autoComplete="email"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 h-12 text-sm text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#A39A90] block mb-1">Admin Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 h-12 text-sm text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1C161C]">
          <Link href="/login" className="text-xs text-[#A39A90] hover:text-[#F8F1E7]">
            ← Return to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
