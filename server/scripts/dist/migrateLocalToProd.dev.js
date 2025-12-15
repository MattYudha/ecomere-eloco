"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("dotenv").config();

var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient; // DB LOKAL


var LocalDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}); // DB PROD

var ProdDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PROD_DATABASE_URL
    }
  }
});

function main() {
  var products, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, p;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("=== START MIGRATION Local → Prod ===");
          _context.next = 3;
          return regeneratorRuntime.awrap(LocalDb.product.findMany({
            include: {
              image: true
            }
          }));

        case 3:
          products = _context.sent;
          console.log("Migrating ".concat(products.length, " products..."));
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 8;
          _iterator = products[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 17;
            break;
          }

          p = _step.value;
          _context.next = 14;
          return regeneratorRuntime.awrap(ProdDb.product.upsert({
            where: {
              id: p.id
            },
            update: _objectSpread({}, p),
            create: _objectSpread({}, p)
          }));

        case 14:
          _iteratorNormalCompletion = true;
          _context.next = 10;
          break;

        case 17:
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 23:
          _context.prev = 23;
          _context.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context.prev = 26;

          if (!_didIteratorError) {
            _context.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context.finish(26);

        case 30:
          return _context.finish(23);

        case 31:
          console.log("=== DONE ===");

        case 32:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
}

main()["catch"](function (err) {
  console.error(err);
  process.exit(1);
})["finally"](function _callee() {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(LocalDb.$disconnect());

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(ProdDb.$disconnect());

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});