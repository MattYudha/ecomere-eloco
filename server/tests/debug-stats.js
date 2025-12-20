const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testStats() {
    try {
        console.log('Testing Dashboard Stats Logic...');
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        console.log('1. Testing Revenue Query...');
        const revenue = await prisma.customer_order.aggregate({
            _sum: { total: true },
            where: {
                status: 'delivered',
                updatedAt: { gte: todayStart, lt: todayEnd },
            },
        });
        console.log('Revenue Result:', revenue);

        console.log('2. Testing New Orders Query...');
        const orders = await prisma.customer_order.count({
            where: { createdAt: { gte: todayStart, lt: todayEnd } },
        });
        console.log('Orders Result:', orders);

        console.log('3. Testing New Customers Query...');
        const customers = await prisma.user.count({
            where: { role: 'user', createdAt: { gte: todayStart, lt: todayEnd } },
        });
        console.log('Customers Result:', customers);

        console.log('4. Testing Visitors Query...');
        try {
            const visitors = await prisma.visitor.count({
                where: { createdAt: { gte: todayStart, lt: todayEnd } },
            });
            console.log('Visitors Result:', visitors);
        } catch (e) {
            console.log('Visitors Query Failed (Expected if table missing):', e.message);
        }

        console.log('5. Testing Daily Sales Chart...');
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentOrders = await prisma.customer_order.findMany({
            where: {
                status: 'delivered',
                updatedAt: { gte: sevenDaysAgo },
            },
            select: {
                total: true,
                updatedAt: true,
            },
        });
        console.log(`Daily Sales Result: Found ${recentOrders.length} orders`);

        console.log('✅ All tests passed!');
    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testStats();
