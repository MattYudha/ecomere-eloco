import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  mainImage: string | null;
  price: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
  wishlist: WishlistedProduct[];
  selectedItems: string[]; // IDs of selected items for checkout
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  buyNow: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
  setWishlist: (products: WishlistedProduct[]) => void;
  addToWishlistLocal: (product: WishlistedProduct) => void;
  removeFromWishlistLocal: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setSelectedItems: (ids: string[]) => void;
  toggleSelectItem: (id: string) => void;
  selectAllItems: () => void;
  clearSelectedItems: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      wishlist: [],
      selectedItems: [],
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id,
          );
          let updatedProducts;
          if (!cartItem) {
            updatedProducts = [...state.products, newProduct];
          } else {
            updatedProducts = state.products.map((product) => {
              if (product.id === cartItem.id) {
                return { ...product, amount: product.amount + newProduct.amount };
              }
              return product;
            });
          }

          let amount = 0;
          let total = 0;
          updatedProducts.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return { products: updatedProducts, allQuantity: amount, total: total };
        });
      },
      buyNow: (newProduct) => {
        set((state) => {
          return {
            products: [newProduct],
            allQuantity: newProduct.amount,
            total: newProduct.amount * newProduct.price
          };
        });
      },
      clearCart: () => {
        set((state: any) => {
          return {
            products: [],
            allQuantity: 0,
            total: 0,
            selectedItems: [], // Also clear selected items
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          const updatedProducts = state.products.filter(
            (product: ProductInCart) => product.id !== id,
          );

          let amount = 0;
          let total = 0;
          updatedProducts.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          return { products: updatedProducts, allQuantity: amount, total: total };
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
          const updatedProducts = state.products.map((product) => {
            if (product.id === id) {
              return { ...product, amount: amount };
            }
            return product;
          });

          let allQuantity = 0;
          let total = 0;
          updatedProducts.forEach((item) => {
            allQuantity += item.amount;
            total += item.amount * item.price;
          });

          return { products: updatedProducts, allQuantity: allQuantity, total: total };
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
          wishlist: state.wishlist.filter(
            (product) => product.id !== productId,
          ),
        }));
      },
      isProductInWishlist: (productId) => {
        return get().wishlist.some((product) => product.id === productId);
      },
      clearWishlist: () => set({ wishlist: [] }),
      // Selected items actions
      setSelectedItems: (ids) => set({ selectedItems: ids }),
      toggleSelectItem: (id) => {
        set((state) => {
          const isSelected = state.selectedItems.includes(id);
          if (isSelected) {
            return {
              selectedItems: state.selectedItems.filter((itemId) => itemId !== id),
            };
          } else {
            return {
              selectedItems: [...state.selectedItems, id],
            };
          }
        });
      },
      selectAllItems: () => {
        set((state) => ({
          selectedItems: state.products.map((p) => p.id),
        }));
      },
      clearSelectedItems: () => set({ selectedItems: [] }),
    }),
    {
      name: 'products-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
