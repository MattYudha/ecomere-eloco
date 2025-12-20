'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sanitize } from '@/lib/sanitize';
import { useProductStore } from '../app/_zustand/store';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

import { formatPrice } from '@/lib/utils';

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
  const router = useRouter();
  const { addToCart } = useProductStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage || '/product_placeholder.jpg',
      amount: 1,
    });
    toast.success(`${product.title} added to cart!`);
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
          className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300"
          whileHover={{ y: -8 }}
        >
          {/* Image Container */}
          <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-700/50 overflow-hidden">
            <Image
              src={imageUrl}
              alt={sanitize(product?.title) || 'Product image'}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            />

            {/* Quick Action Overlay (Optional) */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#cb6112] transition-colors">
                {sanitize(product.title)}
              </h3>
              <p className="text-lg font-bold text-[#cb6112]">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1 h-8 px-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-[10px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ShoppingCart size={12} />
                Add
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/product/${product.slug}`);
                }}
                className="flex items-center justify-center h-8 px-2 rounded-lg bg-[#cb6112] text-white font-medium text-[10px] hover:bg-[#b0520e] transition-colors shadow-lg shadow-orange-500/20"
              >
                Buy Now
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
