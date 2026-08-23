'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  productId: string;
  id?: string;
  name: string;
  slug?: string;
  price: number;
  image: string;
  description?: string;
  categoryName?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  items: WishlistItem[];
  toggleWishlist: (itemOrId: any) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  refreshWishlist?: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'happiwrapz_wishlist_items_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (e) {
        console.error('Failed to save wishlist', e);
      }
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId || item.id === productId);
  };

  const toggleWishlist = (itemOrId: any) => {
    const pId = typeof itemOrId === 'string' ? itemOrId : (itemOrId.productId || itemOrId.id);
    
    setWishlist((prev) => {
      const exists = prev.some((i) => i.productId === pId || i.id === pId);
      if (exists) {
        return prev.filter((i) => i.productId !== pId && i.id !== pId);
      } else {
        const itemToAdd: WishlistItem = typeof itemOrId === 'object' ? itemOrId : {
          productId: pId,
          id: pId,
          name: 'Handmade Item',
          price: 199,
          image: '/images/logo.jpg',
        };
        return [...prev, itemToAdd];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((i) => i.productId !== productId && i.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        items: wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        refreshWishlist: () => {},
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
