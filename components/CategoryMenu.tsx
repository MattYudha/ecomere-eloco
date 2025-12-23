'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Slider from 'react-slick'; // Import Slider

const newCategories = [
  {
    id: 1,
    title: 'Keripik Usus',
    href: '/shop',
    icon: '🐔',
    description: 'Renyah, gurih, dan otentik',
  },
  {
    id: 2,
    title: 'Keripik Makaroni',
    href: '/shop',
    icon: '🍝',
    description: 'Bumbu premium, bikin nagih',
  },
  {
    id: 3,
    title: 'Keripik Lewu',
    href: '/shop',
    icon: '🌶️',
    description: 'Pedas mantap, kuah kental',
  },
  {
    id: 4,
    title: 'Keripik Singkong',
    href: '/shop',
    icon: '🍠',
    description: 'Irisan tipis, rasa klasik',
  },
  {
    id: 5,
    title: 'Cookies',
    href: '/shop',
    icon: '🍪',
    description: 'Manis sempurna, lumer di mulut',
  },


];

const CategoryMenu = () => {
  const sliderSettings = {
    dots: false, // Default to no dots for larger screens
    infinite: false,
    speed: 500,
    slidesToShow: 4, // Show 4 slides on desktop by default
    slidesToScroll: 4, // Scroll 4 slides at a time
    arrows: true, // Enable arrows for desktop by default
    responsive: [
      {
        breakpoint: 1024, // For screens smaller than 1024px (laptops/large tablets)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 768, // For screens smaller than 768px (tables/mobile)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 480, // For extra small screens (mobile)
        settings: {
          slidesToShow: 1.2, // Show a bit of the next slide
          slidesToScroll: 1,
          infinite: false,
          arrows: false, // Optionally hide arrows on very small screens to save space
          dots: true, // Re-enable dots for very small screens
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  return (
    <div className="py-20 bg-white dark:bg-dark-bg relative overflow-hidden">
      {/* Decorative Shape 1 (Top Left) */}
      <div className="absolute top-0 left-0 w-32 md:w-48 h-32 md:h-48 opacity-20 dark:opacity-30 dark:invert pointer-events-none select-none animate-float-slow">
        <Image
          src="/assets/shape-1.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Shape 2 (Bottom Right) */}
      <div className="absolute bottom-10 right-0 w-40 md:w-64 h-40 md:h-64 opacity-20 dark:opacity-30 dark:invert pointer-events-none select-none animate-float-slow" style={{ animationDelay: '2s' }}>
        <Image
          src="/assets/shape-2.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-800 dark:text-white">
          Jelajahi Varian Rasa
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Dari gurihnya keripik hingga manisnya cookies, temukan rasa favoritmu
          yang dibuat dengan bahan-bahan berkualitas.
        </p>

        <Slider {...sliderSettings}>
          {newCategories.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              <Link href={item.href}>
                <motion.div
                  className="group h-full p-4 text-center rounded-2xl shadow-xl cursor-pointer
                               bg-white/60 dark:bg-slate-800/40 
                               backdrop-blur-lg 
                               border border-white/40 dark:border-brand/20"
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: '0 25px 50px -12px rgba(203, 97, 18, 0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span
                    className="text-5xl mb-3 block"
                    role="img"
                    aria-label={item.title}
                  >
                    {item.icon}
                  </span>
                  <h3 className="text-gray-800 dark:text-white font-bold text-xl mb-2 font-dm-sans transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-dm-sans mb-4">
                    {item.description}
                  </p>
                  <span className="mt-4 text-xs text-brand font-semibold uppercase tracking-wider transition-colors">
                    Lihat Koleksi →
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategoryMenu;
