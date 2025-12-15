'use client';
import { SectionTitle } from '@/components';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProductStore } from '../_zustand/store';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const WishlistPage = () => {
  const { data: session } = useSession();
  const { wishlist, addToCart, setWishlist } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of which images failed to load
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setFailedImages((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use local fetch to hit Next.js API route (localhost:3000) which handles session
        const response = await fetch('/api/wishlist');
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        const data = await response.json();
        // API returns array of products directly, no need to map item.product
        const extractedProducts = data;
        setWishlist(extractedProducts);
        setError(null);
      } catch (err: any) {
        console.error('[FETCH_WISHLIST_ERROR]', err);
        setError('Failed to load your wishlist. Please try again later.');
        toast.error('Could not load your wishlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session, setWishlist]);


  const handleRemoveFromWishlist = async (productId: string) => {
    if (!session) {
      toast.error('You must be logged in to remove items from your wishlist.');
      return;
    }

    // Optimistic UI Update: Hapus dulu dari layar biar cepat
    const previousWishlist = [...wishlist];
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(newWishlist);

    try {
      const response = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }
      toast.success('Item removed from wishlist!');
    } catch (error) {
      console.error('[REMOVE_FROM_WISHLIST_ERROR]', error);
      toast.error('Failed to remove item from wishlist.');
      // Kembalikan data jika gagal
      setWishlist(previousWishlist);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
      amount: 1,
    });
    toast.success(`${product.title} added to cart!`);
    handleRemoveFromWishlist(product.id);
  };

  if (!session && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <SectionTitle title="My Wishlist" path="Home | Wishlist" />
        <div className="container mx-auto p-4 text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your wishlist.</p>
          <Link
            href="/login"
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <SectionTitle title="My Wishlist" path="Home | Wishlist" />
      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : wishlist && wishlist.length === 0 ? (
          <div className="text-center p-10 border rounded-lg bg-white dark:bg-gray-800">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your wishlist is empty.
            </p>
            <p className="mt-2 text-gray-500">
              Start adding your favorite products!
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors z-10"
                  aria-label="Remove from wishlist"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
                <Link href={`/product/${product.slug}`} className="block">
                  <Image
                    src={
                      failedImages[product.id]
                        ? '/product_placeholder.jpg'
                        : product.mainImage && product.mainImage.startsWith('http')
                          ? product.mainImage
                          : product.mainImage
                            ? `/${product.mainImage.replace(/^\//, '')}`
                            : '/product_placeholder.jpg'
                    }
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover object-center transform transition-transform duration-300 hover:scale-105"
                    onError={() => handleImageError(product.id)}
                  />
                </Link>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xl font-bold mb-4">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;