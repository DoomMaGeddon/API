"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenRevoked = exports.addToBlacklist = void 0;
const revokedTokens = [];
const addToBlacklist = (token) => {
    revokedTokens.push(token);
};
exports.addToBlacklist = addToBlacklist;
const isTokenRevoked = (token) => {
    return revokedTokens.includes(token);
};
exports.isTokenRevoked = isTokenRevoked;
