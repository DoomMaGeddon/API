"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES = exports.TOKEN_SECRET = exports.DB_DATABASE = exports.DB_PASSWORD = exports.DB_USERNAME = exports.DB_PORT = exports.DB_HOST = exports.PORT = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.PORT = process.env.PORT || 3000;
exports.DB_HOST = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : "localhost";
exports.DB_PORT = (_b = Number(process.env.DB_HOST)) !== null && _b !== void 0 ? _b : 5432;
exports.DB_USERNAME = (_c = process.env.DB_USERNAME) !== null && _c !== void 0 ? _c : "";
exports.DB_PASSWORD = (_d = process.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : "";
exports.DB_DATABASE = (_e = process.env.DB_DATABASE) !== null && _e !== void 0 ? _e : "";
exports.TOKEN_SECRET = (_f = process.env.TOKEN_SECRET) !== null && _f !== void 0 ? _f : "";
exports.JWT_EXPIRES = (_g = process.env.JWT_EXPIRES) !== null && _g !== void 0 ? _g : "60s";
