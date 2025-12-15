'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WishlistModule = void 0;
var wishlistStore_1 = require("@/app/_zustand/wishlistStore");
var ProductItem_1 = require("@/components/ProductItem");
var api_1 = require("@/lib/api");
var react_1 = require("next-auth/react");
var react_2 = require("react");
exports.WishlistModule = function () {
    var status = react_1.useSession().status;
    var _a = wishlistStore_1.useWishlistStore(), wishlist = _a.wishlist, setWishlist = _a.setWishlist;
    var getWishlist = react_2.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, products, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, api_1["default"].get('/api/wishlist', {
                            cache: 'no-store'
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    products = data.map(function (item) {
                        var _a;
                        return ({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            mainImage: item.mainImage,
                            slug: item.slug,
                            stockAvailabillity: (_a = item.stockAvailabillity) !== null && _a !== void 0 ? _a : 0
                        });
                    });
                    setWishlist(products);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch wishlist:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [setWishlist]);
    react_2.useEffect(function () {
        if (status === 'authenticated') {
            getWishlist();
        }
    }, [status, getWishlist]);
    if (status === 'loading') {
        return React.createElement("div", { className: "text-center py-10" }, "Loading...");
    }
    if (!wishlist || wishlist.length === 0) {
        return (React.createElement("h3", { className: "text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl" }, "No items found in the wishlist"));
    }
    return (React.createElement("div", { className: "max-w-screen-2xl mx-auto" },
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "table text-center" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null),
                        React.createElement("th", { className: "text-accent-content" }, "Image"),
                        React.createElement("th", { className: "text-accent-content" }, "Name"),
                        React.createElement("th", { className: "text-accent-content" }, "Stock Status"),
                        React.createElement("th", { className: "text-accent-content" }, "Action"))),
                React.createElement("tbody", null, wishlist.map(function (product) { return (React.createElement(ProductItem_1["default"], { key: product.id, product: product })); }))))));
};
