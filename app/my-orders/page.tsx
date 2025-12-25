'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';
import { FaBox, FaCalendar, FaEye, FaShoppingBag, FaRedo, FaMapPin, FaStar } from 'react-icons/fa';
import { BsPinAngleFill } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import ReviewModal from '@/components/ReviewModal';
import RatingButton from '@/components/RatingButton';

interface OrderProduct {
    id: string;
    quantity: number;
    product: {
        id: string;
        title: string;
        mainImage: string;
        price: number;
        slug: string;
    };
    hasReview?: boolean;
    reviewRating?: number;
}

interface Order {
    id: string;
    dateTime: string;
    updatedAt: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    name: string;
    lastname: string;
    city: string;
    products: OrderProduct[];
}

const MyOrdersPage = () => {
    const { data: session, status } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('active'); // Default to 'active'
    const [reorderingId, setReorderingId] = useState<string | null>(null);
    const { addToCart } = useCart();

    // Review modal state
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{
        id: string;
        title: string;
        image: string;
        orderId: string;
    } | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Silakan login untuk melihat pesanan');
            router.push('/login?callbackUrl=/my-orders');
        }
    }, [status, router]);

    // Fetch user's orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user?.email) return;

            try {
                setIsLoading(true);

                // Get user ID from email
                const userResponse = await apiClient.get(
                    `/api/users/email/${session.user.email}`
                );
                if (!userResponse.ok) throw new Error('Failed to get user');

                const userData = await userResponse.json();
                const userId = userData.id;

                // Get user's orders
                const ordersResponse = await apiClient.get(`/api/orders/user/${userId}`);
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');

                const ordersData = await ordersResponse.json();

                // Fetch products for each order
                const ordersWithProducts = await Promise.all(
                    ordersData.map(async (order: Order) => {
                        try {
                            const productsResponse = await apiClient.get(
                                `/api/order-product/${order.id}`
                            );
                            if (productsResponse.ok) {
                                const products = await productsResponse.json();
                                return { ...order, products };
                            }
                        } catch (error) {
                            console.error('Error fetching products for order:', order.id);
                        }
                        return { ...order, products: [] };
                    })
                );

                setOrders(ordersWithProducts);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Gagal memuat pesanan');
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.email) {
            fetchOrders();
        }
    }, [session]);

    // Handle reorder
    const handleReorder = async (order: Order) => {
        if (!order.products || order.products.length === 0) {
            toast.error('Tidak ada produk untuk dipesan kembali');
            return;
        }

        try {
            setReorderingId(order.id);

            // Add all products to cart
            order.products.forEach((item) => {
                addToCart(
                    {
                        id: item.product.id,
                        name: item.product.title,
                        price: item.product.price,
                        image: item.product.mainImage,
                    },
                    item.quantity
                );
            });

            toast.success(
                `${order.products.length} produk ditambahkan ke keranjang!`,
                { duration: 3000 }
            );

            // Navigate to cart after a short delay
            setTimeout(() => {
                router.push('/cart');
            }, 1000);
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Gagal menambahkan produk ke keranjang');
        } finally {
            setReorderingId(null);
        }
    };

    // Handle open review modal
    const handleOpenReviewModal = (product: OrderProduct, orderId: string) => {
        setSelectedProduct({
            id: product.product.id,
            title: product.product.title,
            image: product.product.mainImage,
            orderId: orderId,
        });
        setReviewModalOpen(true);
    };

    // Handle review submitted
    const handleReviewSubmitted = () => {
        // Refresh orders to update review status
        if (session?.user?.email) {
            window.location.reload();
        }
    };

    // Continue with existing code
    const continueHere = () => {
    };

    // Filter orders with 'active' support
    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        if (filter === 'active') {
            // Active = processing + shipped
            return ['processing', 'shipped'].includes(order.status);
        }
        return order.status === filter;
    });

    // Get latest order and others
    const latestOrder = filteredOrders[0];
    const otherOrders = filteredOrders.slice(1);

    // Active orders count
    const activeCount = orders.filter((o) =>
        ['processing', 'shipped'].includes(o.status)
    ).length;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat pesanan...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <EmptyState
                    variant="orders"
                    title="Belum Ada Pesanan"
                    description="Anda belum memiliki pesanan. Mulai belanja sekarang!"
                    actionLabel="Mulai Belanja"
                    actionHref="/shop"
                />
            </div>
        );
    }

    // Order card component
    const OrderCard = ({ order, isPinned = false }: { order: Order; isPinned?: boolean }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all
                ${isPinned
                    ? 'border-2 border-grilli-gold ring-2 ring-grilli-gold/20'
                    : 'border border-gray-100 dark:border-gray-700'
                }
            `}
        >
            {/* Pinned Badge */}
            {isPinned && (
                <div className="bg-gradient-to-r from-grilli-gold to-orange-500 px-6 py-2 flex items-center gap-2">
                    <BsPinAngleFill className="text-white" size={16} />
                    <span className="text-white font-bold text-sm">PESANAN TERAKHIR</span>
                </div>
            )}

            {/* Order Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg
                            ${isPinned
                                ? 'bg-gradient-to-br from-grilli-gold to-orange-500 shadow-grilli-gold/50'
                                : 'bg-gradient-to-br from-grilli-gold to-orange-500 shadow-grilli-gold/30'
                            }
                        `}>
                            <FaBox size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order ID
                            </p>
                            <p className="font-mono font-bold text-gray-900 dark:text-white">
                                #{order.id.substring(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                                <FaCalendar size={12} />
                                {new Date(order.dateTime).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                            <p className="text-xl font-bold text-grilli-gold mt-1">
                                {formatPrice(order.total)}
                            </p>
                        </div>
                        <OrderStatusBadge status={order.status as any} size="md" />
                    </div>
                </div>
            </div>

            {/* Order Products */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.products?.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative"
                        >
                            <Image
                                src={
                                    item.product.mainImage?.startsWith('http')
                                        ? item.product.mainImage
                                        : `/${item.product.mainImage?.replace(/^\//, '') || 'product_placeholder.jpg'}`
                                }
                                alt={item.product.title}
                                fill
                                className="object-contain p-2"
                            />
                            <div className="absolute top-1 right-1 w-5 h-5 bg-grilli-gold rounded-full flex items-center justify-center text-xs text-white font-bold">
                                {item.quantity}
                            </div>
                        </div>
                    ))}
                    {order.products && order.products.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">
                            +{order.products.length - 4}
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-2">
                    <FaBox size={12} />
                    {order.products?.length || 0} produk
                    <span>•</span>
                    <FaMapPin size={12} />
                    {order.city}
                </p>
            </div>

            {/* Rating Section - Only for delivered orders */}
            {order.status === 'delivered' && order.products && order.products.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/10">
                    <div className="flex items-center gap-2 mb-3">
                        <FaStar className="text-yellow-500" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            Beri Rating Produk:
                        </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {order.products.map((product) => (
                            <div key={product.id} className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                                    {product.product.title}
                                </span>
                                <RatingButton
                                    product={product.product}
                                    orderId={order.id}
                                    hasReview={product.hasReview || false}
                                    reviewRating={product.reviewRating}
                                    onClick={() => handleOpenReviewModal(product, order.id)}
                                    isCompact={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Order Actions */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex gap-3">
                    <Link
                        href={`/my-orders/${order.id}`}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaEye size={16} />
                        Lihat Detail
                    </Link>
                    <button
                        onClick={() => handleReorder(order)}
                        disabled={reorderingId === order.id}
                        className={`
                            flex-1 py-3 px-6 font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2
                            ${reorderingId === order.id
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }
                        `}
                    >
                        {reorderingId === order.id ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <FaRedo size={14} />
                                Pesan Lagi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <FaShoppingBag className="text-grilli-gold" />
                        Pesanan Saya
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Lacak dan kelola semua pesanan Anda
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex gap-2 overflow-x-auto">
                    {[
                        { key: 'active', label: 'Aktif', count: activeCount },
                        { key: 'all', label: 'Semua', count: orders.length },
                        {
                            key: 'pending',
                            label: 'Menunggu',
                            count: orders.filter((o) => o.status === 'pending').length,
                        },
                        {
                            key: 'processing',
                            label: 'Diproses',
                            count: orders.filter((o) => o.status === 'processing').length,
                        },
                        {
                            key: 'shipped',
                            label: 'Dikirim',
                            count: orders.filter((o) => o.status === 'shipped').length,
                        },
                        {
                            key: 'delivered',
                            label: 'Selesai',
                            count: orders.filter((o) => o.status === 'delivered').length,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                                ${filter === tab.key
                                    ? 'bg-grilli-gold text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/30 text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <FaBox className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada pesanan dengan status ini
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pinned Latest Order */}
                        {latestOrder && (
                            <div>
                                <OrderCard order={latestOrder} isPinned={true} />
                            </div>
                        )}

                        {/* Other Orders */}
                        {otherOrders.length > 0 && (
                            <div className="space-y-4">
                                {otherOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedProduct && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    orderId={selectedProduct.orderId}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </div>
    );
};

export default MyOrdersPage;
