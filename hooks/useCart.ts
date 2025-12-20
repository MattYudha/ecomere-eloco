import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item, quantityToAdd = 1) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex((i) => i.id === item.id);
          if (existingItemIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantityToAdd,
            };
            return { cart: updatedCart };
          }
          return { cart: [...state.cart, { ...item, quantity: quantityToAdd }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== id) };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'nextshop_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
