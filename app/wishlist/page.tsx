'use client';

import React, { useEffect } from 'react';
import { SectionTitle, CustomButton } from '@/components';
import { useWishlist } from '@/hooks/useWishlist';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeartBroken, FaSpinner } from 'react-icons/fa';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { sanitize } from '@/lib/sanitize';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading, error, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Product removed from wishlist!');
  };

  const handleAddToCartFromWishlist = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id); // Optionally remove from wishlist after adding to cart
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden">
      <SectionTitle title="Your Wishlist" path="Home | Wishlist" />

      <div className="relative z-10 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 px-6 py-10 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20 dark:border-gray-700/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-gray-700/50 to-transparent pointer-events-none rounded-3xl"></div>

          <div className="relative z-10">
            {loading && (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400 flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Loading wishlist...
              </div>
            )}

            {error && (
              <div className="p-6 text-center text-red-600 dark:text-red-400">
                Error: {error}
              </div>
            )}

            {!loading && !error && wishlist.length === 0 && (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                <FaHeartBroken className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-xl font-medium">Your wishlist is empty!</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Start adding products you love.
                </p>
                <Link href="/" className="mt-6 inline-block">
                  <CustomButton>Continue Shopping</CustomButton>
                </Link>
              </div>
            )}

            {!loading && !error && wishlist.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white/80 dark:bg-gray-700/80 rounded-xl shadow-lg overflow-hidden border border-white/30 dark:border-gray-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <Link href={`/product/${item.slug}`} className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.mainImage ? `/${item.mainImage}` : '/product_placeholder.jpg'}
                        alt={sanitize(item.title) || 'Product image'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                    <div className="p-4 flex-grow flex flex-col">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                          {sanitize(item.title)}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {item.description?.substring(0, 100) + '...' || 'No description available.'}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${item.price}
                        </span>
                        <div className="flex gap-2">
                          <CustomButton
                            onClick={() => handleAddToCartFromWishlist(item)}
                            className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                          >
                            Add to Cart
                          </CustomButton>
                          <CustomButton
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full"
                          >
                            Remove
                          </CustomButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
