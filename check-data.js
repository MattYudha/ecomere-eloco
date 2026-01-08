const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const from = new Date('2025-11-30');
    const to = new Date('2025-12-30');

    // Check total
    const total = await prisma.customer_order.count({
        where: {
            dateTime: {
                gte: from,
                lte: to
            },
            isDeleted: false
        }
    });

    // Check with status 'delivered' or 'shipped'
    const statusCount = await prisma.customer_order.count({
        where: {
            dateTime: {
                gte: from,
                lte: to
            },
            status: { in: ['delivered', 'shipped'] },
            isDeleted: false
        }
    });

    console.log(`Total orders Nov-Dec 2025: ${total}`);
    console.log(`Orders with status delivered/shipped: ${statusCount}`);
}

checkData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
