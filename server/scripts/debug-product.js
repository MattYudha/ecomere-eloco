const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findMany();
  console.log(p);
}

main();
