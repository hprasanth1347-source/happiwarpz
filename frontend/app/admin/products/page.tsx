'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  X,
  Check,
  Sparkles,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface Variant {
  id?: string;
  name: string;
  price: number;
  glitterOption?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  imagesJson?: string | null;
  categoryId: string;
  category?: { id: string; name: string };
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  advanceNoticeDays: number;
  advanceNoticeText?: string | null;
  variants: Variant[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'FEATURED' | 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISABLED'>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await adminFetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isFeatured: !product.isFeatured }),
      });
      if (res.ok) fetchCatalog();
    } catch (e) {
      console.error('Failed to toggle featured state', e);
    }
  };

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    image: '/images/products/roses/rose-bouquet.png',
    imagesList: [] as string[],
    advanceNoticeDays: 7,
    advanceNoticeText: 'Make sure to place the order at least one week earlier.',
    isFeatured: false,
    inStock: true,
    isActive: true,
  });

  const [variantsList, setVariantsList] = useState<Variant[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        adminFetch('/api/admin/products', { cache: 'no-store' }),
        adminFetch('/api/admin/categories', { cache: 'no-store' }),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        const pArr = Array.isArray(pData) ? pData : pData.data?.products || pData.products || pData.data || [];
        setProducts(pArr);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        const cArr = Array.isArray(cData) ? cData : cData.data?.categories || cData.categories || cData.data || [];
        setCategories(cArr);
      }
    } catch (e) {
      console.error('Failed to load products catalog', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      categoryId: categories[0]?.id || '',
      price: '',
      image: '/images/products/roses/rose-bouquet.png',
      imagesList: [],
      advanceNoticeDays: 7,
      advanceNoticeText: 'Make sure to place the order at least one week earlier.',
      isFeatured: false,
      inStock: true,
      isActive: true,
    });
    setVariantsList([
      { name: '1 Rose', price: 60, glitterOption: 'WITHOUT_GLITTER' },
      { name: '10 Roses', price: 350, glitterOption: 'WITHOUT_GLITTER' },
      { name: '10 Roses', price: 390, glitterOption: 'WITH_GLITTER' },
    ]);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingId(p.id);
    let parsedImages: string[] = [p.image];
    if (p.imagesJson) {
      try {
        parsedImages = JSON.parse(p.imagesJson);
      } catch (e) {}
    }

    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      price: String(p.price),
      image: p.image,
      imagesList: parsedImages,
      advanceNoticeDays: p.advanceNoticeDays || 7,
      advanceNoticeText: p.advanceNoticeText || 'Make sure to place the order at least one week earlier.',
      isFeatured: p.isFeatured,
      inStock: p.inStock,
      isActive: p.isActive,
    });
    setVariantsList(p.variants || []);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setForm((prev) => ({
          ...prev,
          image: prev.image || result.url,
          imagesList: [...prev.imagesList, result.url],
        }));
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingId,
        ...form,
        imagesJson: JSON.stringify(form.imagesList),
        variants: variantsList,
      };

      const url = '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchCatalog();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await adminFetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchCatalog();
    } catch (e) {}
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const pName = (p.name || '').toLowerCase();
    const pSlug = (p.slug || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = pName.includes(query) || pSlug.includes(query);

    if (!matchesSearch) return false;

    if (filterStatus === 'FEATURED') return p.isFeatured;
    if (filterStatus === 'AVAILABLE') return p.inStock && p.isActive;
    if (filterStatus === 'OUT_OF_STOCK') return !p.inStock;
    if (filterStatus === 'DISABLED') return !p.isActive;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Inventory & Customization Options
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Product Management
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0D] border border-[#221D22] p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A39A90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="w-full bg-[#050505] border border-[#221D22] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
          {(['ALL', 'FEATURED', 'AVAILABLE', 'OUT_OF_STOCK', 'DISABLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-[#C9A24A] text-black shadow'
                  : 'bg-[#050505] border border-[#221D22] text-[#A39A90] hover:text-[#F8F1E7]'
              }`}
            >
              {st === 'FEATURED' ? '✨ NEW ARRIVALS' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#A39A90]">Loading catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#0D0D0D] border border-[#221D22] rounded-3xl text-[#A39A90]">
          No products match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`bg-[#0D0D0D] border ${p.isFeatured ? 'border-[#C9A24A]' : 'border-[#221D22]'} hover:border-[#C9A24A]/40 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-[#050505] overflow-hidden border border-[#221D22]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="bg-[#050505]/80 text-[#F4D068] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A24A]/30">
                      {p.category?.name}
                    </span>
                    {p.isFeatured && (
                      <span className="bg-[#C9A24A] text-black font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Sparkles className="w-3 h-3" />
                        <span>New Arrival</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!p.isActive && (
                      <span className="bg-[#D00000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Disabled
                      </span>
                    )}
                    {!p.inStock && (
                      <span className="bg-[#555] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-serif font-bold text-[#F8F1E7]">
                      {p.name}
                    </h3>
                    <span className="text-base font-bold text-[#F4D068]">
                      ₹{p.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#A39A90] line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="text-xs text-[#C9A24A] bg-[#050505] p-2.5 rounded-xl border border-[#1C161C] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Advance Notice: {p.advanceNoticeDays || 7} Days</span>
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      p.isFeatured
                        ? 'bg-[#C9A24A] text-black border-[#C9A24A]'
                        : 'bg-[#181218] text-[#A39A90] border-[#221D22] hover:text-[#F4D068]'
                    }`}
                    title="Toggle New Arrival Feature"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{p.isFeatured ? 'Featured' : 'Add to New'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#221D22] flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="px-4 py-2 rounded-xl bg-[#181318] border border-[#C9A24A]/40 text-[#F8F1E7] text-xs font-bold hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-2 text-[#A39A90] hover:text-[#D00000] transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#221D22] pb-4">
              <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">
                {editingId ? 'Edit Product Catalogue' : 'Add New Product Catalogue'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#A39A90] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Product Title *</label>
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
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Advance Notice (Days) *</label>
                <input
                  type="number"
                  required
                  value={form.advanceNoticeDays}
                  onChange={(e) =>
                    setForm({ ...form, advanceNoticeDays: parseInt(e.target.value) || 7 })
                  }
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A39A90] block mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
              />
            </div>

            {/* Product Image Upload Section */}
            <div className="space-y-3 p-4 bg-[#050505] border border-[#221D22] rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#C9A24A]">
                  Product Image Management
                </span>
                <label className="cursor-pointer px-3 py-1.5 bg-[#181318] border border-[#C9A24A]/40 rounded-xl text-xs text-[#F4D068] hover:bg-[#C9A24A] hover:text-black transition-colors flex items-center gap-1.5 font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {form.imagesList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      form.image === imgUrl ? 'border-[#C9A24A]' : 'border-[#221D22]'
                    }`}
                  >
                    <Image src={imgUrl} alt="Product image" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          imagesList: prev.imagesList.filter((_, i) => i !== idx),
                          image: prev.imagesList[0] || '',
                        }))
                      }
                      className="absolute top-1 right-1 bg-black/80 text-white p-0.5 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="rounded accent-[#8B0000]"
                />
                <span>In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded accent-[#8B0000]"
                />
                <span>Enabled (Active)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded accent-[#8B0000]"
                />
                <span className="text-[#F4D068] font-bold">✨ New Arrival / Featured (Home Page)</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[#221D22]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-xs text-[#A39A90] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
