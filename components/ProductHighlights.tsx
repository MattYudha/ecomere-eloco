// *********************
// Role of the component: Display key product features and benefits in chip/badge format
// Name of the component: ProductHighlights.tsx
// Developer: Eloco E-commerce Team
// Version: 1.0
// Component call: <ProductHighlights highlights={['Tanpa Pengawet', 'Pedas Gurih']} />
// Input parameters: ProductHighlightsProps interface
// Output: Feature highlight chips with icons
// *********************

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface ProductHighlightsProps {
    highlights: string[];
}

const ProductHighlights: React.FC<ProductHighlightsProps> = ({ highlights }) => {
    if (!highlights || highlights.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Keunggulan Produk
            </h3>
            <div className="flex flex-wrap gap-3">
                {highlights.map((highlight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cb6112]/40 to-orange-500/40 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />

                        {/* Chip */}
                        <div className="relative flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:border-[#cb6112]/50 transition-all duration-300">
                            <FaCheckCircle className="text-[#cb6112] flex-shrink-0" size={14} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                {highlight}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProductHighlights;
