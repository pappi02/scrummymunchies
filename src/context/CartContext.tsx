"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    unitPriceOverride?: number,
    selectedVariantName?: string,
    note?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    unitPriceOverride?: number,
    selectedVariantName?: string,
    note?: string
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [
        ...prevCart,
        {
          item,
          quantity,
          bogoApplied: false,
          unitPrice: unitPriceOverride ?? item.price,
          selectedVariantName,
          note,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
