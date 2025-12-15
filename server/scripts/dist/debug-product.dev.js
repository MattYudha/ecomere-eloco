"use strict";

var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var prisma = new PrismaClient();

function main() {
  var p;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(prisma.product.findMany());

        case 2:
          p = _context.sent;
          console.log(p);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

main();