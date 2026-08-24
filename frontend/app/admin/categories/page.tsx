'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/categories', { cache: 'no-store' });
      if (res.ok) {
        const cData = await res.json();
        const cArr = Array.isArray(cData) ? cData : cData.data?.categories || cData.categories || cData.data || [];
        setCategories(cArr);
      }
    } catch (e) {
      console.error('Failed to fetch categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', slug: '', description: '', isActive: true });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      isActive: cat.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const payload = editingCategory ? { id: editingCategory.id, ...form } : form;

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchCategories();
      } else {
        setErrorMsg(data.detail || data.error || 'Failed to save category');
      }
    } catch (e) {
      setErrorMsg('An unexpected error occurred.');
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    setErrorMsg('');
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const res = await adminFetch(`/api/admin/categories?id=${cat.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        fetchCategories();
      } else {
        setErrorMsg(data.detail || data.error || 'Cannot delete category.');
      }
    } catch (e) {
      setErrorMsg('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Catalogue Structure
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Category Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#2A0808] border border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Category List */}
      {loading ? (
        <div className="text-center py-16 text-[#A39A90]">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#0D0D0D] border border-[#221D22] hover:border-[#C9A24A]/40 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-bold text-[#F4D068] bg-[#181318] px-2.5 py-1 rounded-full border border-[#C9A24A]/30">
                    {cat._count?.products || 0} Products
                  </span>
                </div>
                <p className="text-xs text-[#A39A90]">
                  {cat.description || 'No description added.'}
                </p>
                <span className="text-[10px] text-[#A39A90] font-mono block">
                  Slug: {cat.slug}
                </span>
              </div>

              <div className="pt-3 border-t border-[#221D22] flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#181318] border border-[#C9A24A]/40 text-[#F8F1E7] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Rename / Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(cat)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2A0808] border border-[#D00000]/60 text-[#D00000] text-xs font-bold hover:bg-[#D00000] hover:text-white transition-all flex items-center gap-1.5 shadow"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Category</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#221D22] pb-4">
              <h3 className="text-lg font-serif font-bold text-[#F8F1E7]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#A39A90] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                placeholder="e.g. Floral Gifts"
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short subtitle for this category..."
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#221D22]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs text-[#A39A90]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
