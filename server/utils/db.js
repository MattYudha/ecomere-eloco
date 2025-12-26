// utils/db.js
// ✅ Clean Prisma Client setup — no duplicate instance, no init errors

const { PrismaClient } = require('@prisma/client');

/**
 * Safely create a Prisma client instance.
 * - Validates DATABASE_URL
 * - Logs connection info (in development)
 * - Reuses instance globally to prevent duplicate connections
 */
const createPrismaClient = () => {
  // DEBUG: Log available env keys to debug Railway issue
  if (!process.env.DATABASE_URL) {
    console.log('Available Env Keys:', Object.keys(process.env).sort());
    console.error('❌ Critical: DATABASE_URL is missing from environment variables.');
  } else {
    // Log a redacted version of the DB URL to confirm it's loaded
    const dbUrl = process.env.DATABASE_URL;
    const redactedUrl = dbUrl.replace(/(:)([^:@]+)(@)/, '$1****$3');
    console.log(`✅ DATABASE_URL found: ${redactedUrl}`);
  }

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error', 'warn'],
  });

  // DEBUG: Inspect generated models
  // We attach this check to the instance creation to verify on startup
  try {
    const modelKeys = Object.keys(client).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    console.log('🔍 PRISMA CLIENT INITIALIZED');
    console.log('🔑 Available Models:', modelKeys);
    if (!modelKeys.includes('product')) { // Note: Prisma models are usually lowercase in keys like prisma.product
      console.error('❌ CRITICAL: "product" model is MISSING from Prisma Client!');
    } else {
      console.log('✅ "product" model found.');
    }
  } catch (err) {
    console.error('⚠️ Could not inspect Prisma keys:', err);
  }

  return client;
};

// ♻️ Reuse Prisma client across hot reloads
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
