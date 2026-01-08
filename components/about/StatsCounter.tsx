'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const StatsCounter = () => {
    const stats = [
        { label: "Pelanggan", value: "10K+" },
        { label: "Produk Terkurasi", value: "500+" },
        { label: "Pengalaman", value: "5+ Thn" },
        { label: "Rating Rata-rata", value: "4.9" }
    ];

    return (
        <section className="py-12 bg-orange-50/50 border-y border-orange-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-orange-200/50">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-[#cb6112] mb-1 font-dm-sans">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
