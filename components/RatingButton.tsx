'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface RatingButtonProps {
    product: {
        id: string;
        title: string;
        mainImage: string;
    };
    orderId: string;
    hasReview: boolean;
    reviewRating?: number;
    onClick: () => void;
    isCompact?: boolean;
}

const RatingButton: React.FC<RatingButtonProps> = ({
    product,
    hasReview,
    reviewRating,
    onClick,
    isCompact = false,
}) => {
    if (hasReview && reviewRating) {
        // Already reviewed - show rating (disabled state)
        return (
            <div
                className={`
                    flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg cursor-not-allowed
                    ${isCompact ? 'text-xs' : 'text-sm'}
                `}
            >
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`
                                ${i < reviewRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                                ${isCompact ? 'text-xs' : 'text-sm'}
                            `}
                        />
                    ))}
                </div>
                <span className="font-medium text-green-700 dark:text-green-300">
                    {isCompact ? 'Sudah Direview' : 'Sudah Direview'}
                </span>
            </div>
        );
    }

    // Not reviewed - show "Beri Rating" button
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-md
                ${isCompact ? 'text-xs' : 'text-sm'}
            `}
        >
            <FaStar className={isCompact ? 'text-xs' : 'text-sm'} />
            <span>{isCompact ? 'Rating' : 'Beri Rating'}</span>
        </motion.button>
    );
};

export default RatingButton;