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
  if (!process.env.DATABASE_URL) {
    throw new Error('❌ Missing DATABASE_URL in .env file');
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `📦 Database: ${databaseUrl.protocol}//${databaseUrl.hostname}:${
        databaseUrl.port || '3306'
      }`,
    );
    console.log(
      `🔒 SSL Mode: ${
        databaseUrl.searchParams.get('sslmode') || 'not specified'
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
