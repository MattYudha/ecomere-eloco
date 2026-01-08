'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomArrow = ({ className, style, onClick, direction }: any) => (
    <div
        className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg cursor-pointer transition-all ${direction === 'prev' ? 'left-4' : 'right-4'}`}
        onClick={onClick}
    >
        {direction === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </div>
);

export const DocSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <CustomArrow direction="next" />,
        prevArrow: <CustomArrow direction="prev" />,
        centerMode: true,
        centerPadding: '150px', // Show partial next/prev slides
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerMode: false,
                    centerPadding: '0',
                    arrows: false // Hide arrows on mobile
                }
            }
        ]
    };

    // Using placeholders
    const images = [
        { src: "/api/placeholder/800/450", label: "Quality Control Process" },
        { src: "/api/placeholder/800/450", label: "Our Collaborative Team" },
        { src: "/api/placeholder/800/450", label: "Warehouse & Logistics" },
    ];

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h2 className="text-3xl font-forum text-gray-900 mb-4">Dokumentasi Kegiatan</h2>
                <p className="text-gray-500 font-dm-sans">Bagian dari proses dan perjalanan kami menghadirkan yang terbaik.</p>
            </div>

            <div className="max-w-[1400px] mx-auto px-0 md:px-6">
                <Slider {...settings}>
                    {images.map((img, index) => (
                        <div key={index} className="px-2 md:px-4 outline-none">
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white">
                                <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center text-gray-400 font-dm-sans">
                                    {/* Placeholder Fallback if image fails */}
                                    <span className="text-lg">{img.label}</span>
                                </div>
                                {/* In real implementation, use Image component. For now, using div background or just placeholder text container to avoid broken image icons if API placeholder fails */}
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm font-medium text-gray-600 font-dm-sans">{img.label}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
