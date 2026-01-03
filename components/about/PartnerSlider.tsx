'use client';

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Placeholder SVG for logos
const LogoPlaceholder = ({ name }: { name: string }) => (
    <div className="flex items-center justify-center h-16 w-32 mx-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
        <div className="bg-gray-200 text-gray-400 font-bold text-xs rounded px-3 py-1">
            {name}
        </div>
    </div>
);

export const PartnerSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 3000, // Slow continuous-like integration
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // Autoplay interval
        cssEase: "linear",
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 }
            }
        ]
    };

    const partners = ["Partner A", "Partner B", "Partner C", "Partner D", "Partner E", "Partner F"];

    return (
        <section className="py-20 bg-white overflow-hidden border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-forum text-gray-900 mb-2">Partner Kami</h2>
                    <p className="text-sm text-gray-500 font-dm-sans">Dipercaya dan bekerja sama dengan berbagai mitra terbaik.</p>
                </div>

                <Slider {...settings} className="partner-slider">
                    {partners.map((partner, index) => (
                        <div key={index} className="px-4 py-2">
                            <LogoPlaceholder name={partner} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
