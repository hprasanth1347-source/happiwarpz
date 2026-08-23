'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ChevronRight } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: { name: string };
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filtered, setFiltered] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFiltered(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(products);
      return;
    }
    const q = query.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
    );
    setFiltered(matches);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#0D0D0D] border border-[#C9A24A]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#221D22] flex items-center gap-3">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#D00000] shrink-0 bg-[#050505]">
            <Image src="/images/logo.png" alt="Happiwrapz" fill className="object-contain p-0.5" />
          </div>
          <Search className="w-5 h-5 text-[#C9A24A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roses, sunflowers, keychains, custom gifts..."
            className="flex-1 bg-transparent text-[#F8F1E7] placeholder-[#A39A90] focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#A39A90] hover:text-[#F8F1E7] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#120F12] border-b border-[#221D22] flex items-center gap-2 overflow-x-auto text-xs text-[#A39A90]">
          <span>Popular searches:</span>
          {['Rose', 'Sunflower', 'Keychain', 'Heart', 'Gift'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-[#1F171F] hover:bg-[#C9A24A] hover:text-black transition-colors text-[#F8F1E7]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-[#A39A90]">Searching catalog...</div>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#181318] transition-colors group"
              >
                <div className="relative w-14 h-14 rounded-lg bg-[#050505] overflow-hidden flex-shrink-0 border border-[#221D22]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#F8F1E7] truncate group-hover:text-[#C9A24A] transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-xs text-[#A39A90]">
                    {item.category.name}
                  </span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#F4D068]">
                    ₹{item.price}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#A39A90] group-hover:text-[#C9A24A]" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-[#A39A90]">
              <p className="text-lg font-serif text-[#F8F1E7] mb-1">
                No products found
              </p>
              <p className="text-sm">Try another search term like "rose" or "keychain".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
