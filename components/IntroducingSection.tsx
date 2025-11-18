'use client'; // WAJIB ada karena Anda menggunakan <style jsx>

import Link from 'next/link';
import React from 'react';

// --- KARTU PRODUK (Komponen Terpisah) ---
interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string; // Dibuat opsional, jika tidak ada, akan pakai placeholder
  price?: string; // Opsional: harga produk
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  imageUrl,
  price,
}) => {
  return (
    // 'animate-float' tetap ada di semua kartu
    <div className={`relative group h-full z-10 animate-float`}>
      {/* Glow Effect (Warna #cb6112) */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-[#cb6112] via-yellow-400 to-[#cb6112] rounded-2xl blur-xl 
                    opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
      ></div>

      {/* Card Container */}
      <div
        className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 
                    rounded-2xl p-6 shadow-2xl transform group-hover:scale-105 transition-all duration-500 h-full flex flex-col`}
      >
        {/* --- PERUBAHAN GAMBAR & BACKGROUND UI DI SINI --- */}
        {/* Div untuk Gambar - sekarang tanpa background gradien slate */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4"> {/* Menambahkan padding di sini */}
          {imageUrl ? (
            // Jika ada imageUrl, tampilkan <img> dengan object-contain
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain pt-4" // object-contain & pt-4 (padding top)
            />
          ) : (
            // Jika tidak ada imageUrl, tampilkan placeholder
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900"> {/* Placeholder tetap ada background */}
              <div className="text-center">
                <svg
                  className="w-20 h-20 text-[#cb6112]/50 mx-auto mb-4"
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
                <p className="text-white/50 text-sm font-dm-sans">
                  Main Product Showcase
                </p>
              </div>
            </div>
          )}
          {/* Overlay gradien di atas gambar (tetap ada untuk efek visual) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Card Content - Menggunakan flex-grow agar konten mengisi ruang */}
        <div className="text-center flex-grow">
          <h3 className="text-white font-bold text-xl mb-2 font-dm-sans">
            {title}
          </h3>
          <p className="text-gray-300 text-sm font-dm-sans mb-4">
            {description}
          </p>

          {/* Stats tetap ada di SEMUA kartu */}
          <div className="flex justify-around gap-4 mt-auto"> {/* mt-auto agar stats selalu di bawah */}
            <div className="text-center">
              <div className="text-[#cb6112] text-2xl font-bold">100+</div>
              <div className="text-gray-400 text-xs">Produk</div>
            </div>
            <div className="text-center">
              <div className="text-[#cb6112] text-2xl font-bold">4.9★</div>
              <div className="text-gray-400 text-xs">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-[#cb6112] text-2xl font-bold">1K+</div>
              <div className="text-gray-400 text-xs">Pelanggan</div>
            </div>
          </div>

          {price && (
            <div className="mt-4 text-white text-2xl font-bold">
              {price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- KOMPONEN UTAMA IntroducingSection ---
const IntroducingSection = () => {
  return (
    <div
      className="relative py-32 bg-cover bg-center overflow-hidden min-h-[90vh] flex items-center"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* ... (Overlay, Orbs, Grids, Corners tetap sama) ... */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#cb6112]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(203,97,18,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(203,97,18,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div className="absolute top-0 left-0 w-40 h-40 border-t-2 border-l-2 border-[#cb6112]/30"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 border-[#cb6112]/30"></div>

      {/* Decorative Images */}
      <img src="/assets/shape-5.png" alt="Decorative Shape 5" className="absolute top-1/4 left-10 w-[700px] h-[700px] object-contain opacity-40 animate-float-slow z-0 max-md:hidden" />
      <img src="/assets/shape-6.png" alt="Decorative Shape 6" className="absolute bottom-1/4 right-10 w-96 h-96 object-contain opacity-40 animate-float-slow delay-500 z-0 max-md:hidden" />

      {/* Main Content */}
      <div className="relative text-center flex flex-col gap-y-8 items-center w-full px-6 z-10">
        
        {/* ... (Premium Badge, Judul, Deskripsi, Pills, Tombol CTA tetap sama dengan warna #cb6112) ... */}
        {/* Premium Badge (Warna #cb6112) */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#cb6112]/10 backdrop-blur-sm border border-[#cb6112]/30 rounded-full animate-fade-in">
          <svg className="w-5 h-5 text-[#cb6112] animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[#cb6112] text-sm font-bold tracking-widest uppercase">Premium Snack By Eloco</span>
        </div>

        {/* Main Heading (Warna #cb6112) */}
        <h2 className="text-white text-8xl font-extrabold text-center mb-4 max-md:text-6xl max-[480px]:text-4xl font-forum leading-tight animate-slide-up">
          INTRODUCING{' '}
          <span className="relative inline-block">
            <span className="text-[#cb6112] relative z-10 animate-glow-new">ELOQO</span>
            <span className="absolute inset-0 blur-2xl bg-[#cb6112]/50 animate-pulse"></span>
          </span>
        </h2>

        {/* Description */}
        <div className="space-y-4 animate-fade-in-delay">
          <p className="text-white text-center text-3xl font-bold max-md:text-2xl max-[480px]:text-lg font-dm-sans drop-shadow-lg">
            Buy the latest snack.
          </p>
          <p className="text-gray-200 text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base font-dm-sans drop-shadow-md">
            The best snack for snacky lovers.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center items-center max-w-2xl mx-auto animate-fade-in-delay-2">
          {/* ... (Tidak berubah) ... */}
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300">
            <span className="text-2xl">⚡</span>
            <span className="text-white font-medium text-sm">Fast Shipping</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300">
            <span className="text-2xl">🛡️</span>
            <span className="text-white font-medium text-sm">2-Year Warranty</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300">
            <span className="text-2xl">✨</span>
            <span className="text-white font-medium text-sm">Premium Quality</span>
          </div>
        </div>

        {/* CTA Button (Warna #cb6112) */}
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center gap-3 font-bold px-12 py-5 text-xl w-fit mt-4
                       bg-gradient-to-r from-[#cb6112] via-yellow-400 to-[#cb6112] bg-[length:200%_100%] 
                       hover:bg-right-bottom text-black rounded-full
                       shadow-[0_0_30px_rgba(203,97,18,0.4)] hover:shadow-[0_0_50px_rgba(203,97,18,0.7)]
                       transform hover:scale-105 transition-all duration-500
                       max-md:text-lg max-md:px-10 max-md:py-4 max-sm:text-base max-sm:px-8 max-sm:py-3
                       animate-bounce-subtle overflow-hidden"
        >
          {/* ... (Tidak berubah) ... */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative z-10 font-dm-sans">SHOP NOW</span>
          <svg className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>


        {/* --- 3 CARD BERJEJER DENGAN KONTEN YANG KONSISTEN & GAMBAR YANG TERLIHAT PENUH --- */}
        <div className="mt-12 relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card Kiri (Gambar brand1.png - Eloqo Cookies) */}
          <ProductCard
            title="Eloqo Cookies"
            description="Variasi cookies premium dengan rasa unik."
            imageUrl="/assets/brand1.png" // Path dari public/assets/brand1.png
            price="$15"
          />

          {/* Card Tengah (Gambar brand2.png - Eloqo Rasa Usus) */}
          <ProductCard
            title="Eloqo Rasa Usus"
            description="Produk Eloqo rasa usus yang gurih."
            imageUrl="/assets/brand2.png" // Path dari public/assets/brand2.png
            price="$10"
          />

          {/* Card Kanan (Placeholder) */}
          <ProductCard
            title="New Product"
            description="Nantikan produk terbaru kami yang inovatif!"
            // Tidak ada imageUrl, jadi akan otomatis pakai placeholder
            price="$20"
          />

        </div>

      </div>

      {/* ... (Style JSX tetap sama) ... */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes glow-new {
          0%, 100% {
            text-shadow: 0 0 20px rgba(203, 97, 18, 0.5),
                         0 0 40px rgba(203, 97, 18, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(203, 97, 18, 0.8),
                         0 0 60px rgba(203, 97, 18, 0.5);
          }
        }

        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.3s both; }
        .animate-fade-in-delay-2 { animation: fade-in 1s ease-out 0.6s both; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-glow-new {
          animation: glow-new 2s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(15px) rotate(-5deg); }
        }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
      `}</style>
      {/* Smooth transition gradient to the next section */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
    </div>
  );
};

export default IntroducingSection;