'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Clock, Monitor, Smartphone, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

export default function LoginActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/auth/login-activity');
      if (res.ok) {
        setActivities(await res.json());
      }
    } catch (e) {
      console.error('Failed to load login activities', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="site-container py-12 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/account/security"
            className="inline-flex items-center gap-1 text-xs text-[#C9A24A] font-bold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Security Settings</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">Login Activity Audit Log</h1>
          <p className="text-xs text-[#A39A90]">
            Review recent authentication events, sign-in methods, and devices accessing your account.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-[#A39A90]">Loading audit logs...</div>
      ) : activities.length === 0 ? (
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 text-center text-xs text-[#A39A90]">
          No recent login activities logged.
        </div>
      ) : (
        <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-[#221D22]">
            {activities.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#221D22] flex items-center justify-center text-[#C9A24A]">
                    {item.loginMethod === 'GOOGLE' ? (
                      <Globe className="w-5 h-5 text-[#4285F4]" />
                    ) : item.loginMethod === 'PHONE_OTP' ? (
                      <Smartphone className="w-5 h-5 text-[#C9A24A]" />
                    ) : (
                      <Monitor className="w-5 h-5 text-[#F8F1E7]" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F8F1E7] uppercase tracking-wider">
                        {item.loginMethod} SIGN-IN
                      </span>
                      {item.success ? (
                        <span className="text-[9px] font-bold bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 px-2 py-0.2 rounded-full uppercase">
                          Success
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-[#D00000]/20 text-[#D00000] border border-[#D00000]/30 px-2 py-0.2 rounded-full uppercase">
                          Failed
                        </span>
                      )}
                    </div>
                    <p className="text-[#A39A90] text-[11px] truncate max-w-xs sm:max-w-md">
                      IP: {item.ipAddress} • {item.userAgent}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[#A39A90] block text-[11px]">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
