import { useState, useEffect, useCallback } from 'react';

interface WishlistItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  mainImage: string;
  description?: string;
}

interface UseWishlist {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  fetchWishlist: () => void;
  loading: boolean;
  error: string | null;
}

const WISHLIST_STORAGE_KEY = 'nextshop_wishlist';

export const useWishlist = (): UseWishlist => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window !== 'undefined') {
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
      }
    } catch (err) {
      console.error("Failed to load wishlist from localStorage", err);
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load wishlist from localStorage on initial mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
        return [...prevWishlist, item];
      }
      return prevWishlist;
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string): boolean => {
    return wishlist.some((item) => item.id === id);
  }, [wishlist]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    loading,
    error,
  };
};
