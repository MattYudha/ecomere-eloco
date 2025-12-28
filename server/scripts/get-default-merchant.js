// Get or create default merchant
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOrCreateDefaultMerchant() {
    try {
        // Try to find existing merchant
        let merchant = await prisma.merchant.findFirst({
            where: {
                status: 'ACTIVE',
            },
        });

        if (!merchant) {
            // Create default merchant if none exists
            merchant = await prisma.merchant.create({
                data: {
                    name: 'Default Store',
                    description: 'Default merchant for bulk uploads',
                    status: 'ACTIVE',
                },
            });
            console.log('✅ Created default merchant:', merchant.id);
        } else {
            console.log('✅ Found existing merchant:', merchant.id);
        }

        console.log('\nMerchant ID:', merchant.id);
        console.log('Merchant Name:', merchant.name);

        return merchant;
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

getOrCreateDefaultMerchant();
