'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock, Instagram, Facebook, Twitter, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const ContactPage = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormState({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 3 seconds
        setTimeout(() => setIsSuccess(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
            {/* 1. HERO SECTION */}
            <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 to-stone-900/60 z-10" />
                    {/* Fallback pattern if no image */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-[#cb6112]/20 border border-[#cb6112]/30 text-[#cb6112] text-sm font-medium tracking-widest uppercase mb-4 backdrop-blur-sm"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-forum text-white mb-6"
                    >
                        Hubungi Kami
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-200 font-dm-sans max-w-2xl mx-auto leading-relaxed"
                    >
                        Punya pertanyaan seputar produk kami atau ingin berkolaborasi?
                        Tim ELOQO siap membantu Anda mewujudkan pengalaman ngemil terbaik.
                    </motion.p>
                </div>
            </section>

            {/* 2. MAIN CONTENT GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 mb-20">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Contact Cards */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800">
                            <h3 className="text-2xl font-forum text-gray-900 dark:text-white mb-8">Informasi Kontak</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-xl bg-[#cb6112]/10 text-[#cb6112] group-hover:bg-[#cb6112] group-hover:text-white transition-all duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Lokasi Kami</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                            Jl. Asia Afrika No. 123,<br />
                                            Bandung, Indonesia 40115
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-xl bg-[#cb6112]/10 text-[#cb6112] group-hover:bg-[#cb6112] group-hover:text-white transition-all duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email</h4>
                                        <a href="mailto:support@eloqo.co" className="text-gray-500 dark:text-gray-400 text-sm hover:text-[#cb6112] transition-colors">
                                            support@eloqo.co
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-xl bg-[#cb6112]/10 text-[#cb6112] group-hover:bg-[#cb6112] group-hover:text-white transition-all duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Telepon</h4>
                                        <a href="tel:+62812345678" className="text-gray-500 dark:text-gray-400 text-sm hover:text-[#cb6112] transition-colors">
                                            +62 812-3456-7890
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 rounded-xl bg-[#cb6112]/10 text-[#cb6112] group-hover:bg-[#cb6112] group-hover:text-white transition-all duration-300">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Jam Operasional</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            Sen - Jum: 09.00 - 17.00<br />
                                            Sab - Min: Libur
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Temukan kami di sosial media:</p>
                                <div className="flex gap-4">
                                    {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                                        <a
                                            key={idx}
                                            href="#"
                                            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#cb6112] hover:text-white transition-all duration-300"
                                        >
                                            <Icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 h-full relative overflow-hidden">

                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10 rounded-bl-full -z-0 opacity-50" />

                            <div className="relative z-10">
                                <h3 className="text-3xl font-forum text-gray-900 dark:text-white mb-2">Kirim Pesan</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl">
                                    Silakan isi formulir di bawah ini. Kami akan membalas pesan Anda sesegera mungkin dalam 1x24 jam kerja.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-dm-sans">Nama Lengkap</label>
                                            <Input
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-[#cb6112] focus:ring-[#cb6112]/20 h-12"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-dm-sans">Email</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-[#cb6112] focus:ring-[#cb6112]/20 h-12"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-dm-sans">Subjek</label>
                                        <Input
                                            name="subject"
                                            value={formState.subject}
                                            onChange={handleChange}
                                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-[#cb6112] focus:ring-[#cb6112]/20 h-12"
                                            placeholder="Hal yang ingin ditanyakan..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-dm-sans">Pesan</label>
                                        <textarea
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm md:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cb6112]/20 focus-visible:border-[#cb6112] transition-colors resize-none"
                                            placeholder="Tulis pesan Anda di sini..."
                                            required
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || isSuccess}
                                            className={`w-full md:w-auto h-12 px-8 rounded-full font-medium tracking-wide transition-all duration-300 shadow-lg ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-[#cb6112] to-[#df7e33] hover:from-[#b0520e] hover:to-[#cb6112] hover:shadow-orange-500/20'}`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                                                    Mengirim...
                                                </span>
                                            ) : isSuccess ? (
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle2 size={18} />
                                                    Terkirim!
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Kirim Pesan <Send size={18} />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. MAP SECTION (Optional Visual) */}
            <section className="h-96 w-full grayscale-[50%] hover:grayscale-0 transition-all duration-700 ease-in-out">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.5731170942382!3d-6.903444341655676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1655611833758!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                ></iframe>
            </section>
        </div>
    );
};

export default ContactPage;
