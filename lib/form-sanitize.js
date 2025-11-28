"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFormData = void 0;
const sanitize_1 = require("./sanitize");
/**
 * Sanitize form data before sending to API
 * @param formData - Form data object
 * @returns Sanitized form data
 */
function sanitizeFormData(formData) {
    if (!formData)
        return formData;
    const sanitized = { ...formData };
    // Sanitize text fields
    if (sanitized.title)
        sanitized.title = (0, sanitize_1.sanitize)(sanitized.title);
    if (sanitized.manufacturer)
        sanitized.manufacturer = (0, sanitize_1.sanitize)(sanitized.manufacturer);
    if (sanitized.description)
        sanitized.description = (0, sanitize_1.sanitize)(sanitized.description);
    if (sanitized.slug)
        sanitized.slug = (0, sanitize_1.sanitize)(sanitized.slug);
    if (sanitized.name)
        sanitized.name = (0, sanitize_1.sanitize)(sanitized.name);
    if (sanitized.lastname)
        sanitized.lastname = (0, sanitize_1.sanitize)(sanitized.lastname);
    if (sanitized.email)
        sanitized.email = (0, sanitize_1.sanitize)(sanitized.email);
    return sanitized;
}
exports.sanitizeFormData = sanitizeFormData;
