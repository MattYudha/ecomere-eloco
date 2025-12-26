'use client';

import {
    StockAvailabillity,
    UrgencyText,
    SingleProductDynamicFields,
    ProductDetailsStack,
} from '@/components';
import ProductHighlights from '@/components/ProductHighlights';
import RelatedProducts from '@/components/RelatedProducts';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import ProductImageLightbox from '@/components/ProductImageLightbox';
import apiClient from '@/lib/api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaSquarePinterest } from 'react-icons/fa6';
import { sanitize } from '@/lib/sanitize';
import { formatPrice } from '@/lib/utils';


interface ImageItem {
    imageID: string;
    productID: string;
    image: string;
}

interface SingleProductPageProps {
    params: { productSlug: string; id: string };
}

const SingleProductPage = ({ params }: SingleProductPageProps) => {
    const { productSlug, id } = params;
    const [product, setProduct] = useState<any>(null);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);

                // Fetch product
                const data = await apiClient.get(`/api/slugs/${productSlug}`, { cache: 'no-store' });
                const productData = await data.json();

                if (!productData || productData.error) {
                    notFound();
                    return;
                }

                setProduct(productData);
                setSelectedImage(productData?.mainImage || '');

                // Fetch images
                const imagesData = await apiClient.get(`/api/images/${id}`, { cache: 'no-store' });
                const imagesArray: ImageItem[] = (await imagesData.json()) || [];
                setImages(imagesArray);
            } catch (error) {
                console.error('Error fetching product:', error);
                notFound();
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productSlug, id]);

    // Helper function to create a consistent, root-relative image path
    const getImageUrl = (path: string | null | undefined) => {
        if (!path) {
            return '/product_placeholder.jpg';
        }
        if (path.startsWith('http')) return path;
        // Ensures a single leading slash for a consistent root-relative path
        return `/${path.replace(/^\//, '')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold"></div>
            </div>
        );
    }

    if (!product) {
        notFound();
        return null;
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Glass Container */}
                <div className="relative rounded-[2rem] backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

                    <div className="relative p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                            {/* Left Column - Product Images */}
                            <div className="space-y-6">
                                {/* Main Product Image - Floating Glass Card */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-[#cb6112]/20 via-transparent to-[#cb6112]/10 rounded-[1.75rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative rounded-3xl backdrop-blur-xl bg-white/25 dark:bg-white/10 border border-white/40 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 overflow-hidden">
                                        {/* Inner glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                                        <div className="relative aspect-square flex items-center justify-center overflow-hidden cursor-zoom-in"
                                            onClick={() => {
                                                setLightboxIndex(0);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={getImageUrl(selectedImage)}
                                                width={500}
                                                height={500}
                                                alt={sanitize(product?.title)}
                                                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Thumbnails - Floating Glass Tiles */}
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    {/* Main image thumbnail */}
                                    <div
                                        onClick={() => setSelectedImage(product?.mainImage)}
                                        className={`relative group cursor-pointer ${selectedImage === product?.mainImage ? 'ring-2 ring-[#cb6112]' : ''
                                            }`}
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-[#cb6112]/40 to-[#cb6112]/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                                        <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] p-2 transition-all duration-300 hover:scale-105 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                            <Image
                                                src={getImageUrl(product?.mainImage)}
                                                width={100}
                                                height={100}
                                                alt={sanitize(product?.title)}
                                                className="w-20 h-20 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Additional images */}
                                    {Array.isArray(images) && images.map((imageItem: ImageItem, key: number) => (
                                        <div
                                            key={imageItem.imageID + key}
                                            onClick={() => setSelectedImage(imageItem.image)}
                                            className={`relative group cursor-pointer ${selectedImage === imageItem.image ? 'ring-2 ring-[#cb6112]' : ''
                                                }`}
                                        >
                                            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#cb6112]/40 to-[#cb6112]/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                                            <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] p-2 transition-all duration-300 hover:scale-105 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                <Image
                                                    src={getImageUrl(imageItem.image)}
                                                    width={100}
                                                    height={100}
                                                    alt={sanitize(product?.title)}
                                                    className="w-20 h-20 object-contain"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div className="space-y-6">

                                {/* 1. Category Label */}
                                <div className="inline-flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Snack • Makanan Pedas
                                    </span>
                                </div>

                                {/* 2. Product Title */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#cb6112] via-[#e07d2e] to-[#cb6112] leading-tight tracking-tight">
                                        {sanitize(product?.title)}
                                    </h1>

                                    {/* 3. Price & Rating Summary */}
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Price Badge */}
                                            <div className="inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#cb6112]/15 via-[#cb6112]/10 to-transparent border border-[#cb6112]/30 shadow-[0_4px_24px_rgba(203,97,18,0.15)]">
                                                <span className="text-4xl font-bold text-[#cb6112]">
                                                    {formatPrice(product?.price)}
                                                </span>
                                            </div>

                                            {/* Rating Summary - Click to Scroll */}
                                            {product?.rating > 0 && (
                                                <button
                                                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                                    className="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                                    type="button"
                                                    aria-label="Lihat ulasan produk"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{Number(product.rating).toFixed(1)}</span>
                                                        <FaStar className="text-[#fbbf24] text-lg" />
                                                    </div>
                                                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 underline decoration-gray-400/50 group-hover:decoration-[#cb6112] underline-offset-2 transition-all">
                                                            {product.reviewCount || 0} Ulasan
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">Lihat semua</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>

                                        {/* 4. Price Microcopy */}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            Harga per porsi • Siap santap
                                        </p>
                                    </div>
                                </div>

                                {/* Short Description - Above the fold */}
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                                    {product?.description ?
                                        sanitize(product.description).substring(0, 200) + (product.description.length > 200 ? '...' : '')
                                        :
                                        'Produk berkualitas dengan bahan pilihan untuk kepuasan Anda.'
                                    }
                                </p>

                                {/* 6. Stock Status */}
                                <div className="inline-block">
                                    <StockAvailabillity stock={94} inStock={product?.inStock} />
                                </div>

                                {/* 7. Purchase Panel */}
                                <div className="rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/40 dark:border-white/20 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                                    <SingleProductDynamicFields product={product} />
                                </div>

                                {/* 8. Trust / Delivery Micro Info */}
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Dikemas rapi & higienis untuk kesegaran maksimal</span>
                                </div>

                                {/* 9. Divider */}
                                {/* 10. Product Highlights */}
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <ProductHighlights highlights={[
                                        "Tanpa Pengawet",
                                        "Pedas Gurih",
                                        "Kemasan Aman",
                                        "Halal Bersertifikat"
                                    ]} />
                                </div>

                                {/* 11. Urgency Text */}
                                <UrgencyText stock={product?.inStock} />

                                {/* 12. Product Meta */}
                                <div className="space-y-4">
                                    {/* SKU */}
                                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">SKU:</span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">abccd-18</span>
                                    </div>

                                    {/* Social Share - Glass Strip */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Share:</span>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                                                <FaSquareFacebook className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                                            </div>
                                            <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                                                <FaSquareXTwitter className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                                            </div>
                                            <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                                                <FaSquarePinterest className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods - Premium Glass Strip */}
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cb6112]/20 via-transparent to-[#cb6112]/20 rounded-2xl blur opacity-50" />
                                        <div className="relative flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/25 via-white/15 to-white/10 dark:from-white/15 dark:via-white/10 dark:to-white/5 border border-white/40 dark:border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
                                            {/* Embossed light effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                                            <div className="relative flex items-center gap-3 flex-wrap">
                                                {['bca', 'bri', 'dana', 'gopay', 'mandiri'].map((payment) => (
                                                    <div
                                                        key={payment}
                                                        className="p-2 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-white/15 border border-white/40 dark:border-white/25 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform duration-300"
                                                    >
                                                        <Image
                                                            src={`/uploads/${payment}.svg`}
                                                            width={50}
                                                            height={32}
                                                            alt={`${payment.toUpperCase()} icon`}
                                                            className="h-7 w-auto opacity-90"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Stack Section */}
                <div className="mt-12">
                    <ProductDetailsStack product={product} />
                </div>

                {/* Related Products Section */}
                <div className="mt-16">
                    <RelatedProducts
                        productId={product.id}
                        categoryId={product.categoryId}
                        categoryName={product.category?.name}
                    />
                </div>

                {/* Product Image Lightbox */}
                <ProductImageLightbox
                    images={[
                        getImageUrl(product?.mainImage),
                        ...images.map(img => getImageUrl(img.image))
                    ]}
                    open={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                />
            </div>
        </div>
    );
};

export default SingleProductPage;