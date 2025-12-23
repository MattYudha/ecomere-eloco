const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNotification() {
    try {
        const orderIdPartial = 'e840fed3'; // Lowercase

        console.log(`Searching for Order ID containing '${orderIdPartial}'...`);

        // 1. Check Notification
        const notifications = await prisma.notification.findMany({
            where: { type: 'ORDER_UPDATE' },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const target = notifications.find(n => {
            const meta = n.metadata || {};
            const oid = (meta.orderId || meta.order_id || '').toLowerCase();
            return oid.includes(orderIdPartial);
        });

        if (target) {
            console.log("=== Notification Found ===");
            console.log(`ID: ${target.id}`);
            console.log(`Metadata:`, JSON.stringify(target.metadata, null, 2));
            console.log(`isReviewed value: ${target.metadata.isReviewed}`);
        } else {
            console.log("❌ Notification not found.");
        }

        // 2. Check Review
        console.log("Checking Review Table...");
        const order = await prisma.customer_order.findFirst({
            where: { id: { contains: orderIdPartial } }
        });

        if (order) {
            console.log(`Order Found: ${order.id}`);
            const review = await prisma.review.findFirst({
                where: { orderId: order.id }
            });
            if (review) {
                console.log("=== Review Found ===");
                console.log(`Review ID: ${review.id}`);
            } else {
                console.log("❌ Review NOT found for this order.");
            }
        } else {
            console.log("❌ Order NOT found.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkNotification();
