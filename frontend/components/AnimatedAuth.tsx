"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Phone, ArrowRight, Sparkles, Smartphone, Palette } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";

interface AnimatedAuthProps {
  initialMode?: "signin" | "signup";
}

export default function AnimatedAuth({ initialMode = "signin" }: AnimatedAuthProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { login, register, googleLogin } = useAuth();

  // Mode state: 'signin' | 'signup'
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === "signup");

  // Color theme: 'crimson' (Happiwrapz signature) | 'indigo' (Classic Blue/Purple)
  const [theme, setTheme] = useState<"crimson" | "indigo">("crimson");

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsSignUp(initialMode === "signup");
  }, [initialMode]);

  // Handle Sign In Submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(signInEmail, signInPassword);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(signUpData);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await googleLogin("mock_google_id_token");
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpField = (key: keyof typeof signUpData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({ ...signUpData, [key]: e.target.value });
  };

  // Dynamic Theme Palette styles
  const isCrimson = theme === "crimson";
  const bgGradient = isCrimson 
    ? "from-red-900 via-rose-950 to-red-950" 
    : "from-indigo-700 via-purple-800 to-blue-900";
  const btnClass = isCrimson
    ? "bg-red-600 hover:bg-red-500 shadow-red-600/30"
    : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30";
  const borderClass = isCrimson
    ? "border-amber-500/40 shadow-amber-500/10"
    : "border-indigo-500/40 shadow-indigo-500/10";
  const accentText = isCrimson ? "text-amber-400" : "text-purple-300";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-black relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700 ${isCrimson ? "bg-red-600" : "bg-indigo-600"}`} />

      {/* Theme Switcher Toggle Floating Pill */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-dark-surface/80 backdrop-blur-md border border-dark-border px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 shadow-xl">
        <Palette className="w-3.5 h-3.5 text-amber-400" />
        <span>Theme Color:</span>
        <button
          onClick={() => setTheme(isCrimson ? "indigo" : "crimson")}
          className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/10 hover:border-white/30 transition-all"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isCrimson ? "bg-red-500" : "bg-indigo-500"}`} />
          {isCrimson ? "Crimson Red & Gold" : "Sapphire Blue"}
        </button>
      </div>

      {/* ── Outer Card Container ── */}
      <div className={`w-full max-w-4xl min-h-[580px] bg-[#0d0d11] border ${borderClass} rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-500 flex flex-col md:flex-row`}>
        
        {/* Mobile Header Switcher (Visible on small screens) */}
        <div className="md:hidden flex border-b border-dark-border bg-dark-card">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${!isSignUp ? "bg-brand-600 text-white" : "text-gray-400"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${isSignUp ? "bg-brand-600 text-white" : "text-gray-400"}`}
          >
            Create Account
          </button>
        </div>

        {/* ── FORM 1: SIGN IN FORM (Left Side when !isSignUp) ── */}
        <div className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center space-y-6 transition-all duration-700 transform ${
          isSignUp ? "md:translate-x-full md:opacity-0 md:pointer-events-none absolute md:relative inset-0" : "md:translate-x-0 md:opacity-100"
        }`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accentText}`}>
              Customer & Admin Access
            </span>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sign in to manage your orders, wishlist, and profile.
            </p>
          </div>

          {error && !isSignUp && <ErrorMessage message={error} />}

          {/* Social / Google Sign-In */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 bg-dark-card border border-dark-border hover:border-gray-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 border-t border-dark-border" />
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">or use your email</span>
              <div className="flex-1 border-t border-dark-border" />
            </div>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="ananya@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300">Password *</label>
                <Link href="/forgot-password" className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${btnClass} text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing In..." : "SIGN IN"}
            </button>
          </form>

          <div className="pt-2 border-t border-dark-border/50 flex justify-between items-center text-[11px]">
            <Link href="/phone-login" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Mobile OTP Login
            </Link>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="md:hidden text-gray-400 hover:text-white font-bold"
            >
              Create Account →
            </button>
          </div>
        </div>

        {/* ── FORM 2: CREATE ACCOUNT / SIGN UP FORM (Right Side when isSignUp) ── */}
        <div className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center space-y-5 transition-all duration-700 transform ${
          !isSignUp ? "md:-translate-x-full md:opacity-0 md:pointer-events-none absolute md:relative inset-0" : "md:translate-x-0 md:opacity-100"
        }`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accentText}`}>
              Join Happiwrapz Today
            </span>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Create an account today to enjoy fast checkout, order tracking, and custom gift requests.
            </p>
          </div>

          {error && isSignUp && <ErrorMessage message={error} />}

          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">First Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Priya"
                    value={signUpData.firstName}
                    onChange={handleSignUpField("firstName")}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Last Name *</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={signUpData.lastName}
                  onChange={handleSignUpField("lastName")}
                  required
                  className="w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="priya@example.com"
                  value={signUpData.email}
                  onChange={handleSignUpField("email")}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Mobile Phone <span className="text-gray-600">(optional)</span></label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={signUpData.phone}
                  onChange={handleSignUpField("phone")}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={signUpData.password}
                  onChange={handleSignUpField("password")}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${btnClass} text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating Account..." : "SIGN UP"}
            </button>
          </form>

          <div className="pt-2 border-t border-dark-border/50 text-right md:hidden">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-xs text-gray-400 hover:text-white font-bold"
            >
              Already have an account? Sign In →
            </button>
          </div>
        </div>

        {/* ── 3. CURVED SLIDING OVERLAY PANEL (Desktop Animation) ── */}
        <div 
          className={`hidden md:flex absolute top-0 bottom-0 w-1/2 bg-gradient-to-br ${bgGradient} p-10 flex-col items-center justify-center text-center text-white transition-all duration-700 ease-in-out z-30 shadow-2xl ${
            isSignUp 
              ? "left-0 rounded-r-[140px] rounded-l-3xl transform translate-x-0" 
              : "left-1/2 rounded-l-[140px] rounded-r-3xl transform translate-x-0"
          }`}
        >
          {/* Subtle background texture overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-black/60 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl relative z-10">
            <span className="font-serif font-black text-amber-400 text-2xl">H</span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/90 relative z-10 mb-2">
            &ldquo;BECAUSE MOMENTS DESERVE FLOWERS.&rdquo;
          </p>

          {!isSignUp ? (
            /* Overlay content when viewing Sign In (Prompting Sign Up) */
            <div className="space-y-6 max-w-xs relative z-10">
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Hello, Friend!
              </h2>
              <p className="text-xs text-gray-200 leading-relaxed opacity-90">
                New to Happiwrapz? Create an account today to enjoy fast checkout, order tracking, and custom gift requests.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="px-8 py-3.5 border-2 border-amber-400/90 text-amber-300 font-bold text-xs rounded-full hover:bg-white hover:text-black hover:border-white transition-all shadow-xl flex items-center justify-center gap-2 mx-auto uppercase tracking-wider group"
              >
                CREATE ACCOUNT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* Overlay content when viewing Sign Up (Prompting Sign In) */
            <div className="space-y-6 max-w-xs relative z-10">
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs text-gray-200 leading-relaxed opacity-90">
                To keep connected with us, please sign in with your account credentials.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="px-8 py-3.5 border-2 border-amber-400/90 text-amber-300 font-bold text-xs rounded-full hover:bg-white hover:text-black hover:border-white transition-all shadow-xl flex items-center justify-center gap-2 mx-auto uppercase tracking-wider group"
              >
                SIGN IN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
