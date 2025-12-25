'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShoppingCart,
    FaTruck,
    FaWhatsapp,
    FaChevronUp,
    FaChevronDown,
} from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import TrustBadges from './TrustBadges';
import DeliveryEstimate from './DeliveryEstimate';

interface CartItem {
    id: string;
    title: string;
    mainImage: string;
    price: number;
    quantity: number;
}

interface StickyOrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shipping?: number;
    tax?: number;
    total: number;
    showWhatsApp?: boolean;
    whatsAppNumber?: string;
    className?: string;
    onCheckout?: () => void;
    showCheckout?: boolean;
}

const StickyOrderSummary: React.FC<StickyOrderSummaryProps> = ({
    items,
    subtotal,
    shipping = 0,
    tax = 0,
    total,
    showWhatsApp = true,
    whatsAppNumber = '6281234567890', // Default WA number
    className = '',
    onCheckout,
    showCheckout = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(
            `Halo! Saya ingin bertanya tentang pesanan saya.\n\nTotal: ${formatPrice(total)}\nJumlah item: ${items.length}`
        );
        window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
    };

    return (
        <>
            {/* Desktop Sticky Summary */}
            <div
                className={`hidden lg:block sticky top-24 ${className}`}
                style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FaShoppingCart className="text-grilli-gold" />
                                Ringkasan Pesanan
                            </h3>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {isExpanded ? (
                                    <FaChevronUp className="text-gray-400" size={16} />
                                ) : (
                                    <FaChevronDown className="text-gray-400" size={16} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {items.length} Item{items.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                {/* Items List */}
                                <div className="p-6 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                                        >
                                            <div className="relative w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.mainImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-bold text-grilli-gold mt-1">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Estimate */}
                                <div className="px-6 pt-4">
                                    <DeliveryEstimate />
                                </div>

                                {/* Price Breakdown */}
                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Subtotal
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    {shipping > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <FaTruck size={12} />
                                                Ongkir
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(shipping)}
                                            </span>
                                        </div>
                                    )}

                                    {tax > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Pajak
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(tax)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                                        <span className="text-base font-bold text-gray-900 dark:text-white">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-grilli-gold">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="px-4 pb-2 pt-1">
                                    <TrustBadges />
                                </div>

                                {/* WhatsApp Contact */}
                                {showWhatsApp && (
                                    <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <FaWhatsapp size={20} />
                                            Tanya via WhatsApp
                                        </button>
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                                            Butuh bantuan? Chat dengan kami
                                        </p>
                                    </div>
                                )}

                                {/* Checkout Button - Desktop */}
                                {showCheckout && onCheckout && (
                                    <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={onCheckout}
                                            className="w-full py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-grilli-gold/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <span>Lanjut ke Checkout</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            🔒 Pembayaran aman & terpercaya
                                        </p>
                                    </div>
                                )}

                                {/* Payment Info */}
                                <div className="p-6 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-100 dark:border-orange-800">
                                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 leading-relaxed">
                                        💳 <strong>Pembayaran via WhatsApp</strong>
                                        <br />
                                        Tim kami akan menghubungi Anda untuk konfirmasi pembayaran
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Floating Bottom Summary */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
                {/* Collapsed View */}
                <button
                    onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                    className="w-full p-4 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-grilli-gold to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-grilli-gold/30">
                            {items.length}
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Total Pesanan
                            </p>
                            <p className="text-lg font-bold text-grilli-gold">
                                {formatPrice(total)}
                            </p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isMobileExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaChevronUp className="text-gray-400" size={20} />
                    </motion.div>
                </button>

                {/* Expanded Mobile View */}
                <AnimatePresence>
                    {isMobileExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                        >
                            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                                {/* Items */}
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 items-start pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <div className="relative w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.mainImage}
                                                alt={item.title}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {item.quantity}x {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-grilli-gold">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}

                                {/* Price Summary */}
                                <div className="pt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    {shipping > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Ongkir
                                            </span>
                                            <span className="font-medium">
                                                {formatPrice(shipping)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <span>Total</span>
                                        <span className="text-grilli-gold">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Trust Badges - Mobile */}
                                <div className="mt-3">
                                    <TrustBadges />
                                </div>

                                {/* WhatsApp Button */}
                                {showWhatsApp && (
                                    <button
                                        onClick={handleWhatsAppClick}
                                        className="w-full mt-3 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FaWhatsapp size={18} />
                                        Tanya via WhatsApp
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default StickyOrderSummary;
