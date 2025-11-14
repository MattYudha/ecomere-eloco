'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import SimpleSlider from './SimpleSlider';
import Link from 'next/link';
// Hapus CiCalendar, tambahkan IoArrowDown
import { IoArrowDown, IoChevronBack, IoChevronForward } from 'react-icons/io5';

// Custom Arrow Components for react-slick (TIDAK BERUBAH)
const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="slider-btn prev absolute z-10 text-yellow-500 border border-yellow-500 w-[45px] h-[45px] grid place-items-center top-1/2 -translate-y-1/2 left-8 transform rotate-45 transition-all duration-200 hover:bg-yellow-500 hover:text-black"
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <IoChevronBack size={24} className="transform -rotate-45" />
    </button>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="slider-btn next absolute z-10 text-yellow-500 border border-yellow-500 w-[45px] h-[45px] grid place-items-center top-1/2 -translate-y-1/2 right-8 transform rotate-45 transition-all duration-200 hover:bg-yellow-500 hover:text-black"
      onClick={onClick}
      aria-label="Next Slide"
    >
      <IoChevronForward size={24} className="transform -rotate-45" />
    </button>
  );
};

// Konten slides (TIDAK BERUBAH)
const slides = [
  {
    bgImage: '/images/hero-slider-1.jpg',
    subtitle: 'Renyah & Tak Tertandingi',
    title: 'Sensasi Dalam <br/> Setiap Gigitan',
    text: 'Nikmati rangkaian keripik premium kami—perpaduan rasa autentik dan inovasi yang menciptakan pengalaman ngemil tak terlupakan.',
    buttonText: 'Lihat Varian Keripik',
    buttonLink: '/shop',
  },
  {
    bgImage: '/images/hero-slider-2.jpg',
    subtitle: 'Gurih yang Menggugah Selera',
    title: 'Cara Baru <br/> Menikmati Makaroni',
    text: 'Temukan makaroni khas ELOQO dengan cita rasa berani dan tekstur sempurna, dirancang untuk memanjakan setiap momen.',
    buttonText: 'Jelajahi Pilihan Makaroni',
    buttonLink: '/shop',
  },
  {
    bgImage: '/images/hero-slider-3.jpg',
    subtitle: 'Manis, Lembut, & Memikat',
    title: 'Setiap Gigitan <br/> Membawa Kebahagiaan',
    text: 'Rasakan kukis premium lembut di dalam, renyah di luar—diciptakan untuk menghadirkan kehangatan di setiap hari.',
    buttonText: 'Cicipi Kukis Premium',
    buttonLink: '/shop',
  },
  {
    bgImage: '/assets/eloqo.png',
    subtitle: 'Kualitas Terbaik, Rasa Juara',
    title: 'Semua Snack Favoritmu <br/> Ada di Sini',
    text: 'Jelajahi dunia rasa ELOQO, tempat setiap produk dibuat dengan bahan-bahan pilihan untuk kepuasan maksimal.',
    buttonText: 'Belanja Semua Produk',
    buttonLink: '/shop',
  },
];

const Hero = () => {
  return (
    // Saya biarkan min-h-[850px] sesuai kode Anda, meski ini sangat tinggi.
    <section className="relative w-full h-[calc(100vh-51px)] min-h-[750px] overflow-hidden">
      <SimpleSlider
        dots={false}
        infinite={true}
        speed={1000}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={5000}
        pauseOnHover={true}
        fade={true}
        arrows={true}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[calc(100vh-51px)] min-h-[750px] w-full">
            {/* Background Image (Container tidak berubah) */}
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-115 animate-smoothScale"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              {/* --- PERUBAHAN 1: OVERLAY GRADIENT --- */}
              {/* Overlay diubah dari bg-black/70 solid menjadi gradient.
                Lebih gelap di bawah (80%) dan memudar ke atas (20%).
                Ini membuat gambar "bernapas" tapi tetap memberi dasar gelap untuk teks.
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>

            {/* Konten Teks (di tengah) */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-4">
              {/* --- PERUBAHAN 2: TEXT SHADOW --- */}
              {/* Menambahkan text-shadow ke semua teks.
                Ini adalah trik UI paling penting agar teks "pop" / menonjol
                dari background tanpa harus menggelapkan background secara berlebihan.
              */}
              <p
                className="text-lg md:text-2xl font-['DM Sans'] text-yellow-500 uppercase tracking-widest mb-4 animate-sliderReveal [text-shadow:0_2px_6px_rgb(0,0,0/0.7)]"
                style={{ animationDelay: '500ms' }}
              >
                {slide.subtitle}
              </p>
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-['Forum'] uppercase leading-tight mb-6 animate-sliderReveal [text-shadow:0_2px_8px_rgb(0,0,0/0.7)]"
                style={{ animationDelay: '1000ms' }}
                dangerouslySetInnerHTML={{ __html: slide.title }}
              ></h1>
              <p
                className="text-base md:text-lg text-gray-300 max-w-lg mb-8 animate-sliderReveal [text-shadow:0_2px_6px_rgb(0,0,0/0.7)]"
                style={{ animationDelay: '1500ms' }}
              >
                {slide.text}
              </p>
              <Link
                href={slide.buttonLink}
                className="btn bg-grilli-gold text-white hover:bg-yellow-600 animate-sliderReveal"
                style={{ animationDelay: '2000ms' }}
              >
                <span className="text text-1">{slide.buttonText}</span>
                <span className="text text-2" aria-hidden="true">
                  {slide.buttonText}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </SimpleSlider>

      {/* --- PERUBAHAN 3: TOMBOL POJOK --- */}
      {/* Saya melihat ini adalah situs e-commerce, tapi tombolnya "Book A Table" (pesan meja).
        Ini sangat tidak pas. Untuk UI yang "profesional" dan "terstruktur",
        saya menggantinya dengan tombol "Scroll Down" yang lebih umum untuk hero section.
        Ini adalah perubahan besar untuk profesionalitas.
      */}
      <Link
        href="#featured-products" // Tetap mengarah ke featured-products
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/70 hover:text-white hover:text-opacity-100 transition-all duration-300 animate-bounce group"
        aria-label="Scroll to next section"
      >
        <span className="font-['DM Sans'] text-xs uppercase tracking-widest mb-1">
          Scroll
        </span>
        <IoArrowDown size={20} />
      </Link>
    </section>
  );
};

export default Hero;