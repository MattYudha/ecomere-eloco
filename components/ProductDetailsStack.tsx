// *********************
// Role of the component: Single product details stacked vertically (Specs -> Description -> Reviews)
// Name of the component: ProductDetailsStack.tsx
// *********************

'use client';

import React, { useState } from 'react';
import { formatCategoryName } from '@/utils/categoryFormating';
import { sanitize, sanitizeHtml } from '@/lib/sanitize';
import ReviewList from './ReviewList';
import { useReviewStore } from '@/app/_zustand/reviewStore';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import Link from 'next/link';
import StarRatingInput from './StarRatingInput';

const ProductDetailsStack = ({ product }: { product: Product }) => {
    // Review Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { createReview, isLoading } = useReviewStore();
    const { data: session } = useAuth();

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return toast.error('Please select a rating');
        const success = await createReview(product.id, rating, comment);
        if (success) {
            toast.success('Review submitted!');
            setRating(0);
            setComment('');
        }
    };

    return (
        <div className="w-full space-y-12">

            {/* 1. Additional Information (Specifications) */}
            <section className="bg-white shadow-sm rounded-2xl dark:bg-gray-900/50 dark:border dark:border-gray-700/50 p-6 md:p-8">
                <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                    Spesifikasi Produk
                </h3>

                <div className="space-y-4">
                    {/* Manufacturer Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[150px]">
                            Manufacturer
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium mt-1 sm:mt-0">
                            {sanitize(product?.manufacturer)}
                        </span>
                    </div>

                    {/* Category Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[150px]">
                            Category
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium mt-1 sm:mt-0">
                            {product?.category?.name
                                ? sanitize(formatCategoryName(product?.category?.name))
                                : 'No category'}
                        </span>
                    </div>

                    {/* Color Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[150px]">
                            Color
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium mt-1 sm:mt-0">
                            Silver, LightSlateGray, Blue
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. Description */}
            <section className="bg-white shadow-sm rounded-2xl dark:bg-gray-900/50 dark:border dark:border-gray-700/50 p-6 md:p-8">
                <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                    Deskripsi Produk
                </h3>

                <div
                    className="prose prose-slate max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300 dark:prose-invert"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product?.description),
                    }}
                />
            </section>

            {/* 3. Reviews */}
            <section id="reviews" className="scroll-mt-24 bg-white shadow-sm rounded-2xl dark:bg-gray-900/50 dark:border dark:border-gray-700/50 p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-10">
                    <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                            Penilaian Produk
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            Ulasan dari pelanggan yang telah membeli produk ini.
                        </p>
                    </div>

                    {/* Rating Summary Badge */}
                    {product.rating > 0 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 px-6 py-4 rounded-2xl flex items-center gap-4 border border-orange-100 dark:border-orange-800/30">
                            <div className="text-center">
                                <span className="text-4xl font-bold text-[#cb6112] block leading-none mb-1">
                                    {product.rating ? Number(product.rating).toFixed(1) : '0.0'}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">dari 5</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex text-[#fbbf24] text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <StarRatingInput key={i} rating={product.rating} onRatingChange={() => { }} disabled />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{product.reviewCount || 0} ulasan</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Write Review Section */}
                <div className="mb-12 p-6 bg-gray-50/80 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    {!session?.user ? (
                        <div className="text-center py-6">
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                Silakan <Link href="/login" className="text-[#cb6112] font-semibold underline hover:text-orange-700">login</Link> untuk memberikan ulasan.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-3 text-lg">
                                Tulis Ulasan
                                <span className="text-[10px] font-medium text-[#cb6112] bg-[#cb6112]/10 px-2.5 py-1 rounded-full border border-[#cb6112]/20 uppercase tracking-widest">Verified Only</span>
                            </h4>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Rating Kualitas</label>
                                <StarRatingInput rating={rating} onRatingChange={setRating} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Ulasan Anda</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-900 text-base p-4 focus:ring-2 focus:ring-[#cb6112] focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 min-h-[120px]"
                                    placeholder="Bagaimana kualitas produk ini? Apakah sesuai ekspektasi?"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-[#cb6112] text-white rounded-xl font-bold text-sm hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <ReviewList productId={product.id} />
            </section>
        </div>
    );
};

export default ProductDetailsStack;
