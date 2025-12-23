const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReviews() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        console.log("Last 5 Reviews:");
        reviews.forEach(r => {
            console.log(`ID: ${r.id}`);
            console.log(`Comment: ${r.comment}`);
            console.log(`Images Type: ${typeof r.images}`);
            console.log(`Images Value:`, r.images);
            console.log("-------------------");
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkReviews();
