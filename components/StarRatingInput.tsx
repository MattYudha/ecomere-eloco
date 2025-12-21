'use client';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa6';

interface StarRatingInputProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, onRatingChange, disabled }) => {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index} className={`cursor-pointer ${disabled ? 'cursor-default opacity-50' : ''}`}>
                        <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => !disabled && onRatingChange(ratingValue)}
                            disabled={disabled}
                        />
                        <FaStar
                            className="transition-all duration-200"
                            size={24}
                            color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e5e7eb"} // Amber-400 vs Gray-200
                            onMouseEnter={() => !disabled && setHover(ratingValue)}
                            onMouseLeave={() => !disabled && setHover(null)}
                            style={{
                                filter: ratingValue <= (hover || rating) ? "drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))" : "none"
                            }}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRatingInput;
