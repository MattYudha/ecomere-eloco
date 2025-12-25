'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [mounted, setMounted] = useState(false);

    // Fix hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRemove = (id: string, title: string) => {
        removeFromWishlist(id);
        toast.success(`${title} dihapus dari wishlist`);
    };

    const handleMoveToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.title,
            price: item.price,
            image: item.mainImage,
        }, 1);
        removeFromWishlist(item.id);
        toast.success(`${item.title} dipindahkan ke keranjang!`);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FaHeart className="text-red-500" />
                        Wishlist Saya
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {wishlist.length > 0
                            ? `${wishlist.length} produk favorit Anda`
                            : 'Simpan produk favorit Anda di sini'}
                    </p>
                </div>

                {/* Wishlist Items or Empty State */}
                {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Wishlist Masih Kosong
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Belum ada produk di wishlist Anda. Mulai tambahkan produk favorit!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
                        >
                            Jelajahi Produk
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                            >
                                {/* Product Image */}
                                <Link href={`/products/${item.id}`} className="block relative h-48 bg-gray-100 dark:bg-gray-700">
                                    <Image
                                        src={item.mainImage?.startsWith('http')
                                            ? item.mainImage
                                            : `/${item.mainImage?.replace(/^\//, '') || 'product_placeholder.jpg'}`}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="p-4">
                                    <Link
                                        href={`/products/${item.id}`}
                                        className="font-bold text-gray-900 dark:text-white hover:text-grilli-gold transition-colors line-clamp-2 mb-2 block"
                                    >
                                        {item.title}
                                    </Link>

                                    <p className="text-xl font-bold text-grilli-gold mb-4">
                                        {formatPrice(item.price)}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all"
                                        >
                                            <FaShoppingCart size={14} />
                                            <span className="text-sm">Keranjang</span>
                                        </button>

                                        <button
                                            onClick={() => handleRemove(item.id, item.title)}
                                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                            title="Hapus dari wishlist"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
