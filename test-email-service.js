const Module = require('module');
const originalRequire = Module.prototype.require;

// --- Mocks ---
const mockSendMail = {
    sendMail: async (options) => {
        console.log(`[MOCK MAIL] Sending to ${options.to} with subject: ${options.subject}`);
        return { messageId: 'mock-id' };
    }
};

const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test User' };

const mockPrisma = {
    user: {
        findUnique: async ({ where }) => {
            console.log(`[MOCK DB] Finding user ${where.id}`);
            return mockUser;
        }
    }
};

class MockPrismaClient {
    constructor() {
        return mockPrisma;
    }
}

// --- Intercept Require ---
Module.prototype.require = function (request) {
    if (request.includes('utils/mail.js')) {
        return mockSendMail;
    }
    if (request === '@prisma/client') {
        return { PrismaClient: MockPrismaClient };
    }
    return originalRequire.apply(this, arguments);
};

// --- Load Service ---
// Note: We used absolute path in require mock check, but here we require relative
// We assume this script is run from project root
console.log('--- Loading Email Service under test ---');
const emailService = require('./server/services/emailService.js');

async function runTests() {
    console.log('\n--- TEST 1: Send Order Shipped Email ---');
    const orderData = {
        id: 'order_abc123',
        total: 150000,
        trackingNumber: 'JP123456789',
        courier: 'jne',
        courierService: 'REG',
        name: 'Test Customer',
        address: 'Jalan Test No 1',
        city: 'Jakarta',
        country: 'Indonesia',
        postalCode: '12345'
    };

    // Trigger (async)
    await emailService.sendOrderShippedEmail('user123', orderData);

    // Wait for setImmediate and logic
    await new Promise(r => setTimeout(r, 1000));

    console.log('\n--- TEST 2: Idempotency Check (Should Skip) ---');
    await emailService.sendOrderShippedEmail('user123', orderData);

    await new Promise(r => setTimeout(r, 500));

    console.log('\n--- TEST 3: Validation (Missing Email) ---');
    // Temporarily break user mock
    const originalFind = mockPrisma.user.findUnique;
    mockPrisma.user.findUnique = async () => ({ ...mockUser, email: null });

    await emailService.sendOrderShippedEmail('user123', { ...orderData, id: 'order_diff' });

    await new Promise(r => setTimeout(r, 500));

    // Restore
    mockPrisma.user.findUnique = originalFind;

    console.log('\n--- Tests Completed ---');
}

runTests().catch(console.error);
