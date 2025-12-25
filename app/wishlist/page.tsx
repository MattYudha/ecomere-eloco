'use client';

import EmptyState from '@/components/EmptyState';

const WishlistPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Wishlist Saya
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Simpan produk favorit Anda di sini
                    </p>
                </div>

                {/* Empty State (Temporary - will be replaced with actual wishlist items) */}
                <EmptyState
                    variant="custom"
                    icon="❤️"
                    title="Wishlist Masih Kosong"
                    description="Belum ada produk di wishlist Anda. Mulai tambahkan produk favorit!"
                    actionLabel="Jelajahi Produk"
                    actionHref="/shop"
                />
            </div>
        </div>
    );
};

export default WishlistPage;
