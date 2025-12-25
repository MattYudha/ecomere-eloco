'use client';

import { useProductStore } from '@/app/_zustand/store';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck, FaClock, FaXmark, FaHeart, FaTrash } from 'react-icons/fa6';
import QuantityInputCart from '@/components/QuantityInputCart';
import { sanitize } from '@/lib/sanitize';
import { formatPrice } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';
import CheckoutStepper from '@/components/CheckoutStepper';
import StickyOrderSummary from '@/components/StickyOrderSummary';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const CartModule = () => {
    const {
        products,
        removeFromCart,
        calculateTotals,
        total,
        clearCart,
        selectedItems,
        setSelectedItems,
        toggleSelectItem,
        selectAllItems
    } = useProductStore();
    const router = useRouter();
    const { data: session, status } = useAuth();

    useEffect(() => {
        calculateTotals();
        // Auto-select all items when products change (if selectedItems is empty)
        if (products.length > 0 && selectedItems.length === 0) {
            selectAllItems();
        }
    }, [calculateTotals, products, selectedItems.length, selectAllItems]);

    const handleRemoveItem = (id: string, title: string) => {
        removeFromCart(id);
        calculateTotals();
        toast.success(`${title} dihapus dari keranjang`);
    };

    const handleMoveToWishlist = (id: string, title: string) => {
        // TODO: Implement move to wishlist functionality
        removeFromCart(id);
        calculateTotals();
        toast.success(`${title} dipindahkan ke wishlist`, {
            icon: '❤️',
        });
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error('Pilih minimal satu item untuk checkout');
            return;
        }
        // TODO: Filter products based on selected items before checkout
        router.push('/checkout');
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === products.length) {
            setSelectedItems([]);
        } else {
            selectAllItems();
        }
    };

    // Calculate total for selected items only
    const selectedTotal = useMemo(() => {
        return products
            .filter(p => selectedItems.includes(p.id))
            .reduce((sum, p) => sum + (p.price * p.amount), 0);
    }, [products, selectedItems]);

    // Transform products for StickyOrderSummary
    const cartItems = useMemo(() => {
        return products.map((product) => ({
            id: product.id,
            title: product.title,
            mainImage: product.image?.startsWith('http')
                ? product.image
                : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`,
            price: product.price,
            quantity: product.amount, // Use 'amount' from ProductInCart type
        }));
    }, [products]);

    // Clear cart when user logs out
    useEffect(() => {
        if (status === 'unauthenticated') {
            clearCart();
        }
    }, [status, clearCart]);

    // Show login prompt if not authenticated
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen">
                <EmptyState
                    variant="cart"
                    title="Login Diperlukan"
                    description="Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang"
                    actionLabel="Login Sekarang"
                    actionHref="/login"
                />
            </div>
        );
    }

    // Show loading state while checking auth
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat keranjang...</p>
                </div>
            </div>
        );
    }

    // Show empty state if cart is empty
    if (products.length === 0) {
        return (
            <div className="min-h-screen">
                <EmptyState
                    variant="cart"
                    title="Keranjang Belanja Kosong"
                    description="Tambahkan produk untuk mulai berbelanja!"
                    actionLabel="Jelajahi Produk"
                    actionHref="/shop"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Checkout Stepper */}
            <CheckoutStepper currentStep={1} completedSteps={[]} />

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
                    {/* Cart Items - Left Column */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Select All Checkbox */}
                                        <button
                                            onClick={toggleSelectAll}
                                            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all hover:border-grilli-gold focus:outline-none focus:ring-2 focus:ring-grilli-gold focus:ring-offset-2"
                                            style={{
                                                backgroundColor: selectedItems.size === products.length && products.length > 0 ? '#D97706' : 'transparent'
                                            }}
                                        >
                                            {selectedItems.size === products.length && products.length > 0 && (
                                                <FaCheck className="text-white" size={12} />
                                            )}
                                        </button>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Keranjang Belanja ({products.length}{' '}
                                                {products.length > 1 ? 'Items' : 'Item'})
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {selectedItems.length} item dipilih
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleSelectItem(product.id)}
                                                className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all hover:border-grilli-gold focus:outline-none focus:ring-2 focus:ring-grilli-gold focus:ring-offset-2 flex-shrink-0 mt-1"
                                                style={{
                                                    backgroundColor: selectedItems.includes(product.id) ? '#D97706' : 'transparent'
                                                }}
                                            >
                                                {selectedItems.includes(product.id) && (
                                                    <FaCheck className="text-white" size={12} />
                                                )}
                                            </button>

                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="relative flex-shrink-0 group"
                                            >
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                                    <Image
                                                        width={128}
                                                        height={128}
                                                        src={
                                                            product?.image
                                                                ? product.image.startsWith('http')
                                                                    ? product.image
                                                                    : `/${product.image.replace(/^\//, '')}`
                                                                : '/product_placeholder.jpg'
                                                        }
                                                        alt={sanitize(product.title)}
                                                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 pr-4">
                                                        <Link
                                                            href={`/products/${product.id}`}
                                                            className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-grilli-gold transition-colors line-clamp-2"
                                                        >
                                                            {sanitize(product.title)}
                                                        </Link>

                                                        {/* Stock Status */}
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <FaCheck className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                                Stok Tersedia
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveItem(product.id, product.title)
                                                        }
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Hapus dari keranjang"
                                                    >
                                                        <FaXmark className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Price and Quantity */}
                                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    {/* Quantity Input */}
                                                    <div className="flex items-center gap-4">
                                                        <QuantityInputCart product={product} />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Harga Satuan
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                {formatPrice(product.price)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Subtotal
                                                            </p>
                                                            <p className="text-lg font-bold text-grilli-gold">
                                                                {formatPrice(product.price * product.amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-4 flex items-center gap-4">
                                                    <button
                                                        onClick={() =>
                                                            handleMoveToWishlist(product.id, product.title)
                                                        }
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <FaHeart className="w-4 h-4" />
                                                        Pindah ke Wishlist
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center text-sm font-medium text-grilli-gold hover:text-orange-600 transition-colors"
                                >
                                    ← Lanjut Belanja
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Order Summary - Right Column */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <StickyOrderSummary
                            items={cartItems.filter(item => selectedItems.includes(item.id))}
                            subtotal={selectedTotal}
                            shipping={0}
                            tax={0}
                            total={selectedTotal}
                            showWhatsApp={true}
                            whatsAppNumber="6281234567890"
                            onCheckout={handleCheckout}
                            showCheckout={true}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Checkout Button */}
            <div className="lg:hidden fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
                <button
                    onClick={handleCheckout}
                    className="w-full py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-grilli-gold/30 active:scale-95 transition-all duration-200"
                >
                    Lanjut ke Checkout
                </button>
            </div>
        </div>
    );
};