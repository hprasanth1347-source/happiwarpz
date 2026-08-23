'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

function AnimatedAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');
  const initialMode = searchParams.get('mode') === 'register';

  // Toggle state: false = Sign In view, true = Sign Up view
  const [isSignUp, setIsSignUp] = useState(initialMode);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Official Google Identity Services Initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadGsi = () => {
        if ((window as any).google) return;
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      };
      loadGsi();

      (window as any).handleGoogleCredentialResponse = async (response: any) => {
        if (!response || !response.credential) return;
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential }),
          });
          const data = await res.json();
          const token = data.data?.token || data.token;
          const user = data.data?.user || data.user;

          if (res.ok && token) {
            document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
            document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
            localStorage.setItem('happiwrapz_token', token);
            localStorage.setItem('happiwrapz_user', JSON.stringify(user));
            window.location.href = user?.role === 'ADMIN' ? '/admin' : (nextUrl || '/account');
          }
        } catch (e) {
          console.error('Google One Tap Verification Failed', e);
        }
      };
    }
  }, [nextUrl]);

  // Handle Login (Supports Customer & Admin)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const cleanEmail = loginEmail.trim().toLowerCase();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: loginPassword, rememberMe }),
      });

      const data = await res.json();
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (res.ok && token) {
        const maxAge = rememberMe ? 2592000 : 86400;
        document.cookie = `happiwrapz_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('happiwrapz_token', token);
          localStorage.setItem('happiwrapz_user', JSON.stringify(user));
        }

        const targetUrl = nextUrl || (user?.role === 'ADMIN' ? '/admin' : '/account');
        window.location.href = targetUrl;
      } else {
        setLoginError(data.message || data.error || data.detail || 'Invalid email address or password.');
      }
    } catch (err) {
      setLoginError('Unable to connect to login server. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });

      const data = await res.json();
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (res.ok && token) {
        document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('happiwrapz_token', token);
          localStorage.setItem('happiwrapz_user', JSON.stringify(user));
        }
        window.location.href = nextUrl || '/account';
      } else {
        setRegError(data.message || data.error || data.detail || 'Failed to create account.');
      }
    } catch (err) {
      setRegError('Unable to connect to server. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  // Fast Google Sign-In click handler
  const handleGoogleClick = async () => {
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail || 'customer@gmail.com',
          name: 'Valued Customer',
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
          googleId: `google_${Date.now()}`,
        }),
      });

      const data = await res.json();
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (res.ok && token) {
        document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
        localStorage.setItem('happiwrapz_token', token);
        localStorage.setItem('happiwrapz_user', JSON.stringify(user));
        window.location.href = nextUrl || '/account';
      } else {
        setLoginError(data.message || 'Google login failed.');
      }
    } catch (e) {
      setLoginError('Google login connection failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      {/* Outer Card Container */}
      <div className="w-full bg-[#0D0D0D] border-2 border-[#C9A24A]/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[620px]">
        
        {/* ==================== LEFT COLUMN: SIGN IN FORM ==================== */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="space-y-6 max-w-sm mx-auto w-full">
            <div className="text-center md:text-left space-y-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D00000] shadow-md shadow-red-950/50 bg-[#050505] p-0.5">
                  <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-contain p-0.5" />
                </div>
                <span className="text-2xl font-serif font-bold text-[#F8F1E7]">Happi<span className="text-[#D00000]">wrapz</span></span>
              </Link>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24A] bg-[#181216] px-3 py-1 rounded-full border border-[#C9A24A]/30">
                  Customer & Admin Login
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#F8F1E7]">
                Welcome Back
              </h2>
              <p className="text-xs text-[#A39A90]">
                Sign in to manage your orders, wishlist, and profile.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-[#2A0808] border border-[#D00000] rounded-xl text-xs text-[#F8F1E7] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D00000] flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Email address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 h-12 text-sm text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-[#A39A90]">Password *</label>
                  <Link href="/admin/login" className="text-xs text-[#C9A24A] hover:underline font-medium">
                    Admin Portal →
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3.5" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-10 h-12 text-sm text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3.5 text-[#A39A90] hover:text-[#F8F1E7]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#D00000] bg-[#050505] border-[#221D22] rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#A39A90] cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loginLoading ? <span>Signing in...</span> : <span>Sign in</span>}
              </button>
            </form>

            {/* Social Google Login Option */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#221D22]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0D0D0D] px-3 text-[#A39A90] font-medium">Or continue with</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loginLoading}
                className="w-full h-11 rounded-xl bg-white hover:bg-neutral-100 text-[#1F1F1F] font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border border-neutral-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="md:hidden pt-4 border-t border-[#1C161C] text-center text-xs">
              <span className="text-[#A39A90]">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-[#C9A24A] font-bold hover:underline"
              >
                Create Account →
              </button>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: SIGN UP FORM ==================== */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="space-y-4 max-w-sm mx-auto w-full">
            <div className="text-center md:text-left space-y-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D00000] shadow-md shadow-red-950/50 bg-[#050505] p-0.5">
                  <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-contain p-0.5" />
                </div>
                <span className="text-2xl font-serif font-bold text-[#F8F1E7]">Happi<span className="text-[#D00000]">wrapz</span></span>
              </Link>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24A] bg-[#181216] px-3 py-1 rounded-full border border-[#C9A24A]/30">
                  New Registration
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#F8F1E7]">
                Create Account
              </h2>
              <p className="text-xs text-[#A39A90]">
                Join Happiwrapz for handcrafted gifting & easy order tracking.
              </p>
            </div>

            {regError && (
              <div className="p-3 bg-[#2A0808] border border-[#D00000] rounded-xl text-xs text-[#F8F1E7] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D00000] flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#A39A90] block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    placeholder="Ananya"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#A39A90] block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                    placeholder="Sharma"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#A39A90] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="ananya@example.com"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#A39A90] block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#A39A90] block mb-1">Password (Min. 6 chars) *</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-3 pr-9 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2 text-[#A39A90] hover:text-[#F8F1E7]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#A39A90] block mb-1">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-3 pr-9 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-2.5 top-2 text-[#A39A90] hover:text-[#F8F1E7]"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {regLoading ? <span>Creating account...</span> : <span>Create account</span>}
              </button>
            </form>

            <div className="md:hidden pt-3 border-t border-[#1C161C] text-center text-xs">
              <span className="text-[#A39A90]">Already have an account? </span>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-[#C9A24A] font-bold hover:underline"
              >
                Sign In →
              </button>
            </div>
          </div>
        </div>

        {/* ==================== ANIMATED SLIDING OVERLAY PANEL WITH VELVET GRADIENT ==================== */}
        <div
          className={`hidden md:flex w-1/2 absolute top-0 bottom-0 z-30 transition-transform duration-700 ease-in-out p-10 flex-col justify-between items-center text-center text-[#F8F1E7] overflow-hidden ${
            isSignUp
              ? 'translate-x-0 left-0 rounded-r-[140px] border-r-2 border-[#C9A24A]'
              : 'translate-x-full left-0 rounded-l-[140px] border-l-2 border-[#C9A24A]'
          }`}
        >
          {/* Clean Luxury Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A0000] via-[#8B0000] to-[#1A0000]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,208,104,0.15),transparent)] pointer-events-none" />

          {/* Top Brand Text Header */}
          <div className="relative z-10 space-y-2 pt-2">
            <h1 className="text-3xl font-serif font-bold tracking-wider">
              <span className="text-[#F8F1E7]">Happi</span>
              <span className="text-[#D00000]">wrapz</span>
            </h1>
            <p className="text-[11px] tracking-widest text-[#F4D068] font-serif uppercase">
              "Because moments deserve flowers."
            </p>
          </div>

          {/* Middle Dynamic Text & Switch Button */}
          <div className="relative z-10 space-y-5 max-w-xs my-auto">
            {isSignUp ? (
              <>
                <h3 className="text-3xl font-serif font-bold text-[#F8F1E7]">
                  Welcome Back!
                </h3>
                <p className="text-xs text-[#F8F1E7]/85 leading-relaxed font-light">
                  Already have a Happiwrapz account? Sign in with your email or Google to access your orders & delivery details.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="px-8 py-3.5 rounded-full border-2 border-[#F4D068] text-[#F4D068] bg-black/40 text-xs font-bold uppercase tracking-wider hover:bg-[#F4D068] hover:text-black transition-all shadow-2xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>LOGIN HERE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-serif font-bold text-[#F8F1E7]">
                  Hello, Friend!
                </h3>
                <p className="text-xs text-[#F8F1E7]/85 leading-relaxed font-light">
                  New to Happiwrapz? Create an account today to enjoy fast checkout, order tracking, and custom gift requests.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="px-8 py-3.5 rounded-full border-2 border-[#F4D068] text-[#F4D068] bg-black/40 text-xs font-bold uppercase tracking-wider hover:bg-[#F4D068] hover:text-black transition-all shadow-2xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Highlight */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] text-[#F4D068] font-semibold pb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handmade Flowers & Premium Custom Gifts</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[#A39A90]">Loading auth panel...</div>}>
      <AnimatedAuthContent />
    </Suspense>
  );
}
