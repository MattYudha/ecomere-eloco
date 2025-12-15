'use client';

import { useWishlistStore } from '@/app/_zustand/wishlistStore';
import ProductItem, { Product } from '@/components/ProductItem';
import apiClient from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';

export const WishlistModule = () => {
  const { status } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlist = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/wishlist', {
        cache: 'no-store',
      });

      const data = await response.json();

      /**
       * Mapping EXPLISIT ke tipe Product
       * ⛔ TIDAK pakai "as Product"
       * ⛔ TIDAK pakai unknown
       */
      const products: Product[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        mainImage: item.mainImage, // WAJIB ADA
        slug: item.slug,
        stockAvailabillity: item.stockAvailabillity ?? 0,
      }));

      setWishlist(products);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, [setWishlist]);

  useEffect(() => {
    if (status === 'authenticated') {
      getWishlist();
    }
  }, [status, getWishlist]);

  if (status === 'loading') {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
        No items found in the wishlist
      </h3>
    );
  }

  return (
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
            {wishlist.map((product) => (
              <ProductItem
                key={product.id}   // ✅ STABLE KEY
                product={product}  // ✅ SUDAH Product
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
