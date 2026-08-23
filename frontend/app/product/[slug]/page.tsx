import React from 'react';
import { notFound } from 'next/navigation';
import { fetchFastAPI } from '@/lib/fastapiClient';
import { getLocalProducts } from '@/lib/productsData';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  try {
    const apiProduct = await fetchFastAPI(`/api/products/${slug}`);
    if (apiProduct) return apiProduct;
  } catch (err) {
    // API server offline
  }

  // Local fallback search
  const localProducts = getLocalProducts();
  const found = localProducts.find((p) => p.slug === slug || p.id === slug);
  return found || null;
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
