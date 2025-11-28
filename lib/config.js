"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};
exports.default = config;
