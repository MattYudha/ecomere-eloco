'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaCamera, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    productImage: string;
    orderId: string;
    onSubmitSuccess?: () => void;
}

const RatingModal = ({
    isOpen,
    onClose,
    productId,
    productName,
    productImage,
    orderId,
    onSubmitSuccess
}: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const remainingSlots = 3 - photos.length;

        if (newFiles.length > remainingSlots) {
            toast.error(`Maksimal 3 foto. Anda masih bisa upload ${remainingSlots} foto`);
            return;
        }

        // Validate file size (max 5MB per file)
        const validFiles = newFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} terlalu besar. Maksimal 5MB per foto`);
                return false;
            }
            return true;
        });

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));

        setPhotos([...photos, ...validFiles]);
        setPhotoPreviews([...photoPreviews, ...newPreviews]);
    };

    const removePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = photoPreviews.filter((_, i) => i !== index);

        // Revoke URL to prevent memory leak
        URL.revokeObjectURL(photoPreviews[index]);

        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Silakan pilih rating');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('orderId', orderId);
            formData.append('rating', rating.toString());
            formData.append('review', review);

            // Append photos
            photos.forEach((photo, index) => {
                formData.append('photos', photo);
            });

            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/reviews', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            toast.success('Review berhasil dikirim!');

            // Clean up
            photoPreviews.forEach(preview => URL.revokeObjectURL(preview));

            onSubmitSuccess?.();
            onClose();

            // Reset form
            setRating(0);
            setReview('');
            setPhotos([]);
            setPhotoPreviews([]);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Gagal mengirim review. Silakan coba lagi');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Beri Rating
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <FaTimes className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={productImage || '/product_placeholder.jpg'}
                                        alt={productName}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {productName}
                                    </h3>
                                </div>
                            </div>

                            {/* Rating Stars */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rating Produk
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <FaStar
                                                size={32}
                                                className={
                                                    star <= (hoverRating || rating)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {rating === 5 && 'Luar biasa!'}
                                        {rating === 4 && 'Sangat baik'}
                                        {rating === 3 && 'Baik'}
                                        {rating === 2 && 'Cukup'}
                                        {rating === 1 && 'Kurang'}
                                    </p>
                                )}
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Review Anda (Opsional)
                                </label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-grilli-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                                    {review.length}/500
                                </p>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Foto Produk (Opsional, max 3)
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Format: JPG, PNG. Max 5MB per foto
                                </p>

                                {/* Photo Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    {photoPreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <Image
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {photos.length < 3 && (
                                        <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-grilli-gold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <FaCamera className="text-gray-400 mb-1" size={20} />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Tambah Foto
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                multiple
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || isSubmitting}
                                className="flex-1 px-4 py-3 bg-grilli-gold text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;
