'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { sanitize } from '@/lib/sanitize';
import { useReviewStore } from '@/app/_zustand/reviewStore';
import StarRatingInput from './StarRatingInput';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';

interface ReviewOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    onReviewSuccess?: () => void;
}

interface OrderProduct {
    id: string; // This is the order-product ID
    productId: string;
    quantity: number;
    product: {
        id: string;
        title: string;
        mainImage: string;
        price: number;
        slug: string;
    };
}

const ReviewOrderModal: React.FC<ReviewOrderModalProps> = ({ isOpen, onClose, orderId, onReviewSuccess }) => {
    const [products, setProducts] = useState<OrderProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeProductId, setActiveProductId] = useState<string | null>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewImages, setReviewImages] = useState<File[]>([]);
    const { createReview, isLoading: isSubmitting } = useReviewStore();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Limit to 3 images total
            setReviewImages((prev) => [...prev, ...newFiles].slice(0, 3));
        }
    };

    const removeImage = (index: number) => {
        setReviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                // Assuming endpoint to get order with products
                const res = await apiClient.get(`/api/orders/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                } else {
                    toast.error('Failed to load order details');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching order');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProductId) return;
        if (rating === 0) return toast.error('Please select a rating');

        const success = await createReview(activeProductId, rating, comment, orderId, reviewImages);

        if (success) {
            toast.success('Review published successfully!');
            setRating(0);
            setComment('');
            setActiveProductId(null); // Close form
            // Optionally remove product from list if we want to show only unreviewed
            if (onReviewSuccess) {
                onReviewSuccess();
            }
        } else {
            // Error is already set in store, but we can toast it here too if we want immediate feedback
            // The store sets 'error' state, let's grab it or just use a generic message if we don't have access to the specific error string easily here without subscribing
            // But waitFor... createReview returns boolean. 
            // We can assume useReviewStore holds the error now.
            const currentError = useReviewStore.getState().error;
            toast.error(currentError || 'Failed to submit review');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white dark:from-gray-700 dark:to-gray-800">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Share your experience with your recent purchase
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cb6112]"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No products found in this order.</p>
                        ) : (
                            <div className="space-y-4">
                                {products.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`border rounded-xl transition-all duration-300 ${activeProductId === item.product.id
                                            ? 'border-[#cb6112] ring-1 ring-[#cb6112]/20 bg-orange-50/10 dark:bg-orange-900/10'
                                            : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="p-4 flex gap-4 items-center">
                                            <div className="relative w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product?.mainImage || '/product_placeholder.jpg'}
                                                    alt={sanitize(item.product.title)}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {sanitize(item.product.title)}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (activeProductId === item.product.id) {
                                                        setActiveProductId(null);
                                                    } else {
                                                        setActiveProductId(item.product.id);
                                                        setRating(0);
                                                        setComment('');
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeProductId === item.product.id
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                    : 'bg-[#cb6112] text-white hover:bg-orange-700 shadow-md shadow-orange-500/20'
                                                    }`}
                                            >
                                                {activeProductId === item.product.id ? 'Cancel' : 'Rate'}
                                            </button>
                                        </div>

                                        {/* Expandable Form */}
                                        <AnimatePresence>
                                            {activeProductId === item.product.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <form onSubmit={handleSubmit} className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700/50 mt-2">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col items-center py-4">
                                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">How would you rate it?</label>
                                                                <StarRatingInput rating={rating} onRatingChange={setRating} />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Review</label>
                                                                <textarea
                                                                    value={comment}
                                                                    onChange={(e) => setComment(e.target.value)}
                                                                    className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-900 text-sm p-3 focus:ring-2 focus:ring-[#cb6112] focus:border-transparent"
                                                                    rows={3}
                                                                    placeholder="Write your review here..."
                                                                />
                                                            </div>

                                                            {/* Image Upload Section */}
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Add Photos</label>
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    {reviewImages.map((file, idx) => (
                                                                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group">
                                                                            <Image
                                                                                src={URL.createObjectURL(file)}
                                                                                alt="preview"
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeImage(idx)}
                                                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <FaTimes className="text-white text-xs" />
                                                                            </button>
                                                                        </div>
                                                                    ))}

                                                                    {reviewImages.length < 3 && (
                                                                        <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#cb6112] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-gray-400 hover:text-[#cb6112]">
                                                                            <div className="text-xl">+</div>
                                                                            <span className="text-[9px] uppercase font-bold">Photo</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                multiple
                                                                                onChange={handleImageChange}
                                                                                className="hidden"
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <button
                                                                    type="submit"
                                                                    disabled={isSubmitting}
                                                                    className="px-6 py-2 bg-[#cb6112] text-white rounded-lg font-bold text-sm hover:bg-orange-700 disabled:opacity-50"
                                                                >
                                                                    {isSubmitting ? 'Publishing...' : 'Publish Review'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewOrderModal;