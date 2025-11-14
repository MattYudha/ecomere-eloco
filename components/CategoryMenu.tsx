'use client';

// *********************
// Role of the component: Category wrapper (UI IMPROVED)
// Name of the component: CategoryMenu.tsx
// Developer: [Your Name] & AI Improvement
// Version: 2.1 (Fix multi-line string error)
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and new category cards
// *********************

import React from "react";
import Link from "next/link";
// Hapus import CategoryItem dan categoryMenuList
// Hapus import Image

// --- DAFTAR KATEGORI BARU ---
const newCategories = [
  {
    id: 1,
    title: "Keripik Usus",
    href: "/shop/usus", // Pastikan link ini sesuai
    icon: "🐔", // Contoh ikon
    description: "Renyah, gurih, dan otentik"
  },
  {
    id: 2,
    title: "Makaroni",
    href: "/shop/makaroni",
    icon: "🍝",
    description: "Bumbu premium, bikin nagih"
  },
  {
    id: 3,
    title: "Seblak Lewu",
    href: "/shop/lewu",
    icon: "🌶️",
    description: "Pedas mantap, kuah kental"
  },
  {
    id: 4,
    title: "Keripik Singkong",
    href: "/shop/singkong",
    icon: "🍠",
    description: "Irisan tipis, rasa klasik"
  },
  {
    id: 5,
    title: "Cookies",
    href: "/shop/cookies",
    icon: "🍪",
    description: "Manis sempurna, lumer di mulut"
  },
];

const CategoryMenu = () => {
  return (
    <div
      className="relative py-24 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* 1. Overlay Gradient (Seperti IntroducingSection) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      
      {/* 2. Grid Pattern Overlay (Seperti IntroducingSection) */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(203,97,18,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(203,97,18,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6">
        
        {/* 3. Judul yang Di-improve (Seperti IntroducingSection) */}
        <h2 className="text-white text-5xl md:text-7xl font-extrabold text-center mb-16 font-forum leading-tight animate-slide-up">
          JELAJAHI VARIAN{' '}
          <span className="relative inline-block">
            <span className="text-[#cb6112] relative z-10 animate-glow-new">RASA KAMI</span>
            <span className="absolute inset-0 blur-2xl bg-[#cb6112]/50 animate-pulse"></span>
          </span>
        </h2>
        
        {/* 4. Grid Kategori yang Baru dan Responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          {/* 5. Looping Kategori Baru & Desain Kartu Kaca */}
          {newCategories.map((item, index) => (
            <Link
              href={item.href}
              key={item.id}
              // --- PERBAIKAN 1: className INI DIJADIKAN SATU BARIS ---
              className="relative group h-full p-6 text-center bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col justify-between"
              style={{ animation: `fade-in 1s ease-out ${index * 150}ms both` }}
            >
              <div className="relative z-10">
                {/* Efek Glow di belakang kartu (Seperti IntroducingSection) */}
                {/* --- PERBAIKAN 2: className INI DIJADIKAN SATU BARIS --- */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#cb6112] to-yellow-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                </div>

                {/* Konten Kartu */}
                <div className="relative">
                  <span className="text-6xl mb-4 block" role="img" aria-label={item.title}>
                    {item.icon}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-2 font-dm-sans">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm font-dm-sans mb-4">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <span className="relative z-10 mt-4 text-xs text-[#cb6112] font-semibold uppercase tracking-wider group-hover:text-yellow-400 transition-colors">
                Lihat Koleksi →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Menambahkan Keyframes Animasi (diperlukan untuk 'animate-glow-new') */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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
        .animate-glow-new { animation: glow-new 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CategoryMenu;