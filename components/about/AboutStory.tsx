'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AboutStory = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-forum text-gray-900 mb-4">Cerita Kami</h2>
                        <div className="w-16 h-0.5 bg-[#cb6112] mx-auto rounded-full" />
                    </div>

                    <div className="prose prose-lg mx-auto text-gray-600 font-dm-sans leading-relaxed text-center space-y-6">
                        <p>
                            ELOQO lahir dari keresahan akan produk snack yang kualitasnya tidak konsisten di pasaran.
                            Kami menyadari bahwa konsumen berhak mendapatkan lebih dari sekadar rasa—mereka berhak atas kejujuran,
                            kebersihan, dan nilai dari setiap gigitan.
                        </p>
                        <p>
                            Kami memulai perjalanan ini dengan satu prinsip sederhana:
                            <span className="text-[#cb6112] font-semibold"> hanya menjual produk yang berani kami konsumsi sendiri. </span>
                            Prinsip ini menjadi kompas kami dalam memilih setiap bahan, setiap mitra, dan setiap kemasan.
                        </p>
                        <p>
                            Hari ini, ELOQO tumbuh sebagai brand snack premium yang dipercaya oleh ribuan pelanggan.
                            Bagi kami, ini bukan hanya tentang berjualan, tapi tentang membangun komunitas penikmat rasa yang menghargai kualitas sejati.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
