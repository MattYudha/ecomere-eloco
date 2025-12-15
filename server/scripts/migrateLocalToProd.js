require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

// DB LOCAL
const LocalDb = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

// DB PROD
const ProdDb = new PrismaClient({
  datasources: {
    db: { url: process.env.PROD_DATABASE_URL },
  },
});

async function main() {
  console.log("=== START MIGRATION Local → Prod ===");

  const products = await LocalDb.product.findMany({
    include: {
      images: true,              // relasi ke model `image`
      category: true,
      merchant: true,
      wishlist: true,            // lowercase sesuai schema: wishlist[]
      customerOrders: true,
      bulkUploadItems: true,
    }
  });

  console.log(`Migrating ${products.length} products...`);

  for (const p of products) {
    const { images, ...productData } = p;

    await ProdDb.product.upsert({
      where: { id: p.id },
      update: productData,
      create: productData,
    });

    if (images?.length) {
      for (const img of images) {
        await ProdDb.image.upsert({
          where: { imageID: img.imageID },
          update: {
            image: img.image,
            productID: p.id,
          },
          create: {
            imageID: img.imageID,
            image: img.image,
            productID: p.id,
          },
        });
      }
    }
  }

  console.log("=== MIGRATION DONE ===");
}

main()
  .catch((err) => {
    console.error("ERROR:", err);
    process.exit(1);
  })
  .finally(async () => {
    await LocalDb.$disconnect();
    await ProdDb.$disconnect();
  });
