import { create } from 'zustand';
import { Product } from '@/components/ProductItem';

type State = {
  wishlist: Product[];
  wishQuantity: number;
};

type Actions = {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: Product[]) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,

  addToWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);

      if (exists) {
        return state;
      }

      const newWishlist = [...state.wishlist, product];
      return {
        wishlist: newWishlist,
        wishQuantity: newWishlist.length,
      };
    }),

  removeFromWishlist: (id) =>
    set((state) => {
      const newWishlist = state.wishlist.filter((item) => item.id !== id);
      return {
        wishlist: newWishlist,
        wishQuantity: newWishlist.length,
      };
    }),

  setWishlist: (wishlist) => ({
    wishlist,
    wishQuantity: wishlist.length,
  }),
}));
