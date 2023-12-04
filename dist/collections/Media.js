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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
var isAdminOrHasAccessToMedia = function () {
    return function (_a) {
        var req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                user = req.user;
                if (!user)
                    return [2 /*return*/, false]; // if the user is not logged in, he cannot access the media
                if (user.role === "admin")
                    return [2 /*return*/, true]; // if the user is an admin, he can access the media
                return [2 /*return*/, {
                        user: {
                            equals: req.user.id,
                        },
                    }]; // if the user is not an admin, he can only access the media he uploaded
            });
        });
    };
};
exports.Media = {
    slug: "media",
    hooks: {
        // lets you define a certain action to be performed when a certain event occurs
        beforeChange: [
            // lets you define a certain action to be performed before a certain event occurs
            function (_a) {
                var req = _a.req, data = _a.data;
                return __assign(__assign({}, data), { user: req.user.id }); // associate the user with the media he uploaded/created
            },
        ],
    },
    access: {
        // use the access here to prevent other users from accessing the media uploaded by other users and tp prevent manipulation of the media by other users like deleting or editing
        read: function (_a) {
            var req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var referer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            referer = req.headers.referer;
                            if (!req.user || !(referer === null || referer === void 0 ? void 0 : referer.includes("sell"))) {
                                // if the user is not logged in or the referer does not include the string "sell", he can access the media as it is not related to the products
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, isAdminOrHasAccessToMedia()({ req: req })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        },
        delete: isAdminOrHasAccessToMedia(), // only admin or the user who uploaded the media can delete the media
        update: isAdminOrHasAccessToMedia(), // only admin or the user who uploaded the media can update the media
    },
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        }, // hide the collection from non-admin users
    },
    upload: {
        staticURL: "/media", // the url where the files will be uploaded
        staticDir: "media", // the directory where the files will be stored
        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "centre",
            },
            {
                name: "card",
                width: 768,
                height: 1024,
                position: "centre",
            },
            {
                name: "tablet",
                width: 1024,
                height: undefined, // undefined means that the height will be automatically calculated
                position: "centre",
            },
        ],
        mimeTypes: ["image/*"], // the types of files that can be uploaded
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            admin: {
                condition: function () { return false; },
            },
        },
    ],
};
