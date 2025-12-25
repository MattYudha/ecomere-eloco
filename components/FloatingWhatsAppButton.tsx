// *********************
// Role of the component: Floating WhatsApp button for customer support
// Name of the component: FloatingWhatsAppButton.tsx
// Developer: Eloco E-commerce Team
// Version: 1.0
// Component call: <FloatingWhatsAppButton />
// Input parameters: None (uses general WhatsApp link)
// Output: Sticky floating button at bottom-right
// *********************

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeneralWhatsAppLink, openWhatsApp } from '@/lib/whatsapp';

const FloatingWhatsAppButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Show button after scrolling down a bit
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-show tooltip once after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 5000); // Hide after 5 seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        const link = getGeneralWhatsAppLink();
        openWhatsApp(link);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-[9998] flex items-center gap-3"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 10, opacity: 0 }}
                                className="hidden md:block backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 px-4 py-2 rounded-xl shadow-lg border border-white/20"
                            >
                                <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    Butuh bantuan? Chat kami!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* WhatsApp Button */}
                    <motion.button
                        onClick={handleClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                        aria-label="Chat via WhatsApp"
                    >
                        {/* Pulse animation */}
                        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

                        {/* WhatsApp Icon */}
                        <svg
                            className="w-8 h-8 md:w-9 md:h-9 text-white relative z-10"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>

                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingWhatsAppButton;
