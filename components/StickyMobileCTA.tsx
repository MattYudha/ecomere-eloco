// *********************
// Role of the component: Sticky bottom CTA bar for mobile purchase
// Name of the component: StickyMobileCTA.tsx
// Developer: Eloco E-commerce Team
// Version: 1.0
// Component call: <StickyMobileCTA product={product} />
// Input parameters: { product: Product }
// Output: Fixed bottom bar with quantity + Buy Now (mobile only)
// *********************

'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { useProductStore } from '@/store/productStore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface StickyMobileCTAProps {
    product: any;
}

const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useAuth();
    const { buyNow, calculateTotals } = useProductStore();

    // Auto-hide when footer is visible
    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                setIsVisible(footerRect.top > windowHeight - 20);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBuyNow = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (product.inStock !== 1) {
            toast.error('Produk sedang tidak tersedia');
            return;
        }

        try {
            setIsLoading(true);

            // Add to cart via buyNow
            buyNow({
                id: product.id.toString(),
                title: product.title,
                price: product.price,
                image: product.mainImage,
                amount: quantity,
            });
            calculateTotals();

            // Small delay to ensure state updates
            await new Promise(resolve => setTimeout(resolve, 100));

            // Navigate to checkout
            router.push('/checkout');
        } catch (error) {
            console.error('Error during buy now:', error);
            toast.error('Terjadi kesalahan, silakan coba lagi');
            setIsLoading(false);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Don't render on desktop or if product out of stock
    if (product.inStock !== 1) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 md:hidden z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
            {/* Glassmorphism Bar */}
            <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-t border-white/20 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Compact Quantity Selector */}
                        <div className="flex items-center gap-2 backdrop-blur-xl bg-white/40 dark:bg-white/10 rounded-xl p-1 border border-white/30">
                            <button
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-white/20 hover:bg-white/80 dark:hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[44px] min-h-[44px]"
                                aria-label="Kurangi jumlah"
                            >
                                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">−</span>
                            </button>

                            <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
                                {quantity}
                            </span>

                            <button
                                onClick={incrementQuantity}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-white/20 hover:bg-white/80 dark:hover:bg-white/30 transition-all active:scale-95 min-w-[44px] min-h-[44px]"
                                aria-label="Tambah jumlah"
                            >
                                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">+</span>
                            </button>
                        </div>

                        {/* Buy Now Button */}
                        <button
                            onClick={handleBuyNow}
                            disabled={isLoading}
                            className="flex-1 h-12 min-h-[48px] bg-gradient-to-r from-[#cb6112] to-[#e07d2e] hover:from-[#b55510] hover:to-[#cb6112] text-white font-bold rounded-xl shadow-lg active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Memproses...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <span>Beli Sekarang</span>
                                    <span className="text-sm opacity-90">
                                        {formatPrice(product.price * quantity)}
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyMobileCTA;
