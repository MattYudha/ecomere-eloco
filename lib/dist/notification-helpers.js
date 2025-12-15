"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createBulkNotifications = exports.createSystemAlertNotification = exports.createPromotionNotification = exports.createPaymentNotification = exports.createOrderUpdateNotification = void 0;
var client_1 = require("@prisma/client");
var mail_1 = require("@/lib/utils/mail");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var utils_1 = require("@/lib/utils");
var prisma = new client_1.PrismaClient();
/**
 * Generate ID using nanoid with dynamic import
 */
var generateId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nanoid, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('nanoid'); })];
            case 1:
                nanoid = (_a.sent()).nanoid;
                return [2 /*return*/, nanoid()];
            case 2:
                error_1 = _a.sent();
                console.error('Error generating nanoid:', error_1);
                return [2 /*return*/, Math.random().toString(36).substr(2, 10)];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Create an order update notification
 */
exports.createOrderUpdateNotification = function (userId, orderStatus, orderId, totalAmount) {
    if (totalAmount === void 0) { totalAmount = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var statusMessages, statusInfo, notificationId, notification, user, emailTemplatePath, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statusMessages = {
                        pending: {
                            title: 'Order Received',
                            message: "Thank you! Your order #" + orderId + " has been received and is being processed.",
                            priority: client_1.notification_priority.NORMAL
                        },
                        confirmed: {
                            title: 'Order Confirmed',
                            message: "Pesanan Anda dengan nomor #" + orderId + " telah berhasil dikonfirmasi.",
                            priority: client_1.notification_priority.HIGH
                        },
                        processing: {
                            title: 'Order Processing',
                            message: "Your order #" + orderId + " is currently being processed.",
                            priority: client_1.notification_priority.NORMAL
                        },
                        shipped: {
                            title: 'Order Shipped',
                            message: "Your order #" + orderId + " has been shipped.",
                            priority: client_1.notification_priority.HIGH
                        },
                        delivered: {
                            title: 'Order Delivered',
                            message: "Your order #" + orderId + " has been delivered.",
                            priority: client_1.notification_priority.HIGH
                        },
                        cancelled: {
                            title: 'Order Cancelled',
                            message: "Your order #" + orderId + " has been cancelled.",
                            priority: client_1.notification_priority.URGENT
                        }
                    };
                    statusInfo = statusMessages[orderStatus.toLowerCase()] || {
                        title: 'Order Update',
                        message: "Order #" + orderId + " status updated to " + orderStatus,
                        priority: client_1.notification_priority.NORMAL
                    };
                    return [4 /*yield*/, generateId()];
                case 1:
                    notificationId = _a.sent();
                    return [4 /*yield*/, prisma.notification.create({
                            data: {
                                id: notificationId,
                                userId: userId,
                                title: statusInfo.title,
                                message: statusInfo.message,
                                type: client_1.notification_type.ORDER_UPDATE,
                                priority: statusInfo.priority,
                                isRead: false,
                                metadata: __assign({ orderId: orderId, status: orderStatus }, (totalAmount && { totalAmount: totalAmount })),
                                updatedAt: new Date()
                            }
                        })];
                case 2:
                    notification = _a.sent();
                    if (!(orderStatus.toLowerCase() === 'delivered')) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
                case 3:
                    user = _a.sent();
                    if (!(user === null || user === void 0 ? void 0 : user.email)) return [3 /*break*/, 6];
                    emailTemplatePath = path_1["default"].join(__dirname, '..', 'templates', 'orderDelivered.html');
                    return [4 /*yield*/, promises_1["default"].readFile(emailTemplatePath, 'utf-8')];
                case 4:
                    html = _a.sent();
                    html = html
                        .replace('{{userName}}', user.email || 'Customer')
                        .replace('{{orderId}}', orderId)
                        .replace('{{totalAmount}}', totalAmount ? utils_1.formatPrice(totalAmount) : 'N/A')
                        .replace('{{shopUrl}}', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
                        .replace('{{currentYear}}', String(new Date().getFullYear()));
                    return [4 /*yield*/, mail_1.sendMail({
                            to: user.email,
                            subject: "Order #" + orderId + " Delivered",
                            html: html
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, notification];
            }
        });
    });
};
/**
 * Payment notification
 */
exports.createPaymentNotification = function (userId, paymentStatus, amount, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var map, info, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                map = {
                    success: {
                        title: 'Payment Successful',
                        message: "Payment " + utils_1.formatPrice(amount) + " received.",
                        priority: client_1.notification_priority.HIGH
                    },
                    failed: {
                        title: 'Payment Failed',
                        message: "Payment failed for order #" + orderId + ".",
                        priority: client_1.notification_priority.URGENT
                    },
                    pending: {
                        title: 'Payment Pending',
                        message: "Payment pending for order #" + orderId + ".",
                        priority: client_1.notification_priority.NORMAL
                    }
                };
                info = map[paymentStatus.toLowerCase()] || {
                    title: 'Payment Update',
                    message: "Payment status updated.",
                    priority: client_1.notification_priority.NORMAL
                };
                _b = (_a = prisma.notification).create;
                _c = {};
                _d = {};
                return [4 /*yield*/, generateId()];
            case 1: return [2 /*return*/, _b.apply(_a, [(_c.data = (_d.id = _e.sent(),
                        _d.userId = userId,
                        _d.title = info.title,
                        _d.message = info.message,
                        _d.type = client_1.notification_type.PAYMENT_STATUS,
                        _d.priority = info.priority,
                        _d.isRead = false,
                        _d.metadata = { orderId: orderId, paymentStatus: paymentStatus, amount: amount },
                        _d.updatedAt = new Date(),
                        _d),
                        _c)])];
        }
    });
}); };
/**
 * Promotion notification
 */
exports.createPromotionNotification = function (userId, title, message, promoCode, discount) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _b = (_a = prisma.notification).create;
                _c = {};
                _d = {};
                return [4 /*yield*/, generateId()];
            case 1: return [2 /*return*/, _b.apply(_a, [(_c.data = (_d.id = _e.sent(),
                        _d.userId = userId,
                        _d.title = title,
                        _d.message = message,
                        _d.type = client_1.notification_type.PROMOTION,
                        _d.priority = client_1.notification_priority.NORMAL,
                        _d.isRead = false,
                        _d.metadata = __assign(__assign({}, (promoCode && { promoCode: promoCode })), (discount && { discount: discount })),
                        _d.updatedAt = new Date(),
                        _d),
                        _c)])];
        }
    });
}); };
/**
 * System alert
 */
exports.createSystemAlertNotification = function (userId, title, message, priority) {
    if (priority === void 0) { priority = client_1.notification_priority.HIGH; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = prisma.notification).create;
                    _c = {};
                    _d = {};
                    return [4 /*yield*/, generateId()];
                case 1: return [2 /*return*/, _b.apply(_a, [(_c.data = (_d.id = _e.sent(),
                            _d.userId = userId,
                            _d.title = title,
                            _d.message = message,
                            _d.type = client_1.notification_type.SYSTEM_ALERT,
                            _d.priority = priority,
                            _d.isRead = false,
                            _d.metadata = { alertType: 'system' },
                            _d.updatedAt = new Date(),
                            _d),
                            _c)])];
            }
        });
    });
};
/**
 * Bulk notifications
 */
exports.createBulkNotifications = function (userIds, title, message, type, priority, metadata) {
    if (type === void 0) { type = client_1.notification_type.SYSTEM_ALERT; }
    if (priority === void 0) { priority = client_1.notification_priority.NORMAL; }
    if (metadata === void 0) { metadata = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(userIds.map(function (userId) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, generateId()];
                                case 1: return [2 /*return*/, (_a.id = _b.sent(),
                                        _a.userId = userId,
                                        _a.title = title,
                                        _a.message = message,
                                        _a.type = type,
                                        _a.priority = priority,
                                        _a.isRead = false,
                                        _a.metadata = metadata,
                                        _a.updatedAt = new Date(),
                                        _a)];
                            }
                        });
                    }); }))];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, prisma.notification.createMany({ data: data })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, data.length];
            }
        });
    });
};
