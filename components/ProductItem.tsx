'use client';

import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sanitize } from '@/lib/sanitize';
import { useProductStore } from '../app/_zustand/store';
import { showCartToast, showErrorToast } from '@/lib/toast-config';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import LoadingButton from './LoadingButton';
import { useState } from 'react';

import { formatPrice } from '@/lib/utils';

export type Product = {
  id: string;
  slug: string;
  mainImage: string | null;
  title: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  description?: string | null;
  inStock?: number | boolean;
};

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  const imageUrl = product.mainImage
    ? (product.mainImage.startsWith('http') ? product.mainImage : `/${product.mainImage.replace(/^\//, '')}`)
    : '/product_placeholder.jpg';
  const router = useRouter();
  const { addToCart } = useProductStore();
  const { data: session } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation

    // Check if user is logged in
    if (!session) {
      showErrorToast('Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    setIsAdding(true);

    try {
      // Optimistic update - immediately add to cart
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage || '/product_placeholder.jpg',
        amount: 1,
      });

      // Simulate API delay for demo (in real app, this would be actual API call)
      await new Promise(resolve => setTimeout(resolve, 500));

      showCartToast(`${product.title} added to cart!`, 'add');
    } catch (error) {
      showErrorToast('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className="group relative w-full h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <motion.div
          className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
          whileHover={{ y: -12, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Image Container */}
          <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-700/50 overflow-hidden">
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <OptimizedImage
                src={imageUrl}
                alt={sanitize(product?.title) || 'Product image'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-4"
              />
            </motion.div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-grilli-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Quick Action Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Out of Stock Overlay - Elegant & Modern */}
            {product.inStock !== 1 && (
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all duration-300">
                <div className="px-5 py-2 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[10px] tracking-[0.2em] font-bold uppercase rounded-full shadow-2xl transform hover:scale-105 transition-transform border border-white/20 dark:border-black/10 backdrop-blur-md">
                  Sold Out
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#cb6112] transition-colors">
                {sanitize(product.title)}
              </h3>

              {/* Rating Star */}
              <div className="flex items-center gap-1">
                <div className="flex text-[#fbbf24] text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(product.rating || 0) ? "fill-current" : "text-gray-200 dark:text-gray-600"} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">({product.reviewCount || 0})</span>
              </div>

              <p className="text-lg font-bold text-[#cb6112]">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              {product.inStock === 1 ? (
                <>
                  <LoadingButton
                    loading={isAdding}
                    onClick={handleAddToCart}
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center gap-1"
                  >
                    <ShoppingCart size={12} />
                    <span className="text-[10px]">Add</span>
                  </LoadingButton>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/product/${product.slug}`);
                    }}
                    className="flex items-center justify-center h-8 px-2 rounded-lg bg-[#cb6112] text-white font-medium text-[10px] hover:bg-[#b0520e] transition-colors shadow-lg shadow-orange-500/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy Now
                  </motion.button>
                </>
              ) : (
                <button
                  disabled
                  className="col-span-2 flex items-center justify-center h-8 px-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-medium text-[10px] uppercase tracking-wider cursor-not-allowed border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;