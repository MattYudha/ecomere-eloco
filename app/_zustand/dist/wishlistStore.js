"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useWishlistStore = void 0;
var zustand_1 = require("zustand");
exports.useWishlistStore = zustand_1.create(function (set) { return ({
    wishlist: [],
    wishQuantity: 0,
    addToWishlist: function (product) {
        return set(function (state) {
            var exists = state.wishlist.some(function (item) { return item.id === product.id; });
            if (exists) {
                return state;
            }
            var newWishlist = __spreadArrays(state.wishlist, [product]);
            return {
                wishlist: newWishlist,
                wishQuantity: newWishlist.length
            };
        });
    },
    removeFromWishlist: function (id) {
        return set(function (state) {
            var newWishlist = state.wishlist.filter(function (item) { return item.id !== id; });
            return {
                wishlist: newWishlist,
                wishQuantity: newWishlist.length
            };
        });
    },
    setWishlist: function (wishlist) { return ({
        wishlist: wishlist,
        wishQuantity: wishlist.length
    }); }
}); });
