"use strict";

require("dotenv").config({
  path: __dirname + "/../.env"
});

var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var fs = require("fs");

var prisma = new PrismaClient();

function pullData() {
  var products, categories, merchants, images, users, wishlist, orders, result, outputPath;
  return regeneratorRuntime.async(function pullData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Connecting to database..."); // === PRODUCTS + RELATIONS ===

          _context.next = 4;
          return regeneratorRuntime.awrap(prisma.product.findMany({
            include: {
              images: true,
              category: true,
              merchant: true,
              wishlist: true,
              bulkUploadItems: true,
              customerOrders: true
            }
          }));

        case 4:
          products = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(prisma.category.findMany());

        case 7:
          categories = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(prisma.merchant.findMany());

        case 10:
          merchants = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(prisma.image.findMany());

        case 13:
          images = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(prisma.user.findMany());

        case 16:
          users = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(prisma.wishlist.findMany());

        case 19:
          wishlist = _context.sent;
          _context.next = 22;
          return regeneratorRuntime.awrap(prisma.customer_order.findMany({
            include: {
              products: true
            }
          }));

        case 22:
          orders = _context.sent;
          // === FINAL RESULT ===
          result = {
            products: products,
            categories: categories,
            merchants: merchants,
            images: images,
            users: users,
            wishlist: wishlist,
            orders: orders
          }; // === CORRECT SAVE PATH === 

          outputPath = __dirname + "/../backups/pull-data.json";
          fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
          console.log("\n\u2714 DATA PULLED SUCCESSFULLY \u2192 ".concat(outputPath, "\n"));
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error pulling data:", _context.t0);

        case 32:
          _context.prev = 32;
          _context.next = 35;
          return regeneratorRuntime.awrap(prisma.$disconnect());

        case 35:
          return _context.finish(32);

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 29, 32, 36]]);
}

pullData();