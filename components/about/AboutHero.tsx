'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AboutHero = () => {
    return (
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100/30">
            {/* Background Pattern (Optional subtle texture) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/noise.png')] mix-blend-overlay pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Premium Badge */}
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-[#cb6112] bg-[#cb6112]/5 rounded-full border border-[#cb6112]/10 backdrop-blur-sm">
                        Premium Snack Brand
                    </span>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-forum text-gray-900 mb-6 leading-tight">
                        Tentang <span className="text-[#cb6112]">ELOQO</span>
                    </h1>

                    {/* Narrative Subtitle */}
                    <p className="text-lg md:text-xl text-gray-600 font-dm-sans max-w-2xl mx-auto leading-relaxed">
                        Lebih dari sekadar snack. Kami menghadirkan produk premium yang terkurasi dengan standar kualitas dan kepercayaan.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
