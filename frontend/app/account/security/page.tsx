'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Lock, Smartphone, Mail, Globe, LogOut, Key, CheckCircle2, XCircle, AlertTriangle, ArrowRight
} from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

export default function AccountSecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        adminFetch('/api/auth/me'),
        adminFetch('/api/auth/sessions'),
      ]);

      if (uRes.ok) {
        const uData = await uRes.json();
        if (uData.authenticated) {
          setUser(uData.user);
        } else {
          router.push('/login?next=/account/security');
        }
      }
      if (sRes.ok) {
        setSessions(await sRes.json());
      }
    } catch (e) {
      console.error('Failed to load account security settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to log out from all devices?')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await adminFetch('/api/auth/logout-all', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('happiwrapz_token');
        localStorage.removeItem('happiwrapz_user');
        router.push('/login');
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Failed to revoke sessions.' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (newPassword.length < 8) {
      setMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setPasswordLoading(true);
    const endpoint = user?.hasPassword ? '/api/auth/change-password' : '/api/auth/set-password';
    const payload = user?.hasPassword ? { currentPassword, newPassword } : { newPassword };

    try {
      const res = await adminFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: data.message || 'Password saved successfully.' });
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        loadSecurityData();
      } else {
        setMsg({ type: 'error', text: data.detail || data.error || 'Failed to update password.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Error connecting to password service.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!confirm('Are you sure you want to disconnect your Google Account?')) return;
    setMsg({ type: '', text: '' });
    try {
      const res = await adminFetch('/api/auth/google/unlink', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: 'Google account disconnected successfully.' });
        loadSecurityData();
      } else {
        setMsg({ type: 'error', text: data.detail || data.error || 'Cannot disconnect Google.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Error unlinking Google account.' });
    }
  };

  if (loading) {
    return (
      <div className="site-container py-16 text-center text-xs text-[#A39A90]">
        Loading security management dashboard...
      </div>
    );
  }

  return (
    <div className="site-container py-12 space-y-8 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#C9A24A]" />
            <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">Security Settings</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">Account Protection Dashboard</h1>
          <p className="text-xs text-[#A39A90]">
            Manage multi-factor login methods, linked social accounts, and active device sessions.
          </p>
        </div>

        <Link
          href="/account/login-activity"
          className="px-4 py-2.5 rounded-xl bg-[#181216] border border-[#C9A24A]/40 text-[#F4D068] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-all flex items-center gap-2"
        >
          <span>View Login Activity Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-[#0A2612] border-[#4CAF50] text-[#F8F1E7]' : 'bg-[#2A0808] border-[#D00000] text-[#F8F1E7]'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" /> : <AlertTriangle className="w-5 h-5 text-[#D00000]" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. EMAIL + PASSWORD */}
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F8F1E7]">
              <Mail className="w-5 h-5 text-[#C9A24A]" />
              <h3 className="text-sm font-bold">Email Address</h3>
            </div>
            {user?.email_verified ? (
              <span className="text-[10px] font-bold bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 px-2.5 py-0.5 rounded-full uppercase">Verified ✓</span>
            ) : (
              <span className="text-[10px] font-bold bg-[#F4D068]/20 text-[#F4D068] border border-[#F4D068]/30 px-2.5 py-0.5 rounded-full uppercase">Primary</span>
            )}
          </div>
          <p className="text-xs text-[#F8F1E7] font-semibold">{user?.email}</p>
          <div className="border-t border-[#221D22] pt-3 flex items-center justify-between text-xs">
            <span className="text-[#A39A90]">Password: {user?.hasPassword ? 'Configured ✓' : 'Not Set'}</span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-[#C9A24A] font-bold hover:underline"
            >
              {user?.hasPassword ? 'Change Password' : 'Set Password'}
            </button>
          </div>
        </div>

        {/* 2. GOOGLE OAUTH */}
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F8F1E7]">
              <Globe className="w-5 h-5 text-[#4285F4]" />
              <h3 className="text-sm font-bold">Google Account</h3>
            </div>
            {user?.googleConnected ? (
              <span className="text-[10px] font-bold bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 px-2.5 py-0.5 rounded-full uppercase">Connected ✓</span>
            ) : (
              <span className="text-[10px] font-bold bg-[#221D22] text-[#A39A90] px-2.5 py-0.5 rounded-full uppercase">Not Linked</span>
            )}
          </div>
          <p className="text-xs text-[#A39A90]">
            {user?.googleConnected ? 'Your account is linked to Google OAuth 2.0.' : 'Link Google to sign in with 1 click.'}
          </p>
          <div className="border-t border-[#221D22] pt-3 flex items-center justify-between text-xs">
            {user?.googleConnected ? (
              <button onClick={handleUnlinkGoogle} className="text-[#D00000] font-bold hover:underline">
                Disconnect Google
              </button>
            ) : (
              <a href="/api/auth/google?state=link" className="text-[#C9A24A] font-bold hover:underline">
                Connect Google Account →
              </a>
            )}
          </div>
        </div>

        {/* 3. PHONE NUMBER + OTP */}
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F8F1E7]">
              <Smartphone className="w-5 h-5 text-[#C9A24A]" />
              <h3 className="text-sm font-bold">Phone Number</h3>
            </div>
            {user?.phone_verified ? (
              <span className="text-[10px] font-bold bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 px-2.5 py-0.5 rounded-full uppercase">Verified ✓</span>
            ) : (
              <span className="text-[10px] font-bold bg-[#221D22] text-[#A39A90] px-2.5 py-0.5 rounded-full uppercase">Not Linked</span>
            )}
          </div>
          <p className="text-xs text-[#F8F1E7] font-semibold">{user?.phone || 'No phone number connected'}</p>
          <div className="border-t border-[#221D22] pt-3 flex items-center justify-between text-xs">
            <Link href="/phone-login" className="text-[#C9A24A] font-bold hover:underline">
              {user?.phone ? 'Change Phone Number' : 'Add Phone Number'}
            </Link>
          </div>
        </div>

        {/* 4. ACTIVE SESSIONS & LOGOUT ALL */}
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F8F1E7]">
              <Lock className="w-5 h-5 text-[#C9A24A]" />
              <h3 className="text-sm font-bold">Active Sessions</h3>
            </div>
            <span className="text-[10px] font-bold bg-[#C9A24A]/20 text-[#F4D068] border border-[#C9A24A]/30 px-2.5 py-0.5 rounded-full uppercase">
              {sessions.length} Devices
            </span>
          </div>
          <p className="text-xs text-[#A39A90]">
            Log out from all browsers and active devices instantly.
          </p>
          <div className="border-t border-[#221D22] pt-3 flex items-center justify-between text-xs">
            <button onClick={handleLogoutAll} className="text-[#D00000] font-bold hover:underline flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout From All Devices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">
              {user?.hasPassword ? 'Change Account Password' : 'Set Account Password'}
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {user?.hasPassword && (
                <div>
                  <label className="text-xs text-[#A39A90] block mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">New Password (8+ chars) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs text-[#A39A90] hover:text-[#F8F1E7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2 rounded-xl bg-[#D00000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8B0000] transition-all"
                >
                  {passwordLoading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
