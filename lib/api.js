"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const config_1 = __importDefault(require("./config"));
const react_1 = require("next-auth/react"); // Import getSession
exports.apiClient = {
    baseUrl: config_1.default.apiBaseUrl,
    async request(endpoint, options = {}) {
        let url;
        // Determine the full URL for the request
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            // If the endpoint is already an absolute URL, use it directly
            url = endpoint;
        }
        else {
            // For relative endpoints, prepend the base API URL
            // This ensures all API calls through apiClient go to the configured backend
            url = `${this.baseUrl}${endpoint}`;
        }
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };
        // Dynamically add Authorization header if session and access token exist
        const session = await (0, react_1.getSession)();
        if (session && session.accessToken) {
            defaultHeaders['Authorization'] = `Bearer ${session.accessToken}`;
        }
        const defaultOptions = {
            headers: defaultHeaders,
            credentials: 'include', // Ensure cookies are sent with the request
        };
        return fetch(url, { ...defaultOptions, ...options });
    },
    // Convenience methods
    get: (endpoint, options) => exports.apiClient.request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, data, options) => exports.apiClient.request(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    }),
    put: (endpoint, data, options) => exports.apiClient.request(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    }),
    delete: (endpoint, options) => exports.apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};
exports.default = exports.apiClient;
