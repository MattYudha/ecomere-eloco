// Check if products with same slugs exist
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDuplicateSlugs() {
    try {
        const slugs = [
            'samsung-galaxy-s24-ultra',
            'apple-macbook-pro-16-m3',
            'sony-wh-1000xm5-headphones',
            'lg-oled-c3-55-smart-tv',
            'canon-eos-r6-mark-ii-camera',
        ];

        console.log('🔍 Checking for duplicate slugs...\n');

        for (const slug of slugs) {
            const product = await prisma.product.findUnique({
                where: { slug },
                select: { id: true, title: true, slug: true },
            });

            if (product) {
                console.log(`❌ DUPLICATE FOUND: ${slug}`);
                console.log(`   Product ID: ${product.id}`);
                console.log(`   Title: ${product.title}\n`);
            } else {
                console.log(`✅ Available: ${slug}`);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDuplicateSlugs();
