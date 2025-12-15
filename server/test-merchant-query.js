const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQuery() {
    const id = 'efeba036-322e-4f46-aef3-2dcda209c44d';
    console.log(`Testing query for merchant ID: ${id}`);
    try {
        const merchant = await prisma.merchant.findUnique({
            where: {
                id: id,
            },
            include: {
                products: true,
            },
        });
        console.log('Query successful:', merchant);
    } catch (error) {
        console.log('Query failed message:', error.message);
        console.log('Query failed json:', JSON.stringify(error, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

testQuery();
