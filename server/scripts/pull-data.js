require("dotenv").config({ path: __dirname + "/../.env" });
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function pullData() {
  try {
    console.log("Connecting to database...");

    // === PRODUCTS + RELATIONS ===
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        merchant: true,
        wishlist: true,
        bulkUploadItems: true,
        customerOrders: true
      },
    });

    // === OTHER TABLES ===
    const categories = await prisma.category.findMany();
    const merchants = await prisma.merchant.findMany();
    const images = await prisma.image.findMany();
    const users = await prisma.user.findMany();
    const wishlist = await prisma.wishlist.findMany();
    const orders = await prisma.customer_order.findMany({
      include: {
        products: true
      }
    });

    // === FINAL RESULT ===
    const result = {
      products,
      categories,
      merchants,
      images,
      users,
      wishlist,
      orders
    };

    // === CORRECT SAVE PATH === 
    const outputPath = __dirname + "/../backups/pull-data.json";
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    console.log(`\n✔ DATA PULLED SUCCESSFULLY → ${outputPath}\n`);
  } catch (err) {
    console.error("❌ Error pulling data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

pullData();
