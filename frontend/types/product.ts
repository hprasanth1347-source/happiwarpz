export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: Category;
  price: number;
  salePrice?: number;
  sku: string;
  image: string;
  images?: string[];
  isFeatured?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  customizationAvailable?: boolean;
  colorOptionAvailable?: boolean;
  advanceNoticeDays?: number;
  variants?: ProductVariant[];
}
