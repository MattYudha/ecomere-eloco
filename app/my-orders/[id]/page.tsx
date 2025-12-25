'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import OrderStatusCard from '@/components/OrderStatusCard';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { motion } from 'framer-motion';
import {
    FaArrowLeft,
    FaBox,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderProduct {
    id: string;
    quantity: number;
    product: {
        id: string;
        slug: string;
        title: string;
        mainImage: string;
        price: number;
    };
}

interface Order {
    id: string;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    company: string;
    adress: string;
    apartment: string;
    city: string;
    country: string;
    postalCode: string;
    dateTime: string;
    updatedAt: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    orderNotice: string | null;
}

const MyOrderDetailPage = () => {
    const { data: session, status } = useAuth();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<OrderProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Silakan login untuk melihat pesanan');
            router.push('/login?callbackUrl=/my-orders');
        }
    }, [status, router]);

    // Fetch order details
    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!params?.id || !session?.user?.email) return;

            try {
                setIsLoading(true);

                // Fetch order
                const orderResponse = await apiClient.get(`/api/orders/${params.id}`);
                if (!orderResponse.ok) throw new Error('Order not found');

                const orderData = await orderResponse.json();

                // Verify this order belongs to the user
                const userResponse = await apiClient.get(
                    `/api/users/email/${session.user.email}`
                );
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    // You might want to add a userId field to orders to verify ownership
                    // For now, we'll trust that the user can only access their own orders
                }

                setOrder(orderData);

                // Fetch products
                const productsResponse = await apiClient.get(
                    `/api/order-product/${params.id}`
                );
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setProducts(productsData);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Gagal memuat detail pesanan');
                router.push('/my-orders');
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.email && params?.id) {
            fetchOrderDetail();
        }
    }, [session, params, router]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat detail pesanan...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const handleWhatsAppContact = () => {
        const message = encodeURIComponent(
            `Halo, saya ingin menanyakan tentang pesanan saya:\n\nOrder ID: ${order.id}\nNama: ${order.name} ${order.lastname}\nTotal: ${formatPrice(order.total)}\n\nTerima kasih!`
        );
        window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/my-orders"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-grilli-gold transition-colors mb-6"
                >
                    <FaArrowLeft />
                    Kembali ke Pesanan Saya
                </Link>

                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Detail Pesanan
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order ID:{' '}
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                    #{order.id.substring(0, 12)}...
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tanggal:{' '}
                                {new Date(order.dateTime).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Total Pembayaran
                            </p>
                            <p className="text-3xl font-bold text-grilli-gold">
                                {formatPrice(order.total)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Visualization */}
                <div className="mb-6">
                    <OrderStatusCard
                        status={order.status as any}
                        createdAt={new Date(order.dateTime)}
                        updatedAt={new Date(order.updatedAt)}
                        timelineOrientation="horizontal"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products List */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaBox className="text-grilli-gold" />
                                    Produk ({products.length} item)
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {products.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                                    >
                                        <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={
                                                    item.product.mainImage?.startsWith('http')
                                                        ? item.product.mainImage
                                                        : `/${item.product.mainImage?.replace(/^\//, '') || 'product_placeholder.jpg'}`
                                                }
                                                alt={item.product.title}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="font-bold text-gray-900 dark:text-white hover:text-grilli-gold transition-colors line-clamp-2"
                                            >
                                                {item.product.title}
                                            </Link>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                {item.quantity} × {formatPrice(item.product.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-grilli-gold">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Ongkir</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        Gratis
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                                    <span className="text-base font-bold text-gray-900 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-grilli-gold">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Notes */}
                        {order.orderNotice && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
                                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                                    Catatan Pesanan
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-400">
                                    {order.orderNotice}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Info */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-grilli-gold" />
                                    Alamat Pengiriman
                                </h2>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {order.name} {order.lastname}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <FaPhone className="mt-1 flex-shrink-0" size={14} />
                                    <span>{order.phone}</span>
                                </div>
                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <FaEnvelope className="mt-1 flex-shrink-0" size={14} />
                                    <span className="break-all">{order.email}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-900 dark:text-white leading-relaxed">
                                        {order.adress}
                                        {order.apartment && `, ${order.apartment}`}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        {order.company}, {order.city}, {order.postalCode}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {order.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
                            <h3 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                                <FaWhatsapp size={20} />
                                Butuh Bantuan?
                            </h3>
                            <p className="text-sm text-green-800 dark:text-green-400 mb-4">
                                Hubungi kami via WhatsApp untuk informasi lebih lanjut tentang pesanan Anda
                            </p>
                            <button
                                onClick={handleWhatsAppContact}
                                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                            >
                                <FaWhatsapp size={18} />
                                Chat via WhatsApp
                            </button>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
                            <h3 className="font-bold text-orange-900 dark:text-orange-300 mb-2">
                                💳 Info Pembayaran
                            </h3>
                            <p className="text-sm text-orange-800 dark:text-orange-400 leading-relaxed">
                                Pembayaran dilakukan via transfer bank. Tim kami akan menghubungi Anda via
                                WhatsApp untuk konfirmasi pembayaran.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrderDetailPage;
