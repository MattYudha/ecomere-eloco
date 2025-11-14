import { useState, useEffect, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface UseCart {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'nextshop_cart';

export const useCart = (): UseCart => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantityToAdd = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantityToAdd,
        };
        return updatedCart;
      } else {
        // Item not in cart, add new item
        return [...prevCart, { ...item, quantity: quantityToAdd }];
      }
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== id);
      }
      return prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
