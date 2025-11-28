"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = exports.sanitize = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
/**
 * Enhanced function to sanitize text and prevent XSS
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
function sanitize(text) {
    if (!text)
        return '';
    // For client-side, use DOMPurify with strict settings
    if (typeof window !== 'undefined') {
        return dompurify_1.default.sanitize(text, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true,
            FORBID_TAGS: [
                'script',
                'img',
                'iframe',
                'object',
                'embed',
                'form',
                'input',
                'button',
                'link',
                'meta',
                'style',
            ],
            FORBID_ATTR: [
                'onerror',
                'onload',
                'onclick',
                'onmouseover',
                'onfocus',
                'onblur',
                'onchange',
                'onsubmit',
                'onreset',
                'onselect',
                'onkeydown',
                'onkeyup',
                'onkeypress',
            ],
        });
    }
    // For server-side, use comprehensive escaping
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/`/g, '&#x60;')
        .replace(/=/g, '&#x3D;');
}
exports.sanitize = sanitize;
/**
 * Sanitize HTML content that needs to preserve some formatting
 * @param text - The HTML text to sanitize
 * @returns Sanitized HTML
 */
function sanitizeHtml(text) {
    if (!text)
        return '';
    // For client-side, use DOMPurify with limited allowed tags
    if (typeof window !== 'undefined') {
        return dompurify_1.default.sanitize(text, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i'],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true,
            FORBID_TAGS: [
                'script',
                'img',
                'iframe',
                'object',
                'embed',
                'form',
                'input',
                'button',
                'link',
                'meta',
                'style',
            ],
            FORBID_ATTR: [
                'onerror',
                'onload',
                'onclick',
                'onmouseover',
                'onfocus',
                'onblur',
                'onchange',
                'onsubmit',
                'onreset',
                'onselect',
                'onkeydown',
                'onkeyup',
                'onkeypress',
            ],
        });
    }
    // For server-side, strip all HTML tags
    return text.replace(/<[^>]*>/g, '');
}
exports.sanitizeHtml = sanitizeHtml;
