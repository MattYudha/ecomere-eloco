const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReview = async (req, res) => {
    try {
        console.log("=== CREATE REVIEW DEBUG ===");
        console.log("Content-Type:", req.headers['content-type']);
        console.log("Req Body:", req.body);
        console.log("Req Files Keys:", req.files ? Object.keys(req.files) : "NO FILES");
        console.log("User from req:", req.user); // CHECK IF USER EXISTS
        if (req.files && req.files.images) {
            console.log("Images found:", Array.isArray(req.files.images) ? "Array" : "Single", req.files.images);
        }

        const { productId, rating, comment, orderId } = req.body;

        // CRITICAL FIX: Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.error("❌ User not found in request (Auth middleware failed or skipped?)");
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.id;
        console.log("✅ User authenticated:", userId);

        // Fetch full user details to get email
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        const userEmail = user.email;

        // 1. Verified Purchase Check
        // Bypass for Admin
        if (req.user.role === 'admin') {
            console.log("⚠️ Admin skipping verified purchase check.");
        } else {
            console.log(`Checking verified purchase for email: ${userEmail}, product: ${productId}, orderId: ${orderId || 'ANY'}`);

            const whereClause = {
                email: userEmail,
                status: {
                    in: ['Delivered', 'Completed', 'COMPLETED', 'DELIVERED', 'Pesanan Diterima', 'Pesanan Telah Terkirim', 'delivered', 'completed']
                },
                products: {
                    some: {
                        productId: productId,
                    },
                },
            };

            // If orderId is provided, strictly check against that order
            if (orderId) {
                whereClause.id = orderId;
            }

            const purchase = await prisma.customer_order.findFirst({
                where: whereClause
            });

            console.log("Purchase result:", purchase ? purchase.id : "NONE");

            if (!purchase) {
                console.log("❌ No verified purchase found.");
                return res.status(403).json({
                    message: 'Verified Purchase Required: You can only review products you have purchased and received.',
                });
            }
        }

        // 2. Check if already reviewed (Scoped by Order ID if available)
        let existingReview;

        if (orderId) {
            // Check if THIS order item has been reviewed
            existingReview = await prisma.review.findFirst({
                where: {
                    userId: userId,
                    productId: productId,
                    orderId: orderId
                },
            });
        } else {
            // Fallback: Check if user ever reviewed this product (legacy behavior)
            existingReview = await prisma.review.findFirst({
                where: {
                    userId: userId,
                    productId: productId,
                },
            });
        }

        // --- HANDLE IMAGE UPLOADS ---
        const uploadedImages = [];
        if (req.files && req.files.images) {
            console.log("📸 Processing review images...");
            const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            const cloudinary = require('../utils/cloudinary');
            const { nanoid } = require('nanoid');

            for (const file of files) {
                try {
                    // Upload stream to Cloudinary
                    const result = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'eloco/reviews',
                                public_id: `${nanoid()}_review`,
                                resource_type: 'auto',
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        uploadStream.end(file.data);
                    });
                    uploadedImages.push(result.secure_url);
                } catch (uploadErr) {
                    console.error("❌ Error uploading review image:", uploadErr);
                    // Continue with other images or handle error (optional: fail whole request)
                }
            }
            console.log(`✅ Uploaded ${uploadedImages.length} images.`);
        }

        let newReview;
        if (existingReview) {
            console.log("⚠️ Review exists for this order/product, updating...");
            // Retrieve existing images to potentially merge or replace (for now, we'll append or just use new ones if provided)
            // Simple logic: If new images provided, add them to existing? Or replace? 
            // Let's assume we append if new ones exist, or strictly update if we want.
            // For simplicity in this edit: We'll just ADD new ones to the list if they exist.

            let currentImages = existingReview.images || [];
            if (uploadedImages.length > 0) {
                currentImages = [...currentImages, ...uploadedImages];
            }

            newReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating: Number(rating),
                    comment,
                    images: currentImages
                }
            });
            console.log("✅ Review updated:", newReview.id);
        } else {
            console.log("✨ Creating new review...");
            // 3. Create Review
            newReview = await prisma.review.create({
                data: {
                    userId,
                    productId,
                    rating: Number(rating),
                    comment,
                    orderId: orderId || null,
                    images: uploadedImages // Save array of URLs
                },
            });
            console.log("✅ Review created:", newReview.id);
        }

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
        console.error('❌❌❌ ERROR creating review:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
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