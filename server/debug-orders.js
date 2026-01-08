const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
    console.log('=== Checking Orders in Database ===\n');

    // Get all orders
    const allOrders = await prisma.customer_order.findMany({
        select: {
            id: true,
            name: true,
            status: true,
            total: true,
            dateTime: true,
            isDeleted: true
        },
        orderBy: { dateTime: 'desc' },
        take: 10
    });

    console.log(`Total orders found: ${allOrders.length}\n`);

    if (allOrders.length > 0) {
        console.log('Recent orders:');
        allOrders.forEach((order, index) => {
            console.log(`${index + 1}. ID: ${order.id.substring(0, 8)}...`);
            console.log(`   Name: ${order.name}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Total: Rp ${order.total.toLocaleString()}`);
            console.log(`   Date: ${order.dateTime}`);
            console.log(`   isDeleted: ${order.isDeleted}`);
            console.log('');
        });
    }

    // Check with date filter (this month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('\n=== Checking with Date Filter ===');
    console.log(`From: ${firstDayOfMonth.toISOString()}`);
    console.log(`To: ${tomorrow.toISOString()}\n`);

    const filteredOrders = await prisma.customer_order.findMany({
        where: {
            dateTime: {
                gte: firstDayOfMonth,
                lt: tomorrow
            },
            isDeleted: false
        }
    });

    console.log(`Orders in date range: ${filteredOrders.length}`);

    await prisma.$disconnect();
}

checkOrders().catch(console.error);
