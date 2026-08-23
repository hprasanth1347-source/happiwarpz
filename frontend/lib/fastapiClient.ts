import { PRODUCTS_DATA, CATEGORIES_DATA, getLocalProducts, getLocalProductByIdOrSlug } from './productsData';

const FASTAPI_URL = process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'http://127.0.0.1:5000');

export async function fetchFastAPI(path: string, options?: RequestInit) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${FASTAPI_URL}${path}`, {
      cache: 'no-store',
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      
      // Automatically unwrap Express 'sendSuccess' wrapper format if it exists
      if (data && data.success && data.data) {
        if (data.data.products) return data.data.products;
        if (data.data.product) return data.data.product;
        if (data.data.categories) return data.data.categories;
        if (data.data.orders) return data.data.orders;
        return data.data;
      }
      return data;
    }
  } catch (err) {
    // Silent fallback to local store data
  }

  // Resilient Store Fallbacks using single source of truth
  if (path.startsWith('/api/categories')) {
    return CATEGORIES_DATA;
  }
  if (path.startsWith('/api/products/')) {
    const slug = path.replace('/api/products/', '').split('?')[0];
    const found = getLocalProductByIdOrSlug(slug);
    return found || null;
  }
  if (path.startsWith('/api/products')) {
    if (path.includes('category=')) {
      const catParam = path.split('category=')[1]?.split('&')[0];
      return getLocalProducts({ category: catParam });
    }
    return getLocalProducts();
  }

  return null;
}
