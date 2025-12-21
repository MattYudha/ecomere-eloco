const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReview = async (req, res) => {
    try {
        console.log("=== CREATE REVIEW DEBUG ===");
        console.log("Req Body:", req.body);
        console.log("Req User:", req.user);

        const { productId, rating, comment } = req.body;

        if (!req.user || !req.user.id) {
            console.error("❌ User not found in request (Auth middleware failed or skipped?)");
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.id;

        // Fetch full user details to get email
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        const userEmail = user.email;

        // DEBUG: List all orders for this email to diagnose mismatch
        const debugOrders = await prisma.customer_order.findMany({
            where: { email: userEmail },
            select: { id: true, status: true, email: true, products: { select: { productId: true } } }
        });
        console.log("DEBUG: Found orders for email:", JSON.stringify(debugOrders, null, 2));

        // 1. Verified Purchase Check
        // Bypass for Admin
        if (req.user.role === 'admin') {
            console.log("⚠️ Admin skipping verified purchase check.");
        } else {
            // Check if there is a delivered order for this user containing the product
            console.log(`Checking verified purchase for email: ${userEmail}, product: ${productId}`);
            const purchase = await prisma.customer_order.findFirst({
                where: {
                    email: userEmail, // MySQL is case insensitive by default usually
                    status: {
                        in: ['Delivered', 'Completed', 'COMPLETED', 'DELIVERED', 'Pesanan Diterima', 'Pesanan Telah Terkirim', 'delivered', 'completed']
                    },
                    products: {
                        some: {
                            productId: productId,
                        },
                    },
                },
            });

            console.log("Purchase result:", purchase ? purchase.id : "NONE");

            if (!purchase) {
                console.log("❌ No verified purchase found.");
                return res.status(403).json({
                    message: 'Verified Purchase Required: You can only review products you have purchased and received.',
                });
            }
        }

        // 2. Check if already reviewed
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        if (existingReview) {
            console.log("❌ Already reviewed.");
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // 3. Create Review
        const newReview = await prisma.review.create({
            data: {
                userId,
                productId,
                rating: Number(rating),
                comment,
            },
        });
        console.log("✅ Review created:", newReview.id);

        // 4. Auto-Recalculate Product Rating
        const aggregations = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        const averageRating = aggregations._avg.rating || 0;
        const totalReviews = aggregations._count.rating || 0;

        // Update Product
        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: averageRating,
                reviewCount: totalReviews,
            },
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Failed to create review', error: error.message });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const review = await prisma.review.findUnique({ where: { id } });

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.userId !== userId && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.review.delete({ where: { id } });

        // Recalculate after delete
        const aggregations = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                rating: aggregations._avg.rating || 0,
                reviewCount: aggregations._count.rating || 0,
            },
        });

        res.json({ message: 'Review deleted' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createReview,
    getReviews,
    deleteReview
};
