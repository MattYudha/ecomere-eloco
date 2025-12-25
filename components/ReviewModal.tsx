'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import StarRatingInput from './StarRatingInput';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        title: string;
        image: string;
    };
    orderId: string;
    onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    product,
    orderId,
    onReviewSubmitted,
}) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Pilih rating minimal 1 bintang');
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await apiClient.post('/api/reviews', {
                productId: product.id,
                orderId: orderId,
                rating: rating,
                comment: comment.trim() || undefined,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal mengirim review');
            }

            toast.success('Terima kasih atas review Anda! 🌟');
            onReviewSubmitted();
            onClose();

            // Reset form
            setRating(5);
            setComment('');
        } catch (error: any) {
            console.error('Review error:', error);
            toast.error(error.message || 'Gagal mengirim review. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Beri Rating
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FaTimes className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl mb-6">
                                <div className="relative w-20 h-20 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={
                                            product.image?.startsWith('http')
                                                ? product.image
                                                : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`
                                        }
                                        alt={product.title}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                                        {product.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    Rating Produk
                                </label>
                                <div className="flex justify-center">
                                    <StarRatingInput
                                        rating={rating}
                                        onRatingChange={setRating}
                                    />
                                </div>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {rating === 5 && '🌟 Luar biasa!'}
                                    {rating === 4 && '👍 Bagus!'}
                                    {rating === 3 && '😊 Cukup baik'}
                                    {rating === 2 && '😐 Kurang'}
                                    {rating === 1 && '😞 Mengecewakan'}
                                </p>
                            </div>

                            {/* Review Text */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Review Anda (Opsional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-grilli-gold resize-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                                    {comment.length}/500
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || rating === 0}
                                    className={`
                                        flex-1 py-3 px-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                                        ${isSubmitting || rating === 0
                                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Kirim Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
