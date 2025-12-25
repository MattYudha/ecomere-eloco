'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaCamera, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import StarRatingInput from './StarRatingInput';
import toast from 'react-hot-toast';

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
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: File[] = [];
        const newPreviews: string[] = [];

        // Limit to 3 images total
        const availableSlots = 3 - images.length;
        const filesToAdd = Math.min(files.length, availableSlots);

        for (let i = 0; i < filesToAdd; i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Hanya file gambar yang diperbolehkan');
                continue;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran gambar maksimal 5MB');
                continue;
            }

            newImages.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }

        setImages([...images, ...newImages]);
        setImagePreviews([...imagePreviews, ...newPreviews]);

        if (images.length + newImages.length >= 3) {
            toast('Maksimal 3 gambar', { icon: '📸' });
        }
    };

    const handleRemoveImage = (index: number) => {
        // Revoke object URL to free memory
        URL.revokeObjectURL(imagePreviews[index]);

        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Pilih rating minimal 1 bintang');
            return;
        }

        try {
            setIsSubmitting(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('productId', product.id);
            formData.append('orderId', orderId);
            formData.append('rating', rating.toString());
            if (comment.trim()) {
                formData.append('comment', comment.trim());
            }

            // Append images
            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await fetch('/api/reviews', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();

                // Handle duplicate review error specifically
                if (response.status === 409) {
                    toast.error(error.message || 'Anda sudah memberikan rating untuk produk ini pada order tersebut.', {
                        duration: 5000
                    });
                } else {
                    toast.error(error.message || 'Gagal mengirim review');
                }

                throw new Error(error.message || 'Gagal mengirim review');
            }

            toast.success('Terima kasih atas review Anda! 🌟');

            // Clean up
            imagePreviews.forEach(url => URL.revokeObjectURL(url));

            onReviewSubmitted();
            onClose();

            // Reset form
            setRating(5);
            setComment('');
            setImages([]);
            setImagePreviews([]);
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto max-h-[90vh] overflow-y-auto">
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

                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Foto Produk (Opsional, max 3)
                                </label>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <div className="relative w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <FaTrash size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {images.length < 3 && (
                                    <label className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-grilli-gold dark:hover:border-grilli-gold cursor-pointer transition-all group">
                                        <FaCamera className="text-gray-400 group-hover:text-grilli-gold transition-colors" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-grilli-gold transition-colors">
                                            Tambah Foto ({images.length}/3)
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Format: JPG, PNG. Max 5MB per foto
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