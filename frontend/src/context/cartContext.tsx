'use client';

import React, { createContext, useContext, useState } from 'react';

// Context for cart so it can be used across the app
export interface CartItem {
  itemID: string;
  itemName: string;
  itemType: string;
  cost: number;
  recipesId?: string[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemID: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isItemInCart: (itemID: string) => boolean;
}

// Tax rate as a decimal (7%)
const TAX_RATE = 0.07;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const isItemInCart = (itemID: string) => {
    return cartItems.some((item) => item.itemID === itemID);
  };

  const addToCart = (item: CartItem) => {
    if (isItemInCart(item.itemID)) {
      return false;
    }

    // Add new item to cart
    setCartItems((prevItems) => [...prevItems, item]);
    return true;
  };

  const removeFromCart = (itemID: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.itemID !== itemID)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.cost, 0);
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return subtotal * TAX_RATE;
  };

  const getCartTotal = () => {
    const subtotal = getSubtotal();
    const tax = getTaxAmount();
    return subtotal + tax;
  };

  const getCartItemCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTaxAmount,
        getCartTotal,
        getCartItemCount,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
