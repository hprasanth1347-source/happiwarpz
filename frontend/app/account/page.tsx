'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Clock,
  Edit,
} from 'lucide-react';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          // Fetch user's orders
          fetch(`/api/orders`, { cache: 'no-store', credentials: 'include' })
            .then((r) => r.json())
            .then((ordData) => {
              const ordersList = ordData.data?.orders || ordData;
              if (Array.isArray(ordersList)) {
                setRecentOrders(ordersList.slice(0, 3));
              }
            })
            .catch(() => {});
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#A39A90]">
        Loading your account dashboard...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Welcome, {user.firstName || user.name || 'Customer'}!
          </h1>
          <p className="text-xs text-[#A39A90]">{user.email} • {user.phone}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account/profile"
            className="px-4 py-2 rounded-xl bg-[#181216] border border-[#C9A24A]/40 text-[#F4D068] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#2A0808] border border-[#D00000] text-[#D00000] text-xs font-bold hover:bg-[#D00000] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href={`/account/orders?email=${encodeURIComponent(user.email)}`}
          className="p-6 bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A] rounded-3xl space-y-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#181216] border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#F8F1E7] group-hover:text-[#C9A24A] transition-colors">
              My Orders
            </h3>
            <p className="text-xs text-[#A39A90] mt-0.5">
              View your order history, delivery receipts, and status.
            </p>
          </div>
          <span className="text-xs text-[#C9A24A] font-bold block pt-2">
            View All Orders →
          </span>
        </Link>

        <Link
          href="/account/security"
          className="p-6 bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A] rounded-3xl space-y-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#181216] border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#F8F1E7] group-hover:text-[#C9A24A] transition-colors">
              Account Security & Sign-In Methods
            </h3>
            <p className="text-xs text-[#A39A90] mt-0.5">
              Connect Google OAuth, verify Phone number, set passwords, and logout active devices.
            </p>
          </div>
          <span className="text-xs text-[#C9A24A] font-bold block pt-2">
            Manage Security →
          </span>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#221D22] pb-3">
          <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">
            Recent Purchases
          </h3>
          <Link
            href={`/account/orders?email=${encodeURIComponent(user.email)}`}
            className="text-xs text-[#C9A24A] font-bold hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A39A90]">
            No recent purchases. Start shopping for handmade flowers!
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-[#050505] border border-[#1C161C] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#F4D068] text-sm block">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[#A39A90]">
                    Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#4CAF50] font-bold bg-[#4CAF50]/10 px-2.5 py-0.5 rounded">
                    {ord.paymentStatus}
                  </span>
                  <span className="text-[#F8F1E7] font-bold">₹{ord.totalAmount}</span>
                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="text-[#C9A24A] font-bold hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
