'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CiShoppingBasket, CiUser } from 'react-icons/ci';
import { IoIosLogOut } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';
import { Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import SearchInput from './SearchInput';
import HeartElement from './HeartElement';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
const Header = () => {
  const { data: session } = useAuth();
  const pathname = usePathname();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- 1. Fix Hydration Error ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 2. Scroll Detection Logic ---
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isScrolling = latest > 50; // Trigger sedikit lebih bawah agar transisi lebih kerasa
    if (isScrolled !== isScrolling) {
      setIsScrolled(isScrolling);
    }
  });

  // --- 3. Click Outside Dropdown ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- 4. Close Mobile Menu on Route Change ---
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!mounted) return null;

  // --- 5. ULTRA-MODERN FLOATING CAPSULE VARIANTS ---
  const headerVariants = {
    top: {
      width: '100%', // Lebar penuh
      maxWidth: '100%',
      top: 0,
      y: 0,
      borderRadius: '0px', // Sudut tajam
      backgroundColor: 'rgba(255, 255, 255, 0)',
      height: '90px',
      boxShadow: 'none',
      border: '1px solid transparent',
      backdropFilter: 'blur(8px) saturate(180%)', // Added liquid glass blur
    },
    scrolled: {
      width: '90%', // Mengecil (Floating effect)
      maxWidth: '1280px', // Batas lebar maksimal agar rapi di layar ultra-wide
      top: 15, // Turun sedikit dari atas
      y: 0,
      borderRadius: '24px', // Sudut membulat (Pill/Capsule shape)
      backgroundColor:
        theme === 'dark'
          ? 'rgba(15, 23, 42, 0.3)' // Dark Blue Glass (lebih transparan)
          : 'rgba(255, 255, 255, 0.3)', // White Glass (lebih transparan)
      height: '70px',
      boxShadow: 'none', // Menghilangkan shadow
      border: '1px solid transparent', // Menghilangkan border
      backdropFilter: 'blur(16px) saturate(180%)',
    },
  };

  return (
    <>
      <motion.header
        className="fixed z-50 left-1/2" // Penting: left-1/2 untuk centering saat width mengecil
        style={{ x: '-50%' }} // Centering technique
        variants={headerVariants}
        initial="top"
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Soft spring animation
      >
        <div className="w-full h-full px-6 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={56}
              height={56}
              className={`transition-all duration-500 ease-out ${isScrolled ? 'h-9 w-9' : 'h-12 w-12'}`}
            />
            <h1
              className={`font-bold font-['Forum'] transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'} text-slate-900 dark:text-white`}
            >
              <span className="text-[#cb6112]">ELOQO</span>
              <span>.CO</span>
            </h1>
          </Link>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <div
              className={`hidden md:block transition-all duration-500 origin-right ${isScrolled ? 'scale-90 opacity-0 w-0 overflow-hidden' : 'scale-100 opacity-100 w-auto'}`}
            >
              {/* Search Input hidden on scroll to save space for cleaner look, or remove this condition if you want it always */}
              <SearchInput />
            </div>

            {/* Admin Link */}
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden md:block text-slate-800 dark:text-white hover:text-[#cb6112] transition-colors p-2 rounded-full hover:bg-orange-50 dark:hover:bg-slate-800"
              >
                <LuLayoutDashboard size={20} />
              </Link>
            )}

            <NotificationBell />

            {/* User Dropdown */}
            {session?.user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-white hover:text-[#cb6112] transition-colors px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <CiUser size={24} />
                  {/* Nama user disembunyikan saat scroll agar lebih compact */}
                  <span
                    className={`hidden lg:block font-medium text-sm transition-all duration-300 ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}
                  >
                    {session.user.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu Glass */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-6 w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 py-2 z-20 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                          Account
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {session?.user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-[#cb6112] transition-all"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LuLayoutDashboard size={18} /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, { method: 'POST' })
                            .then(() => window.location.reload());
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <IoIosLogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-full border border-[#cb6112]/50 text-[#cb6112] hover:border-[#cb6112] hover:bg-[#cb6112] hover:text-white transition-all text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link
              href="/wishlist"
              className={`hidden md:block hover:scale-110 transition-transform ${isScrolled ? 'text-slate-800 dark:text-white' : ''}`}
            >
              <HeartElement wishQuantity={wishlist.length} />
            </Link>

            <Link
              href="/cart"
              className="relative hidden md:block text-slate-800 dark:text-white hover:text-[#cb6112] transition-colors p-1"
            >
              <CiShoppingBasket size={26} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#cb6112] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-800 dark:text-white hover:text-[#cb6112] transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.header >

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {
          isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
                onClick={closeMobileMenu}
              />
              <motion.div
                className="fixed right-0 top-0 w-[85%] max-w-sm h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-[70] flex flex-col overflow-hidden border-l border-white/20"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                {/* Mobile Menu Header */}
                <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-transparent to-[#cb6112]/5">
                  <h2 className="text-xl font-bold font-['Forum'] text-[#cb6112] tracking-widest">
                    MENU
                  </h2>
                  <button
                    className="text-gray-500 hover:text-[#cb6112] hover:rotate-90 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                  <SearchInput />

                  <div className="flex flex-col gap-2">
                    {/* User Info Card */}
                    {session?.user ? (
                      <div className="bg-[#cb6112]/5 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 mb-4 border border-[#cb6112]/10">
                        <div className="h-10 w-10 bg-gradient-to-br from-[#cb6112] to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-[#cb6112] font-medium tracking-wide">
                            MEMBER
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-lg font-medium transition-colors"
                      >
                        Home
                      </Link>
                      <Link
                        href="/shop"
                        onClick={closeMobileMenu}
                        className="block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-lg font-medium transition-colors"
                      >
                        Shop
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={closeMobileMenu}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-lg font-medium transition-colors"
                      >
                        <span>Wishlist</span>
                        <span className="bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                          {wishlist.length}
                        </span>
                      </Link>

                      <Link
                        href="/cart"
                        onClick={closeMobileMenu}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-lg font-medium transition-colors"
                      >
                        <span>Cart</span>
                        <span className="bg-[#cb6112] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md shadow-orange-200 dark:shadow-none">
                          {totalItems}
                        </span>
                      </Link>

                      {session?.user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={closeMobileMenu}
                          className="block p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 text-[#cb6112] font-bold mt-2"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        App Appearance
                      </span>
                      <ThemeToggle />
                    </div>

                    {session?.user ? (
                      <button
                        onClick={() => {
                          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, { method: 'POST' })
                            .then(() => window.location.reload());
                          closeMobileMenu();
                        }}
                        className="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex justify-center items-center gap-2"
                      >
                        <IoIosLogOut size={20} /> Log Out
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href="/login"
                          onClick={closeMobileMenu}
                          className="py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-center font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={closeMobileMenu}
                          className="py-3.5 rounded-xl bg-[#cb6112] text-white text-center font-bold shadow-lg shadow-[#cb6112]/20 hover:shadow-[#cb6112]/40 transition-all"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
};

export default Header;
