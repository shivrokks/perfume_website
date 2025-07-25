
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Perfume } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Perfume, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const oilCategories = ['Essential Oil', 'Flavored Oils', 'Fragrance Oil', 'Arabic Attar'];

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Perfume, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd } : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: quantityToAdd }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  const cartCount = cartItems.length; // Now represents number of unique items

  const totalPrice = cartItems.reduce((acc, item) => {
    if (oilCategories.includes(item.category)) {
      return acc + (item.price / 100) * item.quantity;
    }
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
