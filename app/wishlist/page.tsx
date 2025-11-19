"use client";
import { SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../_zustand/store";

interface WishlistedProduct {
  id: string;
  slug: string;
  title: string;
  mainImage: string;
  price: number;
  // Add other product fields you want to display
}

const WishlistPage = () => {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<WishlistedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useProductStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === "loading") return; // Wait for session to load
      if (!session) {
        setLoading(false);
        return; // No session, no wishlist to fetch
      }

      try {
        setLoading(true);
        const response = await apiClient.get("/api/wishlist");
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        const data: WishlistedProduct[] = await response.json();
        setWishlist(data);
      } catch (error) {
        console.error("[FETCH_WISHLIST_ERROR]", error);
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session, status]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!session) {
      toast.error("You must be logged in to remove items from your wishlist.");
      return;
    }

    try {
      const response = await apiClient.delete(`/api/wishlist/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.id !== productId)
      );
      toast.success("Item removed from wishlist!");
    } catch (error) {
      console.error("[REMOVE_FROM_WISHLIST_ERROR]", error);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  const handleAddToCart = (product: WishlistedProduct) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
      amount: 1, // Default quantity
    });
    toast.success(`${product.title} added to cart!`);
    handleRemoveFromWishlist(product.id); // Optionally remove from wishlist after adding to cart
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <SectionTitle title="My Wishlist" path="Home | Wishlist" />
        <div className="flex justify-center items-center h-64">
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <SectionTitle title="My Wishlist" path="Home | Wishlist" />
        <div className="container mx-auto p-4 text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your wishlist.</p>
          <Link href="/login" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
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

        {wishlist.length === 0 ? (
          <div className="text-center p-10 border rounded-lg bg-white dark:bg-gray-800">
            <p className="text-xl text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
            <p className="mt-2 text-gray-500">Start adding your favorite products!</p>
            <Link href="/" className="mt-5 inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
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
                    src={product.mainImage ? `/${product.mainImage.replace(/^\//, '')}` : "/product_placeholder.jpg"}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover object-center transform transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    <Link href={`/product/${product.slug}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {product.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
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