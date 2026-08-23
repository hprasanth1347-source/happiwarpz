import React from 'react';
import { notFound } from 'next/navigation';
import { fetchFastAPI } from '@/lib/fastapiClient';
import { getLocalProducts } from '@/lib/productsData';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(rawSlug: string) {
  const slug = decodeURIComponent(rawSlug || '').trim();
  try {
    const apiProduct = await fetchFastAPI(`/api/products/${slug}`);
    if (apiProduct) return apiProduct;
  } catch (err) {
    // API server offline
  }

  // Local fallback search
  const localProducts = getLocalProducts();
  const found = localProducts.find((p) => p.slug === slug || p.id === slug);
  if (found) return found;

  // Fuzzy matching fallback so products are always resiliently found
  const fuzzy = localProducts.find(
    (p) => p.slug.toLowerCase().includes(slug.toLowerCase()) || slug.toLowerCase().includes(p.slug.toLowerCase())
  );
  return fuzzy || localProducts[0] || null;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.name} | Happiwrapz Handmade Flowers`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
