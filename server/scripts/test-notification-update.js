const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUpdate() {
    try {
        // 1. Find a notification to test
        const notification = await prisma.notification.findFirst({
            where: { type: 'ORDER_UPDATE' } // Assuming this type has metadata
        });

        if (!notification) {
            console.log("No notification found to test.");
            return;
        }

        console.log("Original Metadata:", notification.metadata);

        // 2. Mock the Update payload
        const newMetadata = {
            ...notification.metadata,
            isReviewed: true,
            testTimestamp: Date.now()
        };

        // 3. Perform Update (Simulating Controller logic)
        const updated = await prisma.notification.update({
            where: { id: notification.id },
            data: { metadata: newMetadata }
        });

        console.log("Updated Metadata Result:", updated.metadata);

        // 4. Verify Persistence (Fetch again)
        const reFetched = await prisma.notification.findUnique({
            where: { id: notification.id }
        });

        console.log("Refetched Metadata:", reFetched.metadata);

        if (reFetched.metadata.isReviewed === true) {
            console.log("✅ SUCCESS: isReviewed persisted.");
        } else {
            console.log("❌ FAILURE: isReviewed NOT persisted.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

testUpdate();
