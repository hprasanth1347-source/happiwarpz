'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  cartItemId: string; // Unique hash or id for product + variant combination
  productId: string;
  productName: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariantName?: string;
  glitterOption?: 'WITH_GLITTER' | 'WITHOUT_GLITTER' | null;
  customColor?: string;
  customMessage?: string;
  advanceNoticeText?: string;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (item: any, quantity?: number, variant?: string, customMessage?: string, specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  isDrawerOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartSubtotal: number;
  subtotal: number;
  totalPrice: number;
  cartCount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('happiwrapz_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('happiwrapz_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [cart, isInitialized]);

  const openDrawer = () => setIsCartOpen(true);
  const closeDrawer = () => setIsCartOpen(false);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    itemOrId: any,
    quantity = 1,
    variant?: string,
    customMessage?: string,
    specialInstructions?: string
  ) => {
    let newItem: Omit<CartItem, 'cartItemId'>;

    if (typeof itemOrId === 'object' && itemOrId !== null) {
      newItem = {
        productId: itemOrId.productId || itemOrId.id || `item_${Date.now()}`,
        productName: itemOrId.productName || itemOrId.name || 'Custom Product',
        slug: itemOrId.slug || 'product',
        image: itemOrId.image || '/images/logo.png',
        price: Number(itemOrId.price) || 0,
        quantity: Number(itemOrId.quantity) || quantity || 1,
        selectedVariantName: itemOrId.selectedVariantName || itemOrId.variant || variant,
        glitterOption: itemOrId.glitterOption || null,
        customColor: itemOrId.customColor || undefined,
        customMessage: itemOrId.customMessage || customMessage,
        advanceNoticeText: itemOrId.advanceNoticeText || itemOrId.specialInstructions || specialInstructions,
      };
    } else {
      newItem = {
        productId: String(itemOrId),
        productName: 'Custom Item',
        slug: 'custom-item',
        image: '/images/logo.jpg',
        price: 199,
        quantity: quantity || 1,
        selectedVariantName: variant,
        customMessage: customMessage,
        advanceNoticeText: specialInstructions,
      };
    }

    const itemHash = `${newItem.productId}_${newItem.selectedVariantName || ''}_${
      newItem.glitterOption || ''
    }_${newItem.customColor || ''}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.cartItemId === itemHash
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      } else {
        return [...prevCart, { ...newItem, cartItemId: itemHash }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId && item.productId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.cartItemId === cartItemId || item.productId === cartItemId) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        isDrawerOpen: isCartOpen,
        setIsCartOpen,
        openDrawer,
        closeDrawer,
        closeCart,
        toggleCart,
        cartSubtotal,
        subtotal: cartSubtotal,
        totalPrice: cartSubtotal,
        cartCount,
        totalItems: cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
