"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CiShoppingBasket, CiUser, CiLocationOn, CiTimer, CiPhone, CiMail } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { Menu, X } from "lucide-react"; // Import Menu and X icons
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import SearchInput from "./SearchInput";
import HeartElement from "./HeartElement";
import { user } from "@prisma/client";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle"; // Added import for ThemeToggle
import { useRef } from "react"; // Import useRef
import { Session } from "next-auth"; // Import Session type

interface HeaderProps {}

const HEADER_TOP_HEIGHT = 0; // Approximate height of the top bar in pixels

const Header = ({}: HeaderProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="w-full z-50 fixed top-0 transition-all duration-300">
      {/* Main Header Section */}
      <div className={`w-full transition-all duration-300 ${isSticky ? 'bg-black/80 shadow-lg py-2 backdrop-blur-md' : 'bg-transparent py-4'}`}
           style={{ top: '0px' }}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="Logo" width={64} height={64} className="h-16 w-16 mb-1" />
            <h1 className="text-3xl font-bold text-white font-['Forum'] mb-1">
              <span className="text-yellow-500">ELOQO</span>
              <span className="text-white">.CO</span>
            </h1>
          </Link>

          {/* E-commerce Actions */}
          <div className="flex items-center gap-6">
            {/* Search Input - Desktop */}
            <div className="hidden md:block">
              <SearchInput />
            </div>

            {/* Admin Dashboard Link - Desktop */}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="hidden md:block text-white hover:text-yellow-500 transition-colors duration-200">
                <LuLayoutDashboard size={24} />
              </Link>
            )}
            {/* Notification Bell - Desktop */}
            <NotificationBell />

            {/* User Dropdown / Login-Register - Desktop */}
            {session?.user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <CiUser size={24} />
                  <span className="hidden lg:block">{session.user.name}</span>
                </div>
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 dark:bg-gray-800 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                  {session?.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LuLayoutDashboard />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <IoIosLogOut />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2"
                >
                  <CiUser size={24} />
                  <span className="hidden lg:block">Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2"
                >
                  <span className="hidden lg:block">Register</span>
                </Link>
              </div>
            )}

            {/* Theme Toggle - Desktop */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {/* Wishlist - Desktop */}
            <div className="hidden md:block">
              <HeartElement wishQuantity={wishlist.length} />
            </div>

            {/* Cart - Desktop */}
            <Link href="/cart" className="relative hidden md:block text-white hover:text-yellow-500">
              <CiShoppingBasket size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Menu Button - Mobile */}
            <button
              className="md:hidden text-white hover:text-yellow-500 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu}></div> {/* Overlay background */}
        <div className="absolute right-0 top-0 w-64 h-full bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-lg flex flex-col p-6 text-white">
          {/* Close Button */}
          <button
            className="self-end text-white hover:text-yellow-500 transition-colors duration-200 mb-6"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X size={28} />
          </button>

          {/* Mobile Menu Content */}
          <div className="flex flex-col gap-6 flex-grow">
            {/* Search Input - Mobile */}
            <SearchInput />

            {/* Admin Dashboard Link - Mobile */}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="flex items-center gap-3 text-lg hover:text-yellow-500 transition-colors duration-200" onClick={closeMobileMenu}>
                <LuLayoutDashboard size={24} />
                Admin Dashboard
              </Link>
            )}

            {/* User Dropdown / Login-Register - Mobile */}
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 text-lg">
                  <CiUser size={24} />
                  <span>{session.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-3 text-lg text-left hover:text-yellow-500 transition-colors duration-200"
                >
                  <IoIosLogOut size={24} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-3 text-lg hover:text-yellow-500 transition-colors duration-200" onClick={closeMobileMenu}>
                  <CiUser size={24} />
                  Login
                </Link>
                <Link href="/register" className="flex items-center gap-3 text-lg hover:text-yellow-500 transition-colors duration-200" onClick={closeMobileMenu}>
                  Register
                </Link>
              </>
            )}

            {/* Wishlist - Mobile */}
            <Link href="/wishlist" className="flex items-center gap-3 text-lg hover:text-yellow-500 transition-colors duration-200" onClick={closeMobileMenu}>
              <HeartElement wishQuantity={wishlist.length} />
              Wishlist
            </Link>

            {/* Cart - Mobile */}
            <Link href="/cart" className="relative flex items-center gap-3 text-lg hover:text-yellow-500 transition-colors duration-200" onClick={closeMobileMenu}>
              <CiShoppingBasket size={24} />
              Cart
              {totalItems > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Theme Toggle - Mobile */}
            <div className="mt-auto pt-6 border-t border-white/20">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;