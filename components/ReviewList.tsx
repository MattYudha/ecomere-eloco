'use client';
import React, { useEffect } from 'react';
import { useReviewStore } from '@/app/_zustand/reviewStore';
import { FaStar, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface ReviewListProps {
    productId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
    const { reviews, fetchReviews, isLoading, deleteReview } = useReviewStore();
    const { data: session } = useAuth();
    const currentUserEmail = session?.user?.email;
    const isAdmin = session?.user?.role === 'admin';

    useEffect(() => {
        if (productId) {
            fetchReviews(productId);
        }
    }, [productId, fetchReviews]);

    if (isLoading) return <div className="text-center py-8 text-gray-500">Loading reviews...</div>;

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Customer Reviews ({reviews.length})
            </h3>

            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 relative group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            {/* Avatar Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 text-[#cb6112] dark:text-orange-200 flex items-center justify-center font-bold text-sm shadow-sm">
                                {review.user?.email ? review.user.email.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {review.user?.email ? review.user.email.split('@')[0] : 'Anonymous'}
                                    </span>
                                    {/* Verified Badge - Always shown as we validate on backend, but strictly we should check order history if specific logic required, 
                      but for now assume if they reviewed, they are verified per our controller logic */}
                                    <span className="flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-200 dark:border-green-800">
                                        <FaCheckCircle size={10} /> Verified
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-0.5 text-[#fbbf24] text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200 dark:text-gray-700"} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        • {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {(isAdmin || currentUserEmail === review.user?.email) && (
                            <button
                                onClick={() => deleteReview(review.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                                title="Delete Review"
                            >
                                <FaTrash size={14} />
                            </button>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-[3.25rem]">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
