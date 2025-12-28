// Get all categories from database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        console.log(JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

getCategories();
