'use client';

import Link from 'next/link';
import React from 'react';
import { useTheme } from '@/context/ThemeContext'; // Pastikan path ini sesuai
import { motion } from 'framer-motion';

// --- KARTU PRODUK (Modern Dark Mode Optimized) ---
interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  price?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  imageUrl,
  price,
}) => {
  return (
    <motion.div
      className="relative group h-full z-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Glow Effect (Background Bloom) */}
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-[#cb6112] via-orange-400 to-[#cb6112] rounded-2xl blur-xl 
                    opacity-20 group-hover:opacity-60 transition-opacity duration-500 dark:opacity-30 dark:group-hover:opacity-70"
      ></div>

      {/* Card Container (Glassmorphism) 
          UPDATED: Padding diperkecil di mobile (p-3) vs desktop (md:p-6) */}
      <div
        className="relative h-full flex flex-col
                   bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl
                   border border-gray-300 dark:border-[#cb6112]/30
                   rounded-xl md:rounded-2xl p-3 md:p-6 
                   shadow-xl shadow-gray-200/50 dark:shadow-none
                   transform transition-all duration-500 group-hover:scale-[1.02]"
      >
        {/* Image Area 
            UPDATED: Tinggi gambar disesuaikan mobile (h-32) vs desktop (md:h-64) */}
        <div className="relative w-full h-32 md:h-64 rounded-lg md:rounded-xl overflow-hidden mb-3 md:mb-5 flex items-center justify-center p-2 md:p-4 bg-gray-50 dark:bg-slate-900/50 group-hover:bg-orange-50 dark:group-hover:bg-slate-800/50 transition-colors">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="text-center">
              <svg
                className="w-10 h-10 md:w-16 md:h-16 text-[#cb6112]/40 mx-auto mb-2 md:mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                No Image
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow text-center flex flex-col justify-between">
          <div>
            {/* Title: Lebih kecil di mobile */}
            <h3 className="text-slate-900 dark:text-white font-bold text-sm md:text-xl mb-1 md:mb-2 font-['Forum'] tracking-wide group-hover:text-[#cb6112] transition-colors leading-tight">
              {title}
            </h3>
            {/* Description: Font kecil dan dilimit barisnya (line-clamp) */}
            <p className="text-gray-600 dark:text-gray-300 text-[10px] md:text-sm leading-snug md:leading-relaxed mb-2 md:mb-4 font-['DM_Sans'] line-clamp-2 md:line-clamp-none">
              {description}
            </p>
          </div>

          {/* Stats Grid 
              UPDATED: Font sangat kecil untuk mobile agar muat 3 kolom */}
          <div className="grid grid-cols-3 gap-1 py-2 md:py-4 border-t border-gray-100 dark:border-white/10 mt-auto">
            <div className="flex flex-col">
              <span className="text-[#cb6112] font-bold text-xs md:text-lg">100+</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 scale-90 md:scale-100">
                Items
              </span>
            </div>
            <div className="flex flex-col border-l border-r border-gray-100 dark:border-white/10">
              <span className="text-[#cb6112] font-bold text-xs md:text-lg">4.9★</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 scale-90 md:scale-100">
                Rating
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#cb6112] font-bold text-xs md:text-lg">1K+</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 scale-90 md:scale-100">
                Sold
              </span>
            </div>
          </div>

          {/* Price */}
          {price && (
            <div className="mt-2 md:mt-4">
              <span className="text-sm md:text-2xl font-bold text-slate-900 dark:text-white">
                {price}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- KOMPONEN UTAMA IntroducingSection ---
const IntroducingSection = () => {
  const { theme } = useTheme();

  // GRADASI BACKGROUND DINAMIS
  const darkModeBg = {
    background:
      'radial-gradient(circle at 50% -20%, rgba(203, 97, 18, 0.25) 0%, rgba(15, 23, 42, 1) 60%)',
    backgroundColor: '#0f172a',
  };

  const lightModeBg = {
    background:
      'radial-gradient(circle at 50% -20%, rgba(203, 97, 18, 0.1) 0%, #ffffff 60%)',
    backgroundColor: '#ffffff',
  };

  return (
    <section
      className="relative py-12 md:py-32 overflow-hidden min-h-[90vh] flex items-center"
      style={theme === 'dark' ? darkModeBg : lightModeBg}
    >
      {/* --- DECORATIVE ELEMENTS --- */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('/assets/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#cb6112] rounded-full blur-[80px] md:blur-[120px] opacity-20 dark:opacity-10 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-yellow-500 dark:bg-orange-900 rounded-full blur-[60px] md:blur-[100px] opacity-10 dark:opacity-20 animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>

      <img
        src="/assets/shape-5.png"
        alt=""
        className="absolute top-[10%] left-[5%] w-32 md:w-[500px] opacity-30 dark:opacity-10 animate-float-slow pointer-events-none select-none"
      />
      <img
        src="/assets/shape-6.png"
        alt=""
        className="absolute bottom-[10%] right-[5%] w-24 md:w-[400px] opacity-30 dark:opacity-10 animate-float-slow pointer-events-none select-none"
        style={{ animationDelay: '-3s' }}
      />

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 relative z-20 flex flex-col items-center">
        {/* 1. Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 md:mb-6 inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full 
                     bg-white/50 dark:bg-white/5 backdrop-blur-md border border-[#cb6112]/20 
                     shadow-sm dark:shadow-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cb6112] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cb6112]"></span>
          </span>
          <span className="text-[#cb6112] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Premium Collection
          </span>
        </motion.div>

        {/* 2. Heading Besar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 md:mb-8 max-w-4xl"
        >
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-extrabold font-['Forum'] leading-tight text-slate-900 dark:text-white drop-shadow-sm">
            INTRODUCING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#cb6112] to-orange-400 relative">
              ELOQO
              <div className="absolute inset-0 blur-3xl bg-[#cb6112]/30 -z-10 hidden dark:block"></div>
            </span>
          </h2>
        </motion.div>

        {/* 3. Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8 md:mb-10 font-['DM_Sans'] leading-relaxed px-4"
        >
          <span className="font-semibold text-slate-900 dark:text-white">
            Buy the latest snack.
          </span>{' '}
          <br className="hidden md:block" />
          The best snack for snacky lovers, crafted with passion.
        </motion.p>

        {/* 4. Features (Pills) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-16"
        >
          {['Fast Shipping', 'Halal Certified', 'Premium Quality'].map(
            (feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#cb6112] transition-colors group cursor-default"
              >
                <span className="text-[#cb6112] group-hover:scale-110 transition-transform text-xs md:text-base">
                  ✦
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                  {feature}
                </span>
              </div>
            ),
          )}
        </motion.div>

        {/* 5. CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-12 md:mb-20"
        >
          <Link href="/shop">
            <button className="relative overflow-hidden px-8 md:px-10 py-3 md:py-4 rounded-full bg-[#cb6112] text-white font-bold tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105 group text-sm md:text-base">
              <span className="relative z-10 flex items-center gap-2">
                SHOP NOW
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
            </button>
          </Link>
        </motion.div>

        {/* 6. PRODUCTS GRID 
            UPDATED: 'grid-cols-2' untuk mobile, 'gap-3' agar muat */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 w-full max-w-6xl">
          <ProductCard
            title="Eloqo Cookies"
            description="Kukis premium renyah dengan coklat lumer."
            imageUrl="/assets/brand1.png"
            price="Rp 45.000"
          />
          <ProductCard
            title="Eloqo Chips"
            description="Keripik pedas dengan bumbu rahasia."
            imageUrl="/assets/brand2.png"
            price="Rp 35.000"
          />
          <ProductCard
            title="Eloqo Signature"
            description="Varian signature kami yang paling laris."
            imageUrl="/assets/eloqo.png"
            price="Rp 50.000"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes shine {
          100% {
            left: 100%;
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 1s;
        }
      `}</style>
    </section>
  );
};

export default IntroducingSection;