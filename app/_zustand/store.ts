import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string | null;
  amount: number;
};

export type WishlistedProduct = {
  id: string;
  slug: string;
  title: string;
  mainImage: string; // Ensure this is always a string for wishlisted products
  price: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
  wishlist: WishlistedProduct[];
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
  setWishlist: (products: WishlistedProduct[]) => void;
  addToWishlistLocal: (product: WishlistedProduct) => void;
  removeFromWishlistLocal: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      wishlist: [],
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );
          if (!cartItem) {
            return { products: [...state.products, newProduct] };
          } else {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount += newProduct.amount;
              }
            });
          }
          return { products: [...state.products] };
        });
      },
      clearCart: () => {
        set((state: any) => {
          
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          state.products = state.products.filter(
            (product: ProductInCart) => product.id !== id
          );
          return { products: state.products };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);

          if (!cartItem) {
            return { products: [...state.products] };
          } else {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount = amount;
              }
            });
          }

          return { products: [...state.products] };
        });
      },
      // Wishlist actions
      setWishlist: (products) => set({ wishlist: products }),
      addToWishlistLocal: (product) => {
        set((state) => ({
          wishlist: [...state.wishlist, product],
        }));
      },
      removeFromWishlistLocal: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((product) => product.id !== productId),
        }));
      },
      isProductInWishlist: (productId) => {
        return get().wishlist.some((product) => product.id === productId);
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "products-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
