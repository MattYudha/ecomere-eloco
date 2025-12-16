import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn(
      '⚠️ DATABASE_URL is missing. Prisma Client will be initialized but may fail on queries.',
    );
    return new PrismaClient();
  }

  try {
    const url = new URL(databaseUrl);

    // Log SSL configuration for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(
        ` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`,
      );
      console.log(
        `🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`,
      );
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse DATABASE_URL for logging');
  }

  return new PrismaClient({
    // Add logging for debugging
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error', 'warn'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
