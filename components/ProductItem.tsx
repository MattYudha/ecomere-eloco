'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sanitize } from '@/lib/sanitize';
import { useProductStore, WishlistedProduct } from '../app/_zustand/store';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils'; // Added import

export type Product = {
  id: string;
  slug: string;
  mainImage: string | null;
  title: string;
  price: number;
  description?: string | null;
};

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  const imageUrl = product.mainImage
    ? (product.mainImage.startsWith('http') ? product.mainImage : `/${product.mainImage.replace(/^\//, '')}`)
    : '/product_placeholder.jpg';
  const { data: session } = useAuth();
  const router = useRouter();
  const { addToCart, addToWishlistLocal, removeFromWishlistLocal, isProductInWishlist } =
    useProductStore();

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (!session?.user) {
      toast.error('You must be logged in to manage your wishlist.');
      router.push('/login');
      return;
    }
    const wishlistedProduct: WishlistedProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      mainImage: product.mainImage || '',
      price: product.price,
    };
    if (isProductInWishlist(product.id)) {
      try {
        await apiClient.delete(`/api/wishlist/${product.id}`);
        removeFromWishlistLocal(product.id);
        toast.success('Removed from wishlist!');
      } catch (error) {
        toast.error('Failed to remove from wishlist.');
      }
    } else {
      try {
        await apiClient.post('/api/wishlist', { productId: product.id });
        addToWishlistLocal(wishlistedProduct);
        toast.success('Added to wishlist!');
      } catch (error) {
        toast.error('Failed to add to wishlist.');
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage || '/product_placeholder.jpg',
        amount: 1,
      },
    );
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div
      className="group relative w-full rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden shadow-xl 
                     bg-white/60 dark:bg-dark-bg/60 
                     backdrop-blur-lg 
                     border border-gray-300 dark:border-brand/20"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {/* Image Container */}
          <div className="relative w-full h-56 bg-white/30 dark:bg-black/10">
            <Image
              src={imageUrl}
              alt={sanitize(product?.title) || 'Product image'}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 min-h-[3.5rem] transition-colors group-hover:text-brand">
              {sanitize(product.title)}
            </h3>
            <div className="flex items-end justify-between pt-2 border-t border-brand/20">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Price
                </span>
                <span className="text-2xl font-extrabold text-brand">
                  {formatPrice(product.price)}
                </span>
              </div>
              <motion.button
                onClick={handleAddToCart}
                className="shine-effect relative overflow-hidden px-5 h-[44px] text-sm font-semibold shadow-md bg-brand text-white rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={16} />
                Add
              </motion.button>
            </div>
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/60 dark:bg-dark-bg/60 backdrop-blur-md text-red-500 transition-colors z-10"
            aria-label="Toggle wishlist"
            whileHover={{ scale: 1.2 }}
          >
            <Heart
              size={20}
              fill={isProductInWishlist(product.id) ? 'currentColor' : 'none'}
            />
          </motion.button>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
