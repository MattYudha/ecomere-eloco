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
    console.error('DATABASE_URL value:', process.env.DATABASE_URL);
    // throw new Error('❌ Missing DATABASE_URL environment variable');
    // Allow it to proceed to see if Prisma can pick it up locally or if it's a soft failure? 
    // No, Prisma needs it. But maybe we can fallback or log better.
    throw new Error('❌ Critical: DATABASE_URL is missing from environment variables.');
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `📦 Database: ${databaseUrl.protocol}//${databaseUrl.hostname}:${databaseUrl.port || '3306'
      }`,
    );
    console.log(
      `🔒 SSL Mode: ${databaseUrl.searchParams.get('sslmode') || 'not specified'
      }`,
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error', 'warn'],
  });
};

// ♻️ Reuse Prisma client across hot reloads
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
