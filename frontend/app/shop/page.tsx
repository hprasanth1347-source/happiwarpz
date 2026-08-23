import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchFastAPI } from '@/lib/fastapiClient';
import { Search } from 'lucide-react';

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;
  const searchQuery = resolvedParams.search || '';
  const sortOption = resolvedParams.sort || 'default';

  const categories: any[] = (await fetchFastAPI('/api/categories')) || [];

  let queryParams = [];
  if (categoryFilter) queryParams.push(`category=${categoryFilter}`);
  if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  if (sortOption) queryParams.push(`sort=${sortOption}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  const products: any[] = (await fetchFastAPI(`/api/products${queryString}`)) || [];

  return (
    <div className="site-container py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
          Happiwrapz catalogue
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F1E7]">
          Shop Happiwrapz
        </h1>
        <p className="text-sm text-[#A39A90] leading-relaxed">
          "Find something special for every moment." Handmade flowers, bouquets, keychains, and custom gifts.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#221D22] pb-6">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            !categoryFilter
              ? 'bg-[#C9A24A] text-black font-semibold shadow-md'
              : 'bg-[#0D0D0D] border border-[#221D22] text-[#F8F1E7] hover:border-[#C9A24A]'
          }`}
        >
          All products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              categoryFilter === cat.slug
                ? 'bg-[#C9A24A] text-black font-semibold shadow-md'
                : 'bg-[#0D0D0D] border border-[#221D22] text-[#F8F1E7] hover:border-[#C9A24A]'
            }`}
          >
            {cat.name}
          </Link>
        ))}

        {/* Custom Gift Request Direct Link Tab */}
        <Link
          href="/custom-gifts"
          className="px-4 py-2 rounded-full text-xs font-bold bg-[#181216] border border-[#C9A24A]/60 text-[#F4D068] hover:bg-[#C9A24A] hover:text-black transition-all flex items-center gap-1.5 shadow-md"
        >
          <span>🎨 Custom Gift Request</span>
        </Link>
      </div>



      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#A39A90]">
        <span>
          Showing <strong className="text-[#F8F1E7]">{products.length}</strong> items
          {categoryFilter && ` in "${categoryFilter.replace('-', ' ')}"`}
        </span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <Link
            href={`/shop?${categoryFilter ? `category=${categoryFilter}&` : ''}sort=price-low`}
            className={`hover:text-[#C9A24A] ${sortOption === 'price-low' ? 'text-[#C9A24A] font-bold' : ''}`}
          >
            Price: low to high
          </Link>
          <span>•</span>
          <Link
            href={`/shop?${categoryFilter ? `category=${categoryFilter}&` : ''}sort=price-high`}
            className={`hover:text-[#C9A24A] ${sortOption === 'price-high' ? 'text-[#C9A24A] font-bold' : ''}`}
          >
            Price: high to low
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4 max-w-md mx-auto">
          <h3 className="text-xl font-serif text-[#F8F1E7]">No products found</h3>
          <p className="text-xs text-[#A39A90]">Try selecting another category or resetting your search filter.</p>
          <Link
            href="/shop"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#C9A24A] text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Reset filters
          </Link>
        </div>
      )}
    </div>
  );
}
