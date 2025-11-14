"use client";

import Image from 'next/image';
import Link from 'next/link';
import { sanitize } from '@/lib/sanitize';
import CustomButton from './CustomButton';
import { useCart } from '@/hooks/useCart'; // Import useCart
import toast from 'react-hot-toast'; // Import toast
import { useSession } from 'next-auth/react'; // Import useSession
import { useRouter } from 'next/navigation'; // Import useRouter

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
  color: string;
};

const ProductItem = ({ product, color }: ProductItemProps) => {
  // Create a consistent, root-relative image path
  const imageUrl = product.mainImage
    ? `/${product.mainImage.replace(/^\//, '')}` // Ensures a single leading slash
    : '/product_placeholder.jpg';

  const { addToCart } = useCart(); // Initialize useCart
  const { data: session } = useSession(); // Get session
  const router = useRouter(); // Get router

  const handleBuyClick = () => {
    if (!session?.user) {
      toast.error("Anda harus login terlebih dahulu.");
      router.push('/login');
      return;
    }
    // If logged in, navigate to the product detail page (assuming "page selanjutnya" means this)
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="group relative w-full bg-white/10 dark:bg-gray-800/10 rounded-3xl overflow-hidden border border-white/20 dark:border-gray-700/20 hover:border-grilli-gold backdrop-blur-md shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-gray-50/10 to-gray-100/10 dark:from-gray-700/10 dark:to-gray-900/10 p-8 flex items-center justify-center h-48">
        <Link
          href={`/product/${product.slug}`}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Image
            src={imageUrl}
            alt={sanitize(product?.title) || 'Product image'}
            width={160}
            height={160}
            className="object-contain max-h-full w-auto group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white line-clamp-2 min-h-[3.5rem] group-hover:text-grilli-gold transition-colors duration-200">
            {sanitize(product.title)}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-300 line-clamp-2 min-h-[2.5rem]">
            {product.description.substring(0, 80) + '...'}
          </p>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-gray-700/20">
          <div className="flex flex-col">
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Price</span>
            <span className="text-2xl font-bold text-grilli-gold">
              ${product.price}
            </span>
          </div>

          <div className="flex gap-2"> {/* Added a div to group buttons */}
            <CustomButton
              onClick={handleBuyClick}
              className="px-4 h-[42px] text-sm font-semibold shadow-md bg-grilli-gold text-black hover:bg-grilli-gold/80 transition-colors duration-200 rounded-full"
            >
              Buy
            </CustomButton>
            <Link href={`/product/${product.slug}`}>
              <CustomButton
                className="px-4 h-[42px] text-sm font-semibold shadow-md bg-transparent border border-grilli-gold text-grilli-gold hover:bg-grilli-gold hover:text-black transition-colors duration-200 rounded-full"
              >
                View
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
