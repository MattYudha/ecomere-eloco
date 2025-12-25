// *********************
// Role of the component: Display related products from same category
// Name of the component: RelatedProducts.tsx
// Developer: Eloco E-commerce Team
// Version: 2.0 - Mobile-First with Horizontal Scroll
// Component call: <RelatedProducts productId={id} categoryId={catId} categoryName={name} />
// Input parameters: RelatedProductsProps interface
// Output: Grid on desktop, horizontal scroll on mobile
// *********************

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import apiClient from '@/lib/api';

interface RelatedProduct {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    reviewCount: number;
}

interface RelatedProductsProps {
    productId: string;
    categoryId: string;
    categoryName?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
    productId,
    categoryId,
    categoryName
}) => {
    const [products, setProducts] = useState<RelatedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(
                    `/api/products/related?categoryId=${categoryId}&exclude=${productId}&limit=4`
                );
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching related products:', error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (categoryId) {
            fetchRelated();
        }
    }, [categoryId, productId]);

    // Guard: Don't render if less than 2 products
    if (!isLoading && products.length < 2) return null;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Section Header */}
            <div className="space-y-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    Produk Terkait
                </h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {categoryName ? `${categoryName} serupa yang mungkin Anda suka` : 'Produk serupa yang mungkin Anda suka'}
                </p>
            </div>

            {/* Products Grid/Scroll */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl mb-3" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Desktop: Grid */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} size="large" />
                        ))}
                    </div>

                    {/* Mobile: Horizontal Scroll */}
                    <div className="md:hidden">
                        <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                            <div className="flex gap-4 pb-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} size="small" />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Hide scrollbar CSS */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

// Product Card Component
const ProductCard: React.FC<{ product: RelatedProduct; size: 'small' | 'large' }> = ({ product, size }) => {
    const isSmall = size === 'small';

    return (
        <Link
            href={`/product/${product.slug}`}
            className={`group cursor-pointer ${isSmall ? 'flex-shrink-0 w-[160px] snap-start' : ''}`}
        >
            <div className={`relative rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 ${isSmall ? 'p-3' : 'p-4'} hover:border-[#cb6112]/50 transition-all duration-300`}>
                {/* Hover glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#cb6112]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />

                {/* Image */}
                <div className={`relative aspect-square ${isSmall ? 'mb-2' : 'mb-3'} overflow-hidden rounded-xl`}>
                    <Image
                        src={product.mainImage || '/product_placeholder.jpg'}
                        fill
                        alt={product.title}
                        className={`object-contain ${!isSmall && 'transition-transform duration-300 group-hover:scale-105'}`}
                    />
                </div>

                {/* Title */}
                <h3 className={`font-semibold ${isSmall ? 'text-xs mb-1' : 'text-sm mb-2'} line-clamp-2 text-gray-900 dark:text-white ${!isSmall && 'group-hover:text-[#cb6112] transition-colors'}`}>
                    {product.title}
                </h3>

                {/* Rating */}
                {product.reviewCount > 0 && (
                    <div className={`flex items-center gap-1 ${isSmall ? 'mb-1' : 'mb-2'}`}>
                        <span className={`text-yellow-500 ${isSmall ? 'text-xs' : ''}`}>⭐</span>
                        <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>
                            {product.rating.toFixed(1)}
                        </span>
                        {!isSmall && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({product.reviewCount})
                            </span>
                        )}
                    </div>
                )}

                {/* Price */}
                <p className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-[#cb6112]`}>
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
};

export default RelatedProducts;
