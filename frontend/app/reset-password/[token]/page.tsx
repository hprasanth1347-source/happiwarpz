'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const token = resolvedParams.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Header */}
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
          Set New Password
        </h1>
        <p className="text-xs text-[#A39A90]">
          Enter your new account password below (minimum 8 characters).
        </p>
      </div>

      {success ? (
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">
            Password Reset Successfully!
          </h3>
          <p className="text-xs text-[#A39A90]">
            Redirecting you to the sign-in page...
          </p>
          <Link href="/login" className="inline-block pt-2 text-xs text-[#C9A24A] font-bold hover:underline">
            Click here to sign in now →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          {errorMsg && (
            <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs text-[#A39A90] block mb-1">New Password (Min. 8 characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <label className="text-xs text-[#A39A90] block mb-1">Confirm New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <span>Resetting Password...</span> : <span>Update Password</span>}
          </button>
        </form>
      )}
    </div>
  );
}
