'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowDown, IoChevronBack, IoChevronForward } from 'react-icons/io5';

// Data Slide (Tidak ada perubahan)
const slides = [
  {
    id: 1,
    bgImage: '/images/hero-slider-1.jpg',
    subtitle: 'Renyah & Tak Tertandingi',
    title: 'Sensasi Dalam <br/> Setiap Gigitan',
    text: 'Nikmati rangkaian keripik premium kami—perpaduan rasa autentik dan inovasi yang menciptakan pengalaman ngemil tak terlupakan.',
    buttonText: 'Lihat Varian Keripik',
    buttonLink: '/shop',
  },
  {
    id: 2,
    bgImage: '/images/hero-slider-2.jpg',
    subtitle: 'Gurih yang Menggugah Selera',
    title: 'Cara Baru <br/> Menikmati Makaroni',
    text: 'Temukan makaroni khas ELOQO dengan cita rasa berani dan tekstur sempurna, dirancang untuk memanjakan setiap momen.',
    buttonText: 'Jelajahi Makaroni',
    buttonLink: '/shop',
  },
  {
    id: 3,
    bgImage: '/images/hero-slider-3.jpg',
    subtitle: 'Manis, Lembut, & Memikat',
    title: 'Setiap Gigitan <br/> Membawa Kebahagiaan',
    text: 'Rasakan kukis premium lembut di dalam, renyah di luar—diciptakan untuk menghadirkan kehangatan di setiap hari.',
    buttonText: 'Cicipi Kukis Premium',
    buttonLink: '/shop',
  },
  {
    id: 4,
    bgImage: '/assets/eloqo.png',
    subtitle: 'Kualitas Terbaik, Rasa Juara',
    title: 'Semua Snack Favoritmu <br/> Ada di Sini',
    text: 'Jelajahi dunia rasa ELOQO, tempat setiap produk dibuat dengan bahan-bahan pilihan untuk kepuasan maksimal.',
    buttonText: 'Belanja Semua Produk',
    buttonLink: '/shop',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  // --- Logic Autoplay ---
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 6000);
    return () => clearTimeout(timer);
  }, [current]);

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  // --- Variants Animasi Framer Motion ---
  const slideVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: [0, 0, 0.58, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 1 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2 + 0.5,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-orange-50 dark:bg-slate-900 transition-colors duration-500">
      {/* --- SLIDER CONTENT --- */}
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                className="absolute inset-0 w-full h-full"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* 1. Background Image */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  variants={slideVariants}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.bgImage}
                      alt={slide.subtitle}
                      fill
                      priority={index === 0}
                      className="object-cover object-center"
                      quality={90}
                    />

                    {/* === UPDATE BAGIAN INI UNTUK MENGURANGI KETEBALAN BLUR === */}

                    {/* 1. Gradient Vertikal (Bawah ke Atas) */}
                    {/* Opacity dikurangi signifikan: from-orange-50/90 dan via-orange-50/20 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-50/90 via-orange-50/20 to-transparent dark:from-[#0f172a] dark:via-[#0f172a]/60 transition-colors duration-500" />

                    {/* 2. Gradient Horizontal (Kiri ke Kanan) */}
                    {/* Opacity dikurangi signifikan: from-orange-50/20 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50/20 to-transparent dark:from-[#0f172a]/80 transition-colors duration-500" />

                    {/* ======================================================= */}
                  </div>
                </motion.div>

                {/* 3. Content Text */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 z-20">
                  {/* Subtitle */}
                  <motion.p
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-[#cb6112] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 drop-shadow-sm bg-white/60 dark:bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full border border-[#cb6112]/20 dark:border-[#cb6112]/30"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* Title */}
                  <motion.h1
                    custom={1}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="font-['Forum'] text-5xl md:text-7xl lg:text-8xl text-gray-900 dark:text-white leading-[1.1] mb-6 drop-shadow-lg transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />

                  {/* Description */}
                  <motion.p
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-gray-800 dark:text-gray-200 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-['DM_Sans'] drop-shadow-md transition-colors duration-300"
                  >
                    {slide.text}
                  </motion.p>

                  {/* Button */}
                  <motion.div
                    custom={3}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={slide.buttonLink}
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-[#cb6112] opacity-90 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(203,97,18,0.4)] group-hover:shadow-[0_0_50px_rgba(203,97,18,0.7)]" />

                      <span className="relative text-white font-bold uppercase tracking-widest text-sm z-10 group-hover:translate-x-[-5px] transition-transform">
                        {slide.buttonText}
                      </span>

                      <span className="relative z-10 bg-white text-[#cb6112] rounded-full p-1 group-hover:translate-x-1 transition-transform">
                        <IoChevronForward />
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      {/* --- CUSTOM NAVIGATION ARROWS --- */}
      <div className="absolute top-1/2 w-full flex justify-between px-4 md:px-10 z-30 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full 
                     bg-white/40 border border-orange-200 text-[#cb6112]
                     dark:bg-white/5 dark:border-white/10 dark:text-white 
                     backdrop-blur-md flex items-center justify-center 
                     hover:bg-[#cb6112] hover:border-[#cb6112] hover:text-white 
                     dark:hover:bg-[#cb6112] dark:hover:border-[#cb6112] 
                     hover:scale-110 transition-all duration-300 group shadow-lg"
          aria-label="Previous Slide"
        >
          <IoChevronBack
            size={24}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>

        <button
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full 
                     bg-white/40 border border-orange-200 text-[#cb6112]
                     dark:bg-white/5 dark:border-white/10 dark:text-white 
                     backdrop-blur-md flex items-center justify-center 
                     hover:bg-[#cb6112] hover:border-[#cb6112] hover:text-white 
                     dark:hover:bg-[#cb6112] dark:hover:border-[#cb6112] 
                     hover:scale-110 transition-all duration-300 group shadow-lg"
          aria-label="Next Slide"
        >
          <IoChevronForward
            size={24}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* --- SLIDE INDICATORS --- */}
      <div className="absolute bottom-32 w-full flex justify-center gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === current
                ? 'w-12 bg-[#cb6112] shadow-[0_0_10px_#cb6112]'
                : 'w-3 bg-gray-400/50 hover:bg-[#cb6112]/50 dark:bg-white/30 dark:hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* --- SCROLL DOWN BUTTON --- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
      >
        <Link
          href="#featured-products"
          className="flex flex-col items-center group"
        >
          <span className="text-xs text-gray-700 dark:text-white/70 uppercase tracking-[0.2em] mb-2 group-hover:text-[#cb6112] transition-colors">
            Scroll
          </span>
          <div className="w-[30px] h-[50px] rounded-full border-2 border-gray-500 dark:border-white/30 flex justify-center p-1 group-hover:border-[#cb6112] transition-colors shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 bg-[#cb6112] rounded-full"
            />
          </div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
