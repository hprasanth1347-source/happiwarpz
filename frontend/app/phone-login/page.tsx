'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PhoneLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid mobile phone number.');
      return;
    }

    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, purpose: 'LOGIN' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPhone(formattedPhone);
        setStep('OTP');
        setCooldown(30);
        setSuccessMsg(`Verification code sent to ${formattedPhone}`);
      } else {
        setErrorMsg(data.detail || data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to OTP server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/phone/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpCode, purpose: 'LOGIN' }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        document.cookie = `happiwrapz_session=${data.token}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `access_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('happiwrapz_token', data.token);
          localStorage.setItem('happiwrapz_user', JSON.stringify(data.user));
        }

        router.push('/account');
        router.refresh();
      } else {
        setErrorMsg(data.detail || data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('OTP verification failed. Please try again.');
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
          {step === 'PHONE' ? 'Phone Number Sign-In' : 'Enter Verification OTP'}
        </h1>
        <p className="text-xs text-[#A39A90]">
          {step === 'PHONE'
            ? 'Sign in securely using SMS OTP verification.'
            : `Enter the 6-digit code sent to ${phone}`}
        </p>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {errorMsg && (
          <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#D00000] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#0A2612] border border-[#4CAF50] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Mobile Phone Number *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-[#C9A24A] font-bold">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-14 pr-4 py-3 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Sending OTP...' : 'Send SMS OTP'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="text-xs text-[#A39A90] block mb-2 text-center">6-Digit Verification Code</label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-12 text-center bg-[#050505] border border-[#221D22] rounded-xl text-lg font-bold text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C9A24A] to-[#F4D068] text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-[#A39A90] hover:text-[#F8F1E7] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change Number
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleSendOtp}
                className="text-[#C9A24A] font-bold hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-[#A39A90]">
        Prefer signing in with password?{' '}
        <Link href="/login" className="text-[#C9A24A] font-bold hover:underline">
          Return to Email Login
        </Link>
      </div>
    </div>
  );
}
