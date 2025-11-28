'use client';
import { useWishlistStore } from '@/app/_zustand/wishlistStore';
import ProductItem, { Product } from '@/components/ProductItem';
import apiClient from '@/lib/api';
import { nanoid } from 'nanoid';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';

export const WishlistModule = () => {
  const { data: session, status } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlist = useCallback(async () => {
    try {
      // PERBAIKAN 1: Panggil langsung ke /api/wishlist
      // Backend akan otomatis tahu siapa user yang login via Session
      const response = await apiClient.get(`/api/wishlist`, {
        cache: 'no-store',
      });
      
      const data = await response.json();

      // PERBAIKAN 2: Mapping data disesuaikan dengan response backend
      // Backend Anda mengirim array produk langsung: [{ id: '...', title: '...' }]
      // Bukan nested object: [{ product: { ... } }]
      const productArray = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        mainImage: item.mainImage, // Backend mengirim 'mainImage', store mengharapkan 'mainImage'
        slug: item.slug,
        stockAvailabillity: item.stockAvailabillity || 0, // Handle jika undefined
      }));

      setWishlist(productArray);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [setWishlist]);

  // PERBAIKAN 3: Hapus getUserByEmail. Cukup trigger saat status 'authenticated'
  useEffect(() => {
    if (status === 'authenticated') {
      getWishlist();
    }
  }, [status, getWishlist]);

  if (status === 'loading') {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist &&
                  wishlist.map((item) => (
                    <ProductItem product={item as Product} key={nanoid()} />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};