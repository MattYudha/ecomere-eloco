/**
 * Validation utilities for Indonesian ecommerce forms
 */

// ===== Email Validation =====
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

// ===== Phone Validation (Indonesia) =====
export const validatePhoneIndonesia = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Check for valid Indonesian phone formats:
    // - 08xx-xxxx-xxxx (10-13 digits starting with 08)
    // - +628xx-xxxx-xxxx (11-14 digits starting with +62)
    // - 628xx-xxxx-xxxx (11-13 digits starting with 62)

    if (cleaned.startsWith('08')) {
        return cleaned.length >= 10 && cleaned.length <= 13;
    }

    if (cleaned.startsWith('628')) {
        return cleaned.length >= 11 && cleaned.length <= 14;
    }

    return false;
};

// Format phone number to Indonesian format
export const formatPhoneIndonesia = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('08')) {
        // Format: 08xx-xxxx-xxxx
        return cleaned.replace(/(\d{4})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    }

    if (cleaned.startsWith('628')) {
        // Format: +62 8xx-xxxx-xxxx
        return '+62 ' + cleaned.substring(2).replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    }

    return phone;
};

// ===== Postal Code Validation (Indonesia) =====
export const validatePostalCodeIndonesia = (postalCode: string): boolean => {
    const cleaned = postalCode.replace(/\D/g, '');

    // Indonesian postal codes are 5 digits (10xxx - 99xxx)
    if (cleaned.length !== 5) return false;

    const num = parseInt(cleaned, 10);
    return num >= 10000 && num <= 99999;
};

// ===== Required Field Validation =====
export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

// ===== Min Length Validation =====
export const validateMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength;
};

// ===== Max Length Validation =====
export const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.trim().length <= maxLength;
};

// ===== Number Validation =====
export const validateNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && value.trim() !== '';
};

// ===== URL Validation =====
export const validateURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// ===== Indonesian Name Validation =====
export const validateName = (name: string): boolean => {
    // Allow letters, spaces, and common Indonesian characters
    const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

// ===== Address Validation =====
export const validateAddress = (address: string): boolean => {
    return address.trim().length >= 10; // Minimum 10 characters for address
};

// ===== Validation Rule Generators =====

/**
 * Create validation rules for ValidatedInput component
 */
export const createValidationRules = {
    email: () => ({
        validate: validateEmail,
        message: 'Format email tidak valid',
    }),

    phoneIndonesia: () => ({
        validate: validatePhoneIndonesia,
        message: 'Nomor telepon harus format Indonesia (08xx-xxxx-xxxx)',
    }),

    postalCodeIndonesia: () => ({
        validate: validatePostalCodeIndonesia,
        message: 'Kode pos harus 5 digit (contoh: 12345)',
    }),

    required: (fieldName: string = 'Field') => ({
        validate: validateRequired,
        message: `${fieldName} wajib diisi`,
    }),

    minLength: (minLength: number, fieldName: string = 'Field') => ({
        validate: (value: string) => validateMinLength(value, minLength),
        message: `${fieldName} minimal ${minLength} karakter`,
    }),

    maxLength: (maxLength: number, fieldName: string = 'Field') => ({
        validate: (value: string) => validateMaxLength(value, maxLength),
        message: `${fieldName} maksimal ${maxLength} karakter`,
    }),

    name: () => ({
        validate: validateName,
        message: 'Nama harus terdiri dari huruf saja (minimal 2 karakter)',
    }),

    address: () => ({
        validate: validateAddress,
        message: 'Alamat minimal 10 karakter',
    }),
};

// ===== Province List (Indonesia) =====
export const INDONESIAN_PROVINCES = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Banten',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Gorontalo',
    'Sulawesi Tengah',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
];

// ===== Export All =====
export const emailValidation = {
    validate: validateEmail,
    message: 'Format email tidak valid',
};

export const phoneIndonesiaValidation = {
    validate: validatePhoneIndonesia,
    message: 'Nomor telepon tidak valid (gunakan format 08xx-xxxx-xxxx)',
};

export const postalCodeIndonesiaValidation = {
    validate: validatePostalCodeIndonesia,
    message: 'Kode pos harus 5 digit',
};
