"use strict";
// self host our Next.js server with express
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextHandler = exports.nextApp = void 0;
var next_1 = __importDefault(require("next"));
var PORT = Number(process.env.PORT) || 3000;
exports.nextApp = (0, next_1.default)({
    dev: process.env.NODE_ENV !== "production", // if we are in development mode then we are going to set dev to true
    port: PORT,
});
exports.nextHandler = exports.nextApp.getRequestHandler(); // we are going to get our request handler from our next app
