'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, HeartHandshake, TrendingUp } from 'lucide-react';

export const WhyChooseUs = () => {
    const values = [
        {
            icon: CheckCircle,
            title: "Transparansi",
            description: "Informasi produk yang jelas, jujur, dan mudah dipahami."
        },
        {
            icon: HeartHandshake,
            title: "Kepercayaan",
            description: "Keamanan transaksi dan kepercayaan pelanggan adalah prioritas utama."
        },
        {
            icon: TrendingUp,
            title: "Konsistensi",
            description: "Standar kualitas yang stabil di setiap produk dan layanan."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-forum text-gray-900 mb-4">Nilai Kami</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-[#cb6112] mb-6">
                                <item.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-dm-sans">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-dm-sans max-w-xs mx-auto">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
