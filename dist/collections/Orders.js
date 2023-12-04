"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var yourOwnOrders = function (_a) {
    var user = _a.req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin")
        return true; // if the user is an admin, he can access the orders
    return {
        user: {
            equals: user === null || user === void 0 ? void 0 : user.id,
        }, // if the user is not an admin, he can only access the orders he created
    };
};
exports.Orders = {
    slug: "orders",
    admin: {
        useAsTitle: "Your orders",
        description: "A summary of all your orders and their status on DigitalBeer.",
    },
    access: {
        read: yourOwnOrders, // only the user who created the order can read the order
        update: function (_a) {
            var _b;
            var req = _a.req;
            return ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin";
        }, // only admin can update the order
        delete: function (_a) {
            var _b;
            var req = _a.req;
            return ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin";
        }, // only admin can update the order
        create: function (_a) {
            var _b;
            var req = _a.req;
            return ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin";
        }, // only admin can update the order
    },
    fields: [
        {
            name: "_isPaid",
            type: "checkbox",
            access: {
                read: function (_a) {
                    var _b;
                    var req = _a.req;
                    return ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin";
                },
                create: function () { return false; },
                update: function () { return false; },
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            admin: {
                hidden: true,
            },
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            required: true,
            hasMany: true, // one order can have multiple products
        },
    ],
};
