'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileBottomNav = () => {
    const pathname = usePathname();
    const { cart } = useCart();
    const { data: session } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Smart scroll detection to hide/show nav
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling up or at top
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            }
            // Hide when scrolling down significantly
            else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: Home
        },
        {
            label: 'Shop',
            href: '/shop',
            icon: ShoppingBag
        },
        {
            label: 'Cart',
            href: '/cart',
            icon: ShoppingCart,
            badge: totalItems > 0 ? totalItems : null
        },
        {
            label: session ? 'Account' : 'Login',
            href: session ? '/account' : '/login',
            icon: User
        }
    ];

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe"
                >
                    {/* Glassmorphism Background */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-around items-center h-16 px-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive
                                                ? 'text-[#cb6112]'
                                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        <div className="relative">
                                            <item.icon
                                                size={24}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
                                            />

                                            {/* Badge for Cart */}
                                            {item.badge && (
                                                <span className="absolute -top-2 -right-2 bg-[#cb6112] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                                            {item.label}
                                        </span>

                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navIndicator"
                                                className="absolute -top-[1px] w-8 h-1 bg-[#cb6112] rounded-b-full shadow-[0_2px_8px_rgba(203,97,18,0.5)]"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
