'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Lock, Unlock, Plus, X, Trash2, ShieldCheck, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface CustomerItem {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  accountStatus: string;
  authProvider?: string;
  orderCount?: number;
  totalSpent?: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  // Modal State for Adding New User
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN',
    accountStatus: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let mergedList: CustomerItem[] = [];

      // 1. Fetch from backend API
      const res = await adminFetch('/api/admin/customers', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const custArray = Array.isArray(data) ? data : data.data?.customers || data.customers || data.data || [];
        if (Array.isArray(custArray)) {
          mergedList = [...custArray];
        }
      }

      // 2. Merge local browser-registered users
      if (typeof window !== 'undefined') {
        try {
          const localPool = JSON.parse(localStorage.getItem('happiwrapz_registered_users') || '[]');
          if (Array.isArray(localPool)) {
            for (const localU of localPool) {
              const email = localU.email?.toLowerCase();
              if (email && !mergedList.some((c) => c.email?.toLowerCase() === email)) {
                mergedList.unshift(localU);
              }
            }
          }
        } catch (_) {}
      }

      setCustomers(mergedList);
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await adminFetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountStatus: newStatus }),
      });

      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === userId ? { ...c, accountStatus: newStatus } : c))
        );
        setFeedback({ type: 'success', message: `Account status updated to ${newStatus}.` });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to update user status.' });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"?`)) return;
    try {
      const res = await adminFetch(`/api/admin/customers?id=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== userId));

        // Also remove from local registered users pool if present
        if (typeof window !== 'undefined') {
          try {
            const localPool = JSON.parse(localStorage.getItem('happiwrapz_registered_users') || '[]');
            const updatedPool = localPool.filter((u: any) => u.id !== userId);
            localStorage.setItem('happiwrapz_registered_users', JSON.stringify(updatedPool));
          } catch (_) {}
        }

        setFeedback({ type: 'success', message: `User "${userName}" was successfully deleted.` });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to delete user.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (addForm.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminFetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.user || data.data?.user)) {
        const newUser: CustomerItem = data.user || data.data?.user || {
          id: `usr_${Date.now()}`,
          name: `${addForm.firstName} ${addForm.lastName}`.trim(),
          firstName: addForm.firstName,
          lastName: addForm.lastName,
          email: addForm.email.toLowerCase(),
          phone: addForm.phone,
          role: addForm.role,
          accountStatus: addForm.accountStatus,
          createdAt: new Date().toISOString(),
          orderCount: 0,
          totalSpent: 0,
        };

        setCustomers((prev) => [newUser, ...prev.filter((c) => c.email.toLowerCase() !== newUser.email.toLowerCase())]);

        // Save in local pool
        if (typeof window !== 'undefined') {
          try {
            const localPool = JSON.parse(localStorage.getItem('happiwrapz_registered_users') || '[]');
            const filtered = localPool.filter((u: any) => u.email.toLowerCase() !== newUser.email.toLowerCase());
            filtered.unshift(newUser);
            localStorage.setItem('happiwrapz_registered_users', JSON.stringify(filtered));
          } catch (_) {}
        }

        setShowAddModal(false);
        setAddForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          role: 'CUSTOMER',
          accountStatus: 'ACTIVE',
        });
        setFeedback({ type: 'success', message: `User "${newUser.name}" (${newUser.role}) created successfully!` });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', message: data.message || data.error || 'Failed to create user.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error communicating with server.' });
    } finally {
      setSubmitting(false);
    }
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter((c) => {
    if (!c) return false;
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toString();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query);
    if (!matchesSearch) return false;

    if (roleFilter !== 'ALL' && (c.role || 'CUSTOMER') !== roleFilter) return false;
    if (statusFilter !== 'ALL' && (c.accountStatus || 'ACTIVE') !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Clientele & Store Accounts
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            User & Customer Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User</span>
          </button>

          <button
            onClick={fetchCustomers}
            className="px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#221D22] text-xs text-[#F8F1E7] hover:border-[#C9A24A] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#C9A24A] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-[#2A0808] border border-[#D00000] text-[#F8F1E7]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#D00000] flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-[#050505] p-1 rounded-xl border border-[#221D22]">
            {(['ALL', 'CUSTOMER', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-[#C9A24A] text-black shadow'
                    : 'text-[#A39A90] hover:text-[#F8F1E7]'
                }`}
              >
                {r === 'ALL' ? 'ALL ROLES' : r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#050505] p-1 rounded-xl border border-[#221D22]">
            {(['ALL', 'ACTIVE', 'SUSPENDED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white shadow'
                    : 'text-[#A39A90] hover:text-[#F8F1E7]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#C9A24A] animate-spin mx-auto" />
            <div>Loading registered accounts...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A39A90] space-y-1">
            <Users className="w-8 h-8 text-[#A39A90]/40 mx-auto mb-2" />
            <div className="text-sm font-semibold text-[#F8F1E7]">No Users Found</div>
            <div>No accounts match your search and filter criteria.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] border-b border-[#221D22] text-[#A39A90]">
                <tr>
                  <th className="p-4 font-semibold">User Details</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Orders / Spend</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181216]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#120F12]/60 transition-colors">
                    <td className="p-4 font-semibold text-[#F8F1E7]">
                      <div className="flex items-center gap-2">
                        <span>{cust.name || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'User'}</span>
                        {cust.role === 'ADMIN' && (
                          <span className="bg-[#C9A24A]/20 text-[#C9A24A] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#C9A24A]/40 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>ADMIN</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#A39A90] font-normal mt-0.5">
                        Joined: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="text-[#F8F1E7]">{cust.email}</div>
                      <div className="text-[11px] text-[#A39A90]">{cust.phone || 'No phone'}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.role === 'ADMIN'
                            ? 'bg-[#C9A24A]/10 text-[#C9A24A] border border-[#C9A24A]/30'
                            : 'bg-white/10 text-white/80 border border-white/20'
                        }`}
                      >
                        {cust.role || 'CUSTOMER'}
                      </span>
                    </td>

                    <td className="p-4 font-medium text-[#F8F1E7]">
                      <div>{cust.orderCount || 0} Orders</div>
                      <div className="text-[10px] text-[#C9A24A] font-bold">
                        ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#2A0808] text-[#D00000] border border-[#D00000]/30'
                        }`}
                      >
                        {cust.accountStatus || 'ACTIVE'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(cust.id, cust.accountStatus || 'ACTIVE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          cust.accountStatus === 'ACTIVE'
                            ? 'bg-[#2A0808] text-[#D00000] hover:bg-[#D00000] hover:text-white border border-[#D00000]/40'
                            : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-800 border border-emerald-500/40'
                        }`}
                      >
                        {cust.accountStatus === 'ACTIVE' ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(cust.id, cust.name)}
                        className="p-1.5 rounded-lg bg-[#2A0808] text-[#D00000] hover:bg-[#D00000] hover:text-white border border-[#D00000]/40 transition-colors inline-flex items-center cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-[#221D22] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">Account Provisioning</span>
                <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">Create New User Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#A39A90] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.firstName}
                  onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                  placeholder="Aarav"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Last Name</label>
                <input
                  type="text"
                  value={addForm.lastName}
                  onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                  placeholder="Sharma"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="aarav.sharma@example.com"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Initial Password (Min. 6 chars) *</label>
              <input
                type="password"
                required
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Account Role *</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value as 'CUSTOMER' | 'ADMIN' })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                >
                  <option value="CUSTOMER">CUSTOMER (Shopper)</option>
                  <option value="ADMIN">ADMIN (Full Store Access)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Account Status *</label>
                <select
                  value={addForm.accountStatus}
                  onChange={(e) => setAddForm({ ...addForm, accountStatus: e.target.value as 'ACTIVE' | 'SUSPENDED' })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-3.5 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#221D22]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 text-xs text-[#A39A90] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
