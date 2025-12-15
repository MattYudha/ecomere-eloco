// scripts/insertDemoData.js
// Jalankan: node scripts/insertDemoData.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function seedAdminUser() {
  console.log('== Seed: Admin User ==');

  const adminEmail = 'admin@ecom-eloco.com';
  const adminPassword = 'admin123';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log('Admin already exists →', existing.email);
    return existing;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      role: 'ADMIN', // schema: String? default "user" → "ADMIN" aman
    },
  });

  console.log('Admin created:');
  console.log(`  email   : ${adminEmail}`);
  console.log(`  password: ${adminPassword}`);
  return admin;
}

async function seedCategories() {
  console.log('\n== Seed: Categories ==');

  const data = [
    { id: randomUUID(), name: 'Electronics' },
    { id: randomUUID(), name: 'Fashion' },
    { id: randomUUID(), name: 'Home & Living' },
    { id: randomUUID(), name: 'Accessories' },
  ];

  const createdOrExisting = {};

  for (const cat of data) {
    const existing = await prisma.category.findUnique({
      where: { name: cat.name },
    });

    if (existing) {
      console.log('Category exists →', existing.name);
      createdOrExisting[existing.name] = existing;
      continue;
    }

    const created = await prisma.category.create({
      data: cat, // id + name
    });

    console.log('Category created →', created.name);
    createdOrExisting[created.name] = created;
  }

  return createdOrExisting;
}

async function seedMerchant() {
  console.log('\n== Seed: Merchant ==');

  const merchantName = 'Default Merchant';

  const existing = await prisma.merchant.findFirst({
    where: { name: merchantName },
  });

  if (existing) {
    console.log('Merchant exists →', existing.name);
    return existing;
  }

  const merchant = await prisma.merchant.create({
    data: {
      // id auto uuid()
      name: merchantName,
      description: 'Default merchant for demo products',
      email: 'merchant@ecom-eloco.com',
      phone: '+62-812-0000-0000',
      address: 'Jakarta, Indonesia',
      status: 'ACTIVE',
    },
  });

  console.log('Merchant created →', merchant.name);
  return merchant;
}

async function seedProducts(categoriesMap, merchant) {
  console.log('\n== Seed: Products ==');

  const electronics = categoriesMap['Electronics'];
  const fashion = categoriesMap['Fashion'];

  if (!electronics || !fashion) {
    console.log(
      'Category Electronics / Fashion belum ada, skip seeding product.',
    );
    return;
  }

  const products = [
    {
      id: randomUUID(),
      slug: 'wireless-earbuds',
      title: 'Wireless Earbuds',
      mainImage: 'https://via.placeholder.com/600x600?text=Wireless+Earbuds',
      price: 250000,
      rating: 5,
      description: 'High quality wireless earphones with noise cancellation.',
      manufacturer: 'Eloco Audio',
      inStock: 100,
      categoryId: electronics.id,
      merchantId: merchant.id,
    },
    {
      id: randomUUID(),
      slug: 'casual-hoodie',
      title: 'Casual Hoodie',
      mainImage: 'https://via.placeholder.com/600x600?text=Casual+Hoodie',
      price: 300000,
      rating: 4,
      description: 'Comfortable hoodie suitable for daily wear.',
      manufacturer: 'Eloco Apparel',
      inStock: 50,
      categoryId: fashion.id,
      merchantId: merchant.id,
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
    });

    if (existing) {
      console.log('Product exists →', existing.slug);
      continue;
    }

    const created = await prisma.product.create({
      data: p,
    });

    console.log('Product created →', created.slug);
  }
}

async function main() {
  console.log('=== INSERT DEMO DATA ===');

  await seedAdminUser();
  const categoriesMap = await seedCategories();
  const merchant = await seedMerchant();
  await seedProducts(categoriesMap, merchant);

  console.log('\n=== DONE INSERT DEMO DATA ===');
}

main()
  .catch((err) => {
    console.error('Error inserting demo data:');
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });