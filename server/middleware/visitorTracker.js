const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware to track daily visitors
 * Uses IP address to identify unique visitors per day
 */
const trackVisitor = async (req, res, next) => {
    try {
        // Skip if it's not a main page navigation (approximation)
        // Only track GET requests to root or main pages, ignore API/static/assets
        if (req.method !== 'GET') return next();
        if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.includes('.')) {
            return next();
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const userId = req.user ? req.user.id : null; // Assuming auth middleware runs before

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if this IP has visited today
        const existingVisitor = await prisma.visitor.findFirst({
            where: {
                ip: ip,
                createdAt: {
                    gte: today,
                },
            },
        });

        if (!existingVisitor) {
            // Record new visitor
            await prisma.visitor.create({
                data: {
                    ip: ip,
                    userAgent: userAgent,
                    userId: userId,
                },
            });
            console.log(`👁️  New visitor recorded: ${ip}`);
        }

        next();
    } catch (error) {
        // Don't block request if tracking fails
        console.error('Error tracking visitor:', error.message);
        next();
    }
};

module.exports = trackVisitor;
