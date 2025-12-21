'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext'; // Pastikan path ini sesuai

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Define dynamic background styles
  // Dark Mode: Elegant Deep Blue dengan "Aurora" glow dari bawah berwarna Tembaga
  const footerBgStyle =
    theme === 'dark'
      ? {
        background:
          'radial-gradient(ellipse at bottom, rgba(203,97,18,0.2), #0f172a 80%)',
        backgroundColor: '#0f172a',
      }
      : {
        background: 'linear-gradient(to top, #ffffff, rgba(203,97,18,0.05))',
        backgroundColor: '#ffffff',
      };

  return (
    <footer
      className="text-gray-800 dark:text-gray-200 font-['DM_Sans'] relative z-20 border-t-2 border-[#cb6112]/30"
      style={footerBgStyle}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand and About */}
          <div className="space-y-6 md:col-span-1">
            <Link
              href="/"
              className="text-3xl font-bold font-['Forum'] text-gray-900 dark:text-white tracking-wide block"
            >
              <span className="text-[#cb6112]">ELOQO</span>.CO
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Delivering premium snacks with authentic flavors. Experience the
              quality and taste in every bite, crafted for perfection.
            </p>
            <div className="flex space-x-5 pt-2">
              <Link
                href="https://www.instagram.com/eloqo.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#cb6112] dark:hover:text-[#cb6112] transition-all transform hover:scale-110"
              >
                <FaInstagram size={22} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-widest uppercase font-['Forum'] relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#cb6112]"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'Shop All', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={
                      item === 'Home'
                        ? '/'
                        : `/${item.toLowerCase().replace(' ', '-')}`
                    }
                    className="text-gray-600 dark:text-gray-400 hover:text-[#cb6112] dark:hover:text-[#cb6112] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#cb6112] transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-widest uppercase font-['Forum'] relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#cb6112]"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'FAQ',
                'Shipping Policy',
                'Return Policy',
                'Privacy Policy',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#cb6112] dark:hover:text-[#cb6112] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#cb6112] transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div className="space-y-6 md:col-span-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-widest uppercase font-['Forum'] relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#cb6112]"></span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to get the latest news, exclusive offers, and delicious
              updates.
            </p>
            <form action="#" className="w-full">
              <div
                className="flex items-center rounded-full p-1.5 
                            bg-white/10 dark:bg-white/5 backdrop-blur-md 
                            border border-gray-200 dark:border-white/10 
                            focus-within:border-[#cb6112] dark:focus-within:border-[#cb6112] 
                            transition-all shadow-sm"
              >
                <input
                  type="email"
                  name="email_address"
                  placeholder="Your email..."
                  autoComplete="off"
                  className="w-full bg-transparent px-4 py-2 text-gray-800 dark:text-white placeholder-gray-500 text-sm focus:outline-none"
                />
                <motion.button
                  type="submit"
                  className="bg-[#cb6112] text-white font-semibold py-2 px-6 rounded-full text-sm shadow-lg shadow-orange-500/20"
                  whileHover={{ scale: 1.05, backgroundColor: '#d97720' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ELOQO.CO. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#cb6112] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-[#cb6112] transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
