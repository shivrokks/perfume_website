
"use client";

import { useContext } from 'react';
import { CartContext } from '@/context/cart-provider';

// This custom hook makes it easy to access the cart context
// in any client component.
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
