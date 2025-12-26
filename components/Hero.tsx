'use client';

import React, { useState, useEffect, useCallback } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowDown, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useTheme } from 'next-themes';

// Data Slide (Tidak ada perubahan)

// --- Theme Definitions ---
const THEMES = {
  goldBright: 'linear-gradient(180deg, #F59E0B 0%, #D97706 55%, #B45309 100%)', // Standard Premium
  goldWarm: 'linear-gradient(180deg, #D97706 0%, #B45309 55%, #92400E 100%)',   // Deep Amber
  goldDeep: 'linear-gradient(180deg, #C2410C 0%, #9A3412 55%, #7C2D12 100%)',   // Rust/Burnt
};

export const slides = [

  {
    id: 2,
    bgImage: '/assets/eloqo.png',
    bgImageMobile: '/assets/eloqomobile.png',
    theme: 'goldWarm',
    subtitle: 'Cookies yang Menggugah Selera',
    title: {
      normal: 'Upgrade Mood',
      highlight: 'Cookies & Varian Baru',
    },
    text:
      'Temukan cookies premium dengan rasa lembut, manis seimbang, dan dibuat dari bahan pilihan berkualitas tinggi.',
    cta: {
      label: 'Jelajahi Makaroni',
      href: '/shop',
    },
  },
  {
    id: 3,
    bgImage: '/uploads/5.jpg',
    bgImageMobile: '/assets/CILOKmobile.png',
    theme: 'goldWarm',
    subtitle: 'PEDAS, NIKMAT, & GURIH',
    title: {
      normal: 'Upgrade Mood?',
      highlight: 'Coba cilok rasa & varian baru kita.',
    },
    text:
      'Bunderan Telkom University, Jl. Telekomunikasi, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257',
    cta: {
      label: 'JELAJAHI CILOK SETAN',
      href: '/shop',
    },
  },
  {
    id: 4,
    bgImage: '/uploads/seragam.png',
    bgImageMobile: '/assets/PKKMBmobile.png',
    theme: 'goldDeep',
    subtitle: 'KUALITAS TERBAIK, BAHAN PREMIUM',
    title: {
      normal: 'PKKMB Season?',
      highlight: 'Tenang, Semua Ada di Sini',
    },
    text:
      'Savora Craft, Sedia Perlengkapan PKKMB Solusi Lengkap Atribut PKKMB Telkom University,Hemat waktu, lengkap, & sesuai spek! Siap Kirim / COD Area Telkom University',
    cta: {
      label: 'KUNJUNGI INSTAGRAM SAVORA',
      href: '/shop',
    },
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const length = slides.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length]);

  // --- Logic Autoplay ---
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 6000);
    return () => clearTimeout(timer);
  }, [current, nextSlide]);

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

  // Helper to safely get theme gradient
  const getMobileGradient = (themeKey: string) => {
    return THEMES[themeKey as keyof typeof THEMES] || THEMES.goldBright;
  };

  return (
    <section className="relative w-full h-screen min-h-[500px] md:min-h-[700px] overflow-hidden bg-orange-50 dark:bg-slate-900 transition-colors duration-500">
      {/* --- SLIDER CONTENT --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0 w-full h-full"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 1. Background Image (Desktop Only) */}
          <motion.div
            className="absolute inset-0 w-full h-full hidden md:block" // Hidden on mobile, visible on desktop
            variants={slideVariants}
          >
            <div className="relative w-full h-full">
              <OptimizedImage
                src={slides[current].bgImage}
                alt={slides[current].subtitle}
                fill
                priority={current === 0}
                className="object-cover object-center"
                quality={90}
                sizes="100vw"
              />
            </div>
          </motion.div>

          {/* 1.b Background Image (Mobile Only) */}
          <motion.div
            className="absolute inset-0 w-full h-full md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full bg-orange-50 dark:bg-slate-900 transition-colors duration-500">
              {/* Mobile Image - Visible in BOTH Light and Dark nodes now as per 'image saja' request */}
              <OptimizedImage
                src={slides[current].bgImageMobile || slides[current].bgImage}
                alt={slides[current].subtitle}
                fill
                className="object-cover object-center"
                quality={90}
                priority={current === 0}
                sizes="100vw"
              />
            </div>

            {/* Grain/Noise Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.04] dark:opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
              }}
            ></div>
          </motion.div>

          {/* 3. Content Text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-12 z-20 pt-16 md:pt-0">
            {/* Subtitle */}
            <motion.p
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-white md:text-gray-900 dark:text-white font-bold tracking-[0.2em] uppercase text-xs md:text-base mb-3 md:mb-4 drop-shadow-sm bg-white/20 md:bg-white/60 dark:bg-white/5 dark:md:bg-white/10 backdrop-blur-sm px-3 py-1 md:px-4 md:py-1 rounded-full border border-white/20 md:border-gray-900/10 dark:border-white/10"
            >
              {slides[current].subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-['Forum'] text-[clamp(1.8rem,5vw,2.2rem)] md:text-7xl lg:text-8xl leading-[1.15] tracking-[-0.02em] text-white md:text-gray-900 dark:text-white mb-4 md:mb-6 drop-shadow-lg transition-colors duration-300"
            >
              {slides[current].title.normal} <br />
              <strong className="font-semibold text-inherit">
                {slides[current].title.highlight}
              </strong>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-white md:text-gray-800 dark:text-gray-200 text-sm md:text-xl max-w-xs md:max-w-2xl mb-8 md:mb-10 leading-relaxed font-['DM_Sans'] drop-shadow-md transition-colors duration-300"
            >
              {slides[current].text}
            </motion.p>

            {/* Button */}
            <motion.div
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={slides[current].cta.href}
                className={`group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-[14px] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:bg-transparent ${mounted && resolvedTheme === 'dark' ? 'bg-[#D97706]' : 'bg-white'
                  }`}
              >
                {/* Desktop Fill Animation */}
                <div className="hidden md:block absolute inset-0 bg-[#cb6112] opacity-90 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(203,97,18,0.4)] group-hover:shadow-[0_0_50px_rgba(203,97,18,0.7)]" />

                {/* Mobile Text (Dynamic) / Desktop Text (White) */}
                <span className={`relative z-10 font-bold uppercase tracking-widest text-sm transition-transform group-hover:translate-x-[-5px] md:text-white ${mounted && resolvedTheme === 'dark' ? 'text-white' : 'text-[#D97706]'
                  }`}>
                  {slides[current].cta.label}
                </span>

                {/* Mobile Icon (Dynamic) OR Simple Icon */}
                <span className={`relative z-10 rounded-full p-1 group-hover:translate-x-1 transition-transform md:bg-white text-[#D97706] ${mounted && resolvedTheme === 'dark' ? 'bg-white/20 text-white' : 'bg-[#D97706]/10 text-[#D97706]'
                  }`}>
                  <IoChevronForward />
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
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
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === current
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
        animate={{ opacity: 0.6, y: 0 }} // Lower opacity
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
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
