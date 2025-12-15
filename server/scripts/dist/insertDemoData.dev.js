"use strict";

// scripts/insertDemoData.js
// Jalankan: node scripts/insertDemoData.js
var _require = require('@prisma/client'),
    PrismaClient = _require.PrismaClient;

var bcrypt = require('bcrypt');

var _require2 = require('crypto'),
    randomUUID = _require2.randomUUID;

var prisma = new PrismaClient();

function seedAdminUser() {
  var adminEmail, adminPassword, existing, hashed, admin;
  return regeneratorRuntime.async(function seedAdminUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('== Seed: Admin User ==');
          adminEmail = 'admin@ecom-eloco.com';
          adminPassword = 'admin123';
          _context.next = 5;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              email: adminEmail
            }
          }));

        case 5:
          existing = _context.sent;

          if (!existing) {
            _context.next = 9;
            break;
          }

          console.log('Admin already exists →', existing.email);
          return _context.abrupt("return", existing);

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(adminPassword, 10));

        case 11:
          hashed = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(prisma.user.create({
            data: {
              email: adminEmail,
              password: hashed,
              role: 'ADMIN' // schema: String? default "user" → "ADMIN" aman

            }
          }));

        case 14:
          admin = _context.sent;
          console.log('Admin created:');
          console.log("  email   : ".concat(adminEmail));
          console.log("  password: ".concat(adminPassword));
          return _context.abrupt("return", admin);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
}

function seedCategories() {
  var data, createdOrExisting, _i, _data, cat, existing, created;

  return regeneratorRuntime.async(function seedCategories$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('\n== Seed: Categories ==');
          data = [{
            id: randomUUID(),
            name: 'Electronics'
          }, {
            id: randomUUID(),
            name: 'Fashion'
          }, {
            id: randomUUID(),
            name: 'Home & Living'
          }, {
            id: randomUUID(),
            name: 'Accessories'
          }];
          createdOrExisting = {};
          _i = 0, _data = data;

        case 4:
          if (!(_i < _data.length)) {
            _context2.next = 21;
            break;
          }

          cat = _data[_i];
          _context2.next = 8;
          return regeneratorRuntime.awrap(prisma.category.findUnique({
            where: {
              name: cat.name
            }
          }));

        case 8:
          existing = _context2.sent;

          if (!existing) {
            _context2.next = 13;
            break;
          }

          console.log('Category exists →', existing.name);
          createdOrExisting[existing.name] = existing;
          return _context2.abrupt("continue", 18);

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(prisma.category.create({
            data: cat // id + name

          }));

        case 15:
          created = _context2.sent;
          console.log('Category created →', created.name);
          createdOrExisting[created.name] = created;

        case 18:
          _i++;
          _context2.next = 4;
          break;

        case 21:
          return _context2.abrupt("return", createdOrExisting);

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function seedMerchant() {
  var merchantName, existing, merchant;
  return regeneratorRuntime.async(function seedMerchant$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('\n== Seed: Merchant ==');
          merchantName = 'Default Merchant';
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.merchant.findFirst({
            where: {
              name: merchantName
            }
          }));

        case 4:
          existing = _context3.sent;

          if (!existing) {
            _context3.next = 8;
            break;
          }

          console.log('Merchant exists →', existing.name);
          return _context3.abrupt("return", existing);

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(prisma.merchant.create({
            data: {
              // id auto uuid()
              name: merchantName,
              description: 'Default merchant for demo products',
              email: 'merchant@ecom-eloco.com',
              phone: '+62-812-0000-0000',
              address: 'Jakarta, Indonesia',
              status: 'ACTIVE'
            }
          }));

        case 10:
          merchant = _context3.sent;
          console.log('Merchant created →', merchant.name);
          return _context3.abrupt("return", merchant);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function seedProducts(categoriesMap, merchant) {
  var electronics, fashion, products, _i2, _products, p, existing, created;

  return regeneratorRuntime.async(function seedProducts$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('\n== Seed: Products ==');
          electronics = categoriesMap['Electronics'];
          fashion = categoriesMap['Fashion'];

          if (!(!electronics || !fashion)) {
            _context4.next = 6;
            break;
          }

          console.log('Category Electronics / Fashion belum ada, skip seeding product.');
          return _context4.abrupt("return");

        case 6:
          products = [{
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
            merchantId: merchant.id
          }, {
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
            merchantId: merchant.id
          }];
          _i2 = 0, _products = products;

        case 8:
          if (!(_i2 < _products.length)) {
            _context4.next = 23;
            break;
          }

          p = _products[_i2];
          _context4.next = 12;
          return regeneratorRuntime.awrap(prisma.product.findUnique({
            where: {
              slug: p.slug
            }
          }));

        case 12:
          existing = _context4.sent;

          if (!existing) {
            _context4.next = 16;
            break;
          }

          console.log('Product exists →', existing.slug);
          return _context4.abrupt("continue", 20);

        case 16:
          _context4.next = 18;
          return regeneratorRuntime.awrap(prisma.product.create({
            data: p
          }));

        case 18:
          created = _context4.sent;
          console.log('Product created →', created.slug);

        case 20:
          _i2++;
          _context4.next = 8;
          break;

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function main() {
  var categoriesMap, merchant;
  return regeneratorRuntime.async(function main$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('=== INSERT DEMO DATA ===');
          _context5.next = 3;
          return regeneratorRuntime.awrap(seedAdminUser());

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(seedCategories());

        case 5:
          categoriesMap = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(seedMerchant());

        case 8:
          merchant = _context5.sent;
          _context5.next = 11;
          return regeneratorRuntime.awrap(seedProducts(categoriesMap, merchant));

        case 11:
          console.log('\n=== DONE INSERT DEMO DATA ===');

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
}

main()["catch"](function (err) {
  console.error('Error inserting demo data:');
  console.error(err);
  process.exit(1);
})["finally"](function _callee() {
  return regeneratorRuntime.async(function _callee$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(prisma.$disconnect());

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
});