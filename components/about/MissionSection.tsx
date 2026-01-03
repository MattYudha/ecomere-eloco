'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Users, Leaf } from 'lucide-react';

export const MissionSection = () => {
    const cards = [
        {
            icon: Sparkles,
            title: "Kurasi Premium",
            description: "Setiap produk dipilih melalui proses seleksi dan evaluasi kualitas yang ketat."
        },
        {
            icon: ShieldCheck,
            title: "Kualitas Terjamin",
            description: "Quality control berlapis sebelum produk tersedia bagi pelanggan."
        },
        {
            icon: Users,
            title: "Customer First",
            description: "Kami membangun hubungan jangka panjang, bukan sekadar transaksi."
        },
        {
            icon: Leaf,
            title: "Bahan Berkualitas",
            description: "Mengutamakan bahan terbaik dan proses yang bertanggung jawab."
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-forum text-gray-900 mb-4">Visi & Misi</h2>
                    <p className="text-gray-500 font-dm-sans">Pilar utama yang menjadi landasan kami.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center group"
                        >
                            <div className="w-12 h-12 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-[#cb6112] mb-6 group-hover:scale-110 transition-transform duration-300">
                                <card.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 font-dm-sans">{card.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-dm-sans">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
