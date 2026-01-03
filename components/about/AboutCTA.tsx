'use client';

import React from 'react';
import { Lock, Truck, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const AboutCTA = () => {
    const badges = [
        { icon: Lock, label: "Secure Payment" },
        { icon: Truck, label: "Fast Shipping" },
        { icon: BadgeCheck, label: "Quality Checked" }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background blob for the whole section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-50/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Trust Badges - Enhanced */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-20">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center gap-4 group"
                        >
                            <div className="p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 group-hover:border-orange-100 group-hover:shadow-[0_4px_20px_rgba(203,97,18,0.1)] transition-all duration-300">
                                <badge.icon size={24} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#cb6112] transition-colors" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-hover:text-[#3A2415] transition-colors">
                                {badge.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Main CTA Card - Premium Design */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#cb6112]/20"
                >
                    {/* Rich Gradient Background (Re-applied) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3A2415] via-[#4d3220] to-[#2a1a10]" />

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#cb6112] opacity-20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cb6112] opacity-10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 p-12 md:p-20 space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-forum leading-tight text-white mb-6">
                                Kenal Kami Lebih Dekat
                            </h2>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#cb6112] to-transparent mx-auto mb-6" />
                            <p className="text-orange-50/80 font-dm-sans max-w-lg mx-auto text-lg font-light leading-relaxed">
                                Punya pertanyaan atau ingin tahu lebih jauh tentang filosofi ELOQO?
                                <br />Kami siap mendengar cerita Anda.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                            <Link href="/contact">
                                <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#cb6112] to-[#df7e33] hover:from-[#b0520e] hover:to-[#cb6112] text-white font-medium tracking-wide shadow-[0_4px_15px_rgba(203,97,18,0.3)] hover:shadow-[0_8px_25px_rgba(203,97,18,0.4)] hover:-translate-y-0.5 transition-all duration-300 border border-white/10">
                                    <span>Hubungi Kami</span>
                                    <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </Link>
                            <Link href="/shop">
                                <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm font-medium tracking-wide hover:border-white/40 transition-all duration-300">
                                    Belanja Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
