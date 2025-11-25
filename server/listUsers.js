// List all users in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('🔍 Fetching all users from database...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('💡 Please register a user first through the application.\n');
      return;
    }

    console.log(`✅ Found ${users.length} user(s):\n`);
    console.log('─'.repeat(80));
    console.log(
      '| No | Email                           | Role       | User ID',
    );
    console.log('─'.repeat(80));

    users.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(
        `| ${(index + 1).toString().padEnd(2)} | ${user.email.padEnd(
          31,
        )} | ${roleIcon} ${user.role?.padEnd(6) || 'user  '} | ${user.id}`,
      );
    });

    console.log('─'.repeat(80));
    console.log(
      '\n💡 To make a user admin, use: node makeUserAdmin.js <email>\n',
    );
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
