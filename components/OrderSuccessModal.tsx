import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderSuccessModalProps {
    isOpen: boolean;
    orderNumber?: string;
    customerName?: string;
    onClose?: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
    isOpen,
    orderNumber = '###',
    customerName = 'Customer',
    onClose,
}) => {
    const router = useRouter();

    const handleViewOrders = () => {
        router.push('/');
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile: Modal with Backdrop (< md) */}
            <div className="md:hidden fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Top Decorative Bar */}
                    <div className="h-2 bg-gradient-to-r from-grilli-gold via-orange-400 to-grilli-gold"></div>

                    {/* Modal Content */}
                    <div className="px-8 py-10 text-center">
                        {/* Success Icon with Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                            transition={{
                                scale: { type: 'spring', stiffness: 200, damping: 15, delay: 0.1 },
                                rotate: { duration: 0.5, delay: 0.3 }
                            }}
                            className="mx-auto mb-6"
                        >
                            <div className="relative">
                                {/* Outer Glow Ring */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.2, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 -m-4 bg-gradient-to-r from-grilli-gold/30 to-orange-400/30 rounded-full blur-xl"
                                />

                                {/* Success Badge */}
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-br from-grilli-gold to-orange-500 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={48} className="text-grilli-gold" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Success Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                        >
                            Pesanan Berhasil!
                        </motion.h1>

                        {/* Success Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-grilli-gold font-semibold text-lg mb-6"
                        >
                            Terima kasih, {customerName}
                        </motion.p>

                        {/* Order Number */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-4 mb-6"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nomor Pesanan</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{orderNumber}</p>
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-600 dark:text-gray-300 space-y-3 mb-8"
                        >
                            <p className="text-base leading-relaxed">
                                Pesanan Anda telah berhasil diterima dan sedang dalam proses verifikasi oleh tim kami.
                            </p>
                            <p className="text-sm font-medium">
                                Tim kami akan segera menghubungi Anda untuk konfirmasi pesanan dan pembayaran melalui WhatsApp.
                            </p>
                        </motion.div>

                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-3 gap-3 mb-8"
                        >
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                                <Package size={24} className="mx-auto mb-2 text-grilli-gold" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Diverifikasi</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                                <Phone size={24} className="mx-auto mb-2 text-grilli-gold" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Dikonfirmasi</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                                <Truck size={24} className="mx-auto mb-2 text-grilli-gold" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Dikirim</p>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-3"
                        >
                            <button
                                onClick={handleViewOrders}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-grilli-gold to-orange-500 text-white font-bold shadow-lg shadow-grilli-gold/30 hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                Kembali ke Beranda
                            </button>

                            <Link href="/shop" className="block">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Lanjut Belanja
                                </button>
                            </Link>
                        </motion.div>

                        {/* Security Notice */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Pembayaran Anda diproses dengan aman</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Desktop: Full-Screen Page (>= md) */}
            <div className="hidden md:block fixed inset-0 z-[200] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto">
                <div className="min-h-screen flex items-center justify-center p-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-2xl"
                    >
                        {/* Main Success Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                            {/* Top Decorative Bar */}
                            <div className="h-3 bg-gradient-to-r from-grilli-gold via-orange-400 to-grilli-gold"></div>

                            {/* Content */}
                            <div className="px-12 py-16 text-center">
                                {/* Success Icon with Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                                    transition={{
                                        scale: { type: 'spring', stiffness: 200, damping: 15, delay: 0.1 },
                                        rotate: { duration: 0.5, delay: 0.3 }
                                    }}
                                    className="mx-auto mb-8"
                                >
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0.2, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 -m-6 bg-gradient-to-r from-grilli-gold/30 to-orange-400/30 rounded-full blur-2xl"
                                        />

                                        {/* Success Badge */}
                                        <div className="relative w-32 h-32 mx-auto">
                                            <div className="absolute inset-0 bg-gradient-to-br from-grilli-gold to-orange-500 rounded-full animate-pulse"></div>
                                            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={64} className="text-grilli-gold" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Success Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    Pesanan Berhasil!
                                </motion.h1>

                                {/* Success Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-grilli-gold font-semibold text-2xl mb-8"
                                >
                                    Terima kasih, {customerName}
                                </motion.p>

                                {/* Order Number */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-6 mb-8 max-w-md mx-auto"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nomor Pesanan</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{orderNumber}</p>
                                </motion.div>

                                {/* Message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-gray-600 dark:text-gray-300 space-y-4 mb-10 max-w-xl mx-auto"
                                >
                                    <p className="text-lg leading-relaxed">
                                        Pesanan Anda telah berhasil diterima dan sedang dalam proses verifikasi oleh tim kami.
                                    </p>
                                    <p className="text-base font-medium">
                                        Tim kami akan segera menghubungi Anda untuk konfirmasi pesanan dan pembayaran melalui WhatsApp.
                                    </p>
                                </motion.div>

                                {/* Info Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto"
                                >
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 text-center">
                                        <Package size={32} className="mx-auto mb-3 text-grilli-gold" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Diverifikasi</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 text-center">
                                        <Phone size={32} className="mx-auto mb-3 text-grilli-gold" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dikonfirmasi</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 text-center">
                                        <Truck size={32} className="mx-auto mb-3 text-grilli-gold" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dikirim</p>
                                    </div>
                                </motion.div>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex gap-4 max-w-md mx-auto"
                                >
                                    <button
                                        onClick={handleViewOrders}
                                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-grilli-gold to-orange-500 text-white font-bold text-lg shadow-lg shadow-grilli-gold/30 hover:shadow-xl hover:scale-[1.02] transition-all"
                                    >
                                        Kembali ke Beranda
                                    </button>

                                    <Link href="/shop" className="flex-1">
                                        <button
                                            onClick={onClose}
                                            className="w-full py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Lanjut Belanja
                                        </button>
                                    </Link>
                                </motion.div>

                                {/* Security Notice */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Pembayaran Anda diproses dengan aman</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccessModal;
